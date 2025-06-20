import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { setCourses, setCurrentCourse } from '../slices/courseSlice';
import { openModal } from '../slices/modalSlice';
import { fetchCoursesThunk } from '../thunks/courseThunks';
import ModalManager from '../components/ModalManager';

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

  const handleEditCourse = useCallback((e, course) => {
    e?.stopPropagation();
    dispatch(setCurrentCourse(course));
    dispatch(openModal({ type: 'edit', data: { course } }));
  }, [dispatch]);

  const handleViewCourse = useCallback((course) => {
    dispatch(setCurrentCourse(course));
    dispatch(openModal({ type: 'viewCourse', data: { course } }));
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div
            key={course.id}
            onClick={() => handleViewCourse(course)}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
          >
            {course.thumbnail && (
              <img
                src={course.thumbnail}
                alt={course.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{course.name}</h2>
                <button
                  onClick={(e) => handleEditCourse(e, course)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Edit</span>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-600 text-sm mb-4">{course.description}</p>
              <div className="text-sm text-gray-500">
                <p><span className="font-medium">Mã khóa học:</span> {course.code}</p>
                <p><span className="font-medium">Thời lượng:</span> {course.duration} giờ</p>
                <p><span className="font-medium">Số lớp học:</span> {course.classes?.length || 0}</p>
                <p>
                  <span className="font-medium">Trạng thái:</span>
                  <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                    course.status === 'active' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {course.status === 'active' ? 'Đang hoạt động' : 'Tạm ngưng'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ModalManager />
    </div>
  );
};

export default Courses; 