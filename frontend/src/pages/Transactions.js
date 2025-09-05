import React, { useState } from 'react';
import { useTransactions, useDeleteTransaction } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';
import { formatCurrency, formatDate, debounce } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import TransactionForm from '../components/TransactionForm';

const TransactionFilter = ({ filters, onFilterChange }) => {
  const { data: categories = [] } = useCategories();

  return (
    <div className="card mb-6">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="form-label">Type</label>
          <select 
            className="form-select"
            value={filters.type || ''}
            onChange={(e) => onFilterChange({ ...filters, type: e.target.value || undefined })}
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        
        <div>
          <label className="form-label">Category</label>
          <select 
            className="form-select"
            value={filters.category || ''}
            onChange={(e) => onFilterChange({ ...filters, category: e.target.value || undefined })}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="form-label">Start Date</label>
          <input 
            type="date"
            className="form-input"
            value={filters.startDate || ''}
            onChange={(e) => onFilterChange({ ...filters, startDate: e.target.value || undefined })}
          />
        </div>
        
        <div>
          <label className="form-label">End Date</label>
          <input 
            type="date"
            className="form-input"
            value={filters.endDate || ''}
            onChange={(e) => onFilterChange({ ...filters, endDate: e.target.value || undefined })}
          />
        </div>
      </div>
      
      <div className="mt-4">
        <button 
          onClick={() => onFilterChange({})}
          className="btn btn-secondary"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

const TransactionItem = ({ transaction, onEdit, onDelete }) => {
  const typeColor = transaction.type === 'income' ? 'text-green-600' : 'text-red-600';
  const amountPrefix = transaction.type === 'income' ? '+' : '-';

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium"
            style={{ backgroundColor: transaction.category?.color || '#6b7280' }}
          >
            {transaction.category?.name?.charAt(0).toUpperCase() || '?'}
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold">{transaction.description}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
              <span>{transaction.category?.name}</span>
              <span>•</span>
              <span>{formatDate(transaction.date)}</span>
              {transaction.location && (
                <>
                  <span>•</span>
                  <span>📍 {transaction.location}</span>
                </>
              )}
            </div>
            {transaction.notes && (
              <p className="text-sm text-gray-600 mt-2">{transaction.notes}</p>
            )}
            {transaction.tags && transaction.tags.length > 0 && (
              <div className="flex gap-1 mt-2">
                {transaction.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <p className={`text-xl font-bold ${typeColor}`}>
            {amountPrefix}{formatCurrency(transaction.amount)}
          </p>
          <div className="flex gap-2 mt-2">
            <button 
              onClick={() => onEdit(transaction)}
              className="btn btn-secondary btn-sm"
            >
              Edit
            </button>
            <button 
              onClick={() => onDelete(transaction._id)}
              className="btn btn-danger btn-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Transactions = () => {
  const [filters, setFilters] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: transactionsData, isLoading } = useTransactions(filters);
  const deleteTransactionMutation = useDeleteTransaction();

  const debouncedSearch = debounce((term) => {
    setFilters(prev => ({ ...prev, search: term || undefined }));
  }, 300);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDelete = async (transactionId) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await deleteTransactionMutation.mutateAsync(transactionId);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading transactions..." />;
  }

  const transactions = transactionsData?.data || [];
  const pagination = transactionsData?.pagination;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : 'Add Transaction'}
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="form-group">
          <label className="form-label">Search Transactions</label>
          <input
            type="text"
            className="form-input"
            placeholder="Search by description, notes, or tags..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Filters */}
      <TransactionFilter filters={filters} onFilterChange={setFilters} />

      {/* Add/Edit Form */}
      {showForm && (
        <TransactionForm 
          transaction={editingTransaction}
          onClose={handleCloseForm}
        />
      )}

      {/* Transaction List */}
      <div className="space-y-4">
        {transactions.length > 0 ? (
          <>
            {transactions.map((transaction) => (
              <TransactionItem
                key={transaction._id}
                transaction={transaction}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
            
            {/* Pagination Info */}
            {pagination && (
              <div className="card">
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                    {pagination.total} transactions
                  </span>
                  <span>
                    Page {pagination.page} of {pagination.pages}
                  </span>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="card text-center py-8">
            <p className="text-gray-500 mb-4">No transactions found</p>
            <button 
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              Add Your First Transaction
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
