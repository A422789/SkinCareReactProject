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
const { demoGuard } = require('../middleware/demoMiddleware');

// Public routes
router.get('/', getPaymentTypes);
router.get('/:id', getPaymentTypeById);

// Protected routes (Admin-only CRUD operations)
router.post('/', protect, demoGuard, createPaymentType);
router.put('/:id', protect, demoGuard, updatePaymentType);
router.delete('/:id', protect, demoGuard, deletePaymentType);

module.exports = router;
