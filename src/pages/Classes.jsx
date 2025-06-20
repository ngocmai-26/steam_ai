import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { setCourses, setCurrentCourse, setCurrentClass } from '../slices/courseSlice';
import { openModal } from '../slices/modalSlice';
import { mockCourses } from '../data/mockData';
import ModalManager from '../components/ModalManager';

const selectClassesState = state => ({
  courses: state.course.courses,
  isLoading: state.course.isLoading,
  error: state.course.error
});

const Classes = () => {
  const dispatch = useDispatch();
  const { courses, isLoading, error } = useSelector(selectClassesState, shallowEqual);

  // Load mock data when component mounts
  useEffect(() => {
    dispatch(setCourses(mockCourses));
  }, [dispatch]);

  const handleAddClass = useCallback((course) => {
    dispatch(setCurrentCourse(course));
    dispatch(openModal({ type: 'addClass', data: { course } }));
  }, [dispatch]);

  const handleEditClass = useCallback((e, course, classData) => {
    e.stopPropagation();
    dispatch(setCurrentCourse(course));
    dispatch(setCurrentClass(classData));
    dispatch(openModal({ type: 'editClass', data: { course, class: classData } }));
  }, [dispatch]);

  const handleViewClass = useCallback((course, classData) => {
    dispatch(setCurrentCourse(course));
    dispatch(setCurrentClass(classData));
    dispatch(openModal({ type: 'viewClass', data: { course, class: classData } }));
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Quản lý lớp học</h1>

      {courses.map(course => (
        <div key={course.id} className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">{course.name}</h2>
            <button
              onClick={() => handleAddClass(course)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Thêm lớp học
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {course.classes?.map(classItem => (
              <div
                key={classItem.id}
                onClick={() => handleViewClass(course, classItem)}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
              >
                {classItem.thumbnail && (
                  <img
                    src={classItem.thumbnail}
                    alt={classItem.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{classItem.name}</h3>
                    <button
                      onClick={(e) => handleEditClass(e, course, classItem)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Chỉnh sửa</span>
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{classItem.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                    <div>
                      <p><span className="font-medium">Giáo viên:</span> {classItem.teacher}</p>
                      {classItem.teaching_assistant && (
                        <p><span className="font-medium">Trợ giảng:</span> {classItem.teaching_assistant}</p>
                      )}
                    </div>
                    <div>
                      <p><span className="font-medium">Học sinh:</span> {classItem.students?.length || 0}/{classItem.max_students}</p>
                      <p><span className="font-medium">Bài học:</span> {classItem.lessons?.length || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <ModalManager />
    </div>
  );
};

export default React.memo(Classes); 