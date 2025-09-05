import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { validateEmail } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      currency: user?.currency || 'USD'
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await updateProfile(data);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  if (!user) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  const currencies = [
    { code: 'USD', name: 'US Dollar ($)' },
    { code: 'EUR', name: 'Euro (€)' },
    { code: 'GBP', name: 'British Pound (£)' },
    { code: 'JPY', name: 'Japanese Yen (¥)' },
    { code: 'CAD', name: 'Canadian Dollar (C$)' },
    { code: 'AUD', name: 'Australian Dollar (A$)' },
    { code: 'INR', name: 'Indian Rupee (₹)' },
    { code: 'CNY', name: 'Chinese Yuan (¥)' }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="btn btn-primary"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Profile Overview */}
      <div className="card">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user.firstName?.charAt(0).toUpperCase()}{user.lastName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user.firstName} {user.lastName}</h2>
            <p className="text-gray-600">@{user.username}</p>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500 mt-1">
              Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Account Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <h3 className="text-2xl font-bold text-blue-600">
            ${user.totalBalance?.toFixed(2) || '0.00'}
          </h3>
          <p className="text-gray-600">Total Balance</p>
        </div>
        <div className="card text-center">
          <h3 className="text-2xl font-bold text-green-600">{user.currency || 'USD'}</h3>
          <p className="text-gray-600">Preferred Currency</p>
        </div>
        <div className="card text-center">
          <h3 className="text-2xl font-bold text-purple-600">Active</h3>
          <p className="text-gray-600">Account Status</p>
        </div>
      </div>

      {/* Edit Form */}
      {isEditing ? (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Edit Profile Information</h3>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  {...register('firstName', {
                    required: 'First name is required',
                    minLength: { value: 2, message: 'First name must be at least 2 characters' }
                  })}
                  className="form-input"
                  placeholder="First name"
                />
                {errors.firstName && <p className="error-message">{errors.firstName.message}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  {...register('lastName', {
                    required: 'Last name is required',
                    minLength: { value: 2, message: 'Last name must be at least 2 characters' }
                  })}
                  className="form-input"
                  placeholder="Last name"
                />
                {errors.lastName && <p className="error-message">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  validate: value => validateEmail(value) || 'Please enter a valid email'
                })}
                className="form-input"
                placeholder="Email address"
                disabled
              />
              <small className="text-gray-500">Email cannot be changed</small>
              {errors.email && <p className="error-message">{errors.email.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Currency</label>
              <select
                {...register('currency', { required: 'Currency is required' })}
                className="form-select"
              >
                {currencies.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.name}
                  </option>
                ))}
              </select>
              {errors.currency && <p className="error-message">{errors.currency.message}</p>}
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary flex-1"
              >
                {isLoading ? <LoadingSpinner size="small" message="" /> : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Profile Information Display */
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">First Name</label>
              <p className="text-gray-900 font-medium">{user.firstName}</p>
            </div>
            
            <div>
              <label className="form-label">Last Name</label>
              <p className="text-gray-900 font-medium">{user.lastName}</p>
            </div>
            
            <div>
              <label className="form-label">Username</label>
              <p className="text-gray-900 font-medium">@{user.username}</p>
            </div>
            
            <div>
              <label className="form-label">Email Address</label>
              <p className="text-gray-900 font-medium">{user.email}</p>
            </div>
            
            <div>
              <label className="form-label">Preferred Currency</label>
              <p className="text-gray-900 font-medium">
                {currencies.find(c => c.code === user.currency)?.name || user.currency}
              </p>
            </div>
            
            <div>
              <label className="form-label">Account Created</label>
              <p className="text-gray-900 font-medium">
                {new Date(user.createdAt || Date.now()).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Security Section */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Security</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">Password</h4>
              <p className="text-sm text-gray-600">Last updated: Never</p>
            </div>
            <button className="btn btn-secondary">
              Change Password
            </button>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600">Add an extra layer of security</p>
            </div>
            <button className="btn btn-secondary">
              Enable 2FA
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card border-red-200">
        <h3 className="text-lg font-semibold mb-4 text-red-600">Danger Zone</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium text-red-900">Export Data</h4>
              <p className="text-sm text-red-700">Download all your transaction data</p>
            </div>
            <button className="btn btn-secondary">
              Export Data
            </button>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium text-red-900">Delete Account</h4>
              <p className="text-sm text-red-700">Permanently delete your account and all data</p>
            </div>
            <button className="btn btn-danger">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
