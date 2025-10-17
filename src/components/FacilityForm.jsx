import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { createFacility, updateFacility } from '../slices/facilitySlice';

const FacilityForm = ({ facility, mode, onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const isEditMode = mode === 'edit';

  useEffect(() => {
    if (isEditMode && facility) {
      setFormData({
        name: facility.name || '',
        description: facility.description || ''
      });
    }
  }, [isEditMode, facility]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên cơ sở vật chất');
      return;
    }

    setLoading(true);
    try {
      if (isEditMode) {
        await dispatch(updateFacility({ 
          id: facility.id, 
          facilityData: formData 
        })).unwrap();
        toast.success('Cập nhật cơ sở vật chất thành công');
      } else {
        await dispatch(createFacility(formData)).unwrap();
        toast.success('Tạo cơ sở vật chất thành công');
      }
      onSuccess();
    } catch (error) {
      toast.error(error || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Tên cơ sở vật chất <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Nhập tên cơ sở vật chất"
          value={formData.name}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Mô tả
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Nhập mô tả cơ sở vật chất"
          value={formData.description}
          onChange={handleInputChange}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          disabled={loading}
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Đang xử lý...' : (isEditMode ? 'Cập nhật' : 'Tạo mới')}
        </button>
      </div>
    </form>
  );
};

export default FacilityForm;
