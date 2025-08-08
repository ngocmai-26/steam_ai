import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../slices/modalSlice';
import { createCourseThunk, updateCourseThunk } from '../thunks/courseThunks';

const CourseModal = () => {
  const dispatch = useDispatch();
  const { type, data } = useSelector((state) => state.modal);
  const selectedCourse = data?.course;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    is_active: true,
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [removeThumbnail, setRemoveThumbnail] = useState(false);
  const [filePreview, setFilePreview] = useState(null);

  // Debug: Log formData and selectedFile changes


  // Debug: Log selectedFile changes separately


  // Cleanup preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  useEffect(() => {
    if (selectedCourse && type === 'edit') {
      setFormData({
        name: selectedCourse.name || '',
        description: selectedCourse.description || '',
        price: selectedCourse.price || '',
        duration: selectedCourse.duration || '',
        is_active: selectedCourse.is_active || false,
      });
      // KHÔNG reset selectedFile và selectedFileName khi edit
      setRemoveThumbnail(false); // Reset remove thumbnail flag
    } else if (type === 'add') {
      // Reset form khi thêm mới
      setFormData({
        name: '',
        description: '',
        price: '',
        duration: '',
        is_active: true,
      });
      setSelectedFile(null); // Chỉ reset file khi thêm mới
      setSelectedFileName('');
      setRemoveThumbnail(false);
    }
  }, [selectedCourse, type]); // Loại bỏ selectedFile khỏi dependency array

  const handleSubmit = async (e) => {
    e.preventDefault();



    // Parse các trường không bắt buộc: nếu là chuỗi rỗng thì chuyển thành null
    const parsedData = {
      ...formData,
      description: formData.description.trim() === '' ? null : formData.description,
      price: formData.price === '' ? null : formData.price,
      duration: formData.duration === '' ? null : formData.duration,
    };

    // Xử lý thumbnail

    if (selectedFile) {
      // Có file mới được chọn


      parsedData.thumbnail = selectedFile;
      // Thử thêm với tên field khác nếu server yêu cầu
      parsedData.image = selectedFile;
      parsedData.file = selectedFile;

    } else if (type === 'edit' && removeThumbnail) {
      // Đang chỉnh sửa và muốn xóa thumbnail
      parsedData.remove_thumbnail = true;
    } else {
      // Không có file mới và không muốn xóa thumbnail
      delete parsedData.thumbnail;
    }
    try {
      if (type === 'edit') {
        await dispatch(updateCourseThunk({ id: selectedCourse.id, courseData: parsedData })).unwrap();
      } else {
        await dispatch(createCourseThunk(parsedData)).unwrap();
      }
      dispatch(closeModal());
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'thumbnail' && files && files.length > 0) {
      const file = files[0];


      setSelectedFile(file);
      setSelectedFileName(file?.name || '');
      setRemoveThumbnail(false); // Reset remove thumbnail flag khi chọn file mới

      // Tạo preview URL
      const previewUrl = URL.createObjectURL(file);
      setFilePreview(previewUrl);

    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {type === 'edit' ? 'Chỉnh sửa khóa học' : 'Thêm khóa học mới'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {type === 'edit' ? 'Cập nhật thông tin khóa học' : 'Điền thông tin để tạo khóa học mới'}
          </p>
        </div>
        <button
          onClick={() => dispatch(closeModal())}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
        >
          <span className="sr-only">Đóng</span>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tên khóa học */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Tên khóa học <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Nhập tên khóa học..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-400"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>

        {/* Mô tả */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Mô tả
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Nhập mô tả khóa học..."
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-400 resize-none"
          />
        </div>

        {/* Giá và Thời lượng */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Giá (VNĐ)
            </label>
            <div className="relative">
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-400"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Thời lượng (phút)
            </label>
            <div className="relative">
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-400"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Trạng thái */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Trạng thái
          </label>
          <div className="relative">
            <select
              name="is_active"
              value={formData.is_active}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-900 appearance-none"
            >
              <option value={true}>Đang hoạt động</option>
              <option value={false}>Không hoạt động</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Hình ảnh */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Hình ảnh
          </label>
          <div className="relative">
            <input
              type="file"
              name="thumbnail"
              onChange={handleChange}
              accept="image/*"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-900"
            />

            {/* Hiển thị preview của file đã chọn */}
            {selectedFile && filePreview && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <div className="flex items-center space-x-2">
                  <img
                    src={filePreview}
                    alt="File preview"
                    className="w-32 h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="text-xs text-gray-500">
                    <p>Tên: {selectedFile.name}</p>
                    <p>Kích thước: {selectedFile.size} bytes</p>
                    <p>Loại: {selectedFile.type}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Hiển thị hình ảnh hiện tại khi chỉnh sửa */}
            {type === 'edit' && selectedCourse && (selectedCourse.thumbnail_url || selectedCourse.thumbnail) && !selectedFileName && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-2">Hình ảnh hiện tại:</p>
                <div className="flex items-center space-x-2 mb-2">
                  <img
                    src={selectedCourse.thumbnail_url || selectedCourse.thumbnail}
                    alt="Current thumbnail"
                    className="w-32 h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => setRemoveThumbnail(true)}
                    className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors duration-200"
                  >
                    Xóa ảnh
                  </button>
                </div>
                <p className="text-xs text-gray-500">Chọn file mới để thay thế hoặc nhấn "Xóa ảnh" để xóa</p>
              </div>
            )}

           
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => dispatch(closeModal())}
            className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {type === 'edit' ? 'Cập nhật' : 'Thêm mới'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseModal; 