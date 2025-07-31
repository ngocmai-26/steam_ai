import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Table from '../components/Table';
import Modal from '../components/Modal';
import CreateUser from './CreateUser';
import { fetchUsers, setFilters, clearError } from '../slices/userSlice';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
};

const Accounts = () => {
  const dispatch = useDispatch();
  const { users, loading, error, filters } = useSelector((state) => state.users);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useIsMobile();

  console.log('Accounts component rendered:', { users, loading, error, filters });

  const columns = [
    { header: 'ID', key: 'id' },
    { header: 'Tên', key: 'name' },
    { header: 'Email', key: 'email' },
    { header: 'Số điện thoại', key: 'phone' },
    { header: 'Vai trò', key: 'role' },
    { header: 'Trạng thái', key: 'status' },
    { header: 'Lần đăng nhập cuối', key: 'last_login' },
  ];

  // Fetch users khi component mount
  useEffect(() => {
    console.log('Accounts: Fetching users on mount');
    dispatch(fetchUsers(filters));
  }, []); // Chỉ chạy 1 lần khi mount

  // Fetch users khi filters thay đổi
  useEffect(() => {
    if (filters.role !== '' || filters.status !== '' || filters.search !== '') {
      console.log('Accounts: Fetching users with filters:', filters);
      dispatch(fetchUsers(filters));
    }
  }, [filters.role, filters.status, filters.search, dispatch]);

  // Hiển thị error toast nếu có
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
  };

  const handleCreateSuccess = () => {
    setIsModalOpen(false);
    dispatch(fetchUsers(filters)); // Refresh danh sách sau khi tạo thành công
  };

  const formatRole = (role) => {
    const roleMap = {
      'root': 'Quản trị hệ thống',
      'manager': 'Quản lý',
      'teacher': 'Giáo viên'
    };
    return roleMap[role] || role;
  };

  const formatStatus = (status) => {
    const statusMap = {
      'activated': 'Đã kích hoạt',
      'blocked': 'Đã khóa',
      'unverified': 'Chưa xác thực'
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa đăng nhập';
    return new Date(dateString).toLocaleString('vi-VN');
  };

  // Transform data cho table
  const tableData = users.map(user => ({
    ...user,
    role: formatRole(user.role),
    status: formatStatus(user.status),
    last_login: formatDate(user.last_login),
    phone: user.phone || 'N/A'
  }));

  return (
    <div className="p-2 md:p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-6 gap-2 md:gap-0">
        <h1 className="text-2xl md:text-3xl font-bold">Quản lý tài khoản</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Thêm tài khoản
        </button>
      </div>

      {/* Debug info */}
      <div className="mb-2 md:mb-4 p-2 md:p-4 bg-gray-100 rounded text-xs md:text-base">
        <p>Debug: Users count: {users.length}, Loading: {loading.toString()}, Error: {error || 'none'}</p>
      </div>

      {/* Filters */}
      <div className="mb-4 md:mb-6 grid grid-cols-1 gap-2 md:grid-cols-4 md:gap-4">
        <div className="flex flex-row gap-2">
          <div className="flex-1">
            <label className="block text-sm md:text-sm font-medium text-gray-700 mb-1">Vai trò</label>
            <select
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
            >
              <option value="">Tất cả vai trò</option>
              <option value="root">Quản trị hệ thống</option>
              <option value="manager">Quản lý</option>
              <option value="teacher">Giáo viên</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm md:text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="activated">Đã kích hoạt</option>
              <option value="blocked">Đã khóa</option>
              <option value="unverified">Chưa xác thực</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400 pointer-events-none">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4-4m0 0A7 7 0 103 10a7 7 0 0014 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Tìm email/số ĐT"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-8 pr-2 py-2 md:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base placeholder:text-sm md:text-base md:placeholder:text-base"
            />
          </div>
        </div>
        <div className="flex items-end">
          <button
            onClick={() => dispatch(fetchUsers(filters))}
            disabled={loading}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
          >
            {loading ? 'Đang tải...' : 'Làm mới'}
          </button>
        </div>
      </div>

      {/* Danh sách tài khoản dạng card cho mobile */}
      {isMobile ? (
        <div className="flex flex-col gap-3">
          {loading ? (
            <div className="text-center text-gray-500 py-4">Đang tải...</div>
          ) : tableData.length === 0 ? (
            <div className="text-center text-gray-500 py-4">Không có tài khoản nào</div>
          ) : (
            tableData.map((user) => (
              <div key={user.id} className="bg-white rounded-lg shadow p-4 flex flex-col gap-1 border border-gray-100">
                <div className="font-semibold text-base">{user.name}</div>
                <div className="text-xs text-gray-600">Email: {user.email}</div>
                <div className="text-xs text-gray-600">SĐT: {user.phone}</div>
                <div className="text-xs text-gray-600">Vai trò: <span className="font-medium">{user.role}</span></div>
                <div className="text-xs text-gray-600">Trạng thái: <span className="font-medium">{user.status}</span></div>
                <div className="text-xs text-gray-500">Lần đăng nhập cuối: {user.last_login}</div>
              </div>
            ))
          )}
        </div>
      ) : (
        <Table
          columns={columns}
          data={tableData}
          isLoading={loading}
          emptyMessage="Không có tài khoản nào"
        />
      )}

      {/* Modal tạo tài khoản */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="lg"
      >
        <CreateUser onSuccess={handleCreateSuccess} />
      </Modal>
    </div>
  );
};

export default Accounts; 