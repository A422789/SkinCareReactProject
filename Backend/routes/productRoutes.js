const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');
const { demoGuard } = require('../middleware/demoMiddleware');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin-only routes (protected by authMiddleware, demoGuard, and accepts image upload)
router.post('/', protect, demoGuard, upload.single('image'), createProduct);
router.put('/:id', protect, demoGuard, upload.single('image'), updateProduct);
router.delete('/:id', protect, demoGuard, deleteProduct);

module.exports = router;
