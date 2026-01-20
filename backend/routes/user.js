import express from 'express';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Get current user profile (protected route)
router.get('/profile', isAuthenticated, (req, res) => {
  res.json({ 
    success: true,
    user: req.user 
  });
});

// Get user session info
router.get('/session', isAuthenticated, (req, res) => {
  res.json({
    success: true,
    sessionID: req.sessionID,
    user: req.user,
    authenticated: req.isAuthenticated()
  });
});

export default router;