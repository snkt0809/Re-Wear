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
  imageUrls: [{
    type: String,
    required: true
  }],
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    type: String,
    required: true
  },
  available: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: () => Date.now()
  },
  updatedAt: {
    type: Date,
    default: () => Date.now()
  }
});

// Auto-update updatedAt on document update
clothesSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Clothes = mongoose.model('Clothes', clothesSchema);

module.exports = Clothes;
