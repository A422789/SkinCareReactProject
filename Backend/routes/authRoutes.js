const express = require('express');
const router = express.Router();
const { loginUser, logoutUser, refreshUser, registerUser, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validateLogin, validateRegister } = require('../middleware/validationMiddleware');

router.post('/login', validateLogin, loginUser);
router.post('/register', protect, validateRegister, registerUser);
router.post('/logout', protect, logoutUser);
router.post('/refresh', protect, refreshUser);
router.get('/profile', protect, getProfile);

module.exports = router;
