import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LessonService } from '../services/LessonService';
import { ClassService } from '../services/ClassService';
import AttendanceService from '../services/AttendanceService';
import { format } from 'date-fns';
import StudentSelectionModal from '../components/StudentSelectionModal';
import LessonEvaluationForm from '../components/LessonEvaluation/LessonEvaluationForm';
import LessonGalleryModal from '../components/LessonGalleryModal';

const LessonDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = useSelector(state => state.auth.user);
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAttendanceModal, setShowAttendanceModal] = useState(false);
    const [classStudents, setClassStudents] = useState([]);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showStudentAttendanceModal, setShowStudentAttendanceModal] = useState(false);
    const [studentAttendanceStatus, setStudentAttendanceStatus] = useState('present');
    const [studentNote, setStudentNote] = useState('');
    const [classInfo, setClassInfo] = useState(null);
    const [checkInInfo, setCheckInInfo] = useState(null);
    const [attendances, setAttendances] = useState([]);
    const [showStudentSelectionModal, setShowStudentSelectionModal] = useState(false);
    const [showEvaluationForm, setShowEvaluationForm] = useState(false);
    const [selectedStudentForEvaluation, setSelectedStudentForEvaluation] = useState(null);
    const [showGalleryModal, setShowGalleryModal] = useState(false);

    useEffect(() => {
        const fetchLessonDetail = async () => {
            if (!id) return;

            setLoading(true);
            try {
                // Lấy thông tin lesson từ state hoặc localStorage nếu có
                // Nếu không có, thì mới gọi API
                const storedLesson = localStorage.getItem(`lesson_${id}`);
                if (storedLesson) {
                    const lessonData = JSON.parse(storedLesson);
                    setLesson(lessonData);

                    // Gọi API để lấy thông tin lớp dựa trên module
                    if (lessonData.module) {
                        await fetchClassInfo(lessonData.module);
                    }

                    // Kiểm tra trạng thái check-in
                    await checkCheckInStatus(lessonData.id);

                    setLoading(false);
                    return;
                }

                // Fallback: Gọi API nếu không có data sẵn
                const lessonData = await LessonService.getLessonById(id);
                setLesson(lessonData);

                // Gọi API để lấy thông tin lớp dựa trên module
                if (lessonData.module) {
                    await fetchClassInfo(lessonData.module);
                }

                await checkCheckInStatus(lessonData.id);
            } catch (error) {
                console.error('Error fetching lesson detail:', error);
                setError('Không thể tải thông tin buổi học');
            } finally {
                setLoading(false);
            }
        };

        const fetchClassInfo = async (moduleId) => {
            try {
                const modulesData = await LessonService.getModules();

                // Tìm module có id trùng với moduleId của lesson
                const matchedModule = modulesData.find(module => module.id === moduleId);
                if (matchedModule) {
                    setClassInfo(matchedModule);
                }
            } catch (error) {
                console.error('Error fetching course-modules:', error);
            }
        };

        fetchLessonDetail();
    }, [id]);

    // Kiểm tra trạng thái check-in
    const checkCheckInStatus = async (lessonId) => {

        if (!lessonId) {
            return;
        }

        if (!user?.id) {
            return;
        }

        try {
            const checkInData = await LessonService.getLessonCheckIn(user.id, lessonId);


            // Nếu có data check-in, lấy thông tin đầu tiên
            if (checkInData && Array.isArray(checkInData) && checkInData.length > 0) {
                setCheckInInfo(checkInData[0]);
            } else if (checkInData && checkInData.data && Array.isArray(checkInData.data) && checkInData.data.length > 0) {
                setCheckInInfo(checkInData.data[0]);
            } else {
                setCheckInInfo(null);
            }
        } catch (error) {
            console.error('Error checking check-in status:', error);
            setCheckInInfo(null);
        }
    };

    // Lấy danh sách điểm danh cho buổi học
    const fetchAttendances = async (lessonId) => {
        if (!lessonId) return;

        try {
            const attendanceData = await AttendanceService.getAttendances(lessonId);

            // Xử lý response data
            if (attendanceData && Array.isArray(attendanceData)) {
                setAttendances(attendanceData);
            } else if (attendanceData && attendanceData.data && Array.isArray(attendanceData.data)) {
                setAttendances(attendanceData.data);
            } else {
                setAttendances([]);
            }
        } catch (error) {
            console.error('Error fetching attendances:', error);
            // Không throw error để tránh logout, chỉ set empty array
            setAttendances([]);
        }
    };

    // Hàm kiểm tra trạng thái check-in dựa trên thời gian
    const getCheckInStatus = () => {
        if (!lesson?.schedule?.start_date || !lesson?.schedule?.start_time) {
            return { canCheckIn: false, status: 'no-schedule', message: 'Chưa có lịch học' };
        }

        const now = new Date();
        const lessonDate = new Date(lesson.schedule.start_date);
        const [hours, minutes] = lesson.schedule.start_time.split(':');
        lessonDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        const timeDiff = lessonDate.getTime() - now.getTime();
        const minutesDiff = timeDiff / (1000 * 60);

        if (minutesDiff > 15) {
            return { canCheckIn: false, status: 'too-early', message: 'Chưa đến giờ check-in' };
        } else {
            // Cho phép check-in từ 15p trước trở đi (không giới hạn thời gian sau)
            return { canCheckIn: true, status: 'ready', message: 'Có thể check-in' };
        }
    };

    const handleCheckIn = async () => {
        const checkInStatus = getCheckInStatus();

        if (!checkInStatus.canCheckIn) {
            alert(checkInStatus.message);
            return;
        }

        try {
            const checkInData = {
                lesson: parseInt(lesson.id),
                teacher: user?.id,
                checkin_type: 'teacher',
                checkin_time: new Date().toISOString()
            };


            await LessonService.createLessonCheckIn(checkInData);

            alert('Check-in thành công!');

            // Refresh trạng thái check-in
            await checkCheckInStatus(lesson.id);

        } catch (error) {
            console.error('Error during check-in:', error);
            alert('Có lỗi khi check-in. Vui lòng thử lại.');
        }
    };

    const handleAttendance = async () => {
        if (!classInfo?.id) {
            console.error('No course-module ID found');
            return;
        }

        setShowAttendanceModal(true);
        setLoadingStudents(true);

        try {
            // Sử dụng course-module ID để lấy danh sách học sinh
            const classData = await ClassService.getClassById(classInfo.id);
            // Giả sử API trả về students trong class data
            const students = classData.data?.students || classData.students || [];
            setClassStudents(students);

            // Lấy danh sách điểm danh
            await fetchAttendances(lesson.id);
        } catch (error) {
            console.error('Error fetching course-module students:', error);
            setClassStudents([]);
        } finally {
            setLoadingStudents(false);
        }
    };

    const handleStudentClick = (student) => {
        setSelectedStudent(student);
        setStudentAttendanceStatus('present');
        setStudentNote('');
        setShowStudentAttendanceModal(true);
    };

    const handleSaveStudentAttendance = async () => {
        if (!selectedStudent || !lesson?.id) {
            console.error('Missing student or lesson data');
            return;
        }

        try {
            // Gọi API để lưu điểm danh
            const attendanceData = {
                student: selectedStudent.id,
                lesson: parseInt(lesson.id),
                status: studentAttendanceStatus,
                note: studentNote
            };

            // Gọi API thực tế
            await AttendanceService.createAttendance(attendanceData);

            // Refresh danh sách điểm danh
            await fetchAttendances(lesson.id);

        } catch (error) {
            console.error('Error saving attendance:', error);
        } finally {
            // Đóng modal
            setShowStudentAttendanceModal(false);
            setSelectedStudent(null);
        }
    };

    const handleEvaluation = () => {
        // Open student selection modal instead of navigating to evaluation page
        setShowStudentSelectionModal(true);
    };

    const handleStudentSelect = (student) => {
        setSelectedStudentForEvaluation(student);
        setShowEvaluationForm(true);
    };

    const handleEvaluationSubmit = (formData) => {
        setShowEvaluationForm(false);
        setSelectedStudentForEvaluation(null);
        // Có thể thêm thông báo thành công ở đây
    };

    const handleEvaluationBack = () => {
        setShowEvaluationForm(false);
        setSelectedStudentForEvaluation(null);
    };

    const handleUploadImage = () => {
        setShowGalleryModal(true);
    };



    const handleBack = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải...</p>
                </div>
            </div>
        );
    }

    if (error || !lesson) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-4">❌</div>
                    <p className="text-gray-600">{error || 'Không tìm thấy buổi học'}</p>
                    <button
                        onClick={handleBack}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        Quay lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                onClick={handleBack}
                                className="mr-4 p-2 rounded-lg hover:bg-gray-100"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <h1 className="text-xl font-bold text-gray-900">Chi tiết buổi học</h1>
                        </div>
                        <button className="p-2 rounded-lg hover:bg-gray-100">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-6">
                {/* Lesson Overview */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="mb-4">
                        <span className="text-sm font-medium text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">
                            Buổi {lesson.sequence_number}/{lesson.total_lessons}
                        </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {classInfo?.name || 'Chưa có học phần'}, Module {lesson.module || 'Chưa có học phần'}
                    </h2>
                    <h3 className="text-lg text-gray-700 mb-4">{lesson.name}</h3>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center">
                            <span className="mr-2">🕒</span>
                            <div>
                                <p className="text-sm text-gray-600">Thời gian</p>
                                <p className="font-medium">
                                    {lesson.schedule?.start_date || 'Chưa có'} {lesson.schedule?.start_time || ''} - {lesson.schedule?.end_time || ''}
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {(() => {
                            const checkInStatus = getCheckInStatus();
                            let buttonClass = "flex flex-col items-center p-4 rounded-lg transition-colors ";
                            let icon = "📝";
                            let text = "Check in";

                            // Nếu đã check-in, hiển thị trạng thái đã check-in
                            if (checkInInfo) {
                                buttonClass += "bg-green-50 border border-green-200 cursor-not-allowed opacity-80";
                                icon = "✅";
                                const checkInTime = new Date(checkInInfo.checkin_time).toLocaleString('vi-VN');
                                text = `Đã check-in\n${checkInTime}`;
                            } else if (checkInStatus.canCheckIn) {
                                buttonClass += "bg-yellow-50 border border-yellow-200 hover:bg-yellow-100";
                                icon = "📝";
                                text = "Check in";
                            } else {
                                buttonClass += "bg-gray-50 border border-gray-200 cursor-not-allowed opacity-60";
                                icon = "⏰";
                                text = checkInStatus.message;
                            }

                            return (
                                <button
                                    onClick={handleCheckIn}
                                    disabled={checkInInfo || !checkInStatus.canCheckIn}
                                    className={buttonClass}
                                    title={checkInInfo ? `Đã check-in lúc ${new Date(checkInInfo.checkin_time).toLocaleString('vi-VN')}` : checkInStatus.message}
                                >
                                    <div className="text-2xl mb-2">{icon}</div>
                                    <span className={`font-medium text-sm ${checkInInfo ? 'text-green-800' : checkInStatus.canCheckIn ? 'text-yellow-800' : 'text-gray-600'}`}>
                                        {text}
                                    </span>
                                </button>
                            );
                        })()}

                        {/* Điểm danh học sinh - chỉ enable khi đã check-in */}
                        <button
                            onClick={checkInInfo ? handleAttendance : undefined}
                            disabled={!checkInInfo}
                            className={`flex flex-col items-center p-4 rounded-lg transition-colors ${checkInInfo
                                ? 'bg-blue-50 border border-blue-200 hover:bg-blue-100'
                                : 'bg-gray-50 border border-gray-200 cursor-not-allowed opacity-60'
                                }`}
                        >
                            <div className="text-2xl mb-2">👥</div>
                            <span className={`font-medium ${checkInInfo ? 'text-blue-800' : 'text-gray-600'}`}>
                                Điểm danh học sinh
                            </span>
                        </button>

                        {/* Đánh giá - chỉ enable khi đã hoàn thành điểm danh */}
                        <button
                            onClick={checkInInfo && attendances.length > 0 ? handleEvaluation : undefined}
                            disabled={!checkInInfo || attendances.length === 0}
                            className={`flex flex-col items-center p-4 rounded-lg transition-colors ${checkInInfo && attendances.length > 0
                                ? 'bg-yellow-50 border border-yellow-200 hover:bg-yellow-100'
                                : 'bg-gray-50 border border-gray-200 cursor-not-allowed opacity-60'
                                }`}
                        >
                            <div className="text-2xl mb-2">⭐</div>
                            <span className={`font-medium ${checkInInfo && attendances.length > 0 ? 'text-yellow-800' : 'text-gray-600'}`}>
                                Đánh giá
                            </span>
                        </button>

                        {/* Up ảnh - chỉ enable khi đã hoàn thành điểm danh */}
                        <button
                            onClick={checkInInfo && attendances.length > 0 ? handleUploadImage : undefined}
                            disabled={!checkInInfo || attendances.length === 0}
                            className={`flex flex-col items-center p-4 rounded-lg transition-colors ${checkInInfo && attendances.length > 0
                                ? 'bg-purple-50 border border-purple-200 hover:bg-purple-100'
                                : 'bg-gray-50 border border-gray-200 cursor-not-allowed opacity-60'
                                }`}
                        >
                            <div className="text-2xl mb-2">📸</div>
                            <span className={`font-medium ${checkInInfo && attendances.length > 0 ? 'text-purple-800' : 'text-gray-600'}`}>
                                Up ảnh
                            </span>
                        </button>


                    </div>
                </div>

                {/* Additional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center mb-4">
                            <div className="text-2xl mr-3">📚</div>
                            <h4 className="font-semibold text-gray-900">Giáo trình, Giáo án</h4>
                        </div>
                        <p className="text-gray-600 text-sm">Nội dung chuẩn bị trước buổi dạy</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center mb-4">
                            <div className="text-2xl mr-3">⭐</div>
                            <h4 className="font-semibold text-gray-900">Feedback buổi học</h4>
                        </div>
                        <p className="text-gray-600 text-sm">Nhận xét, đánh giá về buổi học</p>
                    </div>
                </div>
            </div>

            {/* Attendance Modal */}
            {showAttendanceModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Điểm danh học sinh - {classInfo?.name || 'Chưa có học phần'}
                            </h3>
                            <button
                                onClick={() => setShowAttendanceModal(false)}
                                className="p-2 rounded-lg hover:bg-gray-100"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            {loadingStudents ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                                    <p className="text-gray-600">Đang tải danh sách học sinh...</p>
                                </div>
                            ) : classStudents.length > 0 ? (
                                <div className="space-y-3">
                                    {classStudents.map((student, index) => (
                                        <div
                                            key={student.id || index}
                                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
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
                                                            : student.identification_number || `Học sinh ${index + 1}`
                                                        }
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        ID: {student.id} | {student.parent_phone || student.identification_number || 'Chưa có thông tin'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                {(() => {
                                                    // Sửa logic mapping: API trả về student là object, không phải number
                                                    const studentAttendance = attendances.find(att =>
                                                        (att.student && typeof att.student === 'object' && att.student.id === student.id) ||
                                                        (att.student === student.id)
                                                    );

                                                    if (studentAttendance) {
                                                        const statusMap = {
                                                            'present': { text: '✅ Có mặt', color: 'text-green-600', bgColor: 'bg-green-50' },
                                                            'absent': { text: '❌ Vắng mặt', color: 'text-red-600', bgColor: 'bg-red-50' },
                                                            'late': { text: '⏰ Đi muộn', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
                                                            'excused': { text: '📄 Được phép nghỉ', color: 'text-blue-600', bgColor: 'bg-blue-50' }
                                                        };
                                                        const status = statusMap[studentAttendance.status] || { text: '❓ Không xác định', color: 'text-gray-600', bgColor: 'bg-gray-50' };
                                                        return (
                                                            <div className={`px-3 py-1 rounded-full ${status.bgColor} ${status.color} text-xs font-medium`}>
                                                                {status.text}
                                                            </div>
                                                        );
                                                    }

                                                    // Debug: Kiểm tra xem có attendance nào không


                                                    return (
                                                        <div className="px-3 py-1 rounded-full bg-gray-50 text-gray-500 text-xs font-medium">
                                                            Bấm để điểm danh
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="text-4xl mb-4">👥</div>
                                    <p className="text-gray-600">Không có học sinh nào trong lớp</p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end p-6 border-t bg-gray-50">
                            <button
                                onClick={() => setShowAttendanceModal(false)}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Student Attendance Status Modal */}
            {showStudentAttendanceModal && selectedStudent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">
                                Trạng thái điểm danh
                            </h3>

                            <div className="space-y-3 mb-6">
                                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="attendanceStatus"
                                        value="present"
                                        checked={studentAttendanceStatus === 'present'}
                                        onChange={(e) => setStudentAttendanceStatus(e.target.value)}
                                        className="mr-3"
                                    />
                                    <span className="mr-2">✅</span>
                                    <span className="font-medium">Có mặt</span>
                                </label>

                                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="attendanceStatus"
                                        value="absent"
                                        checked={studentAttendanceStatus === 'absent'}
                                        onChange={(e) => setStudentAttendanceStatus(e.target.value)}
                                        className="mr-3"
                                    />
                                    <span className="mr-2">❌</span>
                                    <span className="font-medium">Vắng mặt</span>
                                </label>

                                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="attendanceStatus"
                                        value="late"
                                        checked={studentAttendanceStatus === 'late'}
                                        onChange={(e) => setStudentAttendanceStatus(e.target.value)}
                                        className="mr-3"
                                    />
                                    <span className="mr-2">⏰</span>
                                    <span className="font-medium">Đi muộn</span>
                                </label>

                                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="attendanceStatus"
                                        value="excused"
                                        checked={studentAttendanceStatus === 'excused'}
                                        onChange={(e) => setStudentAttendanceStatus(e.target.value)}
                                        className="mr-3"
                                    />
                                    <span className="mr-2">📄</span>
                                    <span className="font-medium">Được phép nghỉ</span>
                                </label>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ghi chú (tùy chọn)
                                </label>
                                <textarea
                                    value={studentNote}
                                    onChange={(e) => setStudentNote(e.target.value)}
                                    placeholder="Nhập ghi chú nếu cần..."
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                                    rows="3"
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowStudentAttendanceModal(false)}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
                                >
                                    Quay lại
                                </button>
                                <button
                                    onClick={handleSaveStudentAttendance}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                >
                                    Lưu điểm danh
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Student Selection Modal */}
            <StudentSelectionModal
                isOpen={showStudentSelectionModal}
                onClose={() => setShowStudentSelectionModal(false)}
                onStudentSelect={handleStudentSelect}
                lessonId={id}
                currentLesson={lesson}
                classInfo={classInfo}
                title="Chọn học viên để đánh giá"
            />

            {/* Evaluation Form Modal */}
            {showEvaluationForm && selectedStudentForEvaluation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-semibold text-gray-900">Đánh giá học viên</h2>
                            <button
                                onClick={handleEvaluationBack}
                                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[70vh]">
                            <LessonEvaluationForm
                                classInfo={selectedStudentForEvaluation.classInfo}
                                student={selectedStudentForEvaluation}
                                lesson={lesson}
                                lessonId={id}
                                onBack={handleEvaluationBack}
                                onSubmit={handleEvaluationSubmit}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Gallery Modal */}
            <LessonGalleryModal
                isOpen={showGalleryModal}
                onClose={() => setShowGalleryModal(false)}
                lessonId={lesson?.id || id}
                title="Quản lý ảnh buổi học"
            />
        </div>
    );
};

export default LessonDetail; 