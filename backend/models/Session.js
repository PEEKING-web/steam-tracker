import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true 
  },
  steamId: {
    type: String,
    required: true,
    index: true
  },
  appid: {
    type: Number,
    required: true
  },
  gameName: {
    type: String,
    required: true,
    trim: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    default: null
  },
  durationMinutes: {
    type: Number,
    default: null,
    min: 0
  },
  mood: {
    type: String,
    default: 'Neutral',
    enum: ['Focused', 'Chill', 'Energetic', 'Neutral']
  },
  notes: {
    type: String,
    default: '',
    maxlength: 500 
  }
}, {
  timestamps: true 
});


sessionSchema.index({ steamId: 1, startTime: -1 });
sessionSchema.index({ steamId: 1, appid: 1 });

export default mongoose.model('Session', sessionSchema);