/**
 * Authentication utility functions
 */

/**
 * Clear all authentication data from localStorage
 */
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('auth_token');
  localStorage.removeItem('refresh');
  localStorage.removeItem('info');
};

/**
 * Handle logout and redirect to login page
 */
export const handleLogout = () => {
  clearAuthData();
  window.location.href = '/login';
};

/**
 * Check if response contains token verification error
 */
export const isTokenVerificationError = (error) => {
  return error.response?.data?.detail === "Verify token failed!";
};

/**
 * Check if response is an authentication error
 */
export const isAuthError = (error) => {
  return error.response?.status === 401 || isTokenVerificationError(error);
}; 