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
    console.log('Attaching token to request:', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
