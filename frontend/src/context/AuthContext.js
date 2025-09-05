import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'LOGIN_ERROR':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    if (state.token) {
      loadUser();
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const loadUser = async () => {
    try {
      const response = await authAPI.getProfile();
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: response.data.data,
          token: state.token
        }
      });
    } catch (error) {
      dispatch({
        type: 'LOGIN_ERROR',
        payload: error.response?.data?.message || 'Failed to load user'
      });
    }
  };

  const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await authAPI.login(email, password);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: response.data.data,
          token: response.data.data.token
        }
      });
      return response.data;
    } catch (error) {
      dispatch({
        type: 'LOGIN_ERROR',
        payload: error.response?.data?.message || 'Login failed'
      });
      throw error;
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await authAPI.register(userData);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: response.data.data,
          token: response.data.data.token
        }
      });
      return response.data;
    } catch (error) {
      dispatch({
        type: 'LOGIN_ERROR',
        payload: error.response?.data?.message || 'Registration failed'
      });
      throw error;
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = async (userData) => {
    try {
      const response = await authAPI.updateProfile(userData);
      dispatch({
        type: 'UPDATE_USER',
        payload: response.data.data
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateProfile,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
