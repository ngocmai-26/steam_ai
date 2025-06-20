/**
 * API configuration constants
 */
export const API = {
    uri: "https://cds.bdu.edu.vn/apis",
  };
  
  /**
   * Storage key names for authentication
   */
  export const API_KEY_NAME = "auth_token";
  export const REFRESH_KEY_NAME = "refresh";
  export const INFO_KEY_NAME = "info";
  
export const API_BASE_URL = 'https://bdu-steam.onrender.com';

export const AUTH_ENDPOINTS = {
  SESSION: `${API_BASE_URL}/steam/apis/app/auth/session`,
  TOKEN: `${API_BASE_URL}/steam/apis/back-office/auth/token`,
  VERIFY: `${API_BASE_URL}/steam/apis/back-office/auth/verify`,
};

export const COURSE_ENDPOINTS = {
  COURSES: `${API_BASE_URL}/steam/apis/back-office/courses`,
  COURSE_DETAIL: (id) => `${API_BASE_URL}/steam/apis/back-office/courses/${id}`,
};
  