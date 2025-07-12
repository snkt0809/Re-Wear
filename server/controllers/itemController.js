const Clothes = require('../models/Clothes');


exports.addClothingItem = async (req, res) => {
  try {
    const { title, description, category, size, condition, imageUrls, tags, location } = req.body;

    if (!title || !category || !size || !imageUrls || imageUrls.length === 0 || !location) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const newItem = new Clothes({
      title,
      description,
      category,
      size,
      condition: condition || 'Good',
      imageUrls,
      tags: tags || [],
      location,
      donorId: req.user._id,
      approved: false
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getApprovedItems = async (req, res) => {
  try {
    const items = await Clothes.find({ approved: true }).populate('donorId', 'name');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get available items for swap (approved and available)
// @route   GET /api/items/available
// @access  Private
exports.getAvailableItems = async (req, res) => {
  try {
    const items = await Clothes.find({ 
      approved: true, 
      available: true 
    }).populate('donorId', 'name email');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user's own items
// @route   GET /api/items/my-items
// @access  Private
exports.getMyItems = async (req, res) => {
  try {
    const items = await Clothes.find({ 
      donorId: req.user._id 
    }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
