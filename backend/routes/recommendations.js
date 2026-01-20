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
    const prompt = `You are a gaming expert assistant. Based on the user's context and their Steam library, recommend exactly 3 games they should play right now.

User Context:
- How their day was: ${dayType}
- Current mood: ${mood}
- Time available: ${timeAvailable}

User's Steam Library (top games by playtime):
${topGames.map(g => `- ${g.name} (${g.hours}h played)`).join('\n')}

CRITICAL INSTRUCTIONS:
1. Recommend ONLY 3 games from their library above
2. Match game names EXACTLY as shown in the library
3. Consider their mood, day type, and available time
4. Provide a brief reason for each (1 sentence, max 80 characters)
5. Your response MUST be a valid JSON object with this EXACT structure:

{
  "recommendations": [
    {
      "name": "Exact Game Name From Library",
      "reason": "Brief reason why"
    },
    {
      "name": "Exact Game Name From Library",
      "reason": "Brief reason why"
    },
    {
      "name": "Exact Game Name From Library",
      "reason": "Brief reason why"
    }
  ]
}

Respond ONLY with valid JSON. No markdown, no code blocks, no extra text.`;

    // Call Groq API
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful gaming recommendation assistant. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile", // Fast and accurate
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: "json_object" }
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