/**
 * API configuration constants
 */
export const API = {
    uri: "https://stem.bdu.edu.vn/steam/apis",
  };
  
  /**
   * Storage key names for authentication
   */
  export const API_KEY_NAME = "auth_token";
  export const REFRESH_KEY_NAME = "refresh";
  export const INFO_KEY_NAME = "info";
  
export const API_BASE_URL = 'https://stem.bdu.edu.vn/steam/apis';

export const AUTH_ENDPOINTS = {
  SESSION: `${API_BASE_URL}/app/auth/session`,
  TOKEN: `${API_BASE_URL}/back-office/auth/token`,
  VERIFY: `${API_BASE_URL}/back-office/auth/verify`,
};

export const COURSE_ENDPOINTS = {
  COURSES: `${API_BASE_URL}/back-office/courses`,
  COURSE_DETAIL: (id) => `${API_BASE_URL}/back-office/courses/${id}`,
  UPLOAD_THUMBNAIL: (id) => `${API_BASE_URL}/back-office/courses/${id}/thumbnail`,
};

export const CLASS_ENDPOINTS = {
  CLASSES: `${API_BASE_URL}/back-office/classes`,
  CLASS_DETAIL: (id) => `${API_BASE_URL}/back-office/classes/${id}`,
};

export const MODULE_ENDPOINTS = {
    MODULES: `${API_BASE_URL}/back-office/course-modules`,
    MODULE_DETAIL: (id) => `${API_BASE_URL}/back-office/course-modules/${id}`,
};

export const USER_ENDPOINTS = {
  CREATE_ROOT_USER: `${API_BASE_URL}/back-office/root/users`,
};

export const LESSON_ENDPOINTS = {
  LESSONS: `${API_BASE_URL}/back-office/lessons`,
  LESSON_DETAIL: (id) => `${API_BASE_URL}/back-office/lessons/${id}`,
};
  