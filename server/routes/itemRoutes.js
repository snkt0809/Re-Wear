const express = require('express');
const router = express.Router();
const { 
  addClothingItem,
  getApprovedItems,
  getAvailableItems,
  getMyItems,
  getItemById,
  getAllClothes
  testEnums
} = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');

// Test endpoint to check enum values (no auth required)
router.get('/test-enums', testEnums);

router.post('/add', protect, addClothingItem);
router.get('/', protect, getApprovedItems);
router.get('/available', protect, getAvailableItems);
router.get('/my-items', protect, getMyItems);

// Public route to get all clothes with filters
router.get('/clothes', getAllClothes);

// Public route to get item details by ID
router.get('/:id', getItemById);

module.exports = router;