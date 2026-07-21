const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const BlacklistedToken = require('../models/BlacklistedToken');
const bcrypt = require('bcryptjs');
const { BadRequestError, AuthenticationError, InternalServerError } = require('../utils/customErrors');

// @desc    Auth user, get token & set session
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError('Please provide email and password');
    }

    const user = await User.findOne({ email });

    const isMatch = user ? await bcrypt.compare(password, user.password) : false;

    if (user && isMatch) {
      // Save session info
      req.session.userId = user._id;

      res.status(200).json({
        _id: user._id,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      throw new AuthenticationError('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user, destroy session & blacklist token in MongoDB
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
      // Blacklist token in MongoDB (TTL index auto-cleans after 12 hours)
      await BlacklistedToken.create({ token }).catch(() => {});
    }

    req.session.destroy((err) => {
      if (err) {
        return next(new InternalServerError('Could not log out, session destruction failed'));
      }
      res.clearCookie('connect.sid');
      res.status(200).json({ message: 'Logged out successfully' });
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh token & extend session
// @route   POST /api/auth/refresh
// @access  Protected
const refreshUser = async (req, res, next) => {
  try {
    // Extend session cookie maxAge
    if (req.session) {
      req.session.cookie.maxAge = 12 * 60 * 60 * 1000;
    }

    // Blacklist the old token
    let oldToken;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      oldToken = req.headers.authorization.split(' ')[1];
      await BlacklistedToken.create({ token: oldToken }).catch(() => {});
    }

    // Generate new token
    const newToken = generateToken(req.user._id);

    res.status(200).json({
      token: newToken,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError('Please provide email and password');
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new BadRequestError('User already exists');
    }

    // Hash password
    const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get authenticated user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      throw new NotFoundError('User not found');
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginUser,
  logoutUser,
  refreshUser,
  registerUser,
  getProfile,
};


