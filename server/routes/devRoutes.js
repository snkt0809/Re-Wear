//temporary
const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.put('/make-admin/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isAdmin = true;
    await user.save();
    res.json({ message: `${user.name} is now an admin.` });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
