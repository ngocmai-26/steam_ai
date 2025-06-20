import axios from 'axios';
import { API_BASE_URL } from './constants/api';

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
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Thay vì dispatch action trực tiếp, chúng ta sẽ redirect về trang login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;
