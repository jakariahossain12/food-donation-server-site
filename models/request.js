const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  donationId: {
    type: String,
   
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
  quantity: {
    type: String,
    
  },
  type: {
    type: String,
    
    trim: true
  },
  charityName: {
    type: String,
    
    trim: true
  },
  charityEmail: {
    type: String,
    required: true,
    
  },
  description: {
    type: String,
    
    trim: true
  },
  pickupTime: {
    type: String,
    
  },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Approved', 'PickedUp', 'Rejected']
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  pickup_status: {
    type: String,
    default: 'Unassigned',
    enum: ['Unassigned', 'Assigned', 'PickedUp']
  },
  pickedUpAt: {
    type: Date
  }
});

module.exports = mongoose.model('Request', requestSchema);