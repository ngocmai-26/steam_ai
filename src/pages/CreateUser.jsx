import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createUser, updateUser, clearError } from '../slices/userSlice';
import { HiEye, HiEyeOff } from 'react-icons/hi';

const CreateUser = ({ onSuccess, user, mode = 'create' }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.users);
  const currentUser = useSelector((state) => state.auth.user);
  const isEditMode = mode === 'edit';
  
  // Kiểm tra quyền của user hiện tại
  const isAdminOrRoot = currentUser && (currentUser.role === 'admin' || currentUser.role === 'root');

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    role: 'manager',
    name: '',
    status: 'activated',
    staff_id: '',
    birth_date: '',
    gender: 'male'
  });

  const [showPassword, setShowPassword] = useState(false);

  // Load user data khi edit mode
  useEffect(() => {
    if (isEditMode && user) {
      setFormData({
        email: user.email || '',
        phone: user.phone || '',
        password: '', // Không hiển thị password cũ
        role: user.role || 'manager',
        name: user.name || '',
        status: user.status || 'activated',
        staff_id: user.staff_id || '',
        birth_date: user.birth_date || '',
        gender: user.gender || 'male'
      });
    }
  }, [isEditMode, user]);

  // Hiển thị error toast nếu có
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditMode) {
      // Cho edit mode, chỉ gửi các trường có thay đổi
      const updateData = {};
      
      if (isAdminOrRoot) {
        // Admin/Root chỉ được sửa: email, status, staff_id
        if (formData.email !== user.email) {
          updateData.email = [formData.email]; // API expects array of emails
        }
        
        if (formData.status !== user.status) {
          updateData.status = formData.status;
        }
        
        if (formData.staff_id !== (user.staff_id || '')) {
          updateData.staff_id = formData.staff_id.trim() === '' ? null : formData.staff_id;
        }
      } else {
        // User khác có thể sửa tất cả trường
        if (formData.name !== user.name) {
          updateData.name = formData.name;
        }
        
        if (formData.email !== user.email) {
          updateData.email = [formData.email]; // API expects array of emails
        }
        
        if (formData.phone !== (user.phone || '')) {
          updateData.phone = formData.phone.trim() === '' ? null : formData.phone;
        }
        
        if (formData.status !== user.status) {
          updateData.status = formData.status;
        }
        
        if (formData.staff_id !== (user.staff_id || '')) {
          updateData.staff_id = formData.staff_id.trim() === '' ? null : formData.staff_id;
        }
        
        if (formData.birth_date !== (user.birth_date || '')) {
          updateData.birth_date = formData.birth_date || null;
        }
        
        if (formData.gender !== (user.gender || 'male')) {
          updateData.gender = formData.gender;
        }
      }

      // Chỉ gửi request nếu có ít nhất 1 trường thay đổi
      if (Object.keys(updateData).length === 0) {
        toast.info('Không có thay đổi nào để cập nhật');
        if (onSuccess) onSuccess();
        return;
      }

      try {
        await dispatch(updateUser({ id: user.id, userData: updateData })).unwrap();
        toast.success('Cập nhật tài khoản thành công!');
        if (onSuccess) onSuccess();
      } catch (error) {
        console.error('Update user error:', error);
      }
    } else {
      // Cho create mode, gửi đầy đủ dữ liệu bao gồm password và role
      const createData = {
        email: formData.email,
        phone: formData.phone.trim() === '' ? null : formData.phone,
        password: formData.password,
        role: formData.role,
        name: formData.name,
        status: formData.status
      };

      try {
        await dispatch(createUser(createData)).unwrap();
        toast.success('Tạo tài khoản thành công!');
        
        // Reset form after successful submission
        setFormData({
          email: '',
          phone: '',
          password: '',
          role: 'manager',
          name: '',
          status: 'activated',
          staff_id: '',
          birth_date: '',
          gender: 'male'
        });

        if (onSuccess) onSuccess();
      } catch (error) {
        console.error('Create user error:', error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {isEditMode ? 'Chỉnh sửa tài khoản' : 'Tạo tài khoản mới'}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {(!isEditMode || !isAdminOrRoot) && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Tên <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
          )}
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
          {(!isEditMode || !isAdminOrRoot) && (
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
          )}
          {!isEditMode && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <HiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <HiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          )}
          {!isEditMode && (
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
          )}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Trạng thái <span className="text-red-500">*</span>
            </label>
            <select
              id="status"
              name="status"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="activated">Đã kích hoạt</option>
              <option value="blocked">Đã khóa</option>
              <option value="unverified">Chưa xác thực</option>
            </select>
          </div>
          {isEditMode && !isAdminOrRoot && (
            <>
              <div>
                <label htmlFor="staff_id" className="block text-sm font-medium text-gray-700">
                  Mã nhân viên <span className="text-red-500">*</span>
                </label>
                <input
                  id="staff_id"
                  name="staff_id"
                  type="text"
                  placeholder="Nhập mã nhân viên"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.staff_id}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700">
                  Ngày sinh <span className="text-gray-500">(tùy chọn)</span>
                </label>
                <input
                  id="birth_date"
                  name="birth_date"
                  type="date"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.birth_date}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Giới tính <span className="text-red-500">*</span>
                </label>
                <select
                  id="gender"
                  name="gender"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>
            </>
          )}
          
          {isEditMode && isAdminOrRoot && (
            <div>
              <label htmlFor="staff_id" className="block text-sm font-medium text-gray-700">
                Mã nhân viên <span className="text-red-500">*</span>
              </label>
              <input
                id="staff_id"
                name="staff_id"
                type="text"
                placeholder="Nhập mã nhân viên"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.staff_id}
                onChange={handleInputChange}
              />
            </div>
          )}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Đang xử lý...' : (isEditMode ? 'Cập nhật tài khoản' : 'Tạo tài khoản')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser; 