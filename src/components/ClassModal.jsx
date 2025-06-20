import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../slices/modalSlice';
import { createClass, updateClassThunk } from '../thunks/courseThunks';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const ClassModal = () => {
  const dispatch = useDispatch();
  const { type, data } = useSelector((state) => state.modal);
  const currentClass = data?.class;
  const currentCourse = data?.course;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    thumbnail: null,
    teacher: '',
    teaching_assistant: '',
    max_students: '',
    start_date: null,
    end_date: null,
    schedule: '',
    course_id: '',
  });

  useEffect(() => {
    if (currentClass && type === 'editClass') {
      setFormData({
        name: currentClass.name || '',
        description: currentClass.description || '',
        thumbnail: currentClass.thumbnail || null,
        teacher: currentClass.teacher || '',
        teaching_assistant: currentClass.teaching_assistant || '',
        max_students: currentClass.max_students || '',
        start_date: currentClass.start_date ? new Date(currentClass.start_date) : null,
        end_date: currentClass.end_date ? new Date(currentClass.end_date) : null,
        schedule: typeof currentClass.schedule === 'string' ? currentClass.schedule : JSON.stringify(currentClass.schedule, null, 2),
        course_id: currentClass.course_id || '',
      });
    } else if (currentCourse && type === 'addClass') {
      setFormData(prev => ({
        ...prev,
        course_id: currentCourse.id
      }));
    }
  }, [currentClass, currentCourse, type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      start_date: formData.start_date?.toISOString().split('T')[0],
      end_date: formData.end_date?.toISOString().split('T')[0],
      schedule: formData.schedule ? JSON.parse(formData.schedule) : {},
    };

    try {
      if (type === 'editClass') {
        await dispatch(updateClassThunk({ id: currentClass.id, classData: payload })).unwrap();
      } else {
        await dispatch(createClass({ courseId: formData.course_id, classData: payload })).unwrap();
      }
      dispatch(closeModal());
    } catch (error) {
      console.error('Error saving class:', error);
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
          {type === 'editClass' ? 'Chỉnh sửa lớp học' : 'Thêm lớp học mới'}
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
            Tên lớp học <span className="text-red-500">*</span>
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
            Giáo viên <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="teacher"
            value={formData.teacher}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Trợ giảng
          </label>
          <input
            type="text"
            name="teaching_assistant"
            value={formData.teaching_assistant}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Số học sinh tối đa
          </label>
          <input
            type="number"
            name="max_students"
            value={formData.max_students}
            onChange={handleChange}
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ngày bắt đầu
            </label>
            <DatePicker
              selected={formData.start_date}
              onChange={(date) => setFormData(prev => ({ ...prev, start_date: date }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              dateFormat="dd/MM/yyyy"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ngày kết thúc
            </label>
            <DatePicker
              selected={formData.end_date}
              onChange={(date) => setFormData(prev => ({ ...prev, end_date: date }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              dateFormat="dd/MM/yyyy"
              minDate={formData.start_date}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Lịch học (JSON)
          </label>
          <textarea
            name="schedule"
            value={formData.schedule}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-mono text-sm"
            placeholder='{"monday": ["8:00", "10:00"], "wednesday": ["14:00", "16:00"]}'
          />
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
            {type === 'editClass' ? 'Cập nhật' : 'Thêm mới'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClassModal; 