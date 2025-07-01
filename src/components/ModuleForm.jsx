import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../slices/modalSlice';
import { createModuleThunk, updateModuleThunk } from '../thunks/moduleThunks';
import { fetchClasses } from '../thunks/classThunks';

const ModuleForm = () => {
    const dispatch = useDispatch();
    const { type, data } = useSelector((state) => state.modal);
    const { classes } = useSelector((state) => state.class);
    
    const isEditing = type === 'editModule';
    const currentModule = data?.module;

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        class_room: '',
        sequence_number: '',
        total_lessons: '',
        lesson_names: '',
    });
    
    useEffect(() => {
        dispatch(fetchClasses());
    }, [dispatch]);

    useEffect(() => {
        if (isEditing && currentModule) {
            setFormData({
                name: currentModule.name || '',
                description: currentModule.description || '',
                class_room: currentModule.class_room?.id || currentModule.class_room || '',
                sequence_number: currentModule.sequence_number || '',
                total_lessons: currentModule.total_lessons || '',
                lesson_names: Array.isArray(currentModule.lesson_names) 
                    ? currentModule.lesson_names.join(', ') 
                    : currentModule.lesson_names || '',
            });
        }
    }, [isEditing, currentModule]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const payload = {
            ...formData,
            description: formData.description.trim() === '' ? null : formData.description,
            lesson_names: formData.lesson_names.trim() === '' ? null : formData.lesson_names.split(',').map(name => name.trim()).filter(name => name),
        };

        try {
            if (isEditing) {
                await dispatch(updateModuleThunk({ id: currentModule.id, moduleData: payload })).unwrap();
            } else {
                await dispatch(createModuleThunk(payload)).unwrap();
            }
            dispatch(closeModal());
        } catch (error) {
            console.error('Failed to save module:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-white p-6 rounded-lg max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {isEditing ? 'Chỉnh sửa học phần' : 'Thêm học phần mới'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Lớp học <span className="text-red-500">*</span></label>
                    <select
                        name="class_room"
                        value={formData.class_room}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                        disabled={isEditing}
                    >
                        <option value="">Chọn lớp học</option>
                        {classes.map(classItem => (
                            <option key={classItem.id} value={classItem.id}>
                                {classItem.name}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tên học phần <span className="text-red-500">*</span></label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Thứ tự <span className="text-red-500">*</span></label>
                        <input type="number" name="sequence_number" value={formData.sequence_number} onChange={handleChange} min="1" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tổng số buổi học <span className="text-red-500">*</span></label>
                        <input type="number" name="total_lessons" value={formData.total_lessons} onChange={handleChange} min="1" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Tên các buổi học (cách nhau bởi dấu phẩy)</label>
                    <input
                        type="text"
                        name="lesson_names"
                        value={formData.lesson_names}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        placeholder="Buổi 1: Giới thiệu, Buổi 2: ABC,..."
                    />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
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
                        {isEditing ? 'Cập nhật' : 'Lưu'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ModuleForm; 