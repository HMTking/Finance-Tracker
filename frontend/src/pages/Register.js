import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePassword } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser, error, clearError } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

  const password = watch('password');

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const { confirmPassword, ...userData } = data;
      await registerUser(userData);
      navigate('/dashboard');
    } catch (err) {
      // Error is handled in context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              sign in to your existing account
            </Link>
          </p>
        </div>

        <div className="card">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
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
              <label className="form-label">Username</label>
              <input
                type="text"
                {...register('username', {
                  required: 'Username is required',
                  minLength: { value: 3, message: 'Username must be at least 3 characters' },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message: 'Username can only contain letters, numbers, and underscores'
                  }
                })}
                className="form-input"
                placeholder="Choose a username"
              />
              {errors.username && <p className="error-message">{errors.username.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Email address</label>
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  validate: value => validateEmail(value) || 'Please enter a valid email'
                })}
                className="form-input"
                placeholder="Enter your email"
              />
              {errors.email && <p className="error-message">{errors.email.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  validate: value => validatePassword(value) || 'Password must be at least 6 characters'
                })}
                className="form-input"
                placeholder="Create a password"
              />
              {errors.password && <p className="error-message">{errors.password.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: value => value === password || 'Passwords do not match'
                })}
                className="form-input"
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary"
            >
              {isLoading ? <LoadingSpinner size="small" message="" /> : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
