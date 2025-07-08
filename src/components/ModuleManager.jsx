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
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Quản lý học phần của lớp: <span className="text-indigo-600">{className}</span></h2>
        <button onClick={() => dispatch(closeModal())} className="text-gray-500 hover:text-red-500">Đóng</button>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="mb-4">
        <button onClick={() => setShowForm(f => !f)} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          {showForm ? 'Ẩn form thêm học phần' : 'Thêm học phần'}
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleAddModule} className="bg-gray-50 p-4 rounded mb-6 space-y-3">
          <div>
            <label className="block font-medium mb-1">Tên học phần *</label>
            <input type="text" className="w-full border rounded px-2 py-1" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className="block font-medium mb-1">Mô tả</label>
            <textarea className="w-full border rounded px-2 py-1" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-medium mb-1">Số thứ tự *</label>
              <input type="number" min={1} className="w-full border rounded px-2 py-1" required value={form.sequence_number} onChange={e => setForm(f => ({ ...f, sequence_number: e.target.value }))} />
            </div>
            <div className="flex-1">
              <label className="block font-medium mb-1">Tổng số bài học *</label>
              <input type="number" min={1} className="w-full border rounded px-2 py-1" required value={form.total_lessons} onChange={e => {
                const val = parseInt(e.target.value) || 1;
                setForm(f => {
                  let lesson_names = f.lesson_names.slice(0, val);
                  while (lesson_names.length < val) lesson_names.push('');
                  return { ...f, total_lessons: val, lesson_names };
                });
              }} />
            </div>
          </div>
          <div>
            <label className="block font-medium mb-1">Tên các bài học</label>
            {form.lesson_names.map((name, idx) => (
              <div key={idx} className="flex gap-2 mb-1">
                <input type="text" className="flex-1 border rounded px-2 py-1" value={name} onChange={e => handleLessonNameChange(idx, e.target.value)} />
                <button type="button" onClick={() => handleRemoveLessonName(idx)} className="text-red-500">Xóa</button>
              </div>
            ))}
            <button type="button" onClick={handleAddLessonName} className="text-indigo-600 mt-1">+ Thêm tên bài học</button>
          </div>
          <button type="submit" disabled={submitting} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-2">
            {submitting ? 'Đang lưu...' : 'Lưu học phần'}
          </button>
        </form>
      )}
      <h3 className="text-lg font-semibold mb-2">Danh sách học phần</h3>
      {loading ? <div>Đang tải...</div> : (
        <table className="w-full border rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">STT</th>
              <th className="p-2">Tên học phần</th>
              <th className="p-2">Mô tả</th>
              <th className="p-2">Tổng số bài học</th>
              <th className="p-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {modules.length === 0 ? (
              <tr><td colSpan={5} className="text-center text-gray-500 py-4">Chưa có học phần nào</td></tr>
            ) : modules.map((m, idx) => (
              <tr key={m.id} className="border-t">
                <td className="p-2 text-center">{m.sequence_number}</td>
                <td className="p-2 font-medium">{m.name}</td>
                <td className="p-2">{m.description}</td>
                <td className="p-2 text-center">{m.total_lessons}</td>
                <td className="p-2 flex gap-2">
                  <ButtonAction color="indigo" onClick={() => handleView(m)}>
                    <span className="sm:hidden">
                      {/* icon info */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
                    </span>
                    <span className="hidden sm:inline">Chi tiết</span>
                  </ButtonAction>
                  <ButtonAction color="red" onClick={() => handleDelete(m.id)}>
                    <span className="sm:hidden">
                      {/* icon trash */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </span>
                    <span className="hidden sm:inline">Xóa</span>
                  </ButtonAction>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ModuleManager; 