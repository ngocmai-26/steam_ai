import React, { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { openModal } from '../slices/modalSlice';

const selectLessonDetail = state => ({
  currentLesson: state.course.currentLesson,
  currentClass: state.course.currentClass,
  currentCourse: state.course.currentCourse
});

const LessonDetail = () => {
  const dispatch = useDispatch();
  const { currentLesson, currentClass, currentCourse } = useSelector(selectLessonDetail, shallowEqual);

  console.log('LessonDetail rendering with:', { currentLesson, currentClass, currentCourse });

  const handleEditLesson = useCallback(() => {
    if (currentLesson && currentClass && currentCourse) {
      dispatch(openModal({ 
        type: 'editLesson',
        data: {
          lesson: currentLesson,
          class: currentClass,
          course: currentCourse
        }
      }));
    }
  }, [dispatch, currentLesson, currentClass, currentCourse]);

  if (!currentLesson || !currentClass || !currentCourse) {
    console.log('Missing required data for LessonDetail');
    return null;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="text-sm text-gray-500 mb-1">
            {currentCourse.name} &gt; {currentClass.name}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Học phần {currentLesson.sequence_number}: {currentLesson.name}
          </h2>
          <p className="text-gray-600">{currentLesson.description}</p>
        </div>
        <button
          onClick={handleEditLesson}
          className="text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">Chỉnh sửa</span>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin học phần</h3>
          <div className="space-y-3 text-sm">
            <p><span className="font-medium">Thời lượng:</span> {currentLesson.duration} phút</p>
            <p><span className="font-medium">Loại học phần:</span> {currentLesson.type || 'Chưa phân loại'}</p>
            <p><span className="font-medium">Mục tiêu:</span> {currentLesson.objectives || 'Chưa có mục tiêu'}</p>
            <p><span className="font-medium">Yêu cầu:</span> {currentLesson.requirements || 'Không có yêu cầu đặc biệt'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Nội dung bài học</h3>
          <div className="space-y-3">
            {currentLesson.lesson_names && currentLesson.lesson_names.length > 0 ? (
              <div className="space-y-2">
                {currentLesson.lesson_names.map((name, index) => (
                  <button
                    key={index}
                    className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-center">
                      <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full font-medium mr-3">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{name}</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Chưa có nội dung bài học</p>
            )}
          </div>
        </div>
      </div>

      {currentLesson.materials && currentLesson.materials.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tài liệu học tập</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentLesson.materials.map((material, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  {material.type === 'slide' ? (
                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{material.name}</p>
                  <p className="text-sm text-gray-500 truncate">{material.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonDetail;