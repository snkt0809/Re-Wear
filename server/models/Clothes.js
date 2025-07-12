const mongoose = require('mongoose');

const clothesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['Men', 'Women', 'Kids', 'Unisex', 'Other'],
    required: true
  },
  size: {
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size', 'Other'],
    required: true
  },
  condition: {
    type: String,
    enum: ['Like New', 'Good', 'Worn', 'Needs Repair'],
    default: 'Good'
  },
  points: {
    type: Number,
    default: 10,
    min: 0
  },
  imageUrls: [{
    type: String,
    required: true
  }],
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: function() { return this.donorId; }
  },
  location: {
    type: String,
    required: true
  },
  available: {
    type: Boolean,
    default: true
  },
  approved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Clothes = mongoose.model('Clothes', clothesSchema);

module.exports = Clothes;
