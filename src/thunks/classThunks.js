import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axiosConfig';
import { CLASS_ENDPOINTS } from '../constants/api';
import { setAlert } from '../slices/alertSlice';

// Helper to extract error message
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

// Fetch all classes
export const fetchClasses = createAsyncThunk(
  'class/fetchClasses',
  async (courseId, { dispatch, rejectWithValue }) => {
    try {
      const params = courseId ? { course_id: courseId } : {};
      const response = await axios.get(CLASS_ENDPOINTS.CLASSES, { params });
      return response.data.data;
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch(setAlert({ message, type: 'error' }));
      return rejectWithValue(message);
    }
  }
);

// Fetch class by ID
export const fetchClassById = createAsyncThunk(
  'class/fetchClassById',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.get(CLASS_ENDPOINTS.CLASS_DETAIL(id));
      return response.data.data;
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch(setAlert({ message, type: 'error' }));
      return rejectWithValue(message);
    }
  }
);

// Create new class
export const createClass = createAsyncThunk(
  'class/createClass',
  async (classData, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(CLASS_ENDPOINTS.CLASSES, classData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      dispatch(setAlert({ message: 'Tạo lớp học thành công!', type: 'success' }));
      return response.data.data;
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch(setAlert({ message, type: 'error' }));
      return rejectWithValue(message);
    }
  }
);

// Update class
export const updateClassThunk = createAsyncThunk(
  'class/updateClass',
  async ({ id, classData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.put(CLASS_ENDPOINTS.CLASS_DETAIL(id), classData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      dispatch(setAlert({ message: 'Cập nhật lớp học thành công!', type: 'success' }));
      return response.data.data;
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch(setAlert({ message, type: 'error' }));
      return rejectWithValue(message);
    }
  }
);

// Delete class
export const deleteClassThunk = createAsyncThunk(
  'class/deleteClass',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await axios.delete(CLASS_ENDPOINTS.CLASS_DETAIL(id));
      dispatch(setAlert({ message: 'Xóa lớp học thành công!', type: 'success' }));
      return id;
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch(setAlert({ message, type: 'error' }));
      return rejectWithValue(message);
    }
  }
); 