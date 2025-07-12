const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const { adminLogin } = require('../controllers/adminAuthController');



router.post('/login', adminLogin);

module.exports = router;
