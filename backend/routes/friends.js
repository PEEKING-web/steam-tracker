import express from 'express';
import { isAuthenticated } from '../middleware/auth.js';
import { getFriendsList, getMultiplePlayerSummaries, getOwnedGames } from '../utils/steamAPI.js';

const router = express.Router();

// Get user's friends list with profile data
router.get('/list', isAuthenticated, async (req, res) => {
  try {
    const steamId = req.user.steamId;
    
    // Get friends list
    const friends = await getFriendsList(steamId);
    
    if (friends.length === 0) {
      return res.json({
        success: true,
        friendCount: 0,
        friends: []
      });
    }
    
    // Get Steam IDs of all friends
    const friendIds = friends.map(f => f.steamid);
    
    // Get profile summaries for all friends (in batches of 100)
    const friendProfiles = await getMultiplePlayerSummaries(friendIds);
    
    // Combine data
    const friendsWithData = friendProfiles.map(profile => ({
      steamId: profile.steamid,
      displayName: profile.personaname,
      avatar: profile.avatarfull,
      avatarMedium: profile.avatarmedium,
      profileUrl: profile.profileurl,
      personaState: profile.personastate, // 0=offline, 1=online, 2=busy, 3=away, etc.
      isOnline: profile.personastate !== 0,
      lastLogoff: profile.lastlogoff || null,
      communityVisibilityState: profile.communityvisibilitystate, // 3=public, 1=private
      isPublic: profile.communityvisibilitystate === 3
    }));
    
    res.json({
      success: true,
      friendCount: friendsWithData.length,
      friends: friendsWithData
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get specific friend's profile
router.get('/:steamId/profile', isAuthenticated, async (req, res) => {
  try {
    const friendSteamId = req.params.steamId;
    
    // Get friend's profile
    const profiles = await getMultiplePlayerSummaries([friendSteamId]);
    
    if (profiles.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Friend not found'
      });
    }
    
    const profile = profiles[0];
    
    res.json({
      success: true,
      profile: {
        steamId: profile.steamid,
        displayName: profile.personaname,
        avatar: profile.avatarfull,
        profileUrl: profile.profileurl,
        personaState: profile.personastate,
        isOnline: profile.personastate !== 0,
        lastLogoff: profile.lastlogoff || null,
        realName: profile.realname || null,
        timeCreated: profile.timecreated || null,
        communityVisibilityState: profile.communityvisibilitystate,
        isPublic: profile.communityvisibilitystate === 3
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get friend's games (only if profile is public)
router.get('/:steamId/games', isAuthenticated, async (req, res) => {
  try {
    const friendSteamId = req.params.steamId;
    
    // First check if profile is public
    const profiles = await getMultiplePlayerSummaries([friendSteamId]);
    
    if (profiles.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Friend not found'
      });
    }
    
    const profile = profiles[0];
    
    // Check if profile is public
    if (profile.communityvisibilitystate !== 3) {
      return res.json({
        success: false,
        error: 'This profile is private',
        isPrivate: true
      });
    }
    
    // Get games
    const gamesData = await getOwnedGames(friendSteamId);
    
    res.json({
      success: true,
      isPrivate: false,
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

export default router;