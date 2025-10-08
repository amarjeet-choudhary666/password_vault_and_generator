import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/v1/api';

console.log('API Base URL:', API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor - cookies are sent automatically with withCredentials: true
api.interceptors.request.use(
  (config) => {
    console.log('Making API request to:', config.url);
    console.log('Base URL:', config.baseURL);
    console.log('Full URL:', config.baseURL + config.url);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear local storage and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('encryptionSalt');
        sessionStorage.removeItem('masterPassword');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;