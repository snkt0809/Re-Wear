const express = require('express');
const router = express.Router();
const { 
  addClothingItem,
  getApprovedItems,
  getAvailableItems,
  getMyItems,
  getItemById
} = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');

router.post('/add', protect, addClothingItem);
router.get('/', protect, getApprovedItems);
router.get('/available', protect, getAvailableItems);
router.get('/my-items', protect, getMyItems);

// Public route to get item details by ID
router.get('/:id', getItemById);

module.exports = router;