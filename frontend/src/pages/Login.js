import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { validateEmail } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
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
          <h2 className="text-3xl font-bold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
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
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
                className="form-input"
                placeholder="Enter your password"
              />
              {errors.password && <p className="error-message">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary"
            >
              {isLoading ? <LoadingSpinner size="small" message="" /> : 'Sign in'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo Account</span>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Email: demo@example.com<br />
                Password: demo123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
