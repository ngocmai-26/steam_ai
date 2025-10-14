import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axiosConfig';
import { COURSE_ENDPOINTS } from '../constants/api';
import {
  setModules,
  addModule,
  updateModule,
  removeModule,
} from '../slices/courseSlice';
import { setAlert } from '../slices/alertSlice';

// Helper function to create FormData
const createCourseFormData = (courseData) => {
  const formData = new FormData();
  
  Object.keys(courseData).forEach(key => {
    const value = courseData[key];
    
    // Chỉ thêm vào FormData nếu giá trị không null, undefined và không phải là chuỗi rỗng
    if (value !== null && value !== undefined && value !== '') {
      // Đặc biệt xử lý cho boolean values
      if (typeof value === 'boolean') {
        formData.append(key, value.toString());
      } else if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value);
      }
    } else {
    }
  });
  
  // Debug: Log final FormData
  
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
      
     
      
      // Kiểm tra xem có file upload không
      const hasFileUpload = courseData.thumbnail instanceof File;
      
      let response;
      
      // Luôn sử dụng endpoint chính với FormData
      response = await axios.put(COURSE_ENDPOINTS.COURSE_DETAIL(id), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
       
      dispatch(setAlert({ message: 'Cập nhật khóa học thành công!', type: 'success' }));
      return response.data.data;
     
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
      await axios.delete(COURSE_ENDPOINTS.COURSE_DETAIL(id));
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
      const response = await axios.get(COURSE_ENDPOINTS.CLASSES, {
        params: { course: courseId }
      });
      return response.data?.data || response.data || [];
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Không thể tải danh sách lớp học';
      return rejectWithValue(message);
    }
  }
);

export const createClass = createAsyncThunk(
  'course/createClass',
  async ({ courseId, classData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(COURSE_ENDPOINTS.CLASSES, {
        ...classData,
        course: courseId
      });
      return response.data?.data || response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Không thể tạo lớp học';
      return rejectWithValue(message);
    }
  }
);

export const updateClassThunk = createAsyncThunk(
  'course/updateClass',
  async ({ id, classData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${COURSE_ENDPOINTS.CLASSES}/${id}`, classData);
      return response.data?.data || response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Không thể cập nhật lớp học';
      return rejectWithValue(message);
    }
  }
);

export const deleteClass = createAsyncThunk(
  'course/deleteClass',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${COURSE_ENDPOINTS.CLASSES}/${id}`);
      return id;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Không thể xóa lớp học';
      return rejectWithValue(message);
    }
  }
);

// Module Thunks
export const fetchModules = createAsyncThunk(
  'course/fetchModules',
  async (classId, { rejectWithValue }) => {
    try {
      const response = await axios.get(COURSE_ENDPOINTS.MODULES, {
        params: { class: classId }
      });
      return response.data?.data || response.data || [];
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Không thể tải danh sách module';
      return rejectWithValue(message);
    }
  }
);

export const createModule = createAsyncThunk(
  'course/createModule',
  async ({ classId, moduleData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(COURSE_ENDPOINTS.MODULES, {
        ...moduleData,
        class: classId
      });
      return response.data?.data || response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Không thể tạo module';
      return rejectWithValue(message);
    }
  }
);

export const updateModuleThunk = createAsyncThunk(
  'course/updateModule',
  async ({ id, moduleData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${COURSE_ENDPOINTS.MODULES}/${id}`, moduleData);
      return response.data?.data || response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Không thể cập nhật module';
      return rejectWithValue(message);
    }
  }
);

export const deleteModule = createAsyncThunk(
  'course/deleteModule',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${COURSE_ENDPOINTS.MODULES}/${id}`);
      return id;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Không thể xóa module';
      return rejectWithValue(message);
    }
  }
);

// Fetch classes by course id
export const fetchClassesByCourseId = createAsyncThunk(
  'course/fetchClassesByCourseId',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await axios.get(COURSE_ENDPOINTS.CLASSES, {
        params: { course: courseId }
      });
      return response.data?.data || response.data || [];
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Không thể tải danh sách lớp học';
      return rejectWithValue(message);
    }
  }
); 