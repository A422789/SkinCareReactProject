const jwt = require('jsonwebtoken');
const User = require('../models/User');
const redis = require('../config/redis');
const { AuthenticationError } = require('../utils/customErrors');

const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check for session first
    if (req.session && req.session.userId) {
      const user = await User.findById(req.session.userId).select('-password');
      if (user) {
        req.user = user;
        return next();
      }
    }

    // 2. Check for Bearer token in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];

      // Check if token is blacklisted in Redis
      const isBlacklisted = await redis.get(`blacklist:${token}`);
      if (isBlacklisted) {
        throw new AuthenticationError('Not authorized, token has been revoked');
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (user) {
        req.user = user;
        return next();
      }
    }

    throw new AuthenticationError('Not authorized, session expired or invalid token');
  } catch (error) {
    next(new AuthenticationError(error.message || 'Not authorized, authentication failed'));
  }
};

module.exports = { protect };
