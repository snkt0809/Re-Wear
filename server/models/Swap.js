const mongoose = require('mongoose');

const swapSchema = new mongoose.Schema({
  // First user and their product
  user1Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product1Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clothes',
    required: true
  },
  product1Name: {
    type: String,
    required: true
  },
  
  // Second user and their product
  user2Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product2Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clothes',
    required: true
  },
  product2Name: {
    type: String,
    required: true
  },
  
  // Swap status
  status: {
    type: String,
    enum: ['initiated', 'approved', 'rejected', 'completed'],
    default: 'initiated'
  },
  
  // Additional fields for tracking
  initiatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  completedAt: {
    type: Date
  },
  
  // Optional message from initiator
  message: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for better query performance
swapSchema.index({ user1Id: 1, user2Id: 1 });
swapSchema.index({ status: 1 });

const Swap = mongoose.model('Swap', swapSchema);

module.exports = Swap; 