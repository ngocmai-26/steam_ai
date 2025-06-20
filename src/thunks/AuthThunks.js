import { setUser, logout, setLoading, setError } from '../slices/authSlice'
import axios from '../axiosConfig'
import { AUTH_ENDPOINTS } from '../constants/api'

// Fake account for testing
const FAKE_ACCOUNT = {
  username: 'admin',
  password: 'admin123',
  fullName: 'Admin User',
  role: 'admin',
  email: 'admin@example.com'
};

export const loginThunk = ({ email, password }) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.post(AUTH_ENDPOINTS.TOKEN, { email, password });
    const { access, refresh, user, verification_required } = response.data;

    if (verification_required) {
      return { verificationRequired: true, email };
    }

    localStorage.setItem('token', access);
    localStorage.setItem('refreshToken', refresh);
    dispatch(setUser(user));
    return { verificationRequired: false };

  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message || 'Login failed';
    dispatch(setError(errorMessage));
    throw new Error(errorMessage);
  }
};

export const verifyThunk = ({ email, otp }) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        const response = await axios.post(AUTH_ENDPOINTS.VERIFY, { email, otp });
        const { access, refresh, user } = response.data;

        localStorage.setItem('token', access);
        localStorage.setItem('refreshToken', refresh);
        dispatch(setUser(user));

    } catch (error) {
        const errorMessage = error.response?.data?.detail || error.message || 'Verification failed';
        dispatch(setError(errorMessage));
        throw new Error(errorMessage);
    }
}

export const logoutThunk = () => (dispatch) => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    dispatch(logout());
  } catch (error) {
    console.error('Logout error:', error);
  }
};

export const checkAuthThunk = () => (dispatch) => {
  const token = localStorage.getItem('token');
  if (token) {
    // Here you should ideally verify the token with your backend
    // For now, we'll just assume the token is valid if it exists
    // You might want to decode the token to get user info
    // const decoded = jwt_decode(token);
    // dispatch(setUser(decoded));
    // This is just a placeholder:
    dispatch(setUser({
      // You should fetch user info from backend or decode from token
    }));
  }
};