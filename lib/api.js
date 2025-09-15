import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL+ '/api',
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