import React, { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { setCurrentClass } from '../slices/courseSlice';
import { openModal } from '../slices/modalSlice';

const selectCourseDetail = state => ({
  currentCourse: state.course.currentCourse
});

const CourseDetail = () => {
  const dispatch = useDispatch();
  const { currentCourse } = useSelector(selectCourseDetail, shallowEqual);

  const handleAddClass = useCallback(() => {
    dispatch(openModal({ type: 'addClass', data: { course: currentCourse } }));
  }, [dispatch, currentCourse]);

  const handleEditClass = useCallback((e, classData) => {
    e.stopPropagation();
    dispatch(setCurrentClass(classData));
    dispatch(openModal({ type: 'editClass', data: { course: currentCourse, class: classData } }));
  }, [dispatch, currentCourse]);

  const handleViewClass = useCallback((classData) => {
    dispatch(setCurrentClass(classData));
    dispatch(openModal({ type: 'viewClass', data: { course: currentCourse, class: classData } }));
  }, [dispatch, currentCourse]);

  if (!currentCourse) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentCourse.name}</h2>
          <p className="text-gray-600">{currentCourse.description}</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            currentCourse.is_active
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {currentCourse.is_active ? 'Đang hoạt động' : 'Không hoạt động'}
          </span>
        </div>
      </div>

      {(currentCourse.thumbnail_url || currentCourse.thumbnail) && (
        <div className="mb-8">
          <img 
            src={currentCourse.thumbnail_url || currentCourse.thumbnail} 
            alt={currentCourse.name}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Danh sách lớp học</h3>
          <button
            onClick={handleAddClass}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Thêm lớp học
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentCourse.classes?.map(classItem => (
            <div
              key={classItem.id}
              onClick={() => handleViewClass(classItem)}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
            >
              {classItem.thumbnail && (
                <img
                  src={classItem.thumbnail}
                  alt={classItem.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{classItem.name}</h4>
                  <button
                    onClick={(e) => handleEditClass(e, classItem)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Chỉnh sửa</span>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-600 text-sm mb-4">{classItem.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                  <div>
                    <p><span className="font-medium">Giáo viên:</span> {classItem.teacher}</p>
                    {classItem.teaching_assistant && (
                      <p><span className="font-medium">Trợ giảng:</span> {classItem.teaching_assistant}</p>
                    )}
                  </div>
                  <div>
                    <p><span className="font-medium">Học sinh:</span> {classItem.students?.length || 0}/{classItem.max_students}</p>
                    <p><span className="font-medium">Bài học:</span> {classItem.lessons?.length || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(CourseDetail); 