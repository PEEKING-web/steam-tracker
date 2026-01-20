import express from 'express';
import { isAuthenticated } from '../middleware/auth.js';
import {
  createSession,
  endSession,
  getSessionsByUser,
  getSessionsByGame
} from '../utils/sessionsDB.js';

const router = express.Router();

// Start session
router.post('/start', isAuthenticated, (req, res) => {
  const { appid, gameName, mood, notes } = req.body;

  if (!appid || !gameName) {
    return res.status(400).json({ error: 'Game info required' });
  }

  const session = createSession({
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
});

// End session
router.post('/end/:id', isAuthenticated, (req, res) => {
  const session = endSession(req.params.id, Date.now());

  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  res.json({ success: true, session });
});

// Get all sessions for user
router.get('/', isAuthenticated, (req, res) => {
  const sessions = getSessionsByUser(req.user.steamId);
  res.json({ success: true, sessions });
});

// Get sessions by game
router.get('/game/:appid', isAuthenticated, (req, res) => {
  const sessions = getSessionsByGame(
    req.user.steamId,
    req.params.appid
  );
  res.json({ success: true, sessions });
});

export default router;
