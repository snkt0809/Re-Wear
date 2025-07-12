const Clothes = require('../models/Clothes');

// Test endpoint to check enum values
exports.testEnums = async (req, res) => {
  try {
    console.log('=== TESTING ENUM VALUES ===');
    console.log('Clothes model schema:', Clothes.schema.obj);
    console.log('Category enum:', Clothes.schema.path('category').enumValues);
    console.log('Size enum:', Clothes.schema.path('size').enumValues);
    console.log('Condition enum:', Clothes.schema.path('condition').enumValues);
    
    res.json({
      category: Clothes.schema.path('category').enumValues,
      size: Clothes.schema.path('size').enumValues,
      condition: Clothes.schema.path('condition').enumValues,
      schema: Clothes.schema.obj
    });
  } catch (error) {
    console.log('Error testing enums:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.addClothingItem = async (req, res) => {
  try {
    console.log('=== ADD CLOTHING ITEM REQUEST ===');
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
    console.log('User ID:', req.user._id);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('================================');

    const { title, description, category, size, condition, imageUrls, tags, location, points, brand, color, material } = req.body;

    // Log individual fields
    console.log('Parsed fields:');
    console.log('- title:', title);
    console.log('- description:', description);
    console.log('- category:', category, '(type:', typeof category, ')');
    console.log('- size:', size, '(type:', typeof size, ')');
    console.log('- condition:', condition, '(type:', typeof condition, ')');
    console.log('- imageUrls:', imageUrls);
    console.log('- tags:', tags);
    console.log('- location:', location);
    console.log('- points:', points);
    console.log('- brand:', brand);
    console.log('- color:', color);
    console.log('- material:', material);

    // Log valid enum values
    console.log('Valid categories:', Clothes.schema.path('category').enumValues);
    console.log('Valid sizes:', Clothes.schema.path('size').enumValues);
    console.log('Valid conditions:', Clothes.schema.path('condition').enumValues);

    if (!title || !category || !size || !imageUrls || imageUrls.length === 0 || !location) {
      console.log('❌ Validation failed - missing required fields');
      console.log('Required fields check:');
      console.log('- title:', !!title);
      console.log('- category:', !!category);
      console.log('- size:', !!size);
      console.log('- imageUrls:', !!imageUrls, 'length:', imageUrls?.length);
      console.log('- location:', !!location);
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    console.log('✅ Validation passed - creating new item');

    const newItem = new Clothes({
      title,
      description,
      category,
      size,
      condition: condition || 'Good',
      imageUrls,
      tags: tags || [],
      location,
      points: points || 50,
      brand: brand || '',
      color: color || '',
      material: material || '',
      donorId: req.user._id,
      approved: false
    });

    console.log('New item object:', JSON.stringify(newItem, null, 2));

    const savedItem = await newItem.save();
    console.log('✅ Item saved successfully:', savedItem._id);
    res.status(201).json(savedItem);
  } catch (error) {
    console.log('❌ Error in addClothingItem:', error.message);
    console.log('Error stack:', error.stack);
    
    // Log validation errors in detail
    if (error.name === 'ValidationError') {
      console.log('Validation errors:');
      Object.keys(error.errors).forEach(key => {
        console.log(`- ${key}:`, error.errors[key].message);
      });
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getApprovedItems = async (req, res) => {
  try {
    const items = await Clothes.find({ approved: true }).populate('donorId', 'name');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get available items for swap (approved and available)
// @route   GET /api/items/available
// @access  Private
exports.getAvailableItems = async (req, res) => {
  try {
    const items = await Clothes.find({ 
      approved: true, 
      available: true 
    }).populate('donorId', 'name email');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user's own items
// @route   GET /api/items/my-items
// @access  Private
exports.getMyItems = async (req, res) => {
  try {
    const items = await Clothes.find({ 
      donorId: req.user._id 
    }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
