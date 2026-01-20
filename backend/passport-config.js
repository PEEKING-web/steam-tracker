import passport from 'passport';
import SteamStrategy from 'passport-steam';
import dotenv from 'dotenv';

dotenv.config();

// Configure Steam Strategy
passport.use(new SteamStrategy({
    returnURL: `${process.env.BACKEND_URL}/auth/steam/return`,
    realm: process.env.BACKEND_URL,
    apiKey: process.env.STEAM_API_KEY
  },
  function(identifier, profile, done) {
    // This function is called when Steam returns user data
    // profile contains all Steam user information
    
    const user = {
      steamId: profile.id,
      displayName: profile.displayName,
      avatar: profile.photos[2].value, // Large avatar
      profileUrl: profile._json.profileurl,
      personaState: profile._json.personastate, // Online status
      realName: profile._json.realname || null,
      timeCreated: profile._json.timecreated || null
    };
    
    return done(null, user);
  }
));

// Serialize user into session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;