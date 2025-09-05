import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateTransaction, useUpdateTransaction } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';
import { formatDate } from '../utils/helpers';

const TransactionForm = ({ transaction = null, onClose }) => {
  const [transactionType, setTransactionType] = useState(transaction?.type || 'expense');
  const { data: categories = [] } = useCategories(transactionType);
  const createTransactionMutation = useCreateTransaction();
  const updateTransactionMutation = useUpdateTransaction();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      amount: transaction?.amount || '',
      description: transaction?.description || '',
      date: transaction?.date ? transaction.date.split('T')[0] : new Date().toISOString().split('T')[0],
      category: transaction?.category?._id || '',
      notes: transaction?.notes || '',
      location: transaction?.location || '',
      tags: transaction?.tags?.join(', ') || ''
    }
  });

  const onSubmit = async (data) => {
    try {
      const transactionData = {
        ...data,
        type: transactionType,
        amount: parseFloat(data.amount),
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : []
      };

      if (transaction) {
        await updateTransactionMutation.mutateAsync({
          id: transaction._id,
          data: transactionData
        });
      } else {
        await createTransactionMutation.mutateAsync(transactionData);
      }

      reset();
      onClose?.();
    } catch (error) {
      console.error('Transaction submission error:', error);
    }
  };

  const isSubmitting = createTransactionMutation.isLoading || updateTransactionMutation.isLoading;

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">
        {transaction ? 'Edit Transaction' : 'Add New Transaction'}
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Transaction Type */}
        <div className="form-group">
          <label className="form-label">Type</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="expense"
                checked={transactionType === 'expense'}
                onChange={(e) => setTransactionType(e.target.value)}
                className="mr-2"
              />
              Expense
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="income"
                checked={transactionType === 'income'}
                onChange={(e) => setTransactionType(e.target.value)}
                className="mr-2"
              />
              Income
            </label>
          </div>
        </div>

        {/* Amount */}
        <div className="form-group">
          <label className="form-label">Amount *</label>
          <input
            type="number"
            step="0.01"
            min="0"
            {...register('amount', {
              required: 'Amount is required',
              min: { value: 0.01, message: 'Amount must be greater than 0' }
            })}
            className="form-input"
            placeholder="0.00"
          />
          {errors.amount && <p className="error-message">{errors.amount.message}</p>}
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label">Description *</label>
          <input
            type="text"
            {...register('description', {
              required: 'Description is required',
              maxLength: { value: 200, message: 'Description cannot exceed 200 characters' }
            })}
            className="form-input"
            placeholder="Enter description"
          />
          {errors.description && <p className="error-message">{errors.description.message}</p>}
        </div>

        {/* Category */}
        <div className="form-group">
          <label className="form-label">Category *</label>
          <select
            {...register('category', { required: 'Category is required' })}
            className="form-select"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && <p className="error-message">{errors.category.message}</p>}
        </div>

        {/* Date */}
        <div className="form-group">
          <label className="form-label">Date *</label>
          <input
            type="date"
            {...register('date', { required: 'Date is required' })}
            className="form-input"
          />
          {errors.date && <p className="error-message">{errors.date.message}</p>}
        </div>

        {/* Notes */}
        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea
            {...register('notes', {
              maxLength: { value: 500, message: 'Notes cannot exceed 500 characters' }
            })}
            className="form-input"
            rows="3"
            placeholder="Additional notes (optional)"
          />
          {errors.notes && <p className="error-message">{errors.notes.message}</p>}
        </div>

        {/* Location */}
        <div className="form-group">
          <label className="form-label">Location</label>
          <input
            type="text"
            {...register('location')}
            className="form-input"
            placeholder="Where did this transaction occur?"
          />
        </div>

        {/* Tags */}
        <div className="form-group">
          <label className="form-label">Tags</label>
          <input
            type="text"
            {...register('tags')}
            className="form-input"
            placeholder="Enter tags separated by commas"
          />
          <small className="text-gray-500">Example: food, restaurant, dinner</small>
        </div>

        {/* Form Actions */}
        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary flex-1"
          >
            {isSubmitting ? 'Saving...' : (transaction ? 'Update' : 'Add')} Transaction
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

export default TransactionForm;
