import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (email, password) => api.post('/auth/login', { email, password }),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
};

// Transaction API
export const transactionAPI = {
  getTransactions: (params) => api.get('/transactions', { params }),
  getTransaction: (id) => api.get(`/transactions/${id}`),
  createTransaction: (transactionData) => api.post('/transactions', transactionData),
  updateTransaction: (id, transactionData) => api.put(`/transactions/${id}`, transactionData),
  deleteTransaction: (id) => api.delete(`/transactions/${id}`),
  getStats: (params) => api.get('/transactions/stats', { params }),
};

// Category API
export const categoryAPI = {
  getCategories: (params) => api.get('/categories', { params }),
  getCategory: (id) => api.get(`/categories/${id}`),
  createCategory: (categoryData) => api.post('/categories', categoryData),
  updateCategory: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
  createDefaults: () => api.post('/categories/defaults'),
};

export default api;
