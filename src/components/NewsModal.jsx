import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../slices/modalSlice';
import { createNews, updateNews, fetchNews } from '../slices/newsSlice';
import { setAlert } from '../slices/alertSlice';

const NewsModal = () => {
  const dispatch = useDispatch();
  const { type, data } = useSelector((state) => state.modal);
  const selectedNews = data?.news;

  const [formData, setFormData] = useState({
    title: '',
    link: '',
    posted_at: new Date().toISOString().split('T')[0],
    image: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedNews && (type === 'editNews' || type === 'viewNews')) {
      setFormData({
        title: selectedNews.title || '',
        link: selectedNews.link || '',
        posted_at: selectedNews.posted_at ? selectedNews.posted_at.split('T')[0] : new Date().toISOString().split('T')[0],
        image: selectedNews.image || ''
      });
      setImagePreview(selectedNews.image || null);
      setSelectedFile(null);
    } else if (type === 'addNews') {
      setFormData({
        title: '',
        link: '',
        posted_at: new Date().toISOString().split('T')[0],
        image: ''
      });
      setSelectedFile(null);
      setImagePreview(null);
    }
  }, [selectedNews, type]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Submitting news form data:', {
        title: formData.title,
        link: formData.link,
        posted_at: formData.posted_at,
        selectedFile: selectedFile,
        formDataImage: formData.image
      });

      // Create FormData for file upload support
      const submitData = new FormData();

      // Append text fields
      submitData.append('title', formData.title);
      submitData.append('link', formData.link);
      submitData.append('posted_at', formData.posted_at);

      // Append file if exists
      if (selectedFile && selectedFile instanceof File) {
        submitData.append('image', selectedFile);
        console.log('Adding file to FormData:', selectedFile.name);
      } else {
        submitData.append('image', '');
        console.log('Adding empty string for image field');
      }

      if (type === 'editNews') {
        await dispatch(updateNews({
          id: selectedNews.id,
          newsData: submitData
        })).unwrap();

        dispatch(setAlert({
          type: 'success',
          message: 'Cập nhật tin tức thành công'
        }));
      } else if (type === 'addNews') {
        await dispatch(createNews(submitData)).unwrap();

        dispatch(setAlert({
          type: 'success',
          message: 'Thêm tin tức thành công'
        }));
      }

      dispatch(fetchNews());
      dispatch(closeModal());
    } catch (error) {
      console.error('Lỗi khi lưu tin tức:', error);
      dispatch(setAlert({
        type: 'error',
        message: error.message || 'Không thể lưu tin tức. Vui lòng thử lại'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    dispatch(closeModal());
  };

  const isViewMode = type === 'viewNews';

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">
          {type === 'addNews' ? 'Thêm tin tức mới' :
           type === 'editNews' ? 'Chỉnh sửa tin tức' :
           'Chi tiết tin tức'}
        </h2>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Tiêu đề *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            disabled={isViewMode}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${isViewMode ? 'bg-gray-100' : ''}`}
            placeholder="Nhập tiêu đề tin tức"
          />
        </div>

        <div>
          <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
            Link *
          </label>
          <input
            type="url"
            id="link"
            name="link"
            value={formData.link}
            onChange={handleInputChange}
            required
            disabled={isViewMode}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${isViewMode ? 'bg-gray-100' : ''}`}
            placeholder="https://example.com/news"
          />
        </div>

        <div>
          <label htmlFor="posted_at" className="block text-sm font-medium text-gray-700 mb-1">
            Ngày đăng *
          </label>
          <input
            type="date"
            id="posted_at"
            name="posted_at"
            value={formData.posted_at}
            onChange={handleInputChange}
            required
            disabled={isViewMode}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${isViewMode ? 'bg-gray-100' : ''}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hình ảnh
          </label>
         
          {!isViewMode && (
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          )}
          {isViewMode && formData.image && (
            <div>
              <img
                src={formData.image}
                alt={formData.title}
                className="w-full max-w-md h-auto rounded border"
              />
            </div>
          )}
        </div>

        {!isViewMode && (
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Đang lưu...' : (type === 'editNews' ? 'Cập nhật' : 'Thêm mới')}
            </button>
          </div>
        )}

        {isViewMode && (
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Đóng
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default NewsModal; 