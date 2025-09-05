const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: {
      min: 0.01,
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      len: [1, 200],
      notEmpty: true
    }
  },
  type: {
    type: DataTypes.ENUM('income', 'expense'),
    allowNull: false
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id'
    },
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 500]
    }
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  location: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  receipt: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: ''
  }
}, {
  tableName: 'transactions',
  timestamps: true,
  indexes: [
    {
      fields: ['userId', 'date']
    },
    {
      fields: ['userId', 'type']
    },
    {
      fields: ['userId', 'categoryId']
    }
  ]
});

module.exports = Transaction;
