const User = require('../models/User');
const jwt = require('jsonwebtoken');


exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      _id: user._id,
      name: user.name,
      points: user.points,
      createdAt: user.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};