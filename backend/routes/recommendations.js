import express from 'express';
import Groq from 'groq-sdk';
import { isAuthenticated } from '../middleware/auth.js';
import { getOwnedGames } from '../utils/steamAPI.js';

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Get AI-powered game recommendations
router.post('/suggest', isAuthenticated, async (req, res) => {
  try {
    const { dayType, mood, timeAvailable } = req.body;
    const steamId = req.user.steamId;

    // Fetch user's games
    const gamesData = await getOwnedGames(steamId);
    const games = gamesData.games || [];

    if (games.length === 0) {
      return res.json({
        success: true,
        recommendations: [],
        message: "No games in your library yet!"
      });
    }

    // Prepare game list for AI (top 50 most played to avoid token limits)
    const topGames = games
      .sort((a, b) => (b.playtime_forever || 0) - (a.playtime_forever || 0))
      .slice(0, 50)
      .map(g => ({
        name: g.name,
        hours: Math.floor((g.playtime_forever || 0) / 60)
      }));

    // Create AI prompt
    const prompt = `You are a gaming expert assistant.

    Recommend exactly 3 games from the user's Steam library based on:

    - Day type: ${dayType}
    - Mood: ${mood}
    - Time available: ${timeAvailable}

    Steam Library:
    ${topGames.map(g => `- ${g.name} (${g.hours}h played)`).join('\n')}

    Rules:
    1. Recommend ONLY games that appear in the Steam Library above.
    2. Copy the game names EXACTLY as they appear in the library.
    3. Choose games that best match the user's mood, day type, and available time.
    4. Give each recommendation a short reason of no more than 80 characters.
    5. Return exactly 3 recommendations.`;

    // Call Groq API- openAI model for recommendations
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a gaming recommendation assistant. Recommend exactly 3 games from the user's Steam library."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "openai/gpt-oss-20b",
      temperature: 0.7,
      max_tokens: 500,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "game_recommendations",
          strict: true,
          schema: {
            type: "object",
            properties: {
              recommendations: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string"
                    },
                    reason: {
                      type: "string"
                    }
                  },
                  required: ["name", "reason"],
                  additionalProperties: false
                }
              }
            },
            required: ["recommendations"],
            additionalProperties: false
          }
        }
      }
    });

    // Parse AI response
    const aiResponse = completion.choices[0]?.message?.content;
    let recommendations = [];
    
    try {
      const parsed = JSON.parse(aiResponse);
      
      // Handle different AI response formats
      if (Array.isArray(parsed)) {
        recommendations = parsed;
      } else if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
        recommendations = parsed.recommendations;
      } else if (parsed.games && Array.isArray(parsed.games)) {
        recommendations = parsed.games;
      } else {
        // Try to extract array from object
        const possibleArrays = Object.values(parsed).filter(Array.isArray);
        if (possibleArrays.length > 0) {
          recommendations = possibleArrays[0];
        }
      }
      
      // Ensure each recommendation has required fields
      recommendations = recommendations
        .filter(rec => rec && (rec.name || rec.game || rec.title))
        .map(rec => ({
          name: rec.name || rec.game || rec.title,
          reason: rec.reason || rec.description || "Great choice for you!"
        }));
        
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.log('AI Response was:', aiResponse);
    }
    
    // Fallback if no valid recommendations
    if (!Array.isArray(recommendations) || recommendations.length === 0) {
      console.log('Using fallback recommendations');
      recommendations = topGames.slice(0, 3).map(g => ({
        name: g.name,
        reason: "One of your most played games!"
      }));
    }

    // Match recommendations with full game data
    const enrichedRecommendations = recommendations
      .slice(0, 3) // Take max 3
      .map(rec => {
        const game = games.find(g => 
          g.name.toLowerCase().includes(rec.name.toLowerCase()) ||
          rec.name.toLowerCase().includes(g.name.toLowerCase())
        );
        
        if (game) {
          return {
            appid: game.appid,
            name: game.name,
            playtime_forever: game.playtime_forever,
            reason: rec.reason,
            img_icon_url: game.img_icon_url
          };
        }
        return null;
      })
      .filter(Boolean);

    // Ensure we always return at least some recommendations
    if (enrichedRecommendations.length === 0) {
      // Ultimate fallback - return top 3 most played games
      const fallbackGames = games
        .sort((a, b) => (b.playtime_forever || 0) - (a.playtime_forever || 0))
        .slice(0, 3)
        .map(game => ({
          appid: game.appid,
          name: game.name,
          playtime_forever: game.playtime_forever,
          reason: "One of your favorites - always a good choice!",
          img_icon_url: game.img_icon_url
        }));
      
      return res.json({
        success: true,
        recommendations: fallbackGames,
        contextMessage: getContextMessage(dayType, mood, timeAvailable),
        fallback: true
      });
    }

    res.json({
      success: true,
      recommendations: enrichedRecommendations,
      contextMessage: getContextMessage(dayType, mood, timeAvailable)
    });

  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate recommendations',
      message: error.message
    });
  }
});

// Helper function to generate context message
function getContextMessage(dayType, mood, timeAvailable) {
  if (dayType === 'stressful' && mood === 'chill') {
    return "After a stressful day, here are some relaxing games to unwind! 😌";
  } else if (mood === 'energetic' && timeAvailable === 'long') {
    return "You've got energy and time - perfect for an intense session! ⚡";
  } else if (timeAvailable === 'quick') {
    return "Quick session ahead - games you can jump into right away! ⏱️";
  } else if (mood === 'focused') {
    return "Feeling focused? Here are some games that reward strategic thinking! 🎯";
  } else {
    return "Based on your vibe right now, here's what I recommend! 🎮";
  }
}

export default router;