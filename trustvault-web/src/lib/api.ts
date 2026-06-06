import axios from 'axios';

// The default configuration assumes a local Laravel backend running on port 8000
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Global Axios Instance for TrustVault
 */
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  // Ensure cookies are sent (for Sanctum or Stateful auth)
  withCredentials: true,
});

/**
 * Configure request interceptors for auth tokens if needed in the future
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('trustvault_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Global response interceptor for unified error handlinig
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optionally handle generic errors like 401s here
    if (error.response?.status === 401) {
      console.warn('Unauthorized request. Token might be expired.');
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;

