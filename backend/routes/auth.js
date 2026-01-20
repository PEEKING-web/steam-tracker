import express from 'express';
import passport from '../passport-config.js';

const router = express.Router();

// Route 1: Initiate Steam login
router.get('/steam', passport.authenticate('steam', { failureRedirect: '/' }));

// Route 2: Steam callback (where Steam redirects after login)
router.get('/steam/return',
  (req, res, next) => {
    console.log('=== STEAM CALLBACK HIT ===');
    console.log('Session ID:', req.sessionID);
    next();
  },
  passport.authenticate('steam', { 
    failureRedirect: `${process.env.FRONTEND_URL}/`,
    failureMessage: true 
  }),
  (req, res) => {
    console.log('=== AUTH SUCCESS ===');
    console.log('User:', req.user);
    console.log('Authenticated:', req.isAuthenticated());
    console.log('Session:', req.session);
    
    // Successful authentication, redirect to frontend
    res.redirect(`${process.env.FRONTEND_URL}/profile`);
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
  if (req.isAuthenticated()) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.json({ authenticated: false });
  }
});

export default router;