import express from 'express';
import { isAuthenticated } from '../middleware/auth.js';
import { getOwnedGames, getRecentlyPlayedGames, getPlayerAchievements } from '../utils/steamAPI.js';
import { getGameSchema } from '../utils/steamAPI.js';


const router = express.Router();

// Get user's owned games
router.get('/owned', isAuthenticated, async (req, res) => {
  try {
    const steamId = req.user.steamId;
    const gamesData = await getOwnedGames(steamId);
    
    res.json({
      success: true,
      gameCount: gamesData.game_count || 0,
      games: gamesData.games || []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get recently played games
router.get('/recent', isAuthenticated, async (req, res) => {
  try {
    const steamId = req.user.steamId;
    const recentData = await getRecentlyPlayedGames(steamId);
    
    res.json({
      success: true,
      totalCount: recentData.total_count || 0,
      games: recentData.games || []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get achievements for a specific game
router.get('/:appId/achievements', isAuthenticated, async (req, res) => {
  try {
    const steamId = req.user.steamId;
    const appId = req.params.appId;
    
const playerAchievements = await getPlayerAchievements(steamId, appId);
if (!playerAchievements || playerAchievements.length === 0) {
  return res.json({
    success: true,
    achievements: []
  });
}

const schemaAchievements = await getGameSchema(appId);

// Build schema lookup by apiname
const schemaMap = {};
schemaAchievements.forEach(a => {
  schemaMap[a.name] = a;
});

// Merge schema + player progress
const mergedAchievements = playerAchievements.map(a => {
  const schema = schemaMap[a.apiname];

  return {
    apiname: a.apiname,
    achieved: a.achieved,
    unlocktime: a.unlocktime,
    name: schema?.displayName || 'Hidden Achievement',
    description: schema?.description || 'Hidden until unlocked',
    icon: schema?.icon,
    icongray: schema?.icongray,
    hidden: schema?.hidden === 1
  };
});

res.json({
  success: true,
  achievements: mergedAchievements
});

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;