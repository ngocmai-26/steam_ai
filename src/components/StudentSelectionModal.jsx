import React, { useState, useEffect } from 'react';
import { ClassService } from '../services/ClassService';
import { LessonService } from '../services/LessonService';
import AttendanceService from '../services/AttendanceService';
import EvaluationDetailModal from './EvaluationDetailModal';

const StudentSelectionModal = ({
    isOpen,
    onClose,
    onStudentSelect,
    lessonId,
    currentLesson,
    classInfo,
    title = "Chọn học viên để đánh giá"
}) => {
    const [students, setStudents] = useState([]);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [error, setError] = useState('');
    const [showEvaluationDetail, setShowEvaluationDetail] = useState(false);
    const [selectedEvaluation, setSelectedEvaluation] = useState(null);

    // Sử dụng danh sách học viên từ props thay vì fetch lại
    useEffect(() => {
        if (isOpen && classInfo?.students) {
            setStudents(classInfo.students);
            setLoadingStudents(false);
        }
    }, [isOpen, classInfo?.students]);

    const handleStudentClick = (student) => {
        // Không cho phép đánh giá lại học viên đã được đánh giá
        if (student.attendance?.is_evaluated) {
            return;
        }
        
        // Chỉ cho phép đánh giá học viên có mặt hoặc đi trễ
        if (student.attendance?.status === 'absent' || student.attendance?.status === 'excused') {
            return; // Không làm gì nếu học viên vắng mặt
        }

        // Chỉ gọi onStudentSelect, không đóng modal
        onStudentSelect(student);
    };

    const handleViewEvaluationDetail = (student) => {
        if (student.attendance?.evaluation) {
            setSelectedEvaluation(student.attendance.evaluation);
            setShowEvaluationDetail(true);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-2 sm:mx-4 max-h-[95vh] sm:max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh] sm:max-h-[60vh]">
                    {loadingStudents ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Đang tải danh sách học viên...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <div className="text-red-500 mb-4">⚠️</div>
                            <p className="text-red-600">{error}</p>
                        </div>
                    ) : students.length > 0 ? (
                        <div className="space-y-3">
                            {students.map((student, index) => (
                                <div
                                    key={student.id || index}
                                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3 sm:gap-0 ${
                                        student.attendance?.is_evaluated
                                        ? 'border-green-200 bg-green-50 cursor-default'
                                        : student.attendance?.status === 'absent' || student.attendance?.status === 'excused'
                                        ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                                        : 'border-gray-200 hover:bg-gray-50 cursor-pointer'                         
                                    }`}
                                    onClick={() => handleStudentClick(student)}
                                >
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                                            <span className="text-indigo-600 font-medium">
                                                {student.first_name ? student.first_name.charAt(0).toUpperCase() : 'S'}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {`${student.first_name || ''} ${student.last_name || ''}`.trim() || 'Không có tên'}
                                            </p>
                                            <div className="text-sm text-gray-500 space-y-1">
                                                <p>MSSV: {student.identification_number || 'Chưa có'}</p>
                                                <p>Email: {student.email || 'Chưa có'}</p>
                                                {student.phone_number && <p>SĐT: {student.phone_number}</p>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                                        {/* Hiển thị trạng thái đánh giá */}
                                        {student.attendance?.is_evaluated ? (
                                            <>
                                                <div className="px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-700 border border-green-200 text-center">
                                                    ✅ Đã đánh giá
                                                </div>
                                                <button
                                                    onClick={() => handleViewEvaluationDetail(student)}
                                                    className="px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200 transition-colors"
                                                >
                                                    👁️ Xem chi tiết
                                                </button>
                                            </>
                                        ) : (
                                            <button className="px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors w-full sm:w-auto">
                                                Bấm để đánh giá
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="text-4xl mb-4">👥</div>
                            <p className="text-gray-600">Không có học viên nào để đánh giá</p>
                        </div>
                    )}
                </div>

              
            </div>

            {/* Evaluation Detail Modal */}
            <EvaluationDetailModal
                isOpen={showEvaluationDetail}
                onClose={() => {
                    setShowEvaluationDetail(false);
                    setSelectedEvaluation(null);
                }}
                evaluation={selectedEvaluation}
            />
        </div>
    );
};

export default StudentSelectionModal;
