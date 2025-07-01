import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axiosConfig';
import { MODULE_ENDPOINTS } from '../constants/api';
import { setAlert } from '../slices/alertSlice';

const getErrorMessage = (error) => {
    const message = error.response?.data?.message || error.response?.data?.detail || error.message;
    if (error.response?.data?.data) {
        const dataErrors = Object.entries(error.response.data.data)
            .map(([key, value]) => `${key}: ${value.join(', ')}`)
            .join('; ');
        return `${message}: ${dataErrors}`;
    }
    return message;
};

// Fetch all modules
export const fetchModulesThunk = createAsyncThunk(
    'module/fetchModules',
    async (classRoomId, { dispatch, rejectWithValue }) => {
        try {
            const params = classRoomId ? { class_room: classRoomId } : {};
            const response = await axios.get(MODULE_ENDPOINTS.MODULES, { params });
            return response.data.data;
        } catch (error) {
            const message = getErrorMessage(error);
            dispatch(setAlert({ message, type: 'error' }));
            return rejectWithValue(message);
        }
    }
);

// Fetch module by id
export const fetchModuleById = createAsyncThunk(
  'module/fetchModuleById',
  async (id) => {
    try {
      const response = await axios.get(MODULE_ENDPOINTS.MODULE_DETAIL(id));
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
);

// Fetch modules by course id
export const fetchModulesByCourseId = createAsyncThunk(
  'module/fetchModulesByCourseId',
  async (courseId) => {
    try {
      const response = await axios.get(MODULE_ENDPOINTS.MODULES_BY_COURSE(courseId));
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
);

// Create new module
export const createModuleThunk = createAsyncThunk(
    'module/createModule',
    async (moduleData, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.post(MODULE_ENDPOINTS.MODULES, moduleData);
            dispatch(setAlert({ message: 'Tạo học phần thành công!', type: 'success' }));
            return response.data.data;
        } catch (error) {
            const message = getErrorMessage(error);
            dispatch(setAlert({ message, type: 'error' }));
            return rejectWithValue(message);
        }
    }
);

// Update module
export const updateModuleThunk = createAsyncThunk(
    'module/updateModule',
    async ({ id, moduleData }, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.put(MODULE_ENDPOINTS.MODULE_DETAIL(id), moduleData);
            dispatch(setAlert({ message: 'Cập nhật học phần thành công!', type: 'success' }));
            return response.data.data;
        } catch (error) {
            const message = getErrorMessage(error);
            dispatch(setAlert({ message, type: 'error' }));
            return rejectWithValue(message);
        }
    }
);

// Delete module
export const deleteModuleThunk = createAsyncThunk(
    'module/deleteModule',
    async (id, { dispatch, rejectWithValue }) => {
        try {
            await axios.delete(MODULE_ENDPOINTS.MODULE_DETAIL(id));
            dispatch(setAlert({ message: 'Xóa học phần thành công!', type: 'success' }));
            return id;
        } catch (error) {
            const message = getErrorMessage(error);
            dispatch(setAlert({ message, type: 'error' }));
            return rejectWithValue(message);
        }
    }
); 