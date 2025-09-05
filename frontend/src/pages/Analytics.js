import React, { useState } from 'react';
import { useTransactionStats } from '../hooks/useTransactions';
import { formatCurrency, getDateRange } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';

const StatsPeriodSelector = ({ period, onPeriodChange }) => {
  const periods = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ];

  return (
    <div className="flex gap-2">
      {periods.map(p => (
        <button
          key={p.value}
          onClick={() => onPeriodChange(p.value)}
          className={`btn ${period === p.value ? 'btn-primary' : 'btn-secondary'}`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
};

const StatsCard = ({ title, value, change, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700'
  };

  return (
    <div className={`card border-l-4 ${colorClasses[color]}`}>
      <h3 className="text-sm font-medium opacity-70">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
      {change !== undefined && (
        <p className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change >= 0 ? '↗' : '↘'} {Math.abs(change).toFixed(1)}% from last period
        </p>
      )}
    </div>
  );
};

const CategoryChart = ({ categoryData }) => {
  if (!categoryData || categoryData.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-gray-500">No category data available</p>
      </div>
    );
  }

  const total = categoryData.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
      <div className="space-y-3">
        {categoryData.map((item, index) => {
          const percentage = total > 0 ? (item.total / total) * 100 : 0;
          
          return (
            <div key={item._id} className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: item.category?.color || '#6b7280' }}
              />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{item.category?.name || 'Unknown'}</span>
                  <span className="text-sm text-gray-500">{percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: item.category?.color || '#6b7280'
                    }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>{formatCurrency(item.total)}</span>
                  <span>{item.count} transactions</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TrendChart = ({ overview, period }) => {
  if (!overview || overview.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-gray-500">No trend data available</p>
      </div>
    );
  }

  const income = overview.find(item => item._id === 'income') || { total: 0, count: 0 };
  const expense = overview.find(item => item._id === 'expense') || { total: 0, count: 0 };
  
  const maxValue = Math.max(income.total, expense.total);
  const incomeWidth = maxValue > 0 ? (income.total / maxValue) * 100 : 0;
  const expenseWidth = maxValue > 0 ? (expense.total / maxValue) * 100 : 0;

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Income vs Expenses</h3>
      
      <div className="space-y-6">
        {/* Income Bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-green-600">Income</span>
            <span className="text-lg font-bold text-green-600">
              {formatCurrency(income.total)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="h-4 bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${incomeWidth}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">{income.count} transactions</p>
        </div>

        {/* Expense Bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-red-600">Expenses</span>
            <span className="text-lg font-bold text-red-600">
              {formatCurrency(expense.total)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="h-4 bg-red-500 rounded-full transition-all duration-500"
              style={{ width: `${expenseWidth}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">{expense.count} transactions</p>
        </div>

        {/* Net Balance */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Net Balance</span>
            <span className={`text-xl font-bold ${
              income.total - expense.total >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(income.total - expense.total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Analytics = () => {
  const [period, setPeriod] = useState('month');
  const { data: stats, isLoading } = useTransactionStats(period);

  if (isLoading) {
    return <LoadingSpinner message="Loading analytics..." />;
  }

  const overview = stats?.overview || [];
  const categoryBreakdown = stats?.categoryBreakdown || [];

  const income = overview.find(item => item._id === 'income') || { total: 0, count: 0, avgAmount: 0 };
  const expense = overview.find(item => item._id === 'expense') || { total: 0, count: 0, avgAmount: 0 };
  const netBalance = income.total - expense.total;
  const totalTransactions = income.count + expense.count;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <StatsPeriodSelector period={period} onPeriodChange={setPeriod} />
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Income"
          value={formatCurrency(income.total)}
          color="green"
        />
        <StatsCard
          title="Total Expenses"
          value={formatCurrency(expense.total)}
          color="red"
        />
        <StatsCard
          title="Net Balance"
          value={formatCurrency(netBalance)}
          color={netBalance >= 0 ? 'green' : 'red'}
        />
        <StatsCard
          title="Transactions"
          value={totalTransactions.toString()}
          color="blue"
        />
      </div>

      {/* Average Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Avg Income"
          value={formatCurrency(income.avgAmount || 0)}
          color="green"
        />
        <StatsCard
          title="Avg Expense"
          value={formatCurrency(expense.avgAmount || 0)}
          color="red"
        />
        <StatsCard
          title="Savings Rate"
          value={`${income.total > 0 ? ((netBalance / income.total) * 100).toFixed(1) : 0}%`}
          color={netBalance >= 0 ? 'green' : 'red'}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart overview={overview} period={period} />
        <CategoryChart categoryData={categoryBreakdown} />
      </div>

      {/* Insights */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">💡 Financial Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900">Spending Pattern</h4>
            <p className="text-sm text-blue-700 mt-1">
              {expense.count > 0 
                ? `You made ${expense.count} expense transactions with an average of ${formatCurrency(expense.avgAmount || 0)} each.`
                : 'No expense data available for this period.'
              }
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900">Income Stream</h4>
            <p className="text-sm text-green-700 mt-1">
              {income.count > 0 
                ? `You had ${income.count} income transactions with an average of ${formatCurrency(income.avgAmount || 0)} each.`
                : 'No income data available for this period.'
              }
            </p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-900">Top Category</h4>
            <p className="text-sm text-purple-700 mt-1">
              {categoryBreakdown.length > 0 
                ? `Your highest spending category is "${categoryBreakdown[0].category?.name}" with ${formatCurrency(categoryBreakdown[0].total)}.`
                : 'No category data available.'
              }
            </p>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-yellow-900">Balance Status</h4>
            <p className="text-sm text-yellow-700 mt-1">
              {netBalance >= 0 
                ? `Great! You saved ${formatCurrency(netBalance)} this ${period}.`
                : `You overspent by ${formatCurrency(Math.abs(netBalance))} this ${period}.`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Category Breakdown Table */}
      {categoryBreakdown.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Detailed Category Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="pb-2">Category</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Transactions</th>
                  <th className="pb-2">Average</th>
                  <th className="pb-2">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {categoryBreakdown.map((item, index) => {
                  const total = categoryBreakdown.reduce((sum, cat) => sum + cat.total, 0);
                  const percentage = total > 0 ? (item.total / total) * 100 : 0;
                  
                  return (
                    <tr key={item._id} className="border-b">
                      <td className="py-2">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.category?.color || '#6b7280' }}
                          />
                          <span>{item.category?.name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="py-2 font-medium">{formatCurrency(item.total)}</td>
                      <td className="py-2">{item.count}</td>
                      <td className="py-2">{formatCurrency(item.total / item.count)}</td>
                      <td className="py-2">{percentage.toFixed(1)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
