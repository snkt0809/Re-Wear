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
