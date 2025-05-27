import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
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

export const auth = {
  login: (credentials) => api.post('/api/auth/login/', credentials),
  register: (userData) => api.post('/api/auth/register/', userData),
  getCurrentUser: () => api.get('/api/auth/user/'),
  refreshToken: (refresh) => api.post('/api/auth/refresh/', { refresh }),
};

export const documents = {
  getAll: () => api.get('/api/documents/'),
  getById: (id) => api.get(`/api/documents/${id}/`),
  upload: (formData) => api.post('/api/documents/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  update: (id, data) => api.patch(`/api/documents/${id}/`, data),
  delete: (id) => api.delete(`/api/documents/${id}/`),
  download: (id) => api.get(`/api/documents/${id}/download/`, {
    responseType: 'blob',
  }),
  askQuestion: (id, question) =>
    api.post(`/api/documents/${id}/ask/`, { question }, {
      timeout: 30000, // 30 second timeout
      retry: 3,
      retryDelay: 1000,
      onRetry: (retryCount) => {
        console.log(`Retrying question request (${retryCount}/3)...`);
      }
    }),
};

export default api;