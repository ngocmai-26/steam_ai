import React, { useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { setCourses, setCurrentCourse } from '../slices/courseSlice';
import { openModal } from '../slices/modalSlice';
import { fetchCoursesThunk, deleteCourseThunk } from '../thunks/courseThunks';
import ModalManager from '../components/ModalManager';
import CourseCard from '../components/CourseCard';
import { toast } from 'react-toastify';

const selectCourseState = state => ({
  courses: state.course.courses,
  isLoading: state.course.isLoading,
  error: state.course.error
});

const Courses = () => {
  const dispatch = useDispatch();
  const { courses, isLoading, error } = useSelector(selectCourseState, shallowEqual);

  // Load courses from API when component mounts
  useEffect(() => {
    dispatch(fetchCoursesThunk());
  }, [dispatch]);

  const handleAddCourse = useCallback(() => {
    dispatch(openModal({ type: 'add' }));
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    const errorMessage = typeof error === 'object' && error !== null && error.detail
      ? error.detail
      : typeof error === 'string'
        ? error
        : 'Đã có lỗi xảy ra.';
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error: {errorMessage}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý khóa học</h1>
        <button
          onClick={handleAddCourse}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Thêm khóa học
        </button>
      </div>

      {Array.isArray(courses) && courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có khóa học nào</h3>
          <p className="text-gray-500 text-center mb-6">Bạn chưa tạo khóa học nào. Hãy bắt đầu bằng cách thêm khóa học đầu tiên.</p>
        </div>
      )}

      <ModalManager />
    </div>
  );
};

export default Courses; 