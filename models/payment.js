const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    
    trim: true
  },
  image: {
    type: String,
    
  },
  organization: {
    type: String,
    
    trim: true
  },
  mission: {
    type: String,
    
    trim: true
  },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Completed', 'Failed']
  },
  date: {
    type: Date,
    
  },
  amount: {
    type: Number,
    
  },
  currency: {
    type: String,
   
  },
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  paymentMethod: {
    type: String,
    
  },
  created: {
    type: Number,
    
  }
});

const Payment = mongoose.model('payment', paymentSchema);
module.exports = Payment;