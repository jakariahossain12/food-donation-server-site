const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  type: {
    type: String,
  },
  quantity: {
    type: String,
  },
  pickupStart: {
    type: String,
    
  },
  pickupEnd: {
    type: String,
    
  },
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  image: {
    type: String,
  },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Verified', 'Rejected']
  },
  create: {
    type: Date,
    default: Date.now
  },
  upDate: {
    type: Date,
    default: Date.now
  }
});

const Donation = mongoose.model('donation', donationSchema);
module.exports = Donation;
