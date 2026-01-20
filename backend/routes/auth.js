import express from 'express';
import passport from '../passport-config.js';

const router = express.Router();

// Route 1: Initiate Steam login
router.get('/steam', passport.authenticate('steam', { failureRedirect: '/' }));

// Route 2: Steam callback (where Steam redirects after login)
router.get('/steam/return',
  passport.authenticate('steam', { failureRedirect: '/' }),
  (req, res) => {
    // ✅ SAVE SESSION BEFORE REDIRECT
    req.session.save((err) => {
      if (err) {
        console.error('❌ Session save error:', err);
        return res.redirect(`${process.env.FRONTEND_URL}/`);
      }
      
      console.log('✅ Session saved successfully');
      console.log('User:', req.user);
      console.log('Session ID:', req.sessionID);
      
      // Successful authentication, redirect to frontend
      res.redirect(`${process.env.FRONTEND_URL}/profile`);
    });
  }
);

// Route 3: Logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Session destruction failed' });
      }
      res.json({ message: 'Logged out successfully' });
    });
  });
});

// Route 4: Check if user is authenticated
router.get('/check', (req, res) => {
  console.log('Auth check - Session ID:', req.sessionID);
  console.log('Authenticated:', req.isAuthenticated());
  
  if (req.isAuthenticated()) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.json({ authenticated: false });
  }
});

export default router;