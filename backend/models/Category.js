const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      len: [1, 50],
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.STRING(200),
    allowNull: true,
    validate: {
      len: [0, 200]
    }
  },
  color: {
    type: DataTypes.STRING(7),
    defaultValue: '#007bff'
  },
  icon: {
    type: DataTypes.STRING(50),
    defaultValue: 'category'
  },
  type: {
    type: DataTypes.ENUM('income', 'expense'),
    allowNull: false
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
  isDefault: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'categories',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['name', 'userId']
    }
  ]
});

module.exports = Category;
