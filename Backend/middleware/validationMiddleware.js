const { check, validationResult } = require('express-validator');
const { ValidationError } = require('../utils/customErrors');

const validateLogin = [
  check('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .escape(), // Sanitizes inputs by escaping HTML entities to prevent XSS
  check('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .escape(), // Sanitizes password inputs to prevent script injection
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationError(errors.array()));
    }
    next();
  }
];

const validateRegister = [
  check('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .escape(),
  check('password')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationError(errors.array()));
    }
    next();
  }
];

module.exports = {
  validateLogin,
  validateRegister,
};
