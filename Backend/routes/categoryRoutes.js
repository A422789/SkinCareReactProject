const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');
const { demoGuard } = require('../middleware/demoMiddleware');

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Protected routes (Admin-only CRUD operations)
router.post('/', protect, demoGuard, createCategory);
router.put('/:id', protect, demoGuard, updateCategory);
router.delete('/:id', protect, demoGuard, deleteCategory);

module.exports = router;
