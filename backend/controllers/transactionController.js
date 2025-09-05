const { Transaction, Category, User } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, category, startDate, endDate } = req.query;
    
    let whereClause = { userId: req.user.id };
    
    // Add filters
    if (type) whereClause.type = type;
    if (category) whereClause.categoryId = category;
    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) whereClause.date[Op.gte] = new Date(startDate);
      if (endDate) whereClause.date[Op.lte] = new Date(endDate);
    }

    const { count, rows: transactions } = await Transaction.findAndCountAll({
      where: whereClause,
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'color', 'icon']
      }],
      order: [['date', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    res.json({
      success: true,
      data: transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
const getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'color', 'icon']
      }]
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
const createTransaction = async (req, res) => {
  try {
    const { amount, description, type, categoryId, date, notes, tags, location } = req.body;

    // Verify category belongs to user
    const categoryDoc = await Category.findOne({
      where: {
        id: categoryId,
        userId: req.user.id
      }
    });

    if (!categoryDoc) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category'
      });
    }

    const transaction = await Transaction.create({
      amount,
      description,
      type,
      categoryId,
      userId: req.user.id,
      date,
      notes,
      tags,
      location
    });

    // Update user's total balance
    const balanceChange = type === 'income' ? parseFloat(amount) : -parseFloat(amount);
    const user = await User.findByPk(req.user.id);
    await user.update({
      totalBalance: parseFloat(user.totalBalance) + balanceChange
    });

    const populatedTransaction = await Transaction.findByPk(transaction.id, {
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'color', 'icon']
      }]
    });

    res.status(201).json({
      success: true,
      data: populatedTransaction
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Calculate balance adjustment
    const oldAmount = transaction.type === 'income' ? parseFloat(transaction.amount) : -parseFloat(transaction.amount);
    const newAmount = req.body.type === 'income' ? parseFloat(req.body.amount) : -parseFloat(req.body.amount);
    const balanceAdjustment = newAmount - oldAmount;

    await transaction.update(req.body);

    const updatedTransaction = await Transaction.findByPk(transaction.id, {
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'color', 'icon']
      }]
    });

    // Update user's total balance
    const user = await User.findByPk(req.user.id);
    await user.update({
      totalBalance: parseFloat(user.totalBalance) + balanceAdjustment
    });

    res.json({
      success: true,
      data: updatedTransaction
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Adjust user's total balance
    const balanceChange = transaction.type === 'income' ? -parseFloat(transaction.amount) : parseFloat(transaction.amount);
    const user = await User.findByPk(req.user.id);
    await user.update({
      totalBalance: parseFloat(user.totalBalance) + balanceChange
    });

    await transaction.destroy();

    res.json({
      success: true,
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get transaction statistics
// @route   GET /api/transactions/stats
// @access  Private
const getTransactionStats = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    switch (period) {
      case 'week':
        dateFilter[Op.gte] = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        break;
      case 'month':
        dateFilter[Op.gte] = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        dateFilter[Op.gte] = new Date(now.getFullYear(), 0, 1);
        break;
    }

    // Get overview stats
    const stats = await Transaction.findAll({
      where: {
        userId: req.user.id,
        date: dateFilter
      },
      attributes: [
        'type',
        [sequelize.fn('SUM', sequelize.col('amount')), 'total'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('AVG', sequelize.col('amount')), 'avgAmount']
      ],
      group: ['type'],
      raw: true
    });

    // Get category breakdown
    const categoryStats = await Transaction.findAll({
      where: {
        userId: req.user.id,
        date: dateFilter
      },
      attributes: [
        'categoryId',
        [sequelize.fn('SUM', sequelize.col('amount')), 'total'],
        [sequelize.fn('COUNT', sequelize.col('Transaction.id')), 'count']
      ],
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'color', 'icon']
      }],
      group: ['categoryId', 'category.id'],
      order: [[sequelize.fn('SUM', sequelize.col('amount')), 'DESC']],
      raw: false
    });

    res.json({
      success: true,
      data: {
        overview: stats,
        categoryBreakdown: categoryStats
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionStats
};
