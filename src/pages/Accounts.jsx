import React, { useState } from 'react';
import Table from '../components/Table';
import Modal from '../components/Modal';

const Accounts = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: '',
  });

  const columns = [
    { header: 'Tên đăng nhập', key: 'username' },
    { header: 'Email', key: 'email' },
    { header: 'Vai trò', key: 'role' },
    { header: 'Trạng thái', key: 'status' },
  ];

  const mockData = [
    {
      username: 'admin',
      email: 'admin@steamai.edu.vn',
      role: 'Admin',
      status: 'Hoạt động',
    },
    {
      username: 'teacher1',
      email: 'teacher1@steamai.edu.vn',
      role: 'Giáo viên',
      status: 'Hoạt động',
    },
    // Add more mock data as needed
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Quản lý tài khoản</h1>
      
      <Table
        columns={columns}
        data={mockData}
        onAdd={() => setIsModalOpen(true)}
        addButtonText="Thêm tài khoản"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Thêm tài khoản mới"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tên đăng nhập
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Vai trò
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Chọn vai trò</option>
              <option value="admin">Admin</option>
              <option value="teacher">Giáo viên</option>
              <option value="student">Học viên</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3">
            <button
              type="submit"
              className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            >
              Lưu
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="mt-3 sm:mt-0 inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            >
              Hủy
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Accounts; 