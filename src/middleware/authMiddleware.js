import { setUser } from '../slices/authSlice';

// Fake account for testing
const FAKE_ACCOUNT = {
  username: 'admin',
  password: 'admin123',
  fullName: 'Admin User',
  role: 'admin',
  email: 'admin@example.com'
};

export const checkAuth = () => (dispatch) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    // Tạm thời bỏ qua việc verify token với API
    // TODO: Uncomment khi có API
    // try {
    //   const response = await fetch('http://127.0.0.1:8000/steam/apis/back-office/auth/verify', {
    //     headers: {
    //       'Authorization': `Bearer ${token}`
    //     }
    //   });
    //   if (response.ok) {
    //     const data = await response.json();
    //     dispatch(setUser(data));
    //   }
    // } catch (error) {
    //   console.error('Error verifying token:', error);
    // }

    // Sử dụng fake data thay thế
    dispatch(setUser({
      fullName: FAKE_ACCOUNT.fullName,
      role: FAKE_ACCOUNT.role,
      email: FAKE_ACCOUNT.email
    }));
  }
};

export const requireAuth = () => {
  const token = localStorage.getItem('token');
  return !!token;
}; 