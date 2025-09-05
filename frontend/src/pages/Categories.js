import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCategories, useCreateCategory, useDeleteCategory, useCreateDefaultCategories } from '../hooks/useCategories';
import LoadingSpinner from '../components/LoadingSpinner';

const CategoryForm = ({ onClose }) => {
  const [categoryType, setCategoryType] = useState('expense');
  const createCategoryMutation = useCreateCategory();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await createCategoryMutation.mutateAsync({
        ...data,
        type: categoryType
      });
      reset();
      onClose?.();
    } catch (error) {
      console.error('Category creation error:', error);
    }
  };

  const colorOptions = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7',
    '#fd79a8', '#00b894', '#00cec9', '#fdcb6e', '#e17055',
    '#74b9ff', '#a29bfe', '#fd1d1d', '#00b894', '#fdcb6e'
  ];

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Add New Category</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Category Type */}
        <div className="form-group">
          <label className="form-label">Type</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="expense"
                checked={categoryType === 'expense'}
                onChange={(e) => setCategoryType(e.target.value)}
                className="mr-2"
              />
              Expense
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="income"
                checked={categoryType === 'income'}
                onChange={(e) => setCategoryType(e.target.value)}
                className="mr-2"
              />
              Income
            </label>
          </div>
        </div>

        {/* Category Name */}
        <div className="form-group">
          <label className="form-label">Name *</label>
          <input
            type="text"
            {...register('name', {
              required: 'Category name is required',
              maxLength: { value: 50, message: 'Name cannot exceed 50 characters' }
            })}
            className="form-input"
            placeholder="Enter category name"
          />
          {errors.name && <p className="error-message">{errors.name.message}</p>}
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            {...register('description', {
              maxLength: { value: 200, message: 'Description cannot exceed 200 characters' }
            })}
            className="form-input"
            rows="3"
            placeholder="Enter category description (optional)"
          />
          {errors.description && <p className="error-message">{errors.description.message}</p>}
        </div>

        {/* Color */}
        <div className="form-group">
          <label className="form-label">Color</label>
          <div className="grid grid-cols-5 gap-2 mt-2">
            {colorOptions.map((color) => (
              <label key={color} className="cursor-pointer">
                <input
                  type="radio"
                  value={color}
                  {...register('color', { required: 'Please select a color' })}
                  className="sr-only"
                />
                <div 
                  className="w-8 h-8 rounded-full border-2 border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                />
              </label>
            ))}
          </div>
          {errors.color && <p className="error-message">{errors.color.message}</p>}
        </div>

        {/* Icon */}
        <div className="form-group">
          <label className="form-label">Icon</label>
          <input
            type="text"
            {...register('icon')}
            className="form-input"
            placeholder="Icon name (e.g., restaurant, car, shopping_cart)"
          />
          <small className="text-gray-500">Material Icons name</small>
        </div>

        {/* Form Actions */}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={createCategoryMutation.isLoading}
            className="btn btn-primary flex-1"
          >
            {createCategoryMutation.isLoading ? 'Creating...' : 'Create Category'}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

const CategoryItem = ({ category, onDelete }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium"
            style={{ backgroundColor: category.color }}
          >
            {category.name.charAt(0).toUpperCase()}
          </div>
          
          <div>
            <h3 className="font-semibold">{category.name}</h3>
            <p className="text-sm text-gray-500 capitalize">{category.type}</p>
            {category.description && (
              <p className="text-sm text-gray-600 mt-1">{category.description}</p>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            category.type === 'income' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {category.type}
          </span>
          
          {!category.isDefault && (
            <button 
              onClick={() => onDelete(category._id)}
              className="btn btn-danger btn-sm"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Categories = () => {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  
  const { data: categories = [], isLoading } = useCategories();
  const deleteCategoryMutation = useDeleteCategory();
  const createDefaultsMutation = useCreateDefaultCategories();

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      await deleteCategoryMutation.mutateAsync(categoryId);
    }
  };

  const handleCreateDefaults = async () => {
    if (window.confirm('This will create default categories for income and expenses. Continue?')) {
      await createDefaultsMutation.mutateAsync();
    }
  };

  const filteredCategories = categories.filter(category => {
    if (filter === 'all') return true;
    return category.type === filter;
  });

  if (isLoading) {
    return <LoadingSpinner message="Loading categories..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Categories</h1>
        <div className="flex gap-2">
          <button 
            onClick={handleCreateDefaults}
            className="btn btn-secondary"
            disabled={createDefaultsMutation.isLoading}
          >
            {createDefaultsMutation.isLoading ? 'Creating...' : 'Create Defaults'}
          </button>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary"
          >
            {showForm ? 'Cancel' : 'Add Category'}
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="card">
        <div className="flex gap-4">
          <button 
            onClick={() => setFilter('all')}
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          >
            All Categories ({categories.length})
          </button>
          <button 
            onClick={() => setFilter('income')}
            className={`btn ${filter === 'income' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Income ({categories.filter(c => c.type === 'income').length})
          </button>
          <button 
            onClick={() => setFilter('expense')}
            className={`btn ${filter === 'expense' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Expenses ({categories.filter(c => c.type === 'expense').length})
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <CategoryForm onClose={() => setShowForm(false)} />
      )}

      {/* Categories List */}
      <div className="space-y-4">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <CategoryItem
              key={category._id}
              category={category}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="card text-center py-8">
            <p className="text-gray-500 mb-4">
              {filter === 'all' 
                ? 'No categories found' 
                : `No ${filter} categories found`
              }
            </p>
            <div className="flex gap-2 justify-center">
              <button 
                onClick={() => setShowForm(true)}
                className="btn btn-primary"
              >
                Add Category
              </button>
              {categories.length === 0 && (
                <button 
                  onClick={handleCreateDefaults}
                  className="btn btn-secondary"
                >
                  Create Default Categories
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="card bg-blue-50 border-l-4 border-blue-500">
        <h3 className="font-semibold text-blue-900">💡 Category Tips</h3>
        <ul className="mt-2 text-sm text-blue-800 space-y-1">
          <li>• Use specific category names for better tracking (e.g., "Groceries" instead of "Food")</li>
          <li>• Choose distinct colors to easily identify categories in charts</li>
          <li>• Default categories cannot be deleted but you can create custom ones</li>
          <li>• Categories help you understand your spending patterns</li>
        </ul>
      </div>
    </div>
  );
};

export default Categories;
