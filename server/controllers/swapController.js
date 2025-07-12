const Swap = require('../models/Swap');
const Clothes = require('../models/Clothes');
const User = require('../models/User');

// @desc    Initiate a swap request
// @route   POST /api/swaps/initiate
// @access  Private
exports.initiateSwap = async (req, res) => {
  try {
    const { product1Id, product2Id, message } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!product1Id || !product2Id) {
      return res.status(400).json({ message: 'Both product IDs are required' });
    }

    // Get the products to validate they exist and are available
    const product1 = await Clothes.findById(product1Id);
    const product2 = await Clothes.findById(product2Id);

    if (!product1 || !product2) {
      return res.status(404).json({ message: 'One or both products not found' });
    }

    // Check if products are available for swap
    if (!product1.available || !product2.available) {
      return res.status(400).json({ message: 'One or both products are not available for swap' });
    }

    // Check if user owns product1
    if (product1.donorId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'You can only initiate swaps with your own products' });
    }

    // Check if trying to swap with own product
    if (product1.donorId.toString() === product2.donorId.toString()) {
      return res.status(400).json({ message: 'Cannot swap with your own product' });
    }

    // Check if there's already a pending swap for these products
    const existingSwap = await Swap.findOne({
      $or: [
        { product1Id, product2Id, status: { $in: ['initiated', 'approved'] } },
        { product1Id: product2Id, product2Id: product1Id, status: { $in: ['initiated', 'approved'] } }
      ]
    });

    if (existingSwap) {
      return res.status(400).json({ message: 'A swap request already exists for these products' });
    }

    // Create the swap
    const swap = new Swap({
      user1Id: product1.donorId,
      product1Id,
      product1Name: product1.title,
      user2Id: product2.donorId,
      product2Id,
      product2Name: product2.title,
      initiatedBy: userId,
      message
    });

    const savedSwap = await swap.save();

    // Populate user details for response
    await savedSwap.populate([
      { path: 'user1Id', select: 'name email' },
      { path: 'user2Id', select: 'name email' },
      { path: 'initiatedBy', select: 'name email' }
    ]);

    res.status(201).json(savedSwap);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user's swap requests (initiated and received)
// @route   GET /api/swaps/my-swaps
// @access  Private
exports.getMySwaps = async (req, res) => {
  try {
    const userId = req.user._id;

    const swaps = await Swap.find({
      $or: [
        { user1Id: userId },
        { user2Id: userId }
      ]
    }).populate([
      { path: 'user1Id', select: 'name email' },
      { path: 'user2Id', select: 'name email' },
      { path: 'initiatedBy', select: 'name email' },
      { path: 'approvedBy', select: 'name email' }
    ]).sort({ createdAt: -1 });

    res.json(swaps);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get pending swap requests (received by user)
// @route   GET /api/swaps/pending
// @access  Private
exports.getPendingSwaps = async (req, res) => {
  try {
    const userId = req.user._id;

    const pendingSwaps = await Swap.find({
      $or: [
        { user1Id: userId, status: 'initiated' },
        { user2Id: userId, status: 'initiated' }
      ]
    }).populate([
      { path: 'user1Id', select: 'name email' },
      { path: 'user2Id', select: 'name email' },
      { path: 'initiatedBy', select: 'name email' }
    ]).sort({ createdAt: -1 });

    res.json(pendingSwaps);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Approve a swap request
// @route   PUT /api/swaps/:id/approve
// @access  Private
exports.approveSwap = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const swap = await Swap.findById(id);

    if (!swap) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    // Check if user is part of this swap
    if (swap.user1Id.toString() !== userId.toString() && swap.user2Id.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to approve this swap' });
    }

    // Check if swap is in initiated status
    if (swap.status !== 'initiated') {
      return res.status(400).json({ message: 'Swap is not in initiated status' });
    }

    // Check if user is not the one who initiated the swap
    if (swap.initiatedBy.toString() === userId.toString()) {
      return res.status(400).json({ message: 'You cannot approve your own swap request' });
    }

    // Update swap status to approved
    swap.status = 'approved';
    swap.approvedBy = userId;
    await swap.save();

    // Populate user details for response
    await swap.populate([
      { path: 'user1Id', select: 'name email' },
      { path: 'user2Id', select: 'name email' },
      { path: 'initiatedBy', select: 'name email' },
      { path: 'approvedBy', select: 'name email' }
    ]);

    res.json(swap);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Complete a swap
// @route   PUT /api/swaps/:id/complete
// @access  Private
exports.completeSwap = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const swap = await Swap.findById(id);

    if (!swap) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    // Check if user is part of this swap
    if (swap.user1Id.toString() !== userId.toString() && swap.user2Id.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to complete this swap' });
    }

    // Check if swap is approved
    if (swap.status !== 'approved') {
      return res.status(400).json({ message: 'Swap must be approved before completion' });
    }

    // Update swap status to completed
    swap.status = 'completed';
    swap.completedAt = new Date();
    await swap.save();

    // Update product availability
    await Clothes.findByIdAndUpdate(swap.product1Id, { available: false });
    await Clothes.findByIdAndUpdate(swap.product2Id, { available: false });

    // Populate user details for response
    await swap.populate([
      { path: 'user1Id', select: 'name email' },
      { path: 'user2Id', select: 'name email' },
      { path: 'initiatedBy', select: 'name email' },
      { path: 'approvedBy', select: 'name email' }
    ]);

    res.json(swap);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Reject a swap request
// @route   PUT /api/swaps/:id/reject
// @access  Private
exports.rejectSwap = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const swap = await Swap.findById(id);

    if (!swap) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    // Check if user is part of this swap
    if (swap.user1Id.toString() !== userId.toString() && swap.user2Id.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to reject this swap' });
    }

    // Check if swap is in initiated status
    if (swap.status !== 'initiated') {
      return res.status(400).json({ message: 'Can only reject initiated swaps' });
    }

    // Check if user is not the one who initiated the swap
    if (swap.initiatedBy.toString() === userId.toString()) {
      return res.status(400).json({ message: 'You cannot reject your own swap request' });
    }

    // Update swap status to rejected
    swap.status = 'rejected';
    await swap.save();

    // Populate user details for response
    await swap.populate([
      { path: 'user1Id', select: 'name email' },
      { path: 'user2Id', select: 'name email' },
      { path: 'initiatedBy', select: 'name email' }
    ]);

    res.json(swap);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Cancel a swap request
// @route   DELETE /api/swaps/:id/cancel
// @access  Private
exports.cancelSwap = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const swap = await Swap.findById(id);

    if (!swap) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    // Check if user is part of this swap
    if (swap.user1Id.toString() !== userId.toString() && swap.user2Id.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to cancel this swap' });
    }

    // Check if swap is in initiated status (can only cancel initiated swaps)
    if (swap.status !== 'initiated') {
      return res.status(400).json({ message: 'Can only cancel initiated swaps' });
    }

    await Swap.findByIdAndDelete(id);

    res.json({ message: 'Swap request cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get swap by ID
// @route   GET /api/swaps/:id
// @access  Private
exports.getSwapById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const swap = await Swap.findById(id).populate([
      { path: 'user1Id', select: 'name email' },
      { path: 'user2Id', select: 'name email' },
      { path: 'initiatedBy', select: 'name email' },
      { path: 'approvedBy', select: 'name email' }
    ]);

    if (!swap) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    // Check if user is part of this swap
    if (swap.user1Id._id.toString() !== userId.toString() && swap.user2Id._id.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to view this swap' });
    }

    res.json(swap);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Swap products based on points
// @route   POST /api/swaps/points-swap
// @access  Private
exports.pointsSwap = async (req, res) => {
  try {
    const { product1Id, product2Id } = req.body;
    const userId = req.user._id;

    // Fetch both products
    const product1 = await Clothes.findById(product1Id);
    const product2 = await Clothes.findById(product2Id);

    if (!product1 || !product2) {
      return res.status(404).json({ message: 'One or both products not found' });
    }

    // Check if both products are available
    if (!product1.available || !product2.available) {
      return res.status(400).json({ message: 'One or both products are not available for swap' });
    }

    // Check if both products have points declared
    if (typeof product1.points !== 'number' || typeof product2.points !== 'number') {
      return res.status(400).json({ message: 'Both products must have points declared' });
    }

    // Fetch both users
    const user1 = await User.findById(product1.donorId);
    const user2 = await User.findById(product2.donorId);

    if (!user1 || !user2) {
      return res.status(404).json({ message: 'One or both users not found' });
    }

    // Only allow the owner of product1 (the requester) to initiate
    if (userId.toString() !== user1._id.toString()) {
      return res.status(403).json({ message: 'You can only swap your own product' });
    }

    // Check if both users have enough points
    if (user1.points < product2.points) {
      return res.status(400).json({ message: 'You do not have enough points to receive this product' });
    }
    if (user2.points < product1.points) {
      return res.status(400).json({ message: 'The other user does not have enough points to receive your product' });
    }

    // Deduct/add points
    user1.points = user1.points - product2.points + product1.points;
    user2.points = user2.points - product1.points + product2.points;
    await user1.save();
    await user2.save();

    // Mark products as unavailable
    product1.available = false;
    product2.available = false;
    await product1.save();
    await product2.save();

    // Record the swap as completed
    const swap = new Swap({
      user1Id: user1._id,
      product1Id: product1._id,
      product1Name: product1.title,
      user2Id: user2._id,
      product2Id: product2._id,
      product2Name: product2.title,
      status: 'completed',
      initiatedBy: user1._id,
      approvedBy: user2._id,
      completedAt: new Date()
    });
    await swap.save();

    res.json({
      message: 'Swap completed successfully based on points',
      swap
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Acquire a product using points (no product offered, just coins)
// @route   POST /api/swaps/points-acquire
// @access  Private
exports.pointsAcquire = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    // Fetch the product
    const product = await Clothes.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if product is available
    if (!product.available) {
      return res.status(400).json({ message: 'Product is not available for swap' });
    }

    // Check if product has points declared
    if (typeof product.points !== 'number') {
      return res.status(400).json({ message: 'Product does not have points declared' });
    }

    // Fetch the requesting user and the donor
    const user = await User.findById(userId);
    const donor = await User.findById(product.donorId);
    if (!user || !donor) {
      return res.status(404).json({ message: 'User or donor not found' });
    }

    // Prevent donor from acquiring their own product
    if (userId.toString() === donor._id.toString()) {
      return res.status(400).json({ message: 'You cannot acquire your own product' });
    }

    // Check if user has enough points
    if (user.points < product.points) {
      return res.status(400).json({ message: 'You do not have enough points to acquire this product' });
    }

    // Deduct points from user, add to donor
    user.points -= product.points;
    donor.points += product.points;
    await user.save();
    await donor.save();

    // Mark product as unavailable and update owner
    product.available = false;
    product.ownerId = user._id;
    await product.save();

    // Record the swap as completed
    const swap = new Swap({
      user1Id: donor._id,
      product1Id: product._id,
      product1Name: product.title,
      user2Id: user._id,
      product2Id: null,
      product2Name: null,
      status: 'completed',
      initiatedBy: user._id,
      approvedBy: donor._id,
      completedAt: new Date(),
      message: 'Points-based acquisition'
    });
    await swap.save();

    res.json({
      message: 'Product acquired successfully using points',
      swap,
      product
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 