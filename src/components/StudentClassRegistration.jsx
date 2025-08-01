import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../slices/modalSlice';
import { registerStudentToClass, unregisterStudentFromClass } from '../slices/studentSlice';
import { CourseRegistrationService } from '../services/ClassService';
import { useDispatch as useReduxDispatch } from 'react-redux';
import { fetchClasses } from '../thunks/classThunks';

const StudentClassRegistration = () => {
  const dispatch = useDispatch();
  const currentStudent = useSelector(state => state.student.currentStudent);
  const classes = useSelector(state => state.class.classes);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const reduxDispatch = useReduxDispatch();

  useEffect(() => {
    reduxDispatch(fetchClasses());
    if (currentStudent?.id) {
      CourseRegistrationService.getRegistrations({ student: currentStudent.id })
        .then(data => setRegistrations(data || []));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStudent?.id]);

  const isRegistered = (classItem) => {
    return registrations.some(reg => {
      // class_room có thể là id hoặc object
      const regClassId = typeof reg.class_room === 'object' ? reg.class_room.id : reg.class_room;
      return regClassId === classItem.id && ['approved', 'pending'].includes(reg.status);
    });
  };

  const handleRegister = async (courseId, classId) => {
    if (!currentStudent?.id) return;
    await CourseRegistrationService.createRegistration({
      student: currentStudent.id,
      class_room: classId,
      amount: '0', // hoặc truyền số tiền nếu có
      note: ''
    });
    // Reload lại danh sách đăng ký
    const data = await CourseRegistrationService.getRegistrations({ student: currentStudent.id });
    setRegistrations(data || []);
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
          {classes.length === 0 ? (
            <div className="text-center text-gray-500 py-8">Không có lớp học nào để đăng ký.</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {classes.map(classItem => {
                const registered = isRegistered(classItem);
                const isFull = (classItem.current_students || 0) >= classItem.max_students;
                const schedule = formatSchedule(classItem.schedule);
                return (
                  <div key={classItem.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-grow">
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
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="space-y-2">
                              <p className="flex items-center text-sm text-gray-600">
                                <span className="font-medium">Sĩ số:</span>
                                <span className="ml-1">
                                  {classItem.current_students?.length || 0}/{classItem.max_students}
                                </span>
                              </p>
                              <div className="flex items-center text-sm text-gray-600">
                                <span className="font-medium">Thời gian:</span>
                                <span className="ml-1">
                                  {formatDate(classItem.start_date)} - {formatDate(classItem.end_date)}
                                </span>
                              </div>
                            </div>
                          </div>
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
                      <div className="ml-4 flex-shrink-0">
                        {registered ? (
                          <button
                            onClick={() => handleUnregister(classItem.id)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Hủy đăng ký
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRegister(classItem.course_id, classItem.id)}
                            disabled={isFull}
                            className={`inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md
                              ${isFull
                                ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                                : 'text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                              }`}
                          >
                            Đăng ký
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentClassRegistration;