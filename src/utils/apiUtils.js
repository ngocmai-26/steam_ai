/**
 * API utility functions
 */
import { isAuthError } from './authUtils';

/**
 * Wrapper for API calls that handles authentication errors
 * @param {Function} apiCall - The API call function
 * @returns {Promise} - Promise with API response
 */
export const handleApiCall = async (apiCall) => {
  try {
    return await apiCall();
  } catch (error) {
    // Authentication errors are handled by axios interceptor
    // This is just for additional logging or custom handling
    if (isAuthError(error)) {
      console.log('Authentication error detected in API call:', error.message);
    }
    throw error;
  }
};

/**
 * Create a service method with error handling
 * @param {Function} apiCall - The API call function
 * @returns {Function} - Wrapped function with error handling
 */
export const createServiceMethod = (apiCall) => {
  return async (...args) => {
    return handleApiCall(() => apiCall(...args));
  };
}; 