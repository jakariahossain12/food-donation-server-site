const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  donationId: {
    type: String,
    required: true,
    ref: 'Donation'
  },
  donationTitle: {
    type: String,
    
    trim: true
  },
  restaurantName: {
    type: String,
    
    trim: true
  },
  restaurantEmail: {
    type: String,
    required: true,
    
  },
  reviewerName: {
    type: String,
   
    trim: true
  },
  reviewerEmail: {
    type: String,
    required: true,
    
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  reviewText: {
    type: String,
    
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const review = mongoose.model('review', reviewSchema);
module.exports = review;