/**
 * Generate HTTP headers with optional authentication token
 * @param {string} token - Authentication token
 * @param {Object} headers - Additional headers to merge
 * @returns {Object} Merged headers object
 */
export const getHeaders = (token, headers = {}) => {
    const configs = { 
      "Content-Type": "application/json" 
    };
    
    if (token) {
      configs["Authorization"] = `Bearer ${token}`;
    }
    
    return { ...configs, ...headers };
  };
    