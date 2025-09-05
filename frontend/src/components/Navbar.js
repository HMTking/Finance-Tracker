import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return (
      <nav className="bg-white shadow-lg border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-xl font-bold text-blue-600">
              ExpenseTracker
            </Link>
            <div className="flex gap-4">
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="text-xl font-bold text-blue-600">
            ExpenseTracker
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link 
              to="/dashboard" 
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              to="/transactions" 
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Transactions
            </Link>
            <Link 
              to="/categories" 
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Categories
            </Link>
            <Link 
              to="/analytics" 
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Analytics
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-700">
              Welcome, {user?.firstName || user?.username}
            </span>
            <Link to="/profile" className="btn btn-secondary">
              Profile
            </Link>
            <button onClick={handleLogout} className="btn btn-danger">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
