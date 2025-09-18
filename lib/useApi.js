import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { useMemo } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const useApi = () => {
  const { getToken } = useAuth();

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: `${API_URL}/api`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add Clerk token to requests
    instance.interceptors.request.use(async (config) => {
      try {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.warn('Could not get Clerk token:', error);
      }
      return config;
    });

    return instance;
  }, [getToken]);

  const documents = useMemo(() => ({
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
      }),
  }), [api]);

  return { documents, api };
};

export default useApi;