import { API_KEY_NAME, INFO_KEY_NAME, REFRESH_KEY_NAME } from "../constants/api";

/**
 * Local storage helper functions
 */
const getValueByKey = (key) => localStorage.getItem(key);
const setValueWithKey = (key, val) => localStorage.setItem(key, val);
const removeWithKey = (key) => localStorage.removeItem(key);

/**
 * Token management functions
 */
export const loadTokenFromStorage = () => getValueByKey(API_KEY_NAME);
export const setToken = (token) => setValueWithKey(API_KEY_NAME, token);
export const removeTokenFromStorage = () => removeWithKey(API_KEY_NAME);

/**
 * Refresh token management functions
 */
export const loadAuthRefreshFromStorage = () => getValueByKey(REFRESH_KEY_NAME);
export const setRefresh = (refresh) => setValueWithKey(REFRESH_KEY_NAME, refresh);
export const removeAuthRefreshFromStorage = () => removeWithKey(REFRESH_KEY_NAME);

/**
 * User info management functions
 */
export const loadAuthInfoFromStorage = (key) => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};
export const setInfo = (info) => setValueWithKey(INFO_KEY_NAME, info);
export const removeInfo = () => removeWithKey(INFO_KEY_NAME);
export const removeAuthInfoFromStorage = () => removeWithKey(INFO_KEY_NAME);

/**
 * Data conversion utilities
 */
export const dataToBase64 = (data) => btoa(JSON.stringify(data));
export const base64ToData = (base64Str) => JSON.parse(atob(base64Str));

/**
 * Utility functions
 */
export const delaySync = async (seconds) => {
  await new Promise((res) => setTimeout(res, seconds * 1000));
};

/**
 * Navigation management
 */
let navigate;
export const setNavigate = (nav) => {
  navigate = nav;
};
export const getNavigate = () => navigate;
