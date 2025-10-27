const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  donationId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  userEmail: {
    type: String,
  },
  savedAt: {
    type: Date,
    default: Date.now
  }
});

const Favorite = mongoose.model('favorite', favoriteSchema);

module.exports = Favorite