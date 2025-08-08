import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { setCourses, setCurrentCourse } from '../slices/courseSlice';
import { openModal } from '../slices/modalSlice';
import { fetchCoursesThunk, deleteCourseThunk } from '../thunks/courseThunks';
import ModalManager from '../components/ModalManager';
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

  const handleEditCourse = useCallback((e, course) => {
    e?.stopPropagation();
    dispatch(setCurrentCourse(course));
    dispatch(openModal({ type: 'edit', data: { course } }));
  }, [dispatch]);

  const handleViewCourse = useCallback((course) => {
    dispatch(setCurrentCourse(course));
    dispatch(openModal({ type: 'viewCourse', data: { course } }));
  }, [dispatch]);

  const handleDeleteCourse = async (e, course) => {
    e.stopPropagation();
    if (!window.confirm(`Bạn có chắc chắn muốn xóa khóa học "${course.name}"?`)) return;
    try {
      await dispatch(deleteCourseThunk(course.id)).unwrap();
      toast.success('Xóa khóa học thành công!');
      dispatch(fetchCoursesThunk());
    } catch (error) {
      console.error('Delete course error:', error);
      toast.error('Xóa khóa học thất bại!');
    }
  };

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
            <div
              key={course.id}
              onClick={() => handleViewCourse(course)}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200 relative"
            >
              {/* Nút xóa ở góc phải trên */}
              <button
                onClick={(e) => handleDeleteCourse(e, course)}
                className="absolute top-2 right-2 z-10 bg-white bg-opacity-80 rounded-full p-1 text-red-500 hover:text-red-700 hover:bg-red-100 shadow"
                title="Xóa khóa học"
              >
                <svg className="h-5 w-5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {(course.thumbnail_url || course.thumbnail) && (
                <img
                  src={course.thumbnail_url || course.thumbnail}
                  alt={course.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{course.name}</h2>
                  <button
                    onClick={(e) => handleEditCourse(e, course)}
                    className="text-gray-400 hover:text-gray-500 mr-2"
                  >
                    <span className="sr-only">Edit</span>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                <div className="text-sm text-gray-500 space-y-1">
                  <p><span className="font-medium">Mã khóa học:</span> {course.code}</p>
                  <p><span className="font-medium">Giá:</span> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price || 0)}/level</p>
                  <p><span className="font-medium">Thời lượng:</span> {course.duration} phút/level</p>
                  <p className="flex items-center">
                    <span className="font-medium">Trạng thái:</span>
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${course.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      {course.is_active ? 'Đang hoạt động' : 'Không hoạt động'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
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