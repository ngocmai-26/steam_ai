import { setUser, logout, setLoading, setError } from '../slices/authSlice';
import { setCurrentUserInfo, clearCurrentUserInfo } from '../slices/userSlice';
import axios from '../axiosConfig'
import { AUTH_ENDPOINTS } from '../constants/api'
import { setAlert } from '../slices/alertSlice';
import { clearAuthData } from '../utils/authUtils';

// Fake account for testing
const FAKE_ACCOUNT = {
  username: 'admin',
  password: 'admin123',
  fullName: 'Admin User',
  role: 'admin',
  email: 'admin@example.com'
};

// Helper to manage user info in localStorage
const storeUserInfo = (userInfo) => {
  localStorage.setItem('userInfo', JSON.stringify(userInfo));
};

const clearUserInfo = () => {
  localStorage.removeItem('userInfo');
};

const getUserInfo = () => {
  const userInfo = localStorage.getItem('userInfo');
  return userInfo ? JSON.parse(userInfo) : null;
};

const getErrorMessage = (error) => {
    const message = error.response?.data?.message || error.response?.data?.detail || error.message;
    if (error.response?.data?.data) {
        const dataErrors = Object.entries(error.response.data.data)
            .map(([key, value]) => `${key}: ${value.join(', ')}`)
            .join('; ');
        return `${message}: ${dataErrors}`;
    }
    return message;
}

export const loginThunk = ({ email, password }) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.post(AUTH_ENDPOINTS.TOKEN, { email, password });
    const { access, refresh, user_info, verification_required } = response.data.data;

    localStorage.setItem('token', access);
    localStorage.setItem('refreshToken', refresh);
    storeUserInfo(user_info);

    // Lưu user_info vào userSlice
    dispatch(setCurrentUserInfo(user_info));

    if (verification_required) {
      dispatch(setUser(user_info));
      dispatch(setAlert({ message: 'Yêu cầu xác thực OTP', type: 'info' }));
      return { verificationRequired: true, email: user_info.email };
    }

    dispatch(setUser(user_info));
    dispatch(setAlert({ message: 'Đăng nhập thành công!', type: 'success' }));
    return { verificationRequired: false };

  } catch (error) {
    const message = getErrorMessage(error);
    
    // Kiểm tra nếu là lỗi account_unverify
    if (error.response?.data?.code === 'account_unverify') {
      dispatch(setAlert({ message: 'Tài khoản chưa được xác thực', type: 'warning' }));
      return { verificationRequired: true, email: email };
    }
    
    dispatch(setAlert({ message, type: 'error' }));
    dispatch(setError(message));
    throw new Error(message);
  }
};

export const verifyThunk = ({ email, otp }) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const response = await axios.post(AUTH_ENDPOINTS.VERIFY, { email, otp });
        const { access, refresh, user } = response.data.data;

        localStorage.setItem('token', access);
        localStorage.setItem('refreshToken', refresh);
        storeUserInfo(user);
        dispatch(setUser(user));
        dispatch(setAlert({ message: 'Xác thực thành công!', type: 'success' }));

    } catch (error) {
        const message = getErrorMessage(error);
        dispatch(setAlert({ message, type: 'error' }));
        dispatch(setError(message));
        throw new Error(message);
    }
}

export const logoutThunk = () => (dispatch) => {
  try {
    clearAuthData();
    clearUserInfo();
    dispatch(logout());
    dispatch(clearCurrentUserInfo()); // Xóa user_info khi logout
    dispatch(setAlert({ message: 'Đã đăng xuất', type: 'info' }));
  } catch (error) {
    console.error('Logout error:', error);
  }
};

export const checkAuthThunk = () => (dispatch) => {
  const token = localStorage.getItem('token');
  const userInfo = getUserInfo();

  if (token && userInfo) {
    // Silently authenticate user without showing alert
    dispatch(setUser(userInfo));
    dispatch(setCurrentUserInfo(userInfo)); // Lưu user_info khi check auth
  } else {
    // If token or user info is missing, treat as logged out
    dispatch(logout());
    dispatch(clearCurrentUserInfo()); // Xóa user_info
    clearUserInfo();
    clearAuthData();
  }
};