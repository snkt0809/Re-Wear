const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Example admin-only route
router.get('/dashboard', protect, adminOnly, (req, res) => {
  res.json({ message: 'Welcome Admin', admin: req.user.name });
});

module.exports = router;
