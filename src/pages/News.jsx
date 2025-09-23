import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNews, createNews, updateNews, deleteNews } from '../slices/newsSlice';
import { setAlert } from '../slices/alertSlice';
import Table from '../components/Table';
import Loading from '../components/Loading';
import Toast from '../components/Toast';
import { openModal } from '../slices/modalSlice';
import NewsService from '../services/NewsService';

const News = () => {
  const dispatch = useDispatch();
  const { newsList, loading, error } = useSelector((state) => state.news);
  const alert = useSelector((state) => state.alert);

  useEffect(() => {
    console.log('News component - useEffect called');
    dispatch(fetchNews());
  }, [dispatch]);

  const handleAddNews = () => {
    dispatch(openModal({ type: 'addNews' }));
  };

  const handleEditNews = (news) => {
    dispatch(openModal({
      type: 'editNews',
      data: { news }
    }));
  };

  const handleDeleteNews = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tin tức này?')) {
      try {
        await dispatch(deleteNews(id)).unwrap();
        dispatch(setAlert({
          type: 'success',
          message: 'Xóa tin tức thành công'
        }));
      } catch (error) {
        console.error('Không thể xóa tin tức:', error);
        dispatch(setAlert({
          type: 'error',
          message: error.message || 'Không thể xóa tin tức. Vui lòng thử lại'
        }));
      }
    }
  };

  const handleViewNews = (news) => {
    dispatch(openModal({
      type: 'viewNews',
      data: { news }
    }));
  };

  // Test function to check FormData
  const testFormData = async () => {
    const testFormData = new FormData();
    testFormData.append('title', 'Test Title');
    testFormData.append('link', 'https://test.com');
    testFormData.append('posted_at', '2024-01-01');
    testFormData.append('image', 'test_file.jpg'); // Fake file

    console.log('Test FormData entries:');
    for (let pair of testFormData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    try {
      const response = await NewsService.createNews(testFormData, localStorage.getItem('token'));
      console.log('Test response:', response);
    } catch (error) {
      console.error('Test error:', error);
    }
  };

  const columns = [
    {
      header: 'Tiêu đề',
      key: 'title',
      render: (item) => (
        <div className="font-medium text-gray-900 max-w-xs truncate">
          {item.title}
        </div>
      ),
    },
    {
      header: 'Link',
      key: 'link',
      render: (item) => (
        <div className="text-sm text-blue-600 max-w-xs truncate">
          <a href={item.link} target="_blank" rel="noopener noreferrer">
            {item.link}
          </a>
        </div>
      ),
    },
    {
      header: 'Hình ảnh',
      key: 'image',
      render: (item) => (
        <div className="w-16 h-16">
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover rounded"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
              Không có hình
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Ngày đăng',
      key: 'posted_at',
      render: (item) => new Date(item.posted_at).toLocaleDateString('vi-VN'),
    },
    {
      header: 'Thao tác',
      key: 'id',
      render: (item) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewNews(item)}
            className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Xem
          </button>
          <button
            onClick={() => handleEditNews(item)}
            className="px-3 py-1 text-sm text-white bg-yellow-500 rounded hover:bg-yellow-600 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Sửa
          </button>
          <button
            onClick={() => handleDeleteNews(item.id)}
            className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Xóa
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-red-500">Lỗi: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý tin tức</h1>
        <button
          onClick={handleAddNews}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm tin tức
        </button>
      </div>

      {newsList.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Chưa có tin tức nào</p>
      ) : (
        <Table
          columns={columns}
          data={newsList}
        />
      )}

      {alert.msg && (
        <Toast
          type={alert.msg.type}
          message={alert.msg.message}
          onClose={() => dispatch(setAlert({ msg: null }))}
        />
      )}
    </div>
  );
};

export default News;
