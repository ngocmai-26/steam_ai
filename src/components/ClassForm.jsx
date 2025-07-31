import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../slices/modalSlice';
import { createClass, updateClassThunk } from '../thunks/classThunks';
import { fetchCoursesThunk } from '../thunks/courseThunks';
import { setAlert } from '../slices/alertSlice';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import ClassService from '../services/ClassService';
import axios from '../axiosConfig';
import UserService from '../services/UserService';
import { fetchUsersByRole } from '../slices/userSlice';

const ClassForm = () => {
    const dispatch = useDispatch();
    const { type, data } = useSelector((state) => state.modal);
    const { courses } = useSelector((state) => state.course);

    const isEditing = type === 'editClass';
    const currentClass = data?.class;
    const currentCourse = data?.course;

    // Debug log để kiểm tra giá trị khi mở form
    console.log('ClassForm debug:', { type, data, isEditing, currentClass });

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        course: '',
        teacher: '',
        teaching_assistant: '',
        max_students: '',
        start_date: null,
        end_date: null,
        schedule: '',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const teachers = useSelector((state) => state.users.usersByRole?.teacher || []);

    useEffect(() => {
        if (!courses.length) {
            dispatch(fetchCoursesThunk());
        }
        // Fetch teachers (dùng chung cho cả giáo viên và trợ giảng)
        dispatch(fetchUsersByRole('teacher'));
    }, [dispatch, courses.length]);

    useEffect(() => {
        if (isEditing && currentClass) {
            setFormData({
                name: currentClass.name || '',
                description: currentClass.description || '',
                course: String(currentClass.course?.id || currentClass.course || currentCourse?.course_id || currentCourse?.id || ''),
                teacher: currentClass.teacher || '',
                teaching_assistant: currentClass.teaching_assistant || '',
                max_students: currentClass.max_students || '',
                start_date: currentClass.start_date ? new Date(currentClass.start_date) : null,
                end_date: currentClass.end_date ? new Date(currentClass.end_date) : null,
                schedule: typeof currentClass.schedule === 'string'
                    ? currentClass.schedule
                    : JSON.stringify(currentClass.schedule || {}, null, 2),
            });
        } else if (!isEditing && currentCourse) {
            setFormData(prev => ({ ...prev, course: String(currentCourse.id), }));
        }
    }, [isEditing, currentClass, currentCourse]);

    // Helper ép mọi lỗi về string
    const toStringErrors = (errs) => {
        const result = {};
        for (const key in errs) {
            result[key] = typeof errs[key] === 'string' ? errs[key] : JSON.stringify(errs[key]);
        }
        return result;
    };

    const validateForm = () => {
        const validation = ClassService.validateClassData(formData);
        setErrors(toStringErrors(validation.errors));
        return validation.isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            // Format data using service
            const formattedData = ClassService.formatClassData(formData);
            if (isEditing) {
                console.log("isEditing", isEditing)
                console.log("formattedData", formattedData)
                console.log("currentClass", currentClass)
                await dispatch(updateClassThunk({ id: currentClass.id, classData: formattedData })).unwrap();
            } else {
                await dispatch(createClass(formattedData)).unwrap();
            }

            dispatch(fetchCoursesThunk()); // Refresh courses to show updated class counts
            dispatch(closeModal());
        } catch (error) {
            console.error('Failed to save class:', error);
            dispatch(setAlert({ message: 'Có lỗi xảy ra khi lưu lớp học', type: 'error' }));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log("name", name)
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    console.log('Teachers:', teachers);

    return (
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl max-w-2xl mx-auto shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {isEditing ? 'Chỉnh sửa lớp học' : 'Thêm lớp học mới'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Khóa học <span className="text-red-500">*</span></label>
                    <select
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-lg px-3 py-2 shadow-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100 border border-gray-400 ${errors.course ? 'border-red-300' : 'border-gray-300'
                            }`}
                        required
                        disabled={isEditing || !!currentCourse}
                    >
                        <option value="">Chọn khóa học</option>
                        {courses.map(courseItem => (
                            <option key={courseItem.id} value={String(courseItem.id)}>
                                {courseItem.name}
                            </option>
                        ))}
                    </select>
                    {errors.course && <p className="mt-1 text-sm text-red-600">{String(errors.course)}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tên lớp học <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className={`mt-1 block w-full rounded-lg px-3 py-2 shadow-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100 border border-gray-400 ${errors.name ? 'border-red-300' : 'border-gray-300'
                                }`}
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{String(errors.name)}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Số học viên tối đa</label>
                        <input
                            type="number"
                            name="max_students"
                            value={formData.max_students}
                            onChange={handleChange}
                            min="1"
                            className={`mt-1 block w-full rounded-lg px-3 py-2 shadow-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100 border border-gray-400 ${errors.max_students ? 'border-red-300' : 'border-gray-300'
                                }`}
                        />
                        {errors.max_students && <p className="mt-1 text-sm text-red-600">{String(errors.max_students)}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                        className="mt-1 block w-full rounded-lg px-3 py-2 shadow-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100 border border-gray-400"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Giáo viên</label>
                        <select
                            name="teacher"
                            value={formData.teacher}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-lg px-3 py-2 shadow-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100 border border-gray-400"
                            required
                        >
                            <option value="">Chọn giáo viên</option>
                            {teachers.map(t => (
                                <option key={t.id} value={String(t.id)}>
                                    {[
                                        typeof t.name === 'string' ? t.name : null,
                                        typeof t.email === 'string' ? t.email : null
                                    ].filter(Boolean).join(' - ') || String(t.id)}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Trợ giảng</label>
                        <select
                            name="teaching_assistant"
                            value={formData.teaching_assistant}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-lg px-3 py-2 shadow-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100 border border-gray-400"
                        >
                            <option value="">Chọn trợ giảng</option>
                            {teachers.map(t => (
                                <option key={t.id} value={String(t.id)}>
                                    {[
                                        typeof t.name === 'string' ? t.name : null,
                                        typeof t.email === 'string' ? t.email : null
                                    ].filter(Boolean).join(' - ') || String(t.id)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ngày bắt đầu <span className="text-red-500">*</span></label>
                        <DatePicker
                            selected={formData.start_date}
                            onChange={(date) => setFormData(prev => ({ ...prev, start_date: date }))}
                            className="mt-1 block w-full rounded-lg px-3 py-2 shadow-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100 border border-gray-400"
                            dateFormat="dd/MM/yyyy"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ngày kết thúc <span className="text-red-500">*</span></label>
                        <DatePicker
                            selected={formData.end_date}
                            onChange={(date) => setFormData(prev => ({ ...prev, end_date: date }))}
                            className="mt-1 block w-full rounded-lg px-3 py-2 shadow-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100 border border-gray-400"
                            dateFormat="dd/MM/yyyy"
                            minDate={formData.start_date}
                            required
                        />
                        {errors.end_date && <p className="mt-1 text-sm text-red-600">{String(errors.end_date)}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Lịch học (JSON)</label>
                    <textarea
                        name="schedule"
                        value={formData.schedule}
                        onChange={handleChange}
                        rows="3"
                        className={`mt-1 block w-full rounded-lg px-3 py-2 shadow-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100 font-mono text-sm border border-gray-400 ${errors.schedule ? 'border-red-300' : 'border-gray-300'
                            }`}
                        placeholder='{"monday": "18:30-20:30", "wednesday": "18:30-20:30"}'
                    />
                    {errors.schedule && <p className="mt-1 text-sm text-red-600">{String(errors.schedule)}</p>}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={() => dispatch(closeModal())}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        disabled={isSubmitting}
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Đang lưu...' : (isEditing ? 'Cập nhật' : 'Thêm mới')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ClassForm; 