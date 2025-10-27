import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClasses, deleteClassThunk, fetchClassById } from '../thunks/classThunks';
import { fetchCoursesThunk } from '../thunks/courseThunks';
import { openModal } from '../slices/modalSlice';
import ModalManager from '../components/ModalManager';
import Loading from '../components/Loading';
import { getThumbnailUrl } from '../utils/imageUtils';

const Classes = () => {
  const dispatch = useDispatch();
  const { classes, isLoading, error } = useSelector((state) => state.class);
  const { courses, isLoading: coursesLoading, error: coursesError } = useSelector((state) => state.course);
  const user = useSelector(state => state.auth.user);
  const role = user?.role;

  useEffect(() => {
    dispatch(fetchClasses());
    dispatch(fetchCoursesThunk());
  }, [dispatch]);

  // Helper function to get image URL
  const getImageUrl = (classItem) => {
    return getThumbnailUrl(classItem) || 'https://via.placeholder.com/400x300?text=No+Image';
  };

  // Helper function
  const getDisplayName = (user) => {
    if (!user) return '';
    if (typeof user === 'string') return user;
    if (typeof user === 'object') return user.name || user.email || String(user.id || '');
    return '';
  };

  // Helper function to get student count
  const getStudentCount = (classItem) => {
    if (classItem.current_students !== undefined) return classItem.current_students;
    if (classItem.student_count !== undefined) return classItem.student_count;
    if (classItem.students?.length !== undefined) return classItem.students.length;
    return 0;
  };

  const handleAddClass = () => {
    dispatch(openModal({ type: 'addClass', data: {} }));
  };

  const handleEditClass = (classData) => {
    dispatch(openModal({ type: 'editClass', data: { class: classData } }));
  };

  const handleViewClass = async (classData) => {
    try {
      await dispatch(fetchClassById(classData.id)).unwrap();
      dispatch(openModal({ type: 'viewClass', data: { class: classData } }));
    } catch (error) {
      console.error('Error fetching class details:', error);
    }
  };

  const handleDeleteClass = (classId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lớp học này không?')) {
      dispatch(deleteClassThunk(classId)).then(() => {
        dispatch(fetchClasses());
        dispatch(fetchCoursesThunk());
      });
    }
  };

  // Lọc danh sách lớp theo role
  const filteredClasses = role === 'teacher'
    ? classes.filter(classItem => (classItem.teacher && (classItem.teacher.id === user.id || classItem.teacher === user.id)))
    : classes;

  if (isLoading || coursesLoading) {
    return <Loading />;
  }

  if (error || coursesError) {
    const errorMessage = error || coursesError;
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error: {typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Quản lý lớp học</h1>
      {role === 'manager' && (
        <div className="flex justify-end mb-6">
          <button
            onClick={handleAddClass}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Thêm lớp học
          </button>
        </div>
      )}
      {(!filteredClasses || filteredClasses.length === 0) ? (
        <div className="text-center text-gray-500 py-12">Chưa có lớp học nào.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map(classItem => (
            <div
              key={classItem.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-200 hover:shadow-lg"
            >
              <div className="relative">
                {/* XÓA PHẦN HIỂN THỊ ẢNH */}
                {/* <img ... /> */}
                <div className="absolute top-2 right-2 flex space-x-1">
                  <button
                    onClick={() => handleViewClass(classItem)}
                    className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
                    title="Xem chi tiết"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  {role === 'manager' && (
                    <button
                      onClick={() => handleEditClass(classItem)}
                      className="bg-gray-500 text-white p-1 rounded hover:bg-gray-600"
                      title="Chỉnh sửa"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  )}
                  {role === 'manager' && (
                    <button
                      onClick={() => handleDeleteClass(classItem.id)}
                      className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                      title="Xóa"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                  {role === 'manager' && (
                    <button
                      onClick={() => dispatch(openModal({ type: 'manageModules', data: { classId: classItem.id, className: classItem.name } }))}
                      className="bg-green-500 text-white p-1 rounded hover:bg-green-600"
                      title="Quản lý học phần"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h6" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h6m0 0v6m0-6l-8 8-4-4-6 6" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{classItem.name}</h3>
                {classItem.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{classItem.description}</p>
                )}
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-500">
                  <div>
                    <span className="font-medium text-gray-700">GV:</span>
                    <p className="truncate">{getDisplayName(classItem.teacher)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Trợ giảng:</span>
                    <p className="truncate">{getDisplayName(classItem.teaching_assistant)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Học viên:</span>
                    <p>{getStudentCount(classItem)}/{classItem.max_students || '∞'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Trạng thái:</span>
                    <p className={`capitalize ${
                      classItem.status === 'active' ? 'text-green-600' : 
                      classItem.status === 'inactive' ? 'text-gray-600' : 
                      classItem.status === 'completed' ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                      {classItem.status || 'active'}
                    </p>
                  </div>
                  {classItem.start_date && (
                    <div className="col-span-2">
                      <span className="font-medium text-gray-700">Thời gian:</span>
                      <p>{new Date(classItem.start_date).toLocaleDateString('vi-VN')} - {classItem.end_date ? new Date(classItem.end_date).toLocaleDateString('vi-VN') : 'N/A'}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ModalManager />
    </div>
  );
};

export default Classes; 