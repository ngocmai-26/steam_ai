import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addStudentAsync, updateStudentAsync } from '../slices/studentSlice';
import { closeModal, openModal } from '../slices/modalSlice';

const StudentForm = ({ type, onSuccess }) => {
  const dispatch = useDispatch();
  const currentStudent = useSelector(state => state.student.currentStudent);
  const isEditing = type === 'editStudent';

  const [formData, setFormData] = useState({
    identification_number: '',
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: 'male',
    address: '',
    phone_number: '',
    email: '',
    parent_name: '',
    parent_phone: '',
    parent_email: '',
    note: '',
    avatar_url: '',
    is_active: true
  });

  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    if (isEditing && currentStudent) {
      setFormData({
        identification_number: currentStudent.identification_number || '',
        first_name: currentStudent.first_name || '',
        last_name: currentStudent.last_name || '',
        date_of_birth: currentStudent.date_of_birth || '',
        gender: currentStudent.gender || 'male',
        address: currentStudent.address || '',
        phone_number: currentStudent.phone_number || '',
        email: currentStudent.email || '',
        parent_name: currentStudent.parent_name || '',
        parent_phone: currentStudent.parent_phone || '',
        parent_email: currentStudent.parent_email || '',
        note: currentStudent.note || '',
        avatar_url: currentStudent.avatar_url || '',
        is_active: currentStudent.is_active ?? true
      });
    }
  }, [isEditing, currentStudent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let submitData = { ...formData };
      // Nếu có file avatar, gửi dưới dạng FormData
      if (avatarFile) {
        const fd = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          fd.append(key, value);
        });
        fd.append('avatar', avatarFile);
        submitData = fd;
      }
      if (isEditing) {
        await dispatch(updateStudentAsync({ id: currentStudent.id, studentData: submitData })).unwrap();
      } else {
        await dispatch(addStudentAsync(submitData)).unwrap();
      }
      dispatch(closeModal());
      if (onSuccess) {
        onSuccess(formData);
      }
    } catch (error) {
      console.error('Failed to save student:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          avatar_url: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl max-w-3xl mx-auto shadow-lg">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
        {isEditing ? 'Chỉnh sửa thông tin học viên' : 'Thêm học viên mới'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Mã học viên */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mã học viên <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="identification_number"
              value={formData.identification_number}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100 px-3 py-2 bg-white"
              required
            />
          </div>
          {/* Ảnh đại diện */}
          <div className="flex flex-col items-start sm:items-end">
            <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh đại diện</label>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-300 rounded-lg"
            />
            {formData.avatar_url && (
              <img
                src={formData.avatar_url}
                alt="Avatar preview"
                className="mt-2 h-20 w-20 object-cover rounded-full mx-auto sm:mx-0 border border-gray-200 shadow"
              />
            )}
          </div>
          {/* Họ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Họ <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100 px-3 py-2 bg-white"
              required
            />
          </div>
          {/* Tên */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100 px-3 py-2 bg-white"
              required
            />
          </div>
          {/* Ngày sinh */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh <span className="text-red-500">*</span></label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100 px-3 py-2 bg-white"
              required
            />
          </div>
          {/* Giới tính */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính <span className="text-red-500">*</span></label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100 px-3 py-2 bg-white"
            >
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>
          {/* Địa chỉ */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100 px-3 py-2 bg-white"
            />
          </div>
          {/* Số điện thoại */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100 px-3 py-2 bg-white"
            />
          </div>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100 px-3 py-2 bg-white"
            />
          </div>
          {/* Tên phụ huynh */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên phụ huynh <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="parent_name"
              value={formData.parent_name}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100 px-3 py-2 bg-white"
            />
          </div>
          {/* Số điện thoại phụ huynh */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại phụ huynh <span className="text-red-500">*</span></label>
            <input
              type="tel"
              name="parent_phone"
              value={formData.parent_phone}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100 px-3 py-2 bg-white"
            />
          </div>
          {/* Email phụ huynh */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email phụ huynh</label>
            <input
              type="email"
              name="parent_email"
              value={formData.parent_email}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100 px-3 py-2 bg-white"
            />
          </div>
          {/* Ghi chú */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              rows="3"
              className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100 px-3 py-2 bg-white"
            />
          </div>
          {/* Đang hoạt động */}
          <div className="sm:col-span-2 flex items-center mt-2">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">Đang hoạt động</label>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 sm:pt-6">
          <button
            type="button"
            onClick={() => dispatch(closeModal())}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isEditing ? 'Cập nhật' : 'Thêm mới và đăng ký lớp'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm; 