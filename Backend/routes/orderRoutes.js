const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { demoGuard } = require('../middleware/demoMiddleware');

// Public route to place orders (checkout)
router.post('/', createOrder);

// Protected routes (Admin only)
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id', protect, demoGuard, updateOrder);
router.delete('/:id', protect, demoGuard, deleteOrder);

module.exports = router;
