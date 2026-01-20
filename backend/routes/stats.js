import express from 'express';
import { isAuthenticated } from '../middleware/auth.js';
import { getOwnedGames, getRecentlyPlayedGames, getPlayerAchievements, getPlayerLevel } from '../utils/steamAPI.js';

const router = express.Router();

// Calculate total playtime across all games
router.get('/total-playtime', isAuthenticated, async (req, res) => {
  try {
    const steamId = req.user.steamId;
    const gamesData = await getOwnedGames(steamId);
    
    if (!gamesData.games || gamesData.games.length === 0) {
      return res.json({
        success: true,
        totalPlaytimeMinutes: 0,
        totalPlaytimeHours: 0,
        totalGames: 0
      });
    }
    
    // Calculate total playtime (playtime_forever is in minutes)
    const totalMinutes = gamesData.games.reduce((total, game) => {
      return total + (game.playtime_forever || 0);
    }, 0);
    
    // Find most played game
    const mostPlayed = gamesData.games.reduce((max, game) => {
      return (game.playtime_forever || 0) > (max.playtime_forever || 0) ? game : max;
    }, gamesData.games[0]);
    
    res.json({
      success: true,
      totalPlaytimeMinutes: totalMinutes,
      totalPlaytimeHours: Math.round(totalMinutes / 60),
      totalPlaytimeDays: Math.round(totalMinutes / 60 / 24),
      totalGames: gamesData.game_count,
      mostPlayedGame: {
        name: mostPlayed.name,
        appId: mostPlayed.appid,
        playtimeMinutes: mostPlayed.playtime_forever,
        playtimeHours: Math.round(mostPlayed.playtime_forever / 60)
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Calculate weekly playtime (last 2 weeks)
router.get('/weekly-playtime', isAuthenticated, async (req, res) => {
  try {
    const steamId = req.user.steamId;
    const recentData = await getRecentlyPlayedGames(steamId);
    
    if (!recentData.games || recentData.games.length === 0) {
      return res.json({
        success: true,
        weeklyPlaytimeMinutes: 0,
        weeklyPlaytimeHours: 0,
        gamesPlayed: []
      });
    }
    
    // playtime_2weeks is in minutes
    const totalMinutes = recentData.games.reduce((total, game) => {
      return total + (game.playtime_2weeks || 0);
    }, 0);
    
    // Format games with playtime
    const gamesPlayed = recentData.games.map(game => ({
      name: game.name,
      appId: game.appid,
      playtimeMinutes: game.playtime_2weeks,
      playtimeHours: Math.round((game.playtime_2weeks / 60) * 10) / 10, // 1 decimal
      totalPlaytimeHours: Math.round(game.playtime_forever / 60)
    }));
    
    res.json({
      success: true,
      weeklyPlaytimeMinutes: totalMinutes,
      weeklyPlaytimeHours: Math.round((totalMinutes / 60) * 10) / 10,
      gamesPlayedCount: recentData.total_count,
      gamesPlayed: gamesPlayed
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get interesting achievements (unlocked achievements from recent games)
router.get('/achievements', isAuthenticated, async (req, res) => {
  try {
    const steamId = req.user.steamId;
    const recentData = await getRecentlyPlayedGames(steamId);
    
    if (!recentData.games || recentData.games.length === 0) {
      return res.json({
        success: true,
        achievements: []
      });
    }
    
    // Get achievements from top 3 recent games
    const topGames = recentData.games.slice(0, 3);
    const achievementsPromises = topGames.map(game => 
      getPlayerAchievements(steamId, game.appid)
        .then(achievements => ({
          gameName: game.name,
          appId: game.appid,
          achievements: achievements.filter(a => a.achieved === 1).slice(0, 5) // Top 5 unlocked
        }))
        .catch(() => ({
          gameName: game.name,
          appId: game.appid,
          achievements: []
        }))
    );
    
    const achievementsByGame = await Promise.all(achievementsPromises);
    
    // Flatten and get interesting achievements
    const allAchievements = achievementsByGame.flatMap(game => 
      game.achievements.map(achievement => ({
        gameName: game.gameName,
        appId: game.appId,
        name: achievement.name || achievement.apiname,
        description: achievement.description || 'No description',
        unlockTime: achievement.unlocktime,
        achieved: achievement.achieved === 1
      }))
    );
    
    // Sort by unlock time (most recent first)
    allAchievements.sort((a, b) => b.unlockTime - a.unlockTime);
    
    res.json({
      success: true,
      totalAchievements: allAchievements.length,
      achievements: allAchievements.slice(0, 10) // Top 10 recent
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get Steam level
router.get('/level', isAuthenticated, async (req, res) => {
  try {
    const steamId = req.user.steamId;
    const level = await getPlayerLevel(steamId);
    
    res.json({
      success: true,
      level: level
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;