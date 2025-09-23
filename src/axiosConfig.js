import axios from 'axios';
import { API_BASE_URL } from './constants/api';
import { isAuthError, handleLogout } from './utils/authUtils';

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Quan trọng cho việc xử lý session cookies
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Không set Content-Type cho FormData để browser tự set với boundary
    // Chỉ set Content-Type cho JSON requests
    if (!(config.data instanceof FormData) && !config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }

    // Debug: Log headers for FormData requests
    if (config.data instanceof FormData) {
      console.log('FormData request headers:', config.headers);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Kiểm tra lỗi authentication (401 hoặc "Verify token failed!")
    if (isAuthError(error)) {
      handleLogout();
    }
    return Promise.reject(error);
  }
);

export default instance;
