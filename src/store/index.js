import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import userReducer from '../slices/userSlice';
import alertReducer from '../slices/alertSlice';
import classReducer from '../slices/classSlice';
import courseReducer from '../slices/courseSlice';
import studentReducer from '../slices/studentSlice';
import modalReducer from '../slices/modalSlice';
import moduleReducer from '../slices/moduleSlice';
import studentRegistrationReducer from '../slices/studentRegistrationSlice';
import newsReducer from '../slices/newsSlice';
import facilityReducer from '../slices/facilitySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    alert: alertReducer,
    class: classReducer,
    course: courseReducer,
    student: studentReducer,
    modal: modalReducer,
    module: moduleReducer,
    studentRegistration: studentRegistrationReducer,
    news: newsReducer,
    facilities: facilityReducer,
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