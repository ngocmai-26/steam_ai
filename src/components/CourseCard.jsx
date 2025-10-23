import React, { memo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentCourse } from '../slices/courseSlice';
import { openModal } from '../slices/modalSlice';
import { deleteCourseThunk, fetchCoursesThunk } from '../thunks/courseThunks';
import { toast } from 'react-toastify';
import { getThumbnailUrl } from '../utils/imageUtils';
import ImageWithFallback from './ImageWithFallback';

const CourseCard = memo(({ course }) => {
  const dispatch = useDispatch();

  const handleEditCourse = useCallback((e) => {
    e?.stopPropagation();
    dispatch(setCurrentCourse(course));
    dispatch(openModal({ type: 'edit', data: { course } }));
  }, [dispatch, course]);

  const handleViewCourse = useCallback(() => {
    dispatch(setCurrentCourse(course));
    dispatch(openModal({ type: 'viewCourse', data: { course } }));
  }, [dispatch, course]);

  const handleDeleteCourse = useCallback(async (e) => {
    e.stopPropagation();
    if (!window.confirm(`Bạn có chắc chắn muốn xóa khóa học "${course.name}"?`)) return;
    try {
      await dispatch(deleteCourseThunk(course.id)).unwrap();
      toast.success('Xóa khóa học thành công!');
      dispatch(fetchCoursesThunk());
    } catch (error) {
      console.error('Delete course error:', error);
      toast.error('Xóa khóa học thất bại!');
    }
  }, [dispatch, course]);

  const handleImageError = useCallback((e) => {
    console.log('Image failed to load:', e.target.src);
    
    // Try alternative Google Drive URL format if current one failed
    if (e.target.src.includes('drive.google.com/thumbnail')) {
      const fileIdMatch = e.target.src.match(/id=([a-zA-Z0-9-_]+)/);
      if (fileIdMatch && fileIdMatch[1]) {
        const fileId = fileIdMatch[1];
        const alternativeUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
        console.log('Trying alternative URL:', alternativeUrl);
        e.target.src = alternativeUrl;
        return;
      }
    }
    
    // If all else fails, use placeholder
    if (e.target.src !== 'https://via.placeholder.com/400x300?text=No+Image') {
      console.log('Using placeholder image');
      e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
    }
  }, []);

  const thumbnailUrl = getThumbnailUrl(course);
  
  // Debug logging
  console.log('CourseCard - Course:', course.name);
  console.log('CourseCard - Original thumbnail_url:', course.thumbnail_url);
  console.log('CourseCard - Formatted thumbnailUrl:', thumbnailUrl);



  return (
    <div
      onClick={handleViewCourse}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200 relative"
    >
      {/* Nút xóa ở góc phải trên */}
      <button
        onClick={handleDeleteCourse}
        className="absolute top-2 right-2 z-10 bg-white bg-opacity-80 rounded-full p-1 text-red-500 hover:text-red-700 hover:bg-red-100 shadow"
        title="Xóa khóa học"
      >
        <svg className="h-5 w-5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      {thumbnailUrl && (
        <ImageWithFallback
          src={course.thumbnail_url}
          alt={course.name}
          className="w-full h-48 object-cover"
          fallbackSrc="https://via.placeholder.com/400x300?text=No+Image"
        />
      )}
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{course.name}</h2>
          <button
            onClick={handleEditCourse}
            className="text-gray-400 hover:text-gray-500 mr-2"
          >
            <span className="sr-only">Edit</span>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
        <p className="text-gray-600 text-sm mb-4">{course.description}</p>
        <div className="text-sm text-gray-500 space-y-1">
          <p><span className="font-medium">Mã khóa học:</span> {course.code}</p>
          <p><span className="font-medium">Giá:</span> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price || 0)}/level</p>
          <p><span className="font-medium">Thời lượng:</span> {course.duration} phút/level</p>
          <p className="flex items-center">
            <span className="font-medium">Trạng thái:</span>
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${course.is_active
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
              }`}>
              {course.is_active ? 'Đang hoạt động' : 'Không hoạt động'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
});

CourseCard.displayName = 'CourseCard';

export default CourseCard;
