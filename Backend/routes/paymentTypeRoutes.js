const express = require('express');
const router = express.Router();
const {
  getPaymentTypes,
  getPaymentTypeById,
  createPaymentType,
  updatePaymentType,
  deletePaymentType,
} = require('../controllers/paymentTypeController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getPaymentTypes);
router.get('/:id', getPaymentTypeById);

// Protected routes (Admin-only CRUD operations)
router.post('/', protect, createPaymentType);
router.put('/:id', protect, updatePaymentType);
router.delete('/:id', protect, deletePaymentType);

module.exports = router;
