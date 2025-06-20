import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Table from '../components/Table';
import { openModal } from '../slices/modalSlice';
import { setCurrentStudent, deleteStudent, fetchStudents } from '../slices/studentSlice';
import ModalManager from '../components/ModalManager';

const Students = () => {
  const dispatch = useDispatch();
  const { students = [], status, error } = useSelector((state) => state.student || {});

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

  const columns = [
    {
      title: 'Mã học viên',
      dataIndex: 'identification_number',
      key: 'identification_number',
      render: (text, record) => (
        <div className="flex items-center">
          {record.avatar_url && (
            <img
              src={record.avatar_url}
              alt={`${record.first_name} ${record.last_name}`}
              className="h-10 w-10 rounded-full mr-3"
            />
          )}
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (_, record) => `${record.first_name} ${record.last_name}`,
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'date_of_birth',
      key: 'date_of_birth',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Liên hệ',
      dataIndex: 'contact',
      key: 'contact',
      render: (_, record) => (
        <div>
          <div>{record.phone_number}</div>
          <div className="text-gray-500 text-sm">{record.email}</div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            isActive
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {isActive ? 'Đang hoạt động' : 'Không hoạt động'}
        </span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRegisterClass(record);
            }}
            className="text-blue-600 hover:text-blue-900"
          >
            Đăng ký lớp
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditStudent(record);
            }}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Sửa
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteStudent(record.id);
            }}
            className="text-red-600 hover:text-red-900"
          >
            Xóa
          </button>
        </div>
      ),
    },
  ];

  const handleAddStudent = () => {
    dispatch(openModal({ type: 'addStudent' }));
  };

  const handleEditStudent = (student) => {
    dispatch(setCurrentStudent(student));
    dispatch(openModal({ type: 'editStudent' }));
  };

  const handleDeleteStudent = (studentId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa học viên này?')) {
      dispatch(deleteStudent(studentId));
    }
  };

  const handleRegisterClass = (student) => {
    dispatch(setCurrentStudent(student));
    dispatch(openModal({ 
      type: 'registerClass',
      data: { studentId: student.id }
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Danh sách học viên</h1>
        <button
          onClick={handleAddStudent}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Thêm học viên mới
        </button>
      </div>

      <Table
        columns={columns}
        data={students}
        onRowClick={handleEditStudent}
      />
      
      <ModalManager />
    </div>
  );
};

export default Students; 