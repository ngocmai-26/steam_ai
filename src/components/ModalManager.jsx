import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../slices/modalSlice';
import CourseModal from './CourseModal';
import CourseDetail from './CourseDetail';
import ClassDetail from './ClassDetail';
import LessonDetail from './LessonDetail';
import ClassForm from './ClassForm';
import LessonForm from './LessonForm';
import StudentForm from './StudentForm';
import StudentClassRegistration from './StudentClassRegistration';

const ModalManager = () => {
  const dispatch = useDispatch();
  const { isOpen, type, data } = useSelector(state => state.modal);

  if (!isOpen) {
    return null;
  }

  // Helper function to determine modal size based on type
  const getModalSize = () => {
    switch (type) {
      case 'registerClass':
      case 'viewClass':
      case 'viewLesson':
      case 'viewCourse':
        return 'sm:max-w-4xl';
      case 'addStudent':
      case 'editStudent':
      case 'addClass':
      case 'editClass':
        return 'sm:max-w-2xl';
      default:
        return 'sm:max-w-lg';
    }
  };

  const renderModalContent = () => {
    switch (type) {
      // Course management
      case 'viewCourse':
        return <CourseDetail />;
      case 'add':
      case 'edit':
        return <CourseModal />;
      // Class management
      case 'viewClass':
        return <ClassDetail />;
      case 'addClass':
      case 'editClass':
        return <ClassForm type={type} />;
      // Lesson management
      case 'viewLesson':
        return <LessonDetail />;
      case 'addLesson':
      case 'editLesson':
        return <LessonForm type={type} />;
      // Student management
      case 'addStudent':
      case 'editStudent':
        return <StudentForm type={type} />;
      case 'registerClass':
        return <StudentClassRegistration />;
      default:
        return null;
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50 overflow-y-auto"
      onClick={() => dispatch(closeModal())}
    >
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div 
          className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full ${getModalSize()}`}
          onClick={e => e.stopPropagation()}
        >
          {renderModalContent()}
        </div>
      </div>
    </div>
  );
};

export default ModalManager; 