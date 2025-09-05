const { User } = require('../models');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret_key', {
    expiresIn: '30d'
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ 
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      firstName,
      lastName
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          token: generateToken(user.id)
        }
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ 
      where: { email }
    });

    if (user && (await user.comparePassword(password))) {
      res.json({
        success: true,
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          totalBalance: user.totalBalance,
          currency: user.currency,
          token: generateToken(user.id)
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, currency, avatar } = req.body;
    
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.update({
      firstName,
      lastName,
      currency,
      avatar
    });

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile
};
