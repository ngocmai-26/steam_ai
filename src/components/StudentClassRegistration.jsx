import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../slices/modalSlice';
import { registerStudentToClass, unregisterStudentFromClass } from '../slices/studentSlice';

const StudentClassRegistration = () => {
  const dispatch = useDispatch();
  const currentStudent = useSelector(state => state.student.currentStudent);
  const courses = useSelector(state => state.course.courses);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const isRegistered = (classItem) => {
    if (!currentStudent?.registrations) return false;
    return currentStudent.registrations.some(
      reg => reg.class_id === classItem.id && reg.status === 'active'
    );
  };

  const handleRegister = (courseId, classId) => {
    dispatch(registerStudentToClass({
      studentId: currentStudent.id,
      courseId,
      classId
    }));
  };

  const handleUnregister = (classId) => {
    dispatch(unregisterStudentFromClass({
      studentId: currentStudent.id,
      classId
    }));
  };

  const formatSchedule = (schedule) => {
    if (!schedule) return null;
    
    if (typeof schedule === 'string') {
      try {
        schedule = JSON.parse(schedule);
      } catch {
        return schedule;
      }
    }

    const dayMapping = {
      monday: 'Thứ 2',
      tuesday: 'Thứ 3',
      wednesday: 'Thứ 4',
      thursday: 'Thứ 5',
      friday: 'Thứ 6',
      saturday: 'Thứ 7',
      sunday: 'Chủ nhật'
    };

    return Object.entries(schedule).map(([day, time]) => {
      const localizedDay = dayMapping[day.toLowerCase()] || day;
      const timeStr = Array.isArray(time) ? time.join(' - ') : time;
      return `${localizedDay}: ${timeStr}`;
    }).join('\n');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">
              Đăng ký học phần
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              Học viên: {currentStudent?.first_name} {currentStudent?.last_name}
            </p>
          </div>
          <button
            onClick={() => dispatch(closeModal())}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Course List */}
      <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
        <div className="space-y-4">
          {courses.map(course => (
            <div 
              key={course.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <div 
                className="px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => setSelectedCourseId(selectedCourseId === course.id ? null : course.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{course.name}</h3>
                    <p className="text-sm text-gray-600 mt-0.5">{course.description}</p>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-500 transform transition-transform ${
                      selectedCourseId === course.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Class List */}
              <div className={`transition-all duration-300 ${selectedCourseId === course.id ? 'block' : 'hidden'}`}>
                <div className="divide-y divide-gray-200">
                  {course.classes?.map(classItem => {
                    const registered = isRegistered(classItem);
                    const isFull = (classItem.current_students || 0) >= classItem.max_students;
                    const schedule = formatSchedule(classItem.schedule);

                    return (
                      <div key={classItem.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-grow">
                            {/* Class Header */}
                            <div className="flex items-center space-x-2">
                              <h4 className="text-base font-medium text-gray-900">{classItem.name}</h4>
                              {registered && (
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Đã đăng ký
                                </span>
                              )}
                              {isFull && !registered && (
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Lớp đã đầy
                                </span>
                              )}
                              {classItem.status === 'active' && (
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Đang mở
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-sm text-gray-600">{classItem.description}</p>
                            
                            {/* Class Info Grid */}
                            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {/* Basic Info */}
                              <div className="bg-gray-50 rounded-lg p-3">
                                <div className="space-y-2">
                                  {classItem.teacher && (
                                    <p className="flex items-center text-sm text-gray-600">
                                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                      </svg>
                                      <span className="font-medium">Giảng viên:</span>
                                      <span className="ml-1">{classItem.teacher.name}</span>
                                    </p>
                                  )}
                                  {classItem.teaching_assistant && (
                                    <p className="flex items-center text-sm text-gray-600">
                                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                      </svg>
                                      <span className="font-medium">Trợ giảng:</span>
                                      <span className="ml-1">{classItem.teaching_assistant.name}</span>
                                    </p>
                                  )}
                                  <p className="flex items-center text-sm text-gray-600">
                                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span className="font-medium">Sĩ số:</span>
                                    <span className="ml-1">
                                      {classItem.current_students?.length || 0}/{classItem.max_students}
                                    </span>
                                  </p>
                                  <div className="flex items-center text-sm text-gray-600">
                                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="font-medium">Thời gian:</span>
                                    <span className="ml-1">
                                      {formatDate(classItem.start_date)} - {formatDate(classItem.end_date)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Schedule */}
                              {schedule && (
                                <div className="bg-gray-50 rounded-lg p-3 sm:col-span-2">
                                  <h5 className="text-sm font-medium text-gray-900 mb-2">Lịch học</h5>
                                  <p className="mt-2 text-sm text-gray-600 whitespace-pre-line">
                                    {schedule}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="ml-4 flex-shrink-0">
                            {registered ? (
                              <button
                                onClick={() => handleUnregister(classItem.id)}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Hủy đăng ký
                              </button>
                            ) : (
                              <button
                                onClick={() => handleRegister(course.id, classItem.id)}
                                disabled={isFull}
                                className={`inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md
                                  ${isFull 
                                    ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                                    : 'text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                                  }`}
                              >
                                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Đăng ký
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentClassRegistration;