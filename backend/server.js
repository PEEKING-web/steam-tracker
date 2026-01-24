import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import dotenv from 'dotenv';
import './passport-config.js'; 
import authRoutes from './routes/auth.js'; 
import userRoutes from './routes/user.js'; 
import gamesRoutes from './routes/games.js'; 
import friendsRoutes from './routes/friends.js';
import statsRoutes from './routes/stats.js';
import categoriesRoutes from './routes/categories.js';
import sessionsRoutes from './routes/sessions.js';
import recommendationsRoutes from './routes/recommendations.js';
import { connectDB } from './config/db.js';
import MongoStore from 'connect-mongo';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3001;



// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS 
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGODB_URI,
  collectionName: 'sessions',
  ttl: 7 * 24 * 60 * 60, 
  autoRemove: 'native', 
  touchAfter: 24 * 3600 
});


sessionStore.on('error', (error) => {
  console.error('❌ Session store error:', error.message);
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false, // CRITICAL: prevents null sessionId
  store: sessionStore,
  rolling: true, // Reset cookie expiration on activity
  proxy: true,
  name: 'steamtracker.sid', 
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/'
  }
}));

// Initialize Passport

app.use(passport.initialize());
app.use(passport.session());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Steam Tracker API is running! 🚀' });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth routes
app.use('/auth', authRoutes);

// User routes
app.use('/api/user', userRoutes);

// Games routes
app.use('/api/games', gamesRoutes);

// Friends routes
app.use('/api/friends', friendsRoutes);

// Stats routes
app.use('/api/stats', statsRoutes);

// Categories routes
app.use('/api/categories', categoriesRoutes);

//sessions Routes
app.use('/api/sessions', sessionsRoutes);

//groq game recommendation route
app.use('/api/recommendations', recommendationsRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Something went wrong!', 
    message: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
});