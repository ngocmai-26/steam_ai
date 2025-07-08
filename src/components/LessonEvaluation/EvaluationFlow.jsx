import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LessonEvaluationForm from './LessonEvaluationForm';
import { useSelector } from 'react-redux';
import { ClassService } from '../../services/ClassService';
import { StudentService } from '../../services/StudentService';
import { LessonService } from '../../services/LessonService';
import axios from '../../axiosConfig';
import { MODULE_ENDPOINTS, USER_ENDPOINTS } from '../../constants/api';

const EvaluationFlow = ({ onBack: parentOnBack }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState('classes'); // classes -> students -> modules -> lessons -> evaluation
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingModules, setLoadingModules] = useState(false);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [userCache, setUserCache] = useState({});
  const [users, setUsers] = useState([]);
  const [selectedClassDetail, setSelectedClassDetail] = useState(null);

  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await ClassService.getClasses();
        // Nếu API trả về { data: [...] }
        const classList = Array.isArray(res) ? res : res.data || [];
        setClasses(classList);
      } catch (err) {
        setClasses([]);
      }
    };
    fetchClasses();
  }, []);

  const filteredClasses = classes.filter(classItem => {
    // So sánh teacher
    let teacherMatch = false;
    if (classItem.teacher) {
      if (typeof classItem.teacher === 'object') {
        teacherMatch = classItem.teacher.id === user.id;
      } else {
        teacherMatch = classItem.teacher === user.id;
      }
    }
    // So sánh teaching_assistant
    let assistantMatch = false;
    if (classItem.teaching_assistant) {
      if (typeof classItem.teaching_assistant === 'object') {
        assistantMatch = classItem.teaching_assistant.id === user.id;
      } else {
        assistantMatch = classItem.teaching_assistant === user.id;
      }
    }
    return teacherMatch || assistantMatch;
  });

  // Fetch toàn bộ user khi load component
  useEffect(() => {
    axios.get('/back-office/root/users')
      .then(res => setUsers(Array.isArray(res.data?.data) ? res.data.data : []))
      .catch(() => setUsers([]));
  }, []);

  // Hàm lấy email hoặc tên từ id
  const getUserInfo = (id) => {
    if (!id) return 'Không có';
    const user = users.find(u => u.id === id);
    return user?.email || user?.name || 'Không có';
  };

  const handleSelectClass = async (classItem) => {
    setSelectedClass(classItem);
    setStep('students');
    setLoadingStudents(true); // Bắt đầu loading
    try {
      const detail = await ClassService.getClassById(classItem.id);
      setSelectedClassDetail(detail);
      setStudents(Array.isArray(detail.data.students) ? detail.data.students : []);
    } catch (e) {
      setSelectedClassDetail(null);
      setStudents([]);
    }
    setLoadingStudents(false); // Kết thúc loading
  };

  // XÓA HOẶC COMMENT useEffect fetch students khi selectedClass thay đổi
  // Giữ lại fetch modules nếu cần
  useEffect(() => {
    if (!selectedClass) return;
    // Fetch modules
    setLoadingModules(true);
    axios.get(`${MODULE_ENDPOINTS.MODULES}?class_room=${selectedClass.id}`)
      .then(res => setModules(Array.isArray(res.data.data) ? res.data.data : []))
      .catch(() => setModules([]))
      .finally(() => setLoadingModules(false));
  }, [selectedClass]);

  // Fetch lessons when selectedModule changes
  useEffect(() => {
    if (!selectedModule) return;
    setLoadingLessons(true);
    LessonService.getLessons(selectedModule.id)
      .then(res => {
        // API trả về res.data hoặc res.data.data
        let lessonArr = Array.isArray(res) ? res : (Array.isArray(res.data) ? res.data : res.data?.data || []);
        setLessons(lessonArr);
      })
      .catch(() => setLessons([]))
      .finally(() => setLoadingLessons(false));
  }, [selectedModule]);

  const handleBack = () => {
    switch (step) {
      case 'students':
        setStep('classes');
        setSelectedClass(null);
        break;
      case 'modules':
        setStep('students');
        setSelectedStudent(null);
        break;
      case 'lessons':
        setStep('modules');
        setSelectedModule(null);
        break;
      case 'evaluation':
        setStep('lessons');
        setSelectedLesson(null);
        break;
      default:
        if (parentOnBack) {
          parentOnBack();
        } else {
          navigate('/evaluations');
        }
    }
  };

  const handleSubmitEvaluation = (formData) => {
    // TODO: Submit evaluation data to backend
    if (parentOnBack) {
      parentOnBack();
    } else {
      navigate('/evaluations');
    }
  };

  console.log('selectedStudent', selectedStudent)

  const renderClassList = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredClasses.length === 0 ? (
        <div className="col-span-full text-center text-gray-500">Bạn không có quyền đánh giá lớp nào.</div>
      ) : filteredClasses.map((classItem) => {
        // Đếm số học viên thực tế
        const studentCount = Array.isArray(classItem.students) ? classItem.students.length : 0;
        return (
          <div
            key={classItem.id}
            onClick={() => handleSelectClass(classItem)}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {classItem.name}
            </h3>
            <div className="space-y-2 text-gray-600">
              <p>
                <span className="font-medium">Học viên:</span>{' '}
                {studentCount}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderStudentList = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {loadingStudents ? (
        <div className="col-span-full text-center text-gray-500">Đang tải học viên...</div>
      ) : (Array.isArray(students) && students.length > 0 ? (
        students
          .map((student) => (
            <div
              key={student.id}
              onClick={() => {
                setSelectedStudent(student);
                setStep('modules');
              }}
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {(student.first_name || student.last_name) ? `${student.first_name || ''} ${student.last_name || ''}`.trim() : (student.name || 'Không rõ tên')}
              </h3>
              <div className="space-y-2 text-gray-600">
                {student.email && (
                  <p>
                    <span className="font-medium">Email:</span> {student.email}
                  </p>
                )}
                {student.phone && (
                  <p>
                    <span className="font-medium">SĐT:</span> {student.phone}
                  </p>
                )}
                {student.identification_number && (
                  <p>
                    <span className="font-medium">Mã SV:</span> {student.identification_number}
                  </p>
                )}
              </div>
            </div>
          ))
      ) : <div className="col-span-full text-center text-gray-500">Không có học viên nào.</div>)}
    </div>
  );

  const renderModuleList = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {loadingModules ? (
        <div className="col-span-full text-center text-gray-500">Đang tải học phần...</div>
      ) : (Array.isArray(modules) && modules.length > 0 ? (
        modules.map((module) => (
          <div
            key={module.id}
            onClick={() => {
              setSelectedModule(module);
              setStep('lessons');
            }}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {module.name}
            </h3>
            <div className="space-y-2 text-gray-600">
              <p>{module.description}</p>
              <p>
                <span className="font-medium">Số buổi học:</span> {module.total_lessons || module.lessons}
              </p>
            </div>
          </div>
        ))
      ) : <div className="col-span-full text-center text-gray-500">Không có học phần nào.</div>)}
    </div>
  );

  const renderLessonList = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {loadingLessons ? (
        <div className="col-span-full text-center text-gray-500">Đang tải buổi học...</div>
      ) : (Array.isArray(lessons) && lessons.length > 0 ? (
        lessons
          .map((lesson) => (
            <div
              key={lesson.id}
              onClick={() => {
                setSelectedLesson(lesson);
                setStep('evaluation');
              }}
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Buổi {lesson.sequence_number || lesson.sequence}: {lesson.name}
              </h3>
              <div className="space-y-2 text-gray-600">
                <p>{lesson.description}</p>
                <p>
                  <span className="font-medium">Thời lượng:</span> {lesson.duration}
                </p>
              </div>
            </div>
          ))
      ) : <div className="col-span-full text-center text-gray-500">Không có buổi học nào.</div>)}
    </div>
  );

  const getStepTitle = () => {
    switch (step) {
      case 'classes':
        return 'Chọn lớp học';
      case 'students':
        return `Chọn học viên - ${selectedClass?.name}`;
      case 'modules':
        return `Chọn học phần - ${selectedStudent?.last_name}`;
      case 'lessons':
        return `Chọn buổi học - ${selectedModule?.name}`;
      case 'evaluation':
        return 'Đánh giá buổi học';
      default:
        return '';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <button
          onClick={handleBack}
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
        <h2 className="text-2xl font-bold text-gray-900">{getStepTitle()}</h2>
      </div>

      {step === 'classes' && renderClassList()}
      {step === 'students' && renderStudentList()}
      {step === 'modules' && renderModuleList()}
      {step === 'lessons' && renderLessonList()}
      {step === 'evaluation' && (
        <LessonEvaluationForm
          classInfo={selectedClass}
          student={selectedStudent}
          module={selectedModule}
          lesson={selectedLesson}
          onBack={handleBack}
          onSubmit={handleSubmitEvaluation}
        />
      )}
    </div>
  );
};

export default EvaluationFlow; 