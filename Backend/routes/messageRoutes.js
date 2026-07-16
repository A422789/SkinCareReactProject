const express = require('express');
const router = express.Router();
const {
  createMessage,
  getMessages,
  getMessageById,
  deleteMessage,
  replyToMessage,
  updateMessageStatus,
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// Public route (contact form submission)
router.post('/', createMessage);

// Protected routes (Admin only)
router.get('/', protect, getMessages);
router.get('/:id', protect, getMessageById);
router.delete('/:id', protect, deleteMessage);
router.post('/:id/reply', protect, replyToMessage);
router.put('/:id/read', protect, updateMessageStatus);

module.exports = router;
