import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../slices/modalSlice';
import CourseModal from './CourseModal';
import CourseDetail from './CourseDetail';
import ClassDetail from './ClassDetail';
import LessonDetail from './LessonDetail';
import ClassForm from './ClassForm';
import LessonForm from './LessonForm';
import ModuleForm from './ModuleForm';
import StudentForm from './StudentForm';
import StudentClassRegistration from './StudentClassRegistration';
import ModuleManager from './ModuleManager';
import NewsModal from './NewsModal';
import { useDispatch as useReduxDispatch } from 'react-redux';
import { fetchStudents } from '../slices/studentSlice';
import { useSelector as useReduxSelector } from 'react-redux';

const ModalManager = () => {
  const dispatch = useDispatch();
  const reduxDispatch = useReduxDispatch();
  const { isOpen, type, data } = useSelector(state => state.modal);
  // Di chuyển hook này ra ngoài switch/case
  const student = useReduxSelector(state => state.student.currentStudent);

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
      // Module management
      case 'addModule':
      case 'editModule':
        return <ModuleForm />;
      // Lesson management
      case 'viewLesson':
        return <LessonDetail />;
      case 'addLesson':
      case 'editLesson':
        return <LessonForm type={type} />;
      // Student management
      case 'addStudent':
      case 'editStudent':
        return <StudentForm type={type} onSuccess={() => reduxDispatch(fetchStudents())} />;
      case 'registerClass':
        return <StudentClassRegistration />;
      case 'manageModules':
        return <ModuleManager />;
      // News management
      case 'addNews':
      case 'editNews':
      case 'viewNews':
        return <NewsModal />;
      case 'viewStudent': {
        // Hiển thị chi tiết học viên, có thể tái sử dụng StudentForm ở chế độ readOnly
        if (!student) return <div className="p-6">Đang tải...</div>;
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Chi tiết học viên</h2>
            <div className="flex gap-6">
              {student.avatar_url && (
                <img src={student.avatar_url} alt="avatar" className="h-24 w-24 rounded-full object-cover" />
              )}
              <div>
                <div><b>Mã học viên:</b> {student.identification_number}</div>
                <div><b>Họ tên:</b> {student.first_name} {student.last_name}</div>
                <div><b>Ngày sinh:</b> {student.date_of_birth}</div>
                <div><b>Giới tính:</b> {student.gender}</div>
                <div><b>Địa chỉ:</b> {student.address}</div>
                <div><b>SĐT:</b> {student.phone_number}</div>
                <div><b>Email:</b> {student.email}</div>
                <div><b>Phụ huynh:</b> {student.parent_name} - {student.parent_phone}</div>
                <div><b>Email phụ huynh:</b> {student.parent_email}</div>
                <div><b>Ghi chú:</b> {student.note}</div>
                <div><b>Trạng thái:</b> {student.is_active ? 'Đang hoạt động' : 'Không hoạt động'}</div>
              </div>
            </div>
          </div>
        );
      }
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