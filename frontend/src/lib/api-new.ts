import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/v1/api';

console.log('New API Base URL:', API_BASE_URL);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log('New API - Making request to:', fullUrl);
    return config;
  },
  (error) => {
    console.error('New API - Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('New API - Response error:', error);
    if (error.response?.status === 401) {
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

export default apiClient;