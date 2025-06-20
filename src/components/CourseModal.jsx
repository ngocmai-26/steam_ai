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
    thumbnail: null,
    status: 'active'
  });

  useEffect(() => {
    if (selectedCourse && type === 'edit') {
      setFormData({
        name: selectedCourse.name || '',
        description: selectedCourse.description || '',
        thumbnail: selectedCourse.thumbnail || null,
        status: selectedCourse.status || 'active'
      });
    }
  }, [selectedCourse, type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (type === 'edit') {
        await dispatch(updateCourseThunk({ id: selectedCourse.id, courseData: formData })).unwrap();
      } else {
        await dispatch(createCourseThunk(formData)).unwrap();
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

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Trạng thái
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Không hoạt động</option>
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