import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ClassService } from '../services/ClassService';
import { LessonService } from '../services/LessonService';
import LessonEvaluationForm from '../components/LessonEvaluation/LessonEvaluationForm';
import LessonEvaluationList from '../components/LessonEvaluation/LessonEvaluationList';

const Evaluations = () => {
  const [showStudentList, setShowStudentList] = useState(false);
  const [showEvaluationForm, setShowEvaluationForm] = useState(false);
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [returnToLesson, setReturnToLesson] = useState(false);
  const [lessonId, setLessonId] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(state => state.auth.user);

  // Check if showFlow parameter is present in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('showFlow') === 'true') {
      setShowStudentList(true);

      // Check if should return to lesson detail after evaluation
      if (urlParams.get('returnToLesson') === 'true') {
        setReturnToLesson(true);
        const lessonIdParam = urlParams.get('lessonId');
        console.log('Setting lessonId from URL param:', lessonIdParam);
        setLessonId(lessonIdParam);

        // Lưu thông tin lesson vào state để sử dụng trong đánh giá
        if (lessonIdParam) {
          // Lấy lesson từ localStorage nếu có
          const storedLesson = localStorage.getItem(`lesson_${lessonIdParam}`);
          if (storedLesson) {
            setCurrentLesson(JSON.parse(storedLesson));
          }
        }
      }

      // Clean up URL parameter
      navigate('/evaluations', { replace: true });
    }
  }, [location.search, navigate]);

  // Chỉ gọi fetchAllStudents khi có lessonId và currentLesson
  useEffect(() => {
    if (lessonId && currentLesson) {
      console.log('Lesson data ready, fetching students...');
      fetchAllStudents();
    }
  }, [lessonId, currentLesson]);

  const fetchAllStudents = async () => {
    setLoadingStudents(true);
    try {
      // Nếu có lessonId, chỉ lấy học viên từ lớp của lesson đó
      if (lessonId && currentLesson) {
        console.log('Fetching students for specific lesson:', lessonId, currentLesson);

        // Lấy thông tin lớp từ lesson
        const classId = currentLesson.class_room || currentLesson.class_room_id;
        if (classId) {
          try {
            const detail = await ClassService.getClassById(classId);
            console.log(`Fetching students for class ${classId}:`, detail);

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
          } catch (e) {
            console.error(`Error fetching students for class ${classId}:`, e);
            setStudents([]);
          }
        } else {
          console.error('No class ID found in lesson data');
          setStudents([]);
        }
      } else {
        // Khi không có lessonId (từ trang chính), chỉ hiển thị thông báo
        console.log('No lessonId provided, showing empty state');
        setStudents([]);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleStudentClick = async (student) => {
    // Kiểm tra xem học viên đã được đánh giá chưa
    if (lessonId && student.hasEvaluation) {
      alert('Học viên này đã được đánh giá rồi!');
      return;
    }

    setSelectedStudent(student);
    setShowEvaluationForm(true);
  };

  const handleBackFromForm = () => {
    setShowEvaluationForm(false);
    setSelectedStudent(null);
  };

  const handleBackFromStudentList = () => {
    setShowStudentList(false);
    setStudents([]);

    // If should return to lesson detail, navigate back
    if (returnToLesson && lessonId) {
      navigate(`/lessons/${lessonId}`);
    }
  };

  const handleSubmitEvaluation = (formData) => {
    setShowEvaluationForm(false);
    setSelectedStudent(null);

    // Refresh danh sách học viên để cập nhật trạng thái đánh giá
    fetchAllStudents();

    // Có thể thêm thông báo thành công ở đây
  };

  // Hiển thị form đánh giá
  if (showEvaluationForm && selectedStudent) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <button
            onClick={handleBackFromForm}
            className="mr-4 p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Đánh giá học viên</h2>
        </div>
        <LessonEvaluationForm
          classInfo={selectedStudent.classInfo}
          student={selectedStudent}
          lesson={currentLesson}
          lessonId={lessonId}
          onBack={handleBackFromForm}
          onSubmit={handleSubmitEvaluation}
        />
      </div>
    );
  }

  // Hiển thị danh sách học viên (gộp chung)
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        {returnToLesson && lessonId && (
          <button
            onClick={handleBackFromStudentList}
            className="mr-4 p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
        )}
        <h2 className="text-2xl font-bold text-gray-900">Chọn học viên để đánh giá</h2>
      </div>

      {loadingStudents ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải danh sách học viên...</p>
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
  );
};

export default Evaluations; 