import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Table from '../components/Table';
import { openModal } from '../slices/modalSlice';
import { setCurrentStudent, fetchStudents, addStudentAsync, updateStudentAsync, deleteStudentAsync, fetchStudentDetail } from '../slices/studentSlice';
import ModalManager from '../components/ModalManager';
import { ButtonAction } from '../components/Table';

const Students = () => {
  const dispatch = useDispatch();
  const { students = [], status, error } = useSelector((state) => state.student || {});
  const user = useSelector(state => state.auth.user);
  const role = user?.role;

  const handleAddStudent = (studentData) => {
    dispatch(addStudentAsync(studentData));
  };

  const handleEditStudent = (student) => {
    dispatch(fetchStudentDetail(student.id));
    dispatch(openModal({ type: 'editStudent' }));
  };

  const handleRowClick = (student) => {
    dispatch(fetchStudentDetail(student.id));
    dispatch(openModal({ type: 'viewStudent' }));
  };

  const handleUpdateStudent = (id, studentData) => {
    dispatch(updateStudentAsync({ id, studentData }));
  };

  const handleDeleteStudent = (studentId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa học viên này?')) {
      dispatch(deleteStudentAsync(studentId));
    }
  };

  const handleRegisterClass = (student) => {
    dispatch(setCurrentStudent(student));
    dispatch(openModal({
      type: 'registerClass',
      data: { studentId: student.id }
    }));
  };

  // Di chuyển useMemo lên sau các hàm trên
  const columns = useMemo(() => [
    {
      header: 'Mã học viên',
      key: 'identification_number',
      render: (item) => (
        <div className="flex items-center">
          {item.avatar_url && (
            <img
              src={item.avatar_url}
              alt={`${item.first_name} ${item.last_name}`}
              className="h-10 w-10 rounded-full mr-3"
            />
          )}
          <span>{item.identification_number}</span>
        </div>
      ),
    },
    {
      header: 'Họ và tên',
      key: 'fullName',
      render: (item) => `${item.first_name} ${item.last_name}`,
    },
    {
      header: 'Ngày sinh',
      key: 'date_of_birth',
      render: (item) => new Date(item.date_of_birth).toLocaleDateString(),
    },
    {
      header: 'Trạng thái',
      key: 'is_active',
      render: (item) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.is_active
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
            }`}
        >
          {item.is_active ? 'Đang hoạt động' : 'Không hoạt động'}
        </span>
      ),
    },
    {
      header: 'Thao tác',
      key: 'actions',
      render: (item) => (
        <div className="flex gap-2 justify-center">
          {role === 'manager' && (
            <ButtonAction color="indigo" onClick={(e) => { e.stopPropagation(); handleRegisterClass(item); }}>
              <span className="sm:hidden">
                {/* icon info */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
              </span>
              <span className="hidden sm:inline">Chi tiết</span>
            </ButtonAction>
          )}
          {role === 'manager' && (
            <ButtonAction color="blue" onClick={(e) => { e.stopPropagation(); handleEditStudent(item); }}>
              <span className="sm:hidden">
                {/* icon edit */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3h3z" /></svg>
              </span>
              <span className="hidden sm:inline">Sửa</span>
            </ButtonAction>
          )}
          {role === 'manager' && (
            <ButtonAction color="red" onClick={(e) => { e.stopPropagation(); handleDeleteStudent(item.id); }}>
              <span className="sm:hidden">
                {/* icon trash */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </span>
              <span className="hidden sm:inline">Xóa</span>
            </ButtonAction>
          )}
        </div>
      ),
    },
  ], [role]);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchStudents());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="text-center py-10">
        <div className="text-red-600 text-lg">Error: {error}</div>
        <button
          onClick={() => dispatch(fetchStudents())}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Thử lại
        </button>
      </div>
    );
  }

  // Lọc danh sách học sinh theo role
  const filteredStudents = role === 'teacher'
    ? students.filter(student => {
      // student.class_room có thể là object hoặc id
      if (!student.class_room) return false;
      const classObj = typeof student.class_room === 'object' ? student.class_room : null;
      return classObj && (classObj.teacher?.id === user.id || classObj.teacher === user.id);
    })
    : students;

  return (
    <div className="w-full px-2 sm:px-4 md:px-8 py-4 md:py-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">Danh sách học viên</h1>
        {role === 'manager' && (
          <button
            onClick={() => dispatch(openModal({ type: 'addStudent' }))}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base"
          >
            Thêm học viên mới
          </button>
        )}
      </div>
      {/* Bọc Table bằng div -mx-2 để Table scroll ngang sát mép màn hình trên mobile */}
      <div className="-mx-2 sm:-mx-4 md:-mx-8">
        <div className="bg-white rounded-lg shadow p-2 sm:p-4 overflow-x-auto">
          <Table
            columns={columns}
            data={filteredStudents}
            onRowClick={handleRowClick}
          />
        </div>
      </div>
      <ModalManager />
    </div>
  );
};

export default Students; 