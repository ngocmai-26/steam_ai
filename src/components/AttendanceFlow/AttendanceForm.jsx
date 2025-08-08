import React, { useState, useEffect } from 'react';
import AttendanceService from '../../services/AttendanceService';

const AttendanceForm = ({ classInfo, student, module, lesson, onBack, onSubmit }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        status: 'present', // present, absent, late
        note: ''
    });

    const handleStatusChange = (status) => {
        setFormData(prev => ({
            ...prev,
            status
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            student: student?.id ?? '',
            lesson: lesson?.id ?? '',
            status: formData.status,
            note: formData.note
        };

        // Kiểm tra trước khi gửi
        if (!payload.student || !payload.lesson) {
            alert('Bạn phải chọn học viên và buổi học!');
            return;
        }

        setLoading(true);
        try {
            await AttendanceService.createAttendance(payload);
            if (onSubmit) onSubmit(payload);
        } catch (error) {
            alert('Gửi điểm danh thất bại!');
        } finally {
            setLoading(false);
        }
    };

    const attendanceOptions = [
        { value: 'present', label: 'Có mặt', color: 'green', icon: '✓' },
        { value: 'absent', label: 'Vắng mặt', color: 'red', icon: '✗' },
        { value: 'late', label: 'Đi muộn', color: 'yellow', icon: '⏰' },
        { value: 'excused', label: 'Được phép nghỉ', color: 'blue', icon: '📝' }
    ];

    const renderAttendanceOption = (option) => (
        <label
            key={option.value}
            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${formData.status === option.value
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:bg-gray-50'
                }`}
        >
            <input
                type="radio"
                name="attendance"
                value={option.value}
                checked={formData.status === option.value}
                onChange={() => handleStatusChange(option.value)}
                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
            />
            <div className="ml-3 flex items-center">
                <span className={`text-lg mr-2 ${option.color === 'green' ? 'text-green-600' :
                    option.color === 'red' ? 'text-red-600' :
                        'text-yellow-600'
                    }`}>
                    {option.icon}
                </span>
                <span className="text-sm font-medium text-gray-900">
                    {option.label}
                </span>
            </div>
        </label>
    );

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Điểm danh buổi học
            </h2>
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                {classInfo && (
                    <p className="text-gray-600">
                        <span className="font-medium">Lớp:</span> {classInfo.name}
                    </p>
                )}
                {student && (
                    <p className="text-gray-600">
                        <span className="font-medium">Học viên:</span> {student.last_name}
                    </p>
                )}
                {module && (
                    <p className="text-gray-600">
                        <span className="font-medium">Học phần:</span> {module.name}
                    </p>
                )}
                {lesson && (
                    <p className="text-gray-600">
                        <span className="font-medium">Buổi học:</span> {lesson.name}
                    </p>
                )}
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Trạng thái điểm danh</h3>
                    <div className="space-y-2">
                        {attendanceOptions.map(renderAttendanceOption)}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ghi chú (tùy chọn)
                    </label>
                    <textarea
                        name="note"
                        value={formData.note}
                        onChange={e => setFormData(prev => ({ ...prev, note: e.target.value }))}
                        rows={3}
                        className="w-full rounded-lg px-3 py-2 border-gray-400 shadow-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                        placeholder="Nhập ghi chú nếu cần..."
                    />
                </div>

                <div className="flex justify-end space-x-4">
                    {onBack && (
                        <button
                            type="button"
                            onClick={onBack}
                            disabled={loading}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            Quay lại
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {loading ? 'Đang lưu...' : 'Lưu điểm danh'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AttendanceForm; 