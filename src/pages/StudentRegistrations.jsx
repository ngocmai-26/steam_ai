import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPendingRegistrations, updateRegistrationStatus } from '../slices/studentRegistrationSlice';
import { setAlert } from '../slices/alertSlice';
import Table from '../components/Table';
import Loading from '../components/Loading';
import Toast from '../components/Toast';

const StudentRegistrations = () => {
  const dispatch = useDispatch();
  const { pendingRegistrations, loading, error } = useSelector((state) => state.studentRegistration);
  const alert = useSelector((state) => state.alert);

  useEffect(() => {
    dispatch(fetchPendingRegistrations());
  }, [dispatch]);

  const handleApprove = async (id) => {
    try {
      const result = await dispatch(updateRegistrationStatus({
        id,
        data: {
          status: 'approved',
          note: ''
        }
      })).unwrap();
      
      dispatch(setAlert({
        type: 'success',
        message: 'Đã duyệt đăng ký thành công'
      }));
      
      return result;
    } catch (error) {
      console.error('Không thể duyệt đăng ký:', error);
      dispatch(setAlert({
        type: 'error',
        message: error.message || 'Không thể duyệt đăng ký. Vui lòng thử lại'
      }));
    }
  };

  const handleReject = async (id) => {
    try {
      const result = await dispatch(updateRegistrationStatus({
        id,
        data: {
          status: 'rejected',
          note: 'Bị từ chối bởi quản lý'
        }
      })).unwrap();

      dispatch(setAlert({
        type: 'success',
        message: 'Đã từ chối đăng ký'
      }));

      return result;
    } catch (error) {
      console.error('Không thể từ chối đăng ký:', error);
      dispatch(setAlert({
        type: 'error',
        message: error.message || 'Không thể từ chối đăng ký. Vui lòng thử lại'
      }));
    }
  };

  const columns = [
    {
      header: 'Tên học viên',
      key: 'student',
      render: (item) => `${item.student.first_name} ${item.student.last_name}`,
    },
    {
      header: 'Email',
      key: 'student',
      render: (item) => item.student.email,
    },
    {
      header: 'Số điện thoại',
      key: 'student',
      render: (item) => item.student.phone_number,
    },
    {
      header: 'Phụ huynh',
      key: 'student',
      render: (item) => item.student.parent_name,
    },
    {
      header: 'SĐT phụ huynh',
      key: 'student',
      render: (item) => item.student.parent_phone,
    },
    {
      header: 'Ngày đăng ký',
      key: 'created_at',
      render: (item) => new Date(item.created_at).toLocaleDateString('vi-VN'),
    },
    {
      header: 'Thao tác',
      key: 'id',
      render: (item) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleApprove(item.id)}
            className="px-3 py-1 text-sm text-white bg-green-500 rounded hover:bg-green-600 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Duyệt
          </button>
          <button
            onClick={() => handleReject(item.id)}
            className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Từ chối
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-red-500">Lỗi: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Danh sách học viên chờ duyệt</h1>
      {pendingRegistrations.length === 0 ? (
        <p className="text-gray-500">Không có học viên nào đang chờ duyệt</p>
      ) : (
        <Table
          columns={columns}
          data={pendingRegistrations}
        />
      )}
      {alert.msg && (
        <Toast
          type={alert.msg.type}
          message={alert.msg.message}
          onClose={() => dispatch(setAlert({ msg: null }))}
        />
      )}
    </div>
  );
};

export default StudentRegistrations;
