import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import axios from '../axiosConfig';
import { USER_ENDPOINTS } from '../constants/api';

const CreateUser = () => {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    role: 'manager',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Parse dữ liệu: nếu trường không bắt buộc là chuỗi rỗng thì chuyển thành null
    const parsedData = {
      ...formData,
      phone: formData.phone.trim() === '' ? null : formData.phone,
    };
    try {
      await axios.post(USER_ENDPOINTS.CREATE_ROOT_USER, parsedData);
      toast.success('Tạo tài khoản thành công!');
      // Reset form after successful submission
      setFormData({
        email: '',
        phone: '',
        password: '',
        role: 'manager',
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Tạo tài khoản thất bại.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Tạo tài khoản mới</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Địa chỉ Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Số điện thoại
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Vai trò <span className="text-red-500">*</span>
            </label>
            <select
              id="role"
              name="role"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.role}
              onChange={handleInputChange}
            >
              <option value="root">Quản trị hệ thống (root)</option>
              <option value="manager">Quản lý (manager)</option>
              <option value="teacher">Giáo viên (teacher)</option>
            </select>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Đang tạo...' : 'Tạo tài khoản'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser; 