const express = require('express');
const router = express.Router();
const { addClothingItem } = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');

router.post('/add', protect, addClothingItem);

module.exports = router;