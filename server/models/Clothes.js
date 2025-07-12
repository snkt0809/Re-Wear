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
    enum: ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories', 'Bags', 'Jewelry'],
    required: true
  },
  size: {
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size', 'Custom'],
    required: true
  },
  condition: {
    type: String,
    enum: ['New with tags', 'Like new', 'Excellent', 'Good', 'Fair', 'Poor'],
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
  },
  // Additional fields from frontend
  points: {
    type: Number,
    default: 50
  },
  tags: [{
    type: String,
    trim: true
  }],
  brand: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    trim: true
  },
  material: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const Clothes = mongoose.model('Clothes', clothesSchema);

module.exports = Clothes;
