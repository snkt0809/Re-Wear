const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  initiateSwap,
  getMySwaps,
  getPendingSwaps,
  approveSwap,
  rejectSwap,
  completeSwap,
  cancelSwap,
  getSwapById
} = require('../controllers/swapController');

// All routes require authentication
router.use(protect);

// Initiate a new swap request
router.post('/initiate', initiateSwap);

// Get user's swap history (initiated and received)
router.get('/my-swaps', getMySwaps);

// Get pending swap requests
router.get('/pending', getPendingSwaps);

// Get specific swap by ID
router.get('/:id', getSwapById);

// Approve a swap request
router.put('/:id/approve', approveSwap);

// Reject a swap request
router.put('/:id/reject', rejectSwap);

// Complete a swap
router.put('/:id/complete', completeSwap);

// Cancel a swap request
router.delete('/:id/cancel', cancelSwap);

module.exports = router; 