import express from 'express';
import { isAuthenticated } from '../middleware/auth.js';
import {
  createSession,
  endSession,
  getSessionsByUser,
  getSessionsByGame
} from '../utils/sessionsDB_mongo.js';

const router = express.Router();

// Start session
router.post('/start', isAuthenticated, async (req, res) => {
  try {
    const { appid, gameName, mood, notes } = req.body;

    if (!appid || !gameName) {
      return res.status(400).json({ 
        success: false,
        error: 'Game info required' 
      });
    }

    const session = await createSession({
      steamId: req.user.steamId,
      appid,
      gameName,
      startTime: Date.now(),
      endTime: null,
      durationMinutes: null,
      mood: mood || 'Neutral',
      notes: notes || ''
    });

    res.json({ success: true, session });
  } catch (error) {
    console.error('Error starting session:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// End session
router.post('/end/:id', isAuthenticated, async (req, res) => {
  try {
    const session = await endSession(req.params.id, Date.now());

    if (!session) {
      return res.status(404).json({ 
        success: false,
        error: 'Session not found' 
      });
    }

    res.json({ success: true, session });
  } catch (error) {
    console.error('Error ending session:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Get all sessions for user
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const sessions = await getSessionsByUser(req.user.steamId);
    res.json({ success: true, sessions });
  } catch (error) {
    console.error('Error getting sessions:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Get sessions by game
router.get('/game/:appid', isAuthenticated, async (req, res) => {
  try {
    const sessions = await getSessionsByGame(
      req.user.steamId,
      req.params.appid
    );
    res.json({ success: true, sessions });
  } catch (error) {
    console.error('Error getting game sessions:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

export default router;