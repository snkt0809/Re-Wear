const express = require('express');
const router = express.Router();
const { 
  addClothingItem,
  getApprovedItems,
  getAvailableItems,
  getMyItems,
  testEnums
} = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');

// Test endpoint to check enum values (no auth required)
router.get('/test-enums', testEnums);

router.post('/add', protect, addClothingItem);
router.get('/', protect, getApprovedItems);
router.get('/available', protect, getAvailableItems);
router.get('/my-items', protect, getMyItems);

module.exports = router;