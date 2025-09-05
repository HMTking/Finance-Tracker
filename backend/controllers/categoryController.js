const { Category } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Private
const getCategories = async (req, res) => {
  try {
    const { type } = req.query;
    
    let whereClause = { userId: req.user.id };
    if (type) whereClause.type = type;

    const categories = await Category.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Private
const getCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private
const createCategory = async (req, res) => {
  try {
    const { name, description, color, icon, type } = req.body;

    const category = await Category.create({
      name,
      description,
      color,
      icon,
      type,
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Don't allow updating default categories
    if (category.isDefault) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update default category'
      });
    }

    await category.update(req.body);

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Don't allow deleting default categories
    if (category.isDefault) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete default category'
      });
    }

    await category.destroy();

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create default categories for new user
// @route   POST /api/categories/defaults
// @access  Private
const createDefaultCategories = async (req, res) => {
  try {
    const defaultCategories = [
      { name: 'Food & Dining', type: 'expense', color: '#ff6b6b', icon: 'restaurant', isDefault: true },
      { name: 'Transportation', type: 'expense', color: '#4ecdc4', icon: 'directions_car', isDefault: true },
      { name: 'Shopping', type: 'expense', color: '#45b7d1', icon: 'shopping_cart', isDefault: true },
      { name: 'Entertainment', type: 'expense', color: '#f9ca24', icon: 'movie', isDefault: true },
      { name: 'Bills & Utilities', type: 'expense', color: '#6c5ce7', icon: 'receipt', isDefault: true },
      { name: 'Healthcare', type: 'expense', color: '#fd79a8', icon: 'local_hospital', isDefault: true },
      { name: 'Salary', type: 'income', color: '#00b894', icon: 'work', isDefault: true },
      { name: 'Freelance', type: 'income', color: '#00cec9', icon: 'business_center', isDefault: true },
      { name: 'Investment', type: 'income', color: '#fdcb6e', icon: 'trending_up', isDefault: true },
      { name: 'Other Income', type: 'income', color: '#e17055', icon: 'account_balance_wallet', isDefault: true }
    ];

    const categories = await Category.bulkCreate(
      defaultCategories.map(cat => ({ ...cat, userId: req.user.id }))
    );

    res.status(201).json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  createDefaultCategories
};
