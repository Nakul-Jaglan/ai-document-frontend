/**
 * DEPRECATED API MODULE
 * 
 * This file is kept for backwards compatibility only.
 * For new development, use the useApi hook from './useApi.js' 
 * which provides proper Clerk authentication.
 */

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Clerk token to requests
api.interceptors.request.use(async (config) => {
  try {
    // Try to get Clerk token if we're on the client side
    if (typeof window !== 'undefined') {
      const { useAuth } = await import('@clerk/nextjs');
      // Note: This approach won't work in interceptors since useAuth is a hook
      // We'll need to handle this differently or use the useApi hook instead
      console.warn('Clerk token cannot be retrieved in axios interceptor. Use useApi hook instead.');
    }
  } catch (error) {
    console.warn('Could not get Clerk token:', error);
  }
  
  // Fall back to localStorage token for backwards compatibility
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try to refresh the token
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await api.post('/auth/refresh/', { refresh: refreshToken });
          const { access } = response.data;
          localStorage.setItem('token', access);
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        } catch (refreshError) {
          // If refresh fails, logout
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

// DEPRECATED: This file is kept for backwards compatibility
// Use useApi hook from './useApi.js' for new code with proper Clerk authentication

export const legacyAuth = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (userData) => api.post('/auth/register/', userData),
  getCurrentUser: () => api.get('/auth/user/'),
  refreshToken: (refresh) => api.post('/auth/refresh/', { refresh }),
};

export const documents = {
  getAll: () => api.get('/documents/'),
  getById: (id) => api.get(`/documents/${id}/`),
  upload: (formData) => api.post('/documents/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  update: (id, data) => api.patch(`/documents/${id}/`, data),
  delete: (id) => api.delete(`/documents/${id}/`),
  download: (id) => api.get(`/documents/${id}/download/`, {
    responseType: 'blob',
  }),
  askQuestion: (id, question) =>
    api.post(`/documents/${id}/ask/`, { question }, {
      timeout: 30000, // 30 second timeout
      retry: 3,
      retryDelay: 1000,
      onRetry: (retryCount) => {
        console.log(`Retrying question request (${retryCount}/3)...`);
      }
    }),
};

export default api;