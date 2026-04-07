const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');
const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty
} = require('../controllers/propertyController');

router.route('/')
  .get(getProperties)
  .post(protect, upload.single('image'), createProperty);

router.route('/:id')
  .get(getPropertyById)
  .put(protect, upload.single('image'), updateProperty)
  .delete(protect, deleteProperty);

module.exports = router;
