import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal, addLesson, updateLesson } from '../slices/courseSlice';

const LessonForm = ({ type }) => {
  const dispatch = useDispatch();
  const currentCourse = useSelector(state => state.course.currentCourse);
  const currentClass = useSelector(state => state.course.currentClass);
  const currentLesson = useSelector(state => state.course.currentLesson);
  const isEditing = type === 'editLesson';

  const [formData, setFormData] = useState({
    class_room: 0,
    name: '',
    description: '',
    sequence_number: 0,
    total_lessons: 0,
    lesson_names: [''] // Initialize with one empty lesson name
  });

  useEffect(() => {
    if (isEditing && currentLesson) {
      setFormData({
        class_room: currentLesson.class_room || 0,
        name: currentLesson.name || '',
        description: currentLesson.description || '',
        sequence_number: currentLesson.sequence_number || 0,
        total_lessons: currentLesson.total_lessons || 0,
        lesson_names: currentLesson.lesson_names || ['']
      });
    }
  }, [isEditing, currentLesson]);

  // Đồng bộ lesson_names với total_lessons
  useEffect(() => {
    const total = parseInt(formData.total_lessons) || 0;
    setFormData(prev => {
      let lesson_names = prev.lesson_names.slice(0, total);
      while (lesson_names.length < total) lesson_names.push('');
      return { ...prev, lesson_names };
    });
    // eslint-disable-next-line
  }, [formData.total_lessons]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentCourse || !currentClass) {
      alert('Vui lòng chọn khóa học và lớp học!');
      return;
    }
    
    const lessonData = {
      ...formData,
      id: isEditing ? currentLesson.id : Date.now().toString(),
      class_room: parseInt(formData.class_room),
      sequence_number: parseInt(formData.sequence_number),
      total_lessons: parseInt(formData.total_lessons),
      lesson_names: formData.lesson_names.filter(name => name.trim() !== '') // Remove empty names
    };

    if (isEditing) {
      dispatch(updateLesson({
        courseId: currentCourse.id,
        classId: currentClass.id,
        lessonData
      }));
    } else {
      dispatch(addLesson({
        courseId: currentCourse.id,
        classId: currentClass.id,
        lessonData
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

  const handleLessonNameChange = (index, value) => {
    setFormData(prev => {
      const newLessonNames = [...prev.lesson_names];
      newLessonNames[index] = value;
      return {
        ...prev,
        lesson_names: newLessonNames
      };
    });
  };

  const addLessonName = () => {
    setFormData(prev => ({
      ...prev,
      lesson_names: [...prev.lesson_names, '']
    }));
  };

  const removeLessonName = (index) => {
    setFormData(prev => ({
      ...prev,
      lesson_names: prev.lesson_names.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isEditing ? 'Chỉnh sửa học phần' : 'Thêm học phần mới'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên học phần
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
                Phòng học
              </label>
              <input
                type="number"
                name="class_room"
                value={formData.class_room}
                onChange={handleChange}
                min="0"
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số thứ tự
              </label>
              <input
                type="number"
                name="sequence_number"
                value={formData.sequence_number}
                onChange={handleChange}
                min="0"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tổng số Bài học
              </label>
              <input
                type="number"
                name="total_lessons"
                value={formData.total_lessons}
                onChange={handleChange}
                min="0"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Danh sách Bài học
              </label>
              <button
                type="button"
                onClick={addLessonName}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Thêm Bài học
              </button>
            </div>
            <div className="space-y-2">
              {formData.lesson_names.map((name, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleLessonNameChange(index, e.target.value)}
                    placeholder={`Tên Học Phần ${index + 1}`}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {formData.lesson_names.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLessonName(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
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

export default LessonForm;