const Property = require('../models/Property');
const { uploadToCloudinary } = require('../middleware/uploadMiddleware');

// @desc    Get all properties with filters
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res) => {
  try {
    const { minPrice, maxPrice, location, page = 1, limit = 10 } = req.query;

    // Build filter object
    const filter = {};

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    // Pagination
    const skip = (page - 1) * limit;
    const total = await Property.countDocuments(filter);
    const properties = await Property.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: properties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching properties'
    });
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    res.status(200).json({
      success: true,
      data: property
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching property'
    });
  }
};

// @desc    Create property
// @route   POST /api/properties
// @access  Private
const createProperty = async (req, res) => {
  try {
    const { title, description, price, location } = req.body;

    // Validation
    if (!title || !description || !price || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    let imageUrl = '';

    // Handle image upload if present
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const property = await Property.create({
      title,
      description,
      price: Number(price),
      location,
      image: imageUrl,
      createdBy: req.user._id
    });

    const populatedProperty = await Property.findById(property._id)
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      data: populatedProperty
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error creating property'
    });
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Owner only)
const updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check ownership
    if (property.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are not the owner of this property'
      });
    }

    const { title, description, price, location } = req.body;

    // Handle image upload if present
    let imageUrl = property.image;
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    property = await Property.findByIdAndUpdate(
      req.params.id,
      {
        title: title || property.title,
        description: description || property.description,
        price: price ? Number(price) : property.price,
        location: location || property.location,
        image: imageUrl
      },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      data: property
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating property'
    });
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Owner only)
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check ownership
    if (property.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are not the owner of this property'
      });
    }

    await property.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting property'
    });
  }
};

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty
};
