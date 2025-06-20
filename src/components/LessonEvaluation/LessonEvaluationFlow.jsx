import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getClasses, getStudents, getModules, getLessons } from '../../services/mockData';
import LessonEvaluationForm from './LessonEvaluationForm';
import { useNavigate } from 'react-router-dom';

const LessonEvaluationFlow = () => {
  const dispatch = useDispatch();
  const userRole = useSelector(state => state.auth.user?.role);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('class'); // class, student, module, lesson, evaluation
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showEvaluationForm, setShowEvaluationForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesData, studentsData] = await Promise.all([
          getClasses(),
          getStudents()
        ]);
        
        // Filter classes based on user role
        let filteredClasses = classesData;
        if (userRole === 'teacher') {
          filteredClasses = classesData.filter(c => c.teacher_id === userRole.id);
        }
        
        setClasses(filteredClasses);
        setStudents(studentsData);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };
    fetchData();
  }, [userRole]);

  useEffect(() => {
    const fetchModules = async () => {
      if (selectedClass) {
        try {
          const modulesData = await getModules();
          const filteredModules = modulesData.filter(m => m.class_id === selectedClass.id);
          console.log('Filtered modules:', filteredModules);
          setModules(filteredModules);
        } catch (error) {
          console.error('Error fetching modules:', error);
        }
      }
    };
    fetchModules();
  }, [selectedClass]);

  useEffect(() => {
    const fetchLessons = async () => {
      if (selectedModule) {
        try {
          const lessonsData = await getLessons();
          const filteredLessons = lessonsData.filter(l => l.module_id === selectedModule.id);
          console.log('Filtered lessons:', filteredLessons);
          setLessons(filteredLessons);
        } catch (error) {
          console.error('Error fetching lessons:', error);
        }
      }
    };
    fetchLessons();
  }, [selectedModule]);

  const handleBack = () => {
    if (showEvaluationForm) {
      setShowEvaluationForm(false);
      return;
    }

    switch (currentStep) {
      case 'student':
        setCurrentStep('class');
        setSelectedStudent(null);
        break;
      case 'module':
        setCurrentStep('student');
        setSelectedModule(null);
        break;
      case 'lesson':
        setCurrentStep('module');
        setSelectedLesson(null);
        break;
      default:
        navigate('/evaluations');
    }
  };

  const handleClassSelect = (classItem) => {
    setSelectedClass(classItem);
    setCurrentStep('student');
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setCurrentStep('module');
  };

  const handleModuleSelect = (module) => {
    setSelectedModule(module);
    setCurrentStep('lesson');
  };

  const handleLessonSelect = (lesson) => {
    setSelectedLesson(lesson);
    setShowEvaluationForm(true);
  };

  const renderClasses = () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {classes.map((classItem) => (
        <div
          key={classItem.id}
          onClick={() => handleClassSelect(classItem)}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md cursor-pointer transition-shadow"
        >
          <h3 className="text-lg font-medium text-gray-900">{classItem.name}</h3>
          <p className="text-sm text-gray-500 mt-2">Giáo viên: {classItem.instructor}</p>
          <p className="text-sm text-gray-500">Số học viên: {classItem.studentCount}/{classItem.maxStudents}</p>
        </div>
      ))}
    </div>
  );

  const renderStudents = () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {students
        .filter(student => student.registrations?.some(reg => 
          reg.class_id === selectedClass?.id && reg.status === 'active'
        ))
        .map((student) => (
          <div
            key={student.id}
            onClick={() => handleStudentSelect(student)}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md cursor-pointer transition-shadow"
          >
            <div className="flex items-center">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-12 h-12 rounded-full"
              />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">{student.name}</h3>
                <p className="text-sm text-gray-500">{student.email}</p>
              </div>
            </div>
          </div>
        ))}
    </div>
  );

  const renderModules = () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {modules.map((module) => (
        <div
          key={module.id}
          onClick={() => handleModuleSelect(module)}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md cursor-pointer transition-shadow"
        >
          <h3 className="text-lg font-medium text-gray-900">{module.name}</h3>
          <p className="text-sm text-gray-500 mt-2">Sequence: {module.sequence_number}</p>
          <p className="text-sm text-gray-500">Total Lessons: {module.total_lessons}</p>
        </div>
      ))}
    </div>
  );

  const renderLessons = () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {lessons
        .filter((lesson) => lesson.module_id === selectedModule?.id)
        .map((lesson) => (
          <div
            key={lesson.id}
            onClick={() => handleLessonSelect(lesson)}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md cursor-pointer transition-shadow"
          >
            <h3 className="text-lg font-medium text-gray-900">{lesson.name}</h3>
            <p className="text-sm text-gray-500 mt-2">Duration: {lesson.duration}</p>
            <p className="text-sm text-gray-500">{lesson.description}</p>
          </div>
        ))}
    </div>
  );

  const renderStepContent = () => {
    if (showEvaluationForm) {
      return (
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
          <LessonEvaluationForm
            lesson={selectedLesson}
            student={selectedStudent}
            onClose={() => setShowEvaluationForm(false)}
          />
        </div>
      );
    }

    switch (currentStep) {
      case 'class':
        return renderClasses();
      case 'student':
        return renderStudents();
      case 'module':
        return renderModules();
      case 'lesson':
        return renderLessons();
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    if (showEvaluationForm) {
      return 'Đánh giá buổi học';
    }

    switch (currentStep) {
      case 'class':
        return 'Chọn lớp học';
      case 'student':
        return 'Chọn học viên';
      case 'module':
        return 'Chọn module';
      case 'lesson':
        return 'Chọn buổi học';
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

      {renderStepContent()}
    </div>
  );
};

export default LessonEvaluationFlow; 