import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../slices/modalSlice';
import { createCourseThunk, updateCourseThunk } from '../thunks/courseThunks';

const CourseModal = () => {
  const dispatch = useDispatch();
  const { type, data } = useSelector((state) => state.modal);
  const selectedCourse = data?.course;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    thumbnail: null,
    is_active: true,
  });

  useEffect(() => {
    if (selectedCourse && type === 'edit') {
      setFormData({
        name: selectedCourse.name || '',
        description: selectedCourse.description || '',
        price: selectedCourse.price || '',
        duration: selectedCourse.duration || '',
        thumbnail: null,
        is_active: selectedCourse.is_active || false,
      });
    }
  }, [selectedCourse, type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Parse các trường không bắt buộc: nếu là chuỗi rỗng thì chuyển thành null
    const parsedData = {
      ...formData,
      description: formData.description.trim() === '' ? null : formData.description,
      price: formData.price === '' ? null : formData.price,
      duration: formData.duration === '' ? null : formData.duration,
      // thumbnail giữ nguyên vì đã là null nếu không chọn
    };
    try {
      if (type === 'edit') {
        await dispatch(updateCourseThunk({ id: selectedCourse.id, courseData: parsedData })).unwrap();
      } else {
        await dispatch(createCourseThunk(parsedData)).unwrap();
      }
      dispatch(closeModal());
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'thumbnail' && files) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          {type === 'edit' ? 'Chỉnh sửa khóa học' : 'Thêm khóa học mới'}
        </h2>
        <button
          onClick={() => dispatch(closeModal())}
          className="text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">Đóng</span>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tên khóa học <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mô tả
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Giá (VNĐ)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Thời lượng (phút)
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Trạng thái
          </label>
          <select
            name="is_active"
            value={formData.is_active}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value={true}>Đang hoạt động</option>
            <option value={false}>Không hoạt động</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Hình ảnh
          </label>
          <input
            type="file"
            name="thumbnail"
            onChange={handleChange}
            accept="image/*"
            className="mt-1 block w-full"
          />
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={() => dispatch(closeModal())}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            {type === 'edit' ? 'Cập nhật' : 'Thêm mới'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseModal; 