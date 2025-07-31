import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axiosConfig';
import { COURSE_ENDPOINTS } from '../constants/api';
import {
  setModules,
  addModule,
  updateModule,
  removeModule,
} from '../slices/courseSlice';
import {
  mockCourses,
  mockClasses,
  mockModules,
  getClassesByCourseId,
  getModulesByClassId
} from '../mockData';
import { mockApiService } from '../services/mockData';
import { setAlert } from '../slices/alertSlice';

// Helper function to create FormData
const createCourseFormData = (courseData) => {
  const formData = new FormData();
  Object.keys(courseData).forEach(key => {
    if (courseData[key] !== null && courseData[key] !== undefined) {
      formData.append(key, courseData[key]);
    }
  });
  return formData;
};

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

// Fetch all courses
export const fetchCoursesThunk = createAsyncThunk(
  'course/fetchCourses',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.get(COURSE_ENDPOINTS.COURSES);
      return response.data.data || [];
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch(setAlert({ message, type: 'error' }));
      return rejectWithValue(message);
    }
  }
);

// Fetch course by id
export const fetchCourseByIdThunk = createAsyncThunk(
  'course/fetchCourseById',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.get(COURSE_ENDPOINTS.COURSE_DETAIL(id));
      return response.data.data;
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch(setAlert({ message, type: 'error' }));
      return rejectWithValue(message);
    }
  }
);

// Create new course
export const createCourseThunk = createAsyncThunk(
  'course/createCourse',
  async (courseData, { dispatch, rejectWithValue }) => {
    try {
      const formData = createCourseFormData(courseData);
      const response = await axios.post(COURSE_ENDPOINTS.COURSES, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      dispatch(setAlert({ message: 'Tạo khóa học thành công!', type: 'success' }));
      return response.data.data;
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch(setAlert({ message, type: 'error' }));
      return rejectWithValue(message);
    }
  }
);

// Update course
export const updateCourseThunk = createAsyncThunk(
  'course/updateCourse',
  async ({ id, courseData }, { dispatch, rejectWithValue }) => {
    try {
      const formData = createCourseFormData(courseData);
      const response = await axios.put(COURSE_ENDPOINTS.COURSE_DETAIL(id), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      dispatch(setAlert({ message: 'Cập nhật khóa học thành công!', type: 'success' }));
      return response.data.data;
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch(setAlert({ message, type: 'error' }));
      return rejectWithValue(message);
    }
  }
);

// Delete course
export const deleteCourseThunk = createAsyncThunk(
  'course/deleteCourse',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      console.log('deleteCourseThunk: Deleting course with ID:', id);
      console.log('deleteCourseThunk: API endpoint:', COURSE_ENDPOINTS.COURSE_DETAIL(id));
      await axios.delete(COURSE_ENDPOINTS.COURSE_DETAIL(id));
      console.log('deleteCourseThunk: Delete successful');
      dispatch(setAlert({ message: 'Xóa khóa học thành công!', type: 'success' }));
      return id;
    } catch (error) {
      console.error('deleteCourseThunk: Error:', error);
      const message = getErrorMessage(error);
      dispatch(setAlert({ message, type: 'error' }));
      return rejectWithValue(message);
    }
  }
);

// Class Thunks
export const fetchClasses = createAsyncThunk(
  'course/fetchClasses',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await mockApiService.getClasses();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createClass = createAsyncThunk(
  'course/createClass',
  async ({ courseId, classData }, { rejectWithValue }) => {
    try {
      const response = await mockApiService.createClass(courseId, classData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateClassThunk = createAsyncThunk(
  'course/updateClass',
  async ({ id, classData }, { rejectWithValue }) => {
    try {
      const response = await mockApiService.updateClass(id, classData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteClass = createAsyncThunk(
  'course/deleteClass',
  async (id, { rejectWithValue }) => {
    try {
      await mockApiService.deleteClass(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Module Thunks
export const fetchModules = createAsyncThunk(
  'course/fetchModules',
  async (classId, { rejectWithValue }) => {
    try {
      const response = await mockApiService.getModulesByClassId(classId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createModule = createAsyncThunk(
  'course/createModule',
  async ({ classId, moduleData }, { rejectWithValue }) => {
    try {
      const response = await mockApiService.createModule(classId, moduleData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateModuleThunk = createAsyncThunk(
  'course/updateModule',
  async ({ id, moduleData }, { rejectWithValue }) => {
    try {
      const response = await mockApiService.updateModule(id, moduleData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteModule = createAsyncThunk(
  'course/deleteModule',
  async (id, { rejectWithValue }) => {
    try {
      await mockApiService.deleteModule(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch classes by course id
export const fetchClassesByCourseId = createAsyncThunk(
  'course/fetchClassesByCourseId',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await mockApiService.getClassesByCourseId(courseId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
); 