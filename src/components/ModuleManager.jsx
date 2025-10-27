import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from '../axiosConfig';
import { closeModal } from '../slices/modalSlice';
import { MODULE_ENDPOINTS } from '../constants/api';
import { ButtonAction } from './Table';

const API = MODULE_ENDPOINTS.MODULES;

const ModuleManager = () => {
  const dispatch = useDispatch();
  const { data } = useSelector(state => state.modal);
  const user = useSelector(state => state.auth.user);
  const isManager = user?.role?.toLowerCase() === 'manager';
  const classId = data?.classId;
  const className = data?.className;
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    sequence_number: 1,
    total_lessons: 1,
    lesson_names: ['']
  });
  const [submitting, setSubmitting] = useState(false);

  // Lấy danh sách học phần
  useEffect(() => {
    if (!classId) return;
    setLoading(true);
    axios.get(`${API}?class_room=${classId}`)
      .then(res => setModules(res.data.data || []))
      .catch(() => setError('Không thể tải danh sách học phần'))
      .finally(() => setLoading(false));
  }, [classId]);

  // Thêm học phần
  const handleAddModule = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(API, {
        class_room: classId,
        name: form.name,
        description: form.description,
        sequence_number: Number(form.sequence_number),
        total_lessons: Number(form.total_lessons),
        lesson_names: form.lesson_names.filter(Boolean)
      });
      setForm({ name: '', description: '', sequence_number: 1, total_lessons: 1, lesson_names: [''] });
      setShowForm(false);
      // Reload modules
      const res = await axios.get(`${API}?class_room=${classId}`);
      setModules(res.data.data || []);
    } catch {
      setError('Không thể thêm học phần');
    } finally {
      setSubmitting(false);
    }
  };

  // Xóa học phần
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa học phần này?')) return;
    try {
      await axios.delete(`${API}/${id}`);
      setModules(modules.filter(m => m.id !== id));
    } catch {
      setError('Không thể xóa học phần');
    }
  };

  // Xem chi tiết học phần (có thể mở rộng sau)
  const handleView = (module) => {
    alert(`Tên học phần: ${module.name}\nMô tả: ${module.description || ''}\nSố thứ tự: ${module.sequence_number}\nTổng số bài học: ${module.total_lessons}`);
  };

  // Thêm/xóa tên bài học trong form
  const handleLessonNameChange = (idx, value) => {
    setForm(f => {
      const arr = [...f.lesson_names];
      arr[idx] = value;
      return { ...f, lesson_names: arr };
    });
  };
  const handleAddLessonName = () => setForm(f => ({ ...f, lesson_names: [...f.lesson_names, ''] }));
  const handleRemoveLessonName = (idx) => setForm(f => ({ ...f, lesson_names: f.lesson_names.filter((_, i) => i !== idx) }));

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý học phần</h2>
          <p className="text-gray-600 mt-1">Lớp: <span className="text-indigo-600 font-semibold">{className}</span></p>
        </div>
        <button 
          onClick={() => dispatch(closeModal())} 
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Đóng
        </button>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}

      {isManager && (
        <div className="mb-6">
          <button 
            onClick={() => setShowForm(f => !f)} 
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {showForm ? 'Ẩn form' : 'Thêm học phần'}
          </button>
        </div>
      )}

      {showForm && (
        <div className="bg-white border-2 border-gray-200 rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Thông tin học phần mới
          </h3>
          <form onSubmit={handleAddModule} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên học phần <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                  required 
                  value={form.name} 
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Nhập tên học phần..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none" 
                  rows="3"
                  value={form.description} 
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Nhập mô tả học phần..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số thứ tự <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  min={1} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                  required 
                  value={form.sequence_number} 
                  onChange={e => setForm(f => ({ ...f, sequence_number: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tổng số bài học <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  min={1} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                  required 
                  value={form.total_lessons} 
                  onChange={e => {
                    const val = parseInt(e.target.value) || 1;
                    setForm(f => {
                      let lesson_names = f.lesson_names.slice(0, val);
                      while (lesson_names.length < val) lesson_names.push('');
                      return { ...f, total_lessons: val, lesson_names };
                    });
                  }}
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">Tên các bài học</label>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {form.lesson_names.map((name, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">
                      {idx + 1}
                    </span>
                    <input 
                      type="text" 
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                      value={name} 
                      onChange={e => handleLessonNameChange(idx, e.target.value)}
                      placeholder={`Bài ${idx + 1}...`}
                    />
                    <button 
                      type="button" 
                      onClick={() => handleRemoveLessonName(idx)} 
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa bài học này"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <button 
                type="button" 
                onClick={handleAddLessonName} 
                className="mt-3 flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Thêm bài học
              </button>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setForm({ name: '', description: '', sequence_number: 1, total_lessons: 1, lesson_names: [''] });
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button 
                type="submit" 
                disabled={submitting} 
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Lưu học phần
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Danh sách học phần</h3>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-8">
              <svg className="animate-spin h-8 w-8 text-indigo-600 mx-auto" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-500 mt-2">Đang tải...</p>
            </div>
          ) : modules.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Chưa có học phần nào. Hãy thêm học phần mới.
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên học phần</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng số bài học</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {modules.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-800 rounded-full font-semibold text-sm">
                        {m.sequence_number}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{m.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate">{m.description || 'Không có mô tả'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {m.total_lessons} bài
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center gap-2">
                        <ButtonAction color="indigo" onClick={() => handleView(m)} title="Chi tiết">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </ButtonAction>
                        {isManager && (
                          <ButtonAction color="red" onClick={() => handleDelete(m.id)} title="Xóa">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </ButtonAction>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuleManager; 