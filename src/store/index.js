import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import dashboardReducer from '../slices/dashboardSlice';
import alertReducer from '../slices/alertSlice';
import classReducer from '../slices/classSlice';
import courseReducer from '../slices/courseSlice';
import studentReducer from '../slices/studentSlice';
import modalReducer from '../slices/modalSlice';
import moduleReducer from '../slices/moduleSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    alert: alertReducer,
    class: classReducer,
    course: courseReducer,
    student: studentReducer,
    modal: modalReducer,
    module: moduleReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['course/createCourse/fulfilled', 'course/updateCourseThunk/fulfilled'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.thumbnail'],
        // Ignore these paths in the state
        ignoredPaths: ['courses.thumbnail'],
      },
    }),
});

export default store; 