import React, { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { setCurrentLesson } from '../slices/courseSlice';
import { openModal } from '../slices/modalSlice';
import { ButtonAction } from './Table';

const selectClassDetail = state => ({
  currentClass: state.class.selectedClass || state.modal.data?.class,
  currentCourse: state.modal.data?.course,
  students: state.class.selectedClass?.students || state.modal.data?.class?.students || [],
  lessons: state.class.selectedClass?.lessons || state.modal.data?.class?.lessons || []
});

const ClassDetail = () => {
  const dispatch = useDispatch();
  const { currentClass, currentCourse, students, lessons } = useSelector(selectClassDetail, shallowEqual);

  const handleAddStudent = useCallback(() => {
    if (currentClass && currentCourse) {
      dispatch(openModal({
        type: 'addStudent',
        data: {
          class: currentClass,
          course: currentCourse
        }
      }));
    }
  }, [dispatch, currentClass, currentCourse]);

  const handleEditStudent = useCallback((student) => {
    if (currentClass && currentCourse) {
      dispatch(openModal({
        type: 'editStudent',
        data: {
          student: {
            ...student,
            class_id: currentClass.id,
            class_name: currentClass.name,
            course_id: currentCourse.id,
            course_name: currentCourse.name
          },
          class: currentClass,
          course: currentCourse
        }
      }));
    }
  }, [dispatch, currentClass, currentCourse]);

  const handleAddLesson = useCallback(() => {
    if (currentClass && currentCourse) {
      dispatch(openModal({
        type: 'addLesson',
        data: {
          class: currentClass,
          course: currentCourse
        }
      }));
    }
  }, [dispatch, currentClass, currentCourse]);

  const handleViewLesson = useCallback((lesson) => {
    if (currentClass && currentCourse) {
      dispatch(setCurrentLesson(lesson));
      dispatch(openModal({
        type: 'viewLesson',
        data: {
          lesson,
          class: currentClass,
          course: currentCourse
        }
      }));
    }
  }, [dispatch, currentClass, currentCourse]);

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

  // Helper functions to get data from different possible structures
  const getDisplayName = (user) => {
    if (!user) return '';
    if (typeof user === 'string') return user;
    if (typeof user === 'object') return user.name || user.email || String(user.id || '');
    return '';
  };

  const getTeacher = (cls) => getDisplayName(cls.teacher);
  const getAssistant = (cls) => getDisplayName(cls.teaching_assistant);
  const getStudentCount = (cls) => cls.student_count ?? 0;
  const getStatus = (cls) => {
    if (cls.is_active === false) return 'Ngừng hoạt động';
    if (cls.status === 'completed') return 'Đã hoàn thành';
    return 'Đang hoạt động';
  };

  if (!currentClass) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          Không tìm thấy thông tin lớp học
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentClass.name}</h2>
        {currentClass.description && (
          <p className="text-gray-600 mb-2">{currentClass.description}</p>
        )}
        {currentCourse && (
          <div className="text-sm text-gray-500 mb-1">Khóa học: {currentCourse.name}</div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin lớp học</h3>
          <div className="space-y-3 text-sm">
            <p><span className="font-medium">Mã lớp:</span> {currentClass.id}</p>
            <p><span className="font-medium">Tên lớp:</span> {currentClass.name}</p>
            <p><span className="font-medium">Giáo viên:</span> {getTeacher(currentClass)}</p>
            <p><span className="font-medium">Trợ giảng:</span> {getAssistant(currentClass)}</p>
            <p><span className="font-medium">Số học viên:</span> {getStudentCount(currentClass)}/{currentClass.max_students || 'Không giới hạn'}</p>
            <p><span className="font-medium">Thời gian:</span> {currentClass.start_date ? new Date(currentClass.start_date).toLocaleDateString('vi-VN') : 'N/A'} - {currentClass.end_date ? new Date(currentClass.end_date).toLocaleDateString('vi-VN') : 'N/A'}</p>
            <p><span className="font-medium">Trạng thái:</span> {getStatus(currentClass)}</p>
            <p><span className="font-medium">Tổng số buổi học:</span> {currentClass.total_sessions ?? 0}</p>
            {currentClass.schedule && (
              <p><span className="font-medium">Lịch học:</span> <span className="whitespace-pre-line">{typeof currentClass.schedule === 'string' ? currentClass.schedule : JSON.stringify(currentClass.schedule, null, 2)}</span></p>
            )}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Danh sách học viên ({students.length}/{currentClass.max_students || '∞'})
          </h3>
          <button
            onClick={handleAddStudent}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Thêm học viên
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {students.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    học viên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số điện thoại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày đăng ký
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={student.avatar || 'https://via.placeholder.com/40x40?text=U'}
                            alt=""
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {student.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.student_id || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.phone || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.enrolled_at ? new Date(student.enrolled_at).toLocaleDateString('vi-VN') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <ButtonAction color="blue" onClick={() => handleEditStudent(student)}>
                        <span className="sm:hidden">
                          {/* icon edit */}
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3h3z" /></svg>
                        </span>
                        <span className="hidden sm:inline">Sửa</span>
                      </ButtonAction>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Chưa có học viên nào đăng ký lớp học này
            </div>
          )}
        </div>
      </div>

      {lessons && lessons.length > 0 && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Danh sách bài học</h3>
            <button
              onClick={handleAddLesson}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Thêm bài học
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleViewLesson(lesson)}
              >
                <h4 className="font-medium text-gray-900 mb-2">{lesson.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{lesson.description}</p>
                <div className="text-xs text-gray-500">
                  Thời lượng: {lesson.duration || 'N/A'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassDetail; 