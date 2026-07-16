const rateLimit = require('express-rate-limit');
const { ApiError } = require('../utils/customErrors');

// Global rate limiter configuration
const globalLimiter = rateLimit({
  windowMs: (parseInt(process.env.RATE_LIMIT_GLOBAL_WINDOW_MINS, 10) || 15) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_GLOBAL_MAX, 10) || 100,
  handler: (req, res, next) => {
    next(new ApiError('Too many requests, please try again later', 429));
  },
  standardHeaders: true, // Return rate limit info in standard headers
  legacyHeaders: false,  // Disable legacy X-RateLimit-* headers
});

// Authentication rate limiter (brute-force protection)
const authLimiter = rateLimit({
  windowMs: (parseInt(process.env.RATE_LIMIT_AUTH_WINDOW_MINS, 10) || 15) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_AUTH_MAX, 10) || 5,
  handler: (req, res, next) => {
    next(new ApiError('Too many login attempts, please try again after 15 minutes', 429));
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  globalLimiter,
  authLimiter,
};
