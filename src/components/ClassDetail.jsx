import React, { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { setCurrentLesson } from '../slices/courseSlice';
import { openModal } from '../slices/modalSlice';

const selectClassDetail = state => ({
  currentClass: state.course.currentClass,
  currentCourse: state.course.currentCourse,
  students: state.course.currentClass?.students || [],
  lessons: state.course.currentClass?.lessons || []
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
    console.log('Viewing lesson:', lesson);
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

  if (!currentClass || !currentCourse) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="text-sm text-gray-500 mb-1">
            {currentCourse.name}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentClass.name}</h2>
          <p className="text-gray-600">{currentClass.description}</p>
        </div>
      </div>

      {currentClass.thumbnail && (
        <div className="mb-8">
          <img 
            src={currentClass.thumbnail} 
            alt={currentClass.name}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin lớp học</h3>
          <div className="space-y-3 text-sm">
            <p className="flex items-center">
              <span className="font-medium w-32">Mã khóa học:</span>
              <span>{currentCourse?.code || 'N/A'}</span>
            </p>
            <p className="flex items-center">
              <span className="font-medium w-32">Tên khóa học:</span>
              <span>{currentCourse?.name || 'N/A'}</span>
            </p>
            <p className="flex items-center">
              <span className="font-medium w-32">Mã lớp:</span>
              <span>{currentClass.code || 'N/A'}</span>
            </p>
            <p className="flex items-center">
              <span className="font-medium w-32">Giáo viên:</span>
              <span>{currentClass.teacher || 'Chưa phân công'}</span>
            </p>
            {currentClass.teaching_assistant && (
              <p className="flex items-center">
                <span className="font-medium w-32">Trợ giảng:</span>
                <span>{currentClass.teaching_assistant}</span>
              </p>
            )}
            <p className="flex items-center">
              <span className="font-medium w-32">Sĩ số tối đa:</span>
              <span>{currentClass.max_students || 0} học sinh</span>
            </p>
            <p className="flex items-center">
              <span className="font-medium w-32">Thời gian:</span>
              <span>{currentClass.start_date || 'N/A'} - {currentClass.end_date || 'N/A'}</span>
            </p>
            <p className="flex items-center">
              <span className="font-medium w-32">Phòng học:</span>
              <span>{currentClass.room || 'Chưa phân phòng'}</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lịch học</h3>
          <div className="space-y-2">
            {currentClass.schedule ? (
              <div className="grid gap-2">
                {formatSchedule(currentClass.schedule).split('\n').map((scheduleItem, index) => (
                  <div key={index} className="flex items-center py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-900">{scheduleItem}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">Chưa có lịch học</p>
            )}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Danh sách học sinh ({students.length}/{currentClass.max_students})</h3>
          <button
            onClick={handleAddStudent}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Thêm học sinh
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ tên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số điện thoại</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map(student => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{student.first_name} {student.last_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{student.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{student.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditStudent(student)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Chỉnh sửa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Danh sách bài học ({lessons.length})</h3>
          <button
            onClick={handleAddLesson}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Thêm Học Phần
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map(lesson => (
            <div
              key={lesson.id}
              onClick={() => handleViewLesson(lesson)}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Bài {lesson.sequence_number}: {lesson.name}
                </h4>
                <p className="text-gray-600 text-sm mb-4">{lesson.description}</p>
                <div className="text-sm text-gray-500">
                  <p><span className="font-medium">Thời lượng:</span> {lesson.duration} phút</p>
                  <p><span className="font-medium">Tài liệu:</span> {lesson.materials?.length || 0}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ClassDetail); 