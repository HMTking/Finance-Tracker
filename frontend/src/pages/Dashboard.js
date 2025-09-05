import React from 'react';
import { useTransactions, useTransactionStats } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import TransactionForm from '../components/TransactionForm';

const StatCard = ({ title, value, subtitle, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200'
  };

  return (
    <div className={`card border-l-4 ${colorClasses[color]}`}>
      <h3 className="text-sm font-medium opacity-70">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
      {subtitle && <p className="text-sm opacity-70">{subtitle}</p>}
    </div>
  );
};

const RecentTransactionItem = ({ transaction }) => {
  const typeColor = transaction.type === 'income' ? 'text-green-600' : 'text-red-600';
  const amountPrefix = transaction.type === 'income' ? '+' : '-';

  return (
    <div className="flex items-center justify-between p-3 border-b last:border-b-0">
      <div className="flex items-center space-x-3">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium"
          style={{ backgroundColor: transaction.category?.color || '#6b7280' }}
        >
          {transaction.category?.name?.charAt(0).toUpperCase() || '?'}
        </div>
        <div>
          <p className="font-medium">{transaction.description}</p>
          <p className="text-sm text-gray-500">
            {transaction.category?.name} • {formatDate(transaction.date)}
          </p>
        </div>
      </div>
      <span className={`font-semibold ${typeColor}`}>
        {amountPrefix}{formatCurrency(transaction.amount)}
      </span>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const { data: recentTransactions = [], isLoading: transactionsLoading } = useTransactions({ limit: 5 });
  const { data: stats, isLoading: statsLoading } = useTransactionStats('month');
  const { data: categories = [] } = useCategories();

  if (transactionsLoading || statsLoading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  // Calculate summary stats
  const totalIncome = stats?.overview?.find(s => s._id === 'income')?.total || 0;
  const totalExpenses = stats?.overview?.find(s => s._id === 'expense')?.total || 0;
  const netBalance = totalIncome - totalExpenses;
  const transactionCount = (stats?.overview?.reduce((acc, s) => acc + s.count, 0)) || 0;

  const topCategories = stats?.categoryBreakdown?.slice(0, 3) || [];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="card bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <h1 className="text-2xl font-bold">
          Welcome back, {user?.firstName || user?.username}! 👋
        </h1>
        <p className="mt-2 opacity-90">
          Here's your financial overview for this month
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Balance"
          value={formatCurrency(user?.totalBalance || 0)}
          subtitle="Current balance"
          color="blue"
        />
        <StatCard
          title="Monthly Income"
          value={formatCurrency(totalIncome)}
          subtitle="This month"
          color="green"
        />
        <StatCard
          title="Monthly Expenses"
          value={formatCurrency(totalExpenses)}
          subtitle="This month"
          color="red"
        />
        <StatCard
          title="Net Flow"
          value={formatCurrency(netBalance)}
          subtitle={`${transactionCount} transactions`}
          color={netBalance >= 0 ? 'green' : 'red'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Add Transaction */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Quick Add Transaction</h2>
          <TransactionForm />
        </div>

        {/* Recent Transactions */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recent Transactions</h2>
            <a href="/transactions" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View all →
            </a>
          </div>
          
          <div className="card">
            {recentTransactions.data?.length > 0 ? (
              <div className="space-y-0">
                {recentTransactions.data.map((transaction) => (
                  <RecentTransactionItem key={transaction._id} transaction={transaction} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No transactions yet</p>
                <p className="text-sm">Add your first transaction above!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Categories */}
      {topCategories.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Top Categories This Month</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topCategories.map((categoryData, index) => (
              <div key={categoryData._id} className="card">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium"
                    style={{ backgroundColor: categoryData.category?.color || '#6b7280' }}
                  >
                    #{index + 1}
                  </div>
                  <div>
                    <h3 className="font-medium">{categoryData.category?.name}</h3>
                    <p className="text-xl font-bold">{formatCurrency(categoryData.total)}</p>
                    <p className="text-sm text-gray-500">{categoryData.count} transactions</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a href="/transactions" className="btn btn-primary text-center">
            View Transactions
          </a>
          <a href="/categories" className="btn btn-secondary text-center">
            Manage Categories
          </a>
          <a href="/analytics" className="btn btn-secondary text-center">
            View Analytics
          </a>
          <a href="/profile" className="btn btn-secondary text-center">
            Update Profile
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
