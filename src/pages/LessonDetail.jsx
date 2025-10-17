import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { LessonService } from '../services/LessonService';
import AttendanceService from '../services/AttendanceService';
import ClassService from '../services/ClassService';
import LessonEvaluationService from '../services/LessonEvaluationService';
import { format } from 'date-fns';
import StudentSelectionModal from '../components/StudentSelectionModal';
import LessonEvaluationForm from '../components/LessonEvaluation/LessonEvaluationForm';
import LessonGalleryModal from '../components/LessonGalleryModal';
import LessonDocumentationService from '../services/LessonDocumentationService';

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
    const [showDocumentationModal, setShowDocumentationModal] = useState(false);

    useEffect(() => {
        const fetchLessonDetail = async () => {
            if (!id) return;

            setLoading(true);
            try {
                // Lấy thông tin lesson từ state hoặc localStorage nếu có
                const storedLesson = localStorage.getItem(`lesson_${id}`);
                let lessonData;
                
                if (storedLesson) {
                    lessonData = JSON.parse(storedLesson);
                    setLesson(lessonData);
                } else {
                    // Fallback: Gọi API nếu không có data sẵn
                    lessonData = await LessonService.getLessonById(id);
                    setLesson(lessonData);
                }

                // Gọi API để lấy thông tin lớp dựa trên module
                if (lessonData.module) {
                    await fetchClassInfo(lessonData.module);
                }

                // Kiểm tra trạng thái check-in
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
            setCheckInInfo(null);
        }
    };

    // Lấy danh sách điểm danh cho buổi học
    const fetchAttendances = async (lessonId) => {
        if (!lessonId || !classInfo?.class_room) return;

        try {
            // Lấy danh sách học viên từ lớp học
            const classStudentsData = await ClassService.getStudentsByClassroom(classInfo.class_room);
            
            // Lấy danh sách điểm danh cho buổi học
            const attendanceData = await AttendanceService.getAttendances({
                lesson: lessonId,
                classroom: classInfo.class_room
            });

            // Lấy danh sách đánh giá cho buổi học
            console.log('🔍 About to call LessonEvaluationService.getLessonEvaluations with lessonId:', lessonId);
            const evaluationData = await LessonEvaluationService.getLessonEvaluations(lessonId);
            console.log('✅ Evaluation data received:', evaluationData);

            // Xử lý và kết hợp dữ liệu
            const processedAttendances = classStudentsData.map(student => {
                // Tìm thông tin điểm danh của học viên
                const attendance = attendanceData.find(att =>
                    (att.student && typeof att.student === 'object' && att.student.id === student.id) ||
                    (att.student === student.id)
                );

                // Tìm thông tin đánh giá của học viên
                const evaluation = evaluationData.find(evaluationItem =>
                    (evaluationItem.student && typeof evaluationItem.student === 'object' && evaluationItem.student.id === student.id) ||
                    (evaluationItem.student === student.id)
                );

                // Nếu có điểm danh, trả về thông tin điểm danh + đánh giá
                if (attendance) {
                    return {
                        ...attendance,
                        student: {
                            ...student,
                            ...attendance.student
                        },
                        is_evaluated: evaluation ? true : false,
                        evaluation: evaluation || null
                    };
                }

                // Nếu chưa có điểm danh, tạo bản ghi mới với trạng thái pending
                return {
                    student: student,
                    lesson: lessonId,
                    status: 'pending',
                    note: '',
                    check_in_time: null,
                    is_evaluated: evaluation ? true : false,
                    evaluation: evaluation || null
                };
            });

            console.log('Updated attendances with evaluations:', processedAttendances);
            setAttendances(processedAttendances);
            setClassStudents(classStudentsData);
        } catch (error) {
            console.error('Error fetching attendance data:', error);
            setAttendances([]);
            setClassStudents([]);
        }
    };

    // Hàm kiểm tra trạng thái check-in dựa trên thời gian
    const getCheckInStatus = () => {
        if (!lesson?.schedule?.start_date || !lesson?.schedule?.start_time) {
            return { canCheckIn: false, status: 'no-schedule', message: 'Chưa có lịch học' };
        }

        const now = new Date();
        
        // Parse thời gian từ API - có thể có format khác nhau
        let lessonStartTime;
        
        // Thử parse từ start_datetime trước (format ISO)
        if (lesson.start_datetime) {
            lessonStartTime = new Date(lesson.start_datetime);
        } else {
            // Fallback: parse từ schedule.start_date và start_time
            const lessonDate = new Date(lesson.schedule.start_date);
            const [hours, minutes] = lesson.schedule.start_time.split(':');
            lessonDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            lessonStartTime = lessonDate;
        }

        const timeDiff = lessonStartTime.getTime() - now.getTime();
        const minutesDiff = timeDiff / (1000 * 60);

        // Debug log để kiểm tra
        console.log('Time Debug:', {
            now: now.toLocaleString('vi-VN'),
            lessonStartTime: lessonStartTime.toLocaleString('vi-VN'),
            minutesDiff: minutesDiff,
            canCheckIn: minutesDiff > -30,
            isLate: minutesDiff < 0
        });

        // Trước giờ bắt đầu - CÓ THỂ CHECK-IN SỚM
        if (minutesDiff > 0) {
            return { 
                canCheckIn: true, 
                status: 'early', 
                message: 'Có thể check-in sớm',
                isLate: false 
            };
        }
        
        // Sau giờ bắt đầu đến 30 phút - CÓ THỂ CHECK-IN TRỄ
        if (minutesDiff >= -30) {
            return { 
                canCheckIn: true, 
                status: 'late', 
                message: 'Check-in trễ',
                isLate: true 
            };
        }
        
        // Sau giờ bắt đầu quá 30 phút - KHÔNG THỂ CHECK-IN
        return { 
            canCheckIn: false, 
            status: 'too-late', 
            message: 'Đã quá giờ check-in',
            isLate: true 
        };
    };

    const handleCheckIn = async () => {
        const checkInStatus = getCheckInStatus();

        if (!checkInStatus.canCheckIn) {
            return;
        }

        try {
            const checkInData = {
                lesson: parseInt(lesson.id),
                teacher: user?.id,
                checkin_type: 'teacher',
                checkin_time: new Date().toISOString(),
                is_late: checkInStatus.isLate // Thêm trạng thái trễ
            };

            console.log('Submitting check-in data:', checkInData);
            const result = await LessonService.createLessonCheckIn(checkInData);
            console.log('Check-in result:', result);

            // Refresh trạng thái check-in
            await checkCheckInStatus(lesson.id);
            
            // Thông báo thành công
            toast.success('Check-in thành công!');

        } catch (error) {
            console.error('Error during check-in:', error);
            
            // Hiển thị thông báo lỗi từ API hoặc thông báo mặc định
            const errorMessage = error.response?.data?.message || error.message || 'Không xác định';
            toast.error(errorMessage);
        }
    };

    const handleAttendance = async () => {
        console.log("lesson?.class_room", classInfo)
        
        try {
            // Hiển thị modal trước với trạng thái loading
            setShowAttendanceModal(true);
            setLoadingStudents(true);
            
            // Gọi các API song song để tăng tốc
            const [classData, attendanceData] = await Promise.all([
                ClassService.getClassById(classInfo.class_room),
                AttendanceService.getAttendances({
                    lesson: lesson.id,
                    classroom: classInfo.class_room
                })
            ]);

            console.log("Data loaded:", { classData, attendanceData });

            // Xử lý dữ liệu học viên và điểm danh
            const students = classData.data.students || [];
            const processedAttendances = students.map(student => {
                const attendance = attendanceData.find(att => 
                    (att.student && typeof att.student === 'object' && att.student.id === student.id) ||
                    (att.student === student.id)
                );

                if (attendance) {
                    return {
                        ...attendance,
                        student: {
                            ...student,
                            ...attendance.student
                        }
                    };
                }

                return {
                    student: student,
                    lesson: lesson.id,
                    status: 'pending',
                    note: '',
                    check_in_time: null,
                    is_evaluated: false
                };
            });

            // Cập nhật state
            setClassStudents(students);
            setAttendances(processedAttendances);
            
        } catch (error) {
            console.error('Error fetching data:', error);
            setClassStudents([]);
            setAttendances([]);
            toast.error('Có lỗi khi tải dữ liệu lớp học và điểm danh');
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

            // Refresh danh sách điểm danh và đợi hoàn thành
            await fetchAttendances(lesson.id);
            
            // Thông báo thành công
            toast.success('Điểm danh thành công!');
            
            // Đóng modal sau khi cập nhật thành công
            setShowStudentAttendanceModal(false);
            setSelectedStudent(null);

        } catch (error) {
            console.error('Error saving attendance:', error);
            
            // Hiển thị thông báo lỗi từ API hoặc thông báo mặc định
            const errorMessage = error.response?.data?.message || error.message || 'Có lỗi khi lưu điểm danh';
            toast.error(errorMessage);
        }
    };

    // Kiểm tra xem đã đủ thời gian để đánh giá chưa (120 phút từ khi bắt đầu)
    const getEvaluationStatus = () => {
        if (!lesson?.schedule?.start_date || !lesson?.schedule?.start_time) {
            return { canEvaluate: false, message: 'Chưa có lịch học' };
        }

        const now = new Date();
        const lessonStartTime = new Date(lesson.schedule.start_date);
        const [hours, minutes] = lesson.schedule.start_time.split(':');
        lessonStartTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        // Tính thời gian đã trôi qua kể từ khi bắt đầu (phút)
        const timeDiff = (now.getTime() - lessonStartTime.getTime()) / (1000 * 60);

        if (timeDiff < 120) {
            const remainingMinutes = Math.ceil(120 - timeDiff);
            return { 
                canEvaluate: false, 
                message: `Còn ${remainingMinutes} phút nữa mới có thể đánh giá` 
            };
        }

        return { canEvaluate: true, message: 'Có thể đánh giá' };
    };

    const handleEvaluation = async () => {
        console.log("classInfo for evaluation:", classInfo);
        
        const evaluationStatus = getEvaluationStatus();
        if (!evaluationStatus.canEvaluate) {
            return;
        }

        try {
            // Hiển thị modal trước với trạng thái loading
            setShowStudentSelectionModal(true);
            setLoadingStudents(true);
            
            // Gọi các API song song để tăng tốc
            const [classData, attendanceData, evaluationData] = await Promise.all([
                ClassService.getClassById(classInfo.class_room),
                AttendanceService.getAttendances({
                    lesson: lesson.id,
                    classroom: classInfo.class_room
                }),
                LessonEvaluationService.getLessonEvaluations(lesson.id)
            ]);

            console.log("Data loaded for evaluation:", { classData, attendanceData, evaluationData });

            // Xử lý dữ liệu học viên, điểm danh và đánh giá
            const students = classData.data.students || [];
            const processedStudents = students.map(student => {
                const attendance = attendanceData.find(att => 
                    (att.student && typeof att.student === 'object' && att.student.id === student.id) ||
                    (att.student === student.id)
                );

                const evaluation = evaluationData.find(evaluationItem =>
                    (evaluationItem.student && typeof evaluationItem.student === 'object' && evaluationItem.student.id === student.id) ||
                    (evaluationItem.student === student.id)
                );

                return {
                    ...student,
                    attendance: attendance ? {
                        ...attendance,
                        is_evaluated: evaluation ? true : false,
                        evaluation: evaluation || null
                    } : null,
                    classInfo: classInfo
                };
            });

            // Cập nhật state
            setClassStudents(processedStudents);
            
        } catch (error) {
            console.error('Error fetching data for evaluation:', error);
            toast.error('Có lỗi khi tải dữ liệu học viên');
            setShowStudentSelectionModal(false);
        } finally {
            setLoadingStudents(false);
        }
    };

    const handleStudentSelect = (student) => {
        setSelectedStudentForEvaluation(student);
        setShowEvaluationForm(true);
    };

    const handleEvaluationSubmit = async (formData) => {
        try {
            // Refresh danh sách điểm danh để cập nhật trạng thái đánh giá
            await fetchAttendances(lesson.id);
            
            // Thông báo thành công
            toast.success('Đánh giá thành công!');
            
            // Chỉ ẩn form đánh giá, giữ lại modal chọn học viên
            setShowEvaluationForm(false);
            setSelectedStudentForEvaluation(null);
            // Hiện lại modal chọn học viên
            setShowStudentSelectionModal(true);
        } catch (error) {
            console.error('Error refreshing attendance data after evaluation:', error);
            toast.error('Có lỗi khi cập nhật dữ liệu');
        }
    };

    const handleEvaluationBack = () => {
        // Chỉ ẩn form đánh giá, giữ lại modal chọn học viên
        setShowEvaluationForm(false);
        setSelectedStudentForEvaluation(null);
        // Hiện lại modal chọn học viên
        setShowStudentSelectionModal(true);
    };

    const handleUploadImage = () => {
        setShowGalleryModal(true);
    };



    const handleBack = () => {
        navigate(-1);
    };

    // Gọi API attendance khi có thông tin lớp học và lesson
    useEffect(() => {
        const fetchInitialAttendance = async () => {
            if (!lesson?.id || !classInfo?.class_room) return;

            try {
                console.log("Fetching initial attendance data...");
                const attendanceData = await AttendanceService.getAttendances({
                    lesson: lesson.id,
                    classroom: classInfo.class_room
                });
                console.log("Initial attendance data:", attendanceData);

                if (attendanceData && Array.isArray(attendanceData)) {
                    setAttendances(attendanceData);
                }
            } catch (error) {
                console.error('Error fetching initial attendance:', error);
            }
        };

        fetchInitialAttendance();
    }, [lesson?.id, classInfo?.class_room]);

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
                        
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-6">
                {/* Lesson Overview */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="mb-4">
                        <span className="text-sm font-medium text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">
                            Buổi {lesson.sequence_number} - {classInfo?.name}
                        </span>
                    </div>
                    
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
                            
                            // Debug: Log thông tin để kiểm tra
                            console.log('Debug Check-in Status:', {
                                checkInStatus,
                                lessonSchedule: lesson.schedule,
                                currentTime: new Date().toLocaleString('vi-VN'),
                                lessonStartTime: lesson.schedule?.start_date + ' ' + lesson.schedule?.start_time
                            });
                            
                            let buttonClass = "flex flex-col items-center p-4 rounded-lg transition-colors ";
                            let icon = "📝";
                            let text = "Check in";
                            let statusClass = "";

                            // Nếu đã check-in, hiển thị trạng thái đã check-in
                            if (checkInInfo) {
                                console.log('Check-in Info:', checkInInfo);
                                
                                const checkInTime = new Date(checkInInfo.checkin_time);
                                let lessonStartTime;
                                
                                // Parse thời gian lesson giống như trong getCheckInStatus
                                if (lesson.start_datetime) {
                                    lessonStartTime = new Date(lesson.start_datetime);
                                } else {
                                    const lessonDate = new Date(lesson.schedule.start_date);
                                    const [hours, minutes] = lesson.schedule.start_time.split(':');
                                    lessonDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                                    lessonStartTime = lessonDate;
                                }
                                
                                // Kiểm tra xem có check in muộn không
                                const isLateCheckIn = checkInTime > lessonStartTime;

                                if (isLateCheckIn) {
                                    buttonClass += "bg-red-50 border border-red-200 cursor-not-allowed";
                                    icon = "⏰";
                                    text = "Đã check-in (Trễ)";
                                    statusClass = "text-xs text-red-600 mt-1";
                                } else {
                                    buttonClass += "bg-green-50 border border-green-200 cursor-not-allowed";
                                    icon = "✅";
                                    text = "Đã check-in";
                                    statusClass = "text-xs text-green-600 mt-1";
                                }
                            } else if (checkInStatus.canCheckIn) {
                                if (checkInStatus.isLate) {
                                    buttonClass += "bg-orange-50 border border-orange-200 hover:bg-orange-100";
                                    icon = "⏰";
                                    text = "Check in";
                                    statusClass = "text-xs text-orange-600 mt-1";
                                } else {
                                    buttonClass += "bg-indigo-600 hover:bg-indigo-700 text-white";
                                    icon = "📝";
                                    text = "Check in";
                                }
                            } else {
                                buttonClass += "bg-gray-100 border border-gray-200 cursor-not-allowed";
                                icon = "⏰";
                                text = "Check in";
                                statusClass = "text-xs text-gray-500 mt-1";
                            }

                            return (
                                <button
                                    onClick={handleCheckIn}
                                    disabled={checkInInfo || !checkInStatus.canCheckIn}
                                    className={buttonClass}
                                >
                                    <div className="text-2xl mb-2">{icon}</div>
                                    <span className="font-medium text-sm">{text}</span>
                                    {statusClass && (
                                        <div className={statusClass}>
                                            {checkInInfo 
                                                ? new Date(checkInInfo.checkin_time).toLocaleString('vi-VN')
                                                : checkInStatus.isLate 
                                                    ? "(Trễ)"
                                                    : checkInStatus.message
                                            }
                                        </div>
                                    )}
                                </button>
                            );
                        })()}

                        {/* Điểm danh học viên - chỉ enable khi đã check-in */}
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
                                Điểm danh học viên
                            </span>
                        </button>

                        {/* Đánh giá - chỉ enable khi đã có điểm danh và đủ thời gian */}
                        {(() => {
                            const evaluationStatus = getEvaluationStatus();
                            let buttonClass = "flex flex-col items-center p-4 rounded-lg transition-colors ";
                            let statusClass = "";

                            if (!attendances.length) {
                                buttonClass += "bg-gray-100 border border-gray-200 cursor-not-allowed";
                                statusClass = "text-xs text-gray-500 mt-1";
                            } else if (!evaluationStatus.canEvaluate) {
                                buttonClass += "bg-yellow-50 border border-yellow-200 cursor-not-allowed";
                                statusClass = "text-xs text-yellow-600 mt-1";
                            } else {
                                buttonClass += "bg-indigo-600 hover:bg-indigo-700 text-white";
                            }

                            return (
                                <button
                                    onClick={attendances.length > 0 && evaluationStatus.canEvaluate ? handleEvaluation : undefined}
                                    disabled={!attendances.length || !evaluationStatus.canEvaluate}
                                    className={buttonClass}
                                >
                                    <div className="text-2xl mb-2">⭐</div>
                                    <span className="font-medium text-sm">Đánh giá</span>
                                    {statusClass && (
                                        <div className={statusClass}>
                                            {!attendances.length 
                                                ? "Chưa điểm danh"
                                                : !evaluationStatus.canEvaluate 
                                                    ? evaluationStatus.message
                                                    : ""
                                            }
                                        </div>
                                    )}
                                </button>
                            );
                        })()}

                        {/* Up ảnh - chỉ enable khi đã có điểm danh */}
                        <button
                            onClick={attendances.length > 0 ? handleUploadImage : undefined}
                            disabled={attendances.length === 0}
                            className={`flex flex-col items-center p-4 rounded-lg transition-colors ${attendances.length > 0
                                ? 'bg-purple-50 border border-purple-200 hover:bg-purple-100'
                                : 'bg-gray-50 border border-gray-200 cursor-not-allowed opacity-60'
                                }`}
                        >
                            <div className="text-2xl mb-2">📸</div>
                            <span className={`font-medium ${attendances.length > 0 ? 'text-purple-800' : 'text-gray-600'}`}>
                                Up ảnh
                            </span>
                        </button>


                    </div>
                </div>

                {/* Additional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center mb-4">
                            <div className="text-2xl mr-3">⭐</div>
                            <h4 className="font-semibold text-gray-900">Feedback buổi học</h4>
                        </div>
                        <p className="text-gray-600 text-sm">Nhận xét, đánh giá về buổi học</p>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center mb-4">
                            <div className="text-2xl mr-3">📄</div>
                            <h4 className="font-semibold text-gray-900">Tài liệu buổi học</h4>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">Xem và quản lý tài liệu của buổi học</p>
                        <button
                            onClick={() => setShowDocumentationModal(true)}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                        >
                            <span className="mr-2">📄</span>
                            Xem tài liệu
                        </button>
                    </div>
                </div>
            </div>

            {/* Attendance Modal */}
            {showAttendanceModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Điểm danh học viên - {classInfo?.name || 'Chưa có học phần'}
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
                                    <p className="text-gray-600">Đang tải danh sách học viên...</p>
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
                                                            : student.identification_number || `học viên ${index + 1}`
                                                        }
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        ID: {student.id} | {student.parent_phone || student.identification_number || 'Chưa có thông tin'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                {(() => {
                                                    console.log("attendances", attendances)
                                                    console.log("current student:", student)
                                                    // Sửa logic mapping: API trả về student là object, không phải number
                                                    const studentAttendance = attendances.find(att =>
                                                        (att.student && typeof att.student === 'object' && att.student.id === student.id) ||
                                                        (att.student === student.id)
                                                    );
                                                    
                                                    console.log("studentAttendance for student", student.id, ":", studentAttendance);

                                                    if (studentAttendance) {
                                                        const statusMap = {
                                                            'present': { text: '✅ Có mặt', color: 'text-green-600', bgColor: 'bg-green-50' },
                                                            'absent': { text: '❌ Vắng mặt', color: 'text-red-600', bgColor: 'bg-red-50' },
                                                            'late': { text: '⏰ Đi muộn', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
                                                            'excused': { text: '📄 Được phép nghỉ', color: 'text-blue-600', bgColor: 'bg-blue-50' }
                                                        };
                                                        const status = statusMap[studentAttendance.status] || { text: 'Chưa điểm danh', color: 'text-gray-600', bgColor: 'bg-gray-50' };
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
                                    <p className="text-gray-600">Không có học viên nào trong lớp</p>
                                </div>
                            )}
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
                classInfo={{
                    ...classInfo,
                    students: classStudents
                }}
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

            {/* Documentation Modal - Read Only */}
            {showDocumentationModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">Tài liệu buổi học</h3>
                            <button
                                onClick={() => setShowDocumentationModal(false)}
                                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto max-h-[70vh]">
                            <DocumentationViewer lessonId={lesson?.id || id} />
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end p-6 border-t bg-gray-50">
                            <button
                                onClick={() => setShowDocumentationModal(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Component chỉ để xem tài liệu (read-only)
const DocumentationViewer = ({ lessonId }) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (lessonId) {
            fetchDocuments();
        }
    }, [lessonId]);

    const fetchDocuments = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await LessonDocumentationService.getLessonDocumentations(lessonId);
            setDocuments(data);
        } catch (error) {
            console.error('Error fetching documents:', error);
            setError('Không thể tải danh sách tài liệu');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Đang tải tài liệu...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <div className="text-red-500 text-4xl mb-4">❌</div>
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    if (documents.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-4">📄</div>
                <p className="text-gray-600">Chưa có tài liệu nào cho buổi học này</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {documents.map((doc, index) => (
                <div key={doc.id || index} className="border border-gray-200 rounded-lg p-4">
                    {/* Thông tin tài liệu */}
                    <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 text-lg mb-2">
                            {doc.name || `Tài liệu ${index + 1}`}
                        </h4>
                    </div>

                    {/* Hiển thị tài liệu */}
                    <div 
                        style={{
                            position: 'relative',
                            width: '100%',
                            height: 0,
                            paddingTop: '56.25%', // 16:9 aspect ratio
                            paddingBottom: 0,
                            boxShadow: '0 2px 8px 0 rgba(63,69,81,0.16)',
                            overflow: 'hidden',
                            borderRadius: '8px',
                            willChange: 'transform'
                        }}
                    >
                        <iframe
                            src={doc.link.includes('canva.com') 
                                ? (doc.link.includes('/view?') ? `${doc.link}&embed` : `${doc.link}?embed`)
                                : doc.link}
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                top: 0,
                                left: 0,
                                border: 'none',
                                padding: 0,
                                margin: 0
                            }}
                            loading="lazy"
                            allowFullScreen={true}
                            allow="fullscreen"
                            title={doc.name || `Tài liệu ${index + 1}`}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LessonDetail; 