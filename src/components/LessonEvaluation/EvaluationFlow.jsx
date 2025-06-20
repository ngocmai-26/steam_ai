import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EvaluationForm from './EvaluationForm';

const EvaluationFlow = ({ onBack: parentOnBack }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState('classes'); // classes -> students -> modules -> lessons -> evaluation
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);

  // Mock data - Thay thế bằng API call thực tế sau này
  const classes = [
    {
      id: 1,
      name: 'Python-01',
      teacher: 'John Doe',
      schedule: 'Thứ 2, 4, 6',
      totalStudents: 15,
      activeStudents: 12
    },
    {
      id: 2,
      name: 'Web Development-01',
      teacher: 'Jane Smith',
      schedule: 'Thứ 3, 5, 7',
      totalStudents: 20,
      activeStudents: 18
    }
  ];

  const students = [
    {
      id: 1,
      classId: 1,
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      phone: '0123456789',
      status: 'active'
    },
    {
      id: 2,
      classId: 1,
      name: 'Trần Thị B',
      email: 'tranthib@example.com',
      phone: '0987654321',
      status: 'active'
    }
  ];

  const modules = [
    {
      id: 1,
      name: 'Cơ bản về Python',
      description: 'Giới thiệu về ngôn ngữ lập trình Python',
      duration: '4 tuần',
      lessons: 12
    },
    {
      id: 2,
      name: 'Lập trình hướng đối tượng với Python',
      description: 'OOP trong Python',
      duration: '3 tuần',
      lessons: 9
    }
  ];

  const lessons = [
    {
      id: 1,
      moduleId: 1,
      name: 'Giới thiệu Python',
      description: 'Tổng quan về Python và cài đặt môi trường',
      duration: '3 giờ',
      sequence: 1
    },
    {
      id: 2,
      moduleId: 1,
      name: 'Biến và kiểu dữ liệu',
      description: 'Các kiểu dữ liệu cơ bản trong Python',
      duration: '3 giờ',
      sequence: 2
    }
  ];

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
    console.log('Submitting evaluation:', {
      class_id: selectedClass?.id,
      student_id: selectedStudent?.id,
      module_id: selectedModule?.id,
      lesson_id: selectedLesson?.id,
      ...formData
    });
    if (parentOnBack) {
      parentOnBack();
    } else {
      navigate('/evaluations');
    }
  };

  const renderClassList = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {classes.map((classItem) => (
        <div
          key={classItem.id}
          onClick={() => {
            setSelectedClass(classItem);
            setStep('students');
          }}
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {classItem.name}
          </h3>
          <div className="space-y-2 text-gray-600">
            <p>
              <span className="font-medium">Giảng viên:</span> {classItem.teacher}
            </p>
            <p>
              <span className="font-medium">Lịch học:</span> {classItem.schedule}
            </p>
            <p>
              <span className="font-medium">Học viên:</span>{' '}
              {classItem.activeStudents}/{classItem.totalStudents}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderStudentList = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {students
        .filter(
          (student) =>
            student.classId === selectedClass?.id && student.status === 'active'
        )
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
              {student.name}
            </h3>
            <div className="space-y-2 text-gray-600">
              <p>
                <span className="font-medium">Email:</span> {student.email}
              </p>
              <p>
                <span className="font-medium">SĐT:</span> {student.phone}
              </p>
            </div>
          </div>
        ))}
    </div>
  );

  const renderModuleList = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {modules.map((module) => (
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
              <span className="font-medium">Thời lượng:</span> {module.duration}
            </p>
            <p>
              <span className="font-medium">Số buổi học:</span> {module.lessons}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderLessonList = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {lessons
        .filter((lesson) => lesson.moduleId === selectedModule?.id)
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
              Buổi {lesson.sequence}: {lesson.name}
            </h3>
            <div className="space-y-2 text-gray-600">
              <p>{lesson.description}</p>
              <p>
                <span className="font-medium">Thời lượng:</span> {lesson.duration}
              </p>
            </div>
          </div>
        ))}
    </div>
  );

  const getStepTitle = () => {
    switch (step) {
      case 'classes':
        return 'Chọn lớp học';
      case 'students':
        return `Chọn học viên - ${selectedClass?.name}`;
      case 'modules':
        return `Chọn học phần - ${selectedStudent?.name}`;
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
        <EvaluationForm
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