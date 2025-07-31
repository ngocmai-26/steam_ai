import React, { useState, useEffect } from 'react';
import AttendanceService from '../../services/AttendanceService';

const AttendanceStats = ({ classId, moduleId, lessonId, dateRange }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const params = {};
                if (classId) params.class_id = classId;
                if (moduleId) params.module_id = moduleId;
                if (lessonId) params.lesson_id = lessonId;
                if (dateRange) {
                    params.start_date = dateRange.start;
                    params.end_date = dateRange.end;
                }
                const data = await AttendanceService.getAttendanceStats(params);
                setStats(data);
            } catch (error) {
                setStats(null);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [classId, moduleId, lessonId, dateRange]);

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-20 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-500 text-center">Không có dữ liệu thống kê</p>
            </div>
        );
    }

    const attendanceRate = stats.attendance_rate || ((stats.present / stats.total) * 100).toFixed(1);

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê điểm danh</h3>

            {/* Tổng quan */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{stats.total || 0}</div>
                    <div className="text-sm text-blue-600">Tổng số</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats.present || 0}</div>
                    <div className="text-sm text-green-600">Có mặt</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{stats.absent || 0}</div>
                    <div className="text-sm text-red-600">Vắng mặt</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{stats.late || 0}</div>
                    <div className="text-sm text-yellow-600">Đi muộn</div>
                </div>
            </div>

            {/* Tỷ lệ điểm danh */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Tỷ lệ điểm danh</span>
                    <span className="text-sm font-medium text-gray-900">{attendanceRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${attendanceRate}%` }}
                    ></div>
                </div>
            </div>

            {/* Thống kê theo lớp */}
            {stats.by_class && stats.by_class.length > 0 && (
                <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Theo lớp học</h4>
                    <div className="space-y-3">
                        {stats.by_class.map((classStat, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="font-medium text-gray-700">{classStat.class_name}</span>
                                <div className="flex space-x-4 text-sm">
                                    <span className="text-green-600">✓ {classStat.present}</span>
                                    <span className="text-red-600">✗ {classStat.absent}</span>
                                    <span className="text-yellow-600">⏰ {classStat.late}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttendanceStats; 