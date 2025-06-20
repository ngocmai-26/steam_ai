import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal, addLesson, updateLesson } from '../slices/courseSlice';

const ModuleModal = () => {
  const dispatch = useDispatch();
  const currentCourse = useSelector(state => state.course.currentCourse);
  const currentClass = useSelector(state => state.course.currentClass);
  const currentLesson = useSelector(state => state.course.currentLesson);
  const modalType = useSelector(state => state.modal.type);
  const isEditing = modalType === 'editModule';

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sequence_number: 1,
    duration: 60,
    type: 'Lý thuyết',
    objectives: '',
    requirements: '',
    lesson_names: [''],
    materials: []
  });

  useEffect(() => {
    if (isEditing && currentLesson) {
      setFormData({
        name: currentLesson.name || '',
        description: currentLesson.description || '',
        sequence_number: currentLesson.sequence_number || 1,
        duration: currentLesson.duration || 60,
        type: currentLesson.type || 'Lý thuyết',
        objectives: currentLesson.objectives || '',
        requirements: currentLesson.requirements || '',
        lesson_names: currentLesson.lesson_names || [''],
        materials: currentLesson.materials || []
      });
    }
  }, [isEditing, currentLesson]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const lessonData = {
      ...formData,
      id: isEditing ? currentLesson.id : Date.now().toString(),
      course_id: currentCourse.id,
      class_id: currentClass.id,
      status: 'active'
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

  const handleMaterialChange = (index, field, value) => {
    setFormData(prev => {
      const newMaterials = [...prev.materials];
      newMaterials[index] = {
        ...newMaterials[index],
        [field]: value
      };
      return {
        ...prev,
        materials: newMaterials
      };
    });
  };

  const addMaterial = () => {
    setFormData(prev => ({
      ...prev,
      materials: [...prev.materials, { name: '', type: 'slide', url: '' }]
    }));
  };

  const removeMaterial = (index) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isEditing ? 'Chỉnh sửa học phần' : 'Thêm học phần mới'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
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
                min="1"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thời lượng (phút)
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="0"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại học phần
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Lý thuyết">Lý thuyết</option>
              <option value="Thực hành">Thực hành</option>
              <option value="Bài tập">Bài tập</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mục tiêu
            </label>
            <textarea
              name="objectives"
              value={formData.objectives}
              onChange={handleChange}
              rows="2"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Yêu cầu
            </label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows="2"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Danh sách Học Phần
              </label>
              <button
                type="button"
                onClick={addLessonName}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Thêm Học Phần
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

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Tài liệu học tập
              </label>
              <button
                type="button"
                onClick={addMaterial}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Thêm tài liệu
              </button>
            </div>
            <div className="space-y-4">
              {formData.materials.map((material, index) => (
                <div key={index} className="grid grid-cols-3 gap-2 items-start">
                  <div>
                    <input
                      type="text"
                      value={material.name}
                      onChange={(e) => handleMaterialChange(index, 'name', e.target.value)}
                      placeholder="Tên tài liệu"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <select
                      value={material.type}
                      onChange={(e) => handleMaterialChange(index, 'type', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="slide">Slide</option>
                      <option value="document">Tài liệu</option>
                      <option value="code">Code mẫu</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={material.url}
                      onChange={(e) => handleMaterialChange(index, 'url', e.target.value)}
                      placeholder="URL tài liệu"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeMaterial(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
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

export default ModuleModal; 