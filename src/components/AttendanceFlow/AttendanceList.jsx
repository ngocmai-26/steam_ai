import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AttendanceService from '../../services/AttendanceService';
import { useSelector } from 'react-redux';
import { ButtonAction } from '../Table';

const AttendanceList = () => {
    const navigate = useNavigate();
    const [attendances, setAttendances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [detail, setDetail] = useState(null);
    const [showDetailId, setShowDetailId] = useState(null);
    const user = useSelector(state => state.auth.user);

    useEffect(() => {
        const fetchAttendances = async () => {
            setLoading(true);
            try {
                const data = await AttendanceService.getAttendances();
                setAttendances(data || []);
            } catch (err) {
                setAttendances([]);
            } finally {
                setLoading(false);
            }
        };
        fetchAttendances();
    }, []);

    // Nhóm điểm danh theo class_room_name
    const grouped = attendances.reduce((acc, attendance) => {
        const className = attendance.class_room_name || 'Không rõ lớp';
        if (!acc[className]) acc[className] = [];
        acc[className].push(attendance);
        return acc;
    }, {});

    // Xem chi tiết điểm danh
    const handleShowDetail = async (attendance) => {
        setShowDetailId(attendance.id);
        setDetail(attendance);
    };

    // Đóng chi tiết
    const handleCloseDetail = () => {
        setShowDetailId(null);
        setDetail(null);
    };

    // Xóa điểm danh
    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa điểm danh này?')) return;
        try {
            await AttendanceService.deleteAttendance(id);
            setAttendances(attendances.filter(a => a.id !== id));
            handleCloseDetail();
        } catch (error) {
            console.error('Error deleting attendance:', error);
            alert('Xóa điểm danh thất bại!');
        }
    };

    // Hiển thị trạng thái điểm danh
    const getStatusDisplay = (status) => {
        switch (status) {
            case 'present':
                return { text: 'Có mặt', color: 'text-green-600', bg: 'bg-green-100' };
            case 'absent':
                return { text: 'Vắng mặt', color: 'text-red-600', bg: 'bg-red-100' };
            case 'late':
                return { text: 'Đi muộn', color: 'text-yellow-600', bg: 'bg-yellow-100' };
            default:
                return { text: 'Không rõ', color: 'text-gray-600', bg: 'bg-gray-100' };
        }
    };

    if (loading) return <div className="p-6 text-center">Đang tải điểm danh...</div>;
    if (!attendances.length) return <div className="p-6 text-center">Không có dữ liệu điểm danh nào.</div>;

    // Hiển thị chi tiết điểm danh
    if (showDetailId && detail) {
        const statusDisplay = getStatusDisplay(detail.status);
        return (
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 mt-8">
                <h2 className="text-xl font-bold mb-4">Chi tiết điểm danh</h2>
                <div className="mb-4 flex items-center space-x-4">
                    <img src={detail.student?.avatar_url} alt="avatar" className="w-12 h-12 rounded-full object-cover border" />
                    <div>
                        <div className="font-semibold">{detail.student?.first_name} {detail.student?.last_name}</div>
                        <div className="text-sm text-gray-500">Mã SV: {detail.student?.identification_number}</div>
                    </div>
                </div>
                <div className="mb-2"><b>Lớp:</b> {detail.class_room_name}</div>
                <div className="mb-2"><b>Học phần:</b> {detail.module_name}</div>
                <div className="mb-2"><b>Buổi học:</b> {detail.lesson?.name || detail.lesson_name || ''}</div>
                <div className="mb-2">
                    <b>Trạng thái:</b>
                    <span className={`ml-2 px-2 py-1 rounded-full text-sm font-medium ${statusDisplay.bg} ${statusDisplay.color}`}>
                        {statusDisplay.text}
                    </span>
                </div>
                <div className="mb-2"><b>Ghi chú:</b> {detail.note || 'Không có'}</div>
                <div className="mb-2"><b>Ngày:</b> {detail.date}</div>
                <div className="flex space-x-3">
                    <button onClick={handleCloseDetail} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Đóng</button>
                    <button onClick={() => navigate(`/attendance/edit/${detail.id}`)} className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700">Chỉnh sửa</button>
                    {user?.role === 'manager' && (
                        <button onClick={() => handleDelete(detail.id)} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">Xóa</button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {Object.entries(grouped).map(([className, atts]) => (
                <div key={className} className="mb-8">
                    <h2 className="text-lg font-bold text-indigo-700 mb-2">{className}</h2>
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã SV</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Học viên</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avatar</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buổi học</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ghi chú</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {atts.map(attendance => {
                                    const statusDisplay = getStatusDisplay(attendance.status);
                                    return (
                                        <tr key={attendance.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{attendance.student?.identification_number}</td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{attendance.student?.first_name} {attendance.student?.last_name}</td>
                                            <td className="px-4 py-2 whitespace-nowrap">
                                                <img src={attendance.student?.avatar_url} alt="avatar" className="w-8 h-8 rounded-full object-cover border" />
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{attendance.lesson?.name || attendance.lesson_name || ''}</td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{attendance.date || ''}</td>
                                            <td className="px-4 py-2 whitespace-nowrap">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusDisplay.bg} ${statusDisplay.color}`}>
                                                    {statusDisplay.text}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{attendance.note || ''}</td>
                                            <td className="px-4 py-2 whitespace-nowrap">
                                                <div className="flex flex-row items-center justify-center space-x-2">
                                                    <ButtonAction color="indigo" onClick={() => handleShowDetail(attendance)}>
                                                        <span className="sm:hidden">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
                                                        </span>
                                                        <span className="hidden sm:inline">Chi tiết</span>
                                                    </ButtonAction>
                                                    <ButtonAction color="blue" onClick={() => navigate(`/attendance/edit/${attendance.id}`)}>
                                                        <span className="sm:hidden">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3h3z" /></svg>
                                                        </span>
                                                        <span className="hidden sm:inline">Sửa</span>
                                                    </ButtonAction>
                                                    {user?.role === 'manager' && (
                                                        <ButtonAction color="red" onClick={() => handleDelete(attendance.id)}>
                                                            <span className="sm:hidden">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                            </span>
                                                            <span className="hidden sm:inline">Xóa</span>
                                                        </ButtonAction>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AttendanceList; 