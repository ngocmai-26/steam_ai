import React, { useState, useEffect } from 'react';
import { ClassService } from '../services/ClassService';
import { LessonService } from '../services/LessonService';

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

    useEffect(() => {
        if (isOpen && lessonId && classInfo) {
            fetchStudents();
        }
    }, [isOpen, lessonId, classInfo]);

    const fetchStudents = async () => {
        setLoadingStudents(true);
        setError('');

        try {
            // Lấy thông tin lớp từ classInfo (giống như phần điểm danh)
            const classId = classInfo.id;
            if (!classId) {
                setError('Không tìm thấy thông tin lớp');
                return;
            }

            console.log(`Fetching students for class ${classId} using /back-office/classes/${classId}`);
            const detail = await ClassService.getClassById(classId);
            console.log('Class detail response:', detail);

            // Lấy danh sách học viên từ response
            const classStudents = Array.isArray(detail.data?.students)
                ? detail.data.students
                : Array.isArray(detail.students)
                    ? detail.students
                    : [];

            console.log(`Found ${classStudents.length} students in class ${classId}`);

            // Thêm thông tin lớp vào mỗi học viên
            const studentsWithClass = classStudents.map(student => ({
                ...student,
                classInfo: {
                    id: classId,
                    name: detail.data?.name || detail.name || 'Lớp không rõ'
                }
            }));

            // Kiểm tra trạng thái đánh giá cho từng học viên
            console.log('Checking evaluations for lessonId:', lessonId);
            const studentsWithEvaluationStatus = await Promise.all(
                studentsWithClass.map(async (student) => {
                    try {
                        console.log('Checking evaluation for student:', student.id, student.name);
                        const evaluation = await LessonService.getStudentLessonEvaluation(lessonId, student.id);
                        console.log('Evaluation result for student', student.id, ':', evaluation);
                        return {
                            ...student,
                            hasEvaluation: evaluation && evaluation.length > 0
                        };
                    } catch (error) {
                        console.error(`Error checking evaluation for student ${student.id}:`, error);
                        return {
                            ...student,
                            hasEvaluation: false
                        };
                    }
                })
            );

            console.log('Final students with evaluation status:', studentsWithEvaluationStatus);
            setStudents(studentsWithEvaluationStatus);
        } catch (err) {
            console.error('Error fetching students:', err);
            setError('Không thể tải danh sách học viên');
            setStudents([]);
        } finally {
            setLoadingStudents(false);
        }
    };

    const handleStudentClick = (student) => {
        // Kiểm tra xem học viên đã được đánh giá chưa
        if (lessonId && student.hasEvaluation) {
            alert('Học viên này đã được đánh giá rồi!');
            return;
        }

        onStudentSelect(student);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
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
                <div className="p-6 overflow-y-auto max-h-[60vh]">
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
                                    className={`flex items-center justify-between p-4 border rounded-lg ${student.hasEvaluation
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
                                                {student.first_name && student.last_name
                                                    ? `${student.first_name} ${student.last_name}`
                                                    : student.identification_number || `Học viên ${index + 1}`
                                                }
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {student.classInfo?.name && `Lớp: ${student.classInfo.name}`} | {student.identification_number || 'Chưa có mã SV'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        {lessonId && student.hasEvaluation ? (
                                            <div className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-medium">
                                                ✅ Đã đánh giá
                                            </div>
                                        ) : (
                                            <div className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                                                Bấm để đánh giá
                                            </div>
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

                {/* Footer */}
                <div className="flex justify-end p-6 border-t">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentSelectionModal;
