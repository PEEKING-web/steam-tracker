import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  steamId: {
    type: String,
    required: true,
    index: true
  },
  categoryId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  games: [{
    appid: Number,
    name: String,
    playtime_forever: Number,
    img_icon_url: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});


categorySchema.index({ steamId: 1, categoryId: 1 });

export default mongoose.model('Category', categorySchema);