import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../slices/courseSlice';
import { addClassToCourse, updateClassInCourse } from '../slices/courseSlice';

const ClassForm = ({ type }) => {
  const dispatch = useDispatch();
  const courses = useSelector(state => state.course.courses);
  const currentCourse = useSelector(state => state.course.currentCourse);
  const currentClass = useSelector(state => state.course.currentClass);
  const isEditing = type === 'editClass';

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    thumbnail: null,
    course: '',
    teacher: '',
    teaching_assistant: '',
    max_students: 30,
    start_date: '',
    end_date: '',
    schedule: ''
  });

  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  useEffect(() => {
    if (currentCourse) {
      setFormData(prev => ({
        ...prev,
        course: currentCourse.id
      }));
    }

    if (isEditing && currentClass) {
      setFormData({
        name: currentClass.name || '',
        description: currentClass.description || '',
        thumbnail: currentClass.thumbnail || null,
        course: currentCourse?.id || '',
        teacher: currentClass.teacher || '',
        teaching_assistant: currentClass.teaching_assistant || '',
        max_students: currentClass.max_students || 30,
        start_date: currentClass.start_date || '',
        end_date: currentClass.end_date || '',
        schedule: currentClass.schedule || ''
      });

      if (currentClass.thumbnail) {
        setThumbnailPreview(currentClass.thumbnail);
      }
    }
  }, [isEditing, currentClass, currentCourse]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const classData = {
      ...formData,
      id: isEditing ? currentClass.id : Date.now().toString(),
      course: parseInt(formData.course),
      teacher: formData.teacher ? parseInt(formData.teacher) : null,
      teaching_assistant: formData.teaching_assistant ? parseInt(formData.teaching_assistant) : null,
      max_students: parseInt(formData.max_students)
    };

    if (isEditing) {
      dispatch(updateClassInCourse({
        courseId: formData.course,
        classData
      }));
    } else {
      dispatch(addClassToCourse({
        courseId: formData.course,
        classData
      }));
    }

    dispatch(closeModal());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        thumbnail: file
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isEditing ? 'Chỉnh sửa lớp học' : 'Thêm lớp học mới'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Khóa học
            </label>
            <select
              name="course"
              value={formData.course}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              disabled={isEditing}
            >
              <option value="">Chọn khóa học</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên lớp học
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số học viên tối đa
              </label>
              <input
                type="number"
                name="max_students"
                value={formData.max_students}
                onChange={handleChange}
                min="1"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ảnh đại diện
            </label>
            <div className="mt-1 flex items-center space-x-4">
              <input
                type="file"
                name="thumbnail"
                onChange={handleFileChange}
                accept="image/*"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {thumbnailPreview && (
                <img 
                  src={thumbnailPreview} 
                  alt="Thumbnail preview" 
                  className="h-20 w-20 object-cover rounded-md"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giáo viên
              </label>
              <input
                type="number"
                name="teacher"
                value={formData.teacher}
                onChange={handleChange}
                min="1"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trợ giảng
              </label>
              <input
                type="number"
                name="teaching_assistant"
                value={formData.teaching_assistant}
                onChange={handleChange}
                min="1"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày bắt đầu
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày kết thúc
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lịch học (JSON)
            </label>
            <textarea
              name="schedule"
              value={formData.schedule}
              onChange={handleChange}
              rows="3"
              placeholder='Ví dụ: {"monday": "18:30-20:30", "wednesday": "18:30-20:30", "friday": "18:30-20:30"}'
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6">
          <button
            type="button"
            onClick={() => dispatch(closeModal())}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isEditing ? 'Cập nhật' : 'Thêm mới'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClassForm; 