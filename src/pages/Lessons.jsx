import React, { useEffect, useState } from 'react';
import { LessonService } from '../services/LessonService';
import Modal from '../components/Modal';

const Lessons = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editLesson, setEditLesson] = useState(null);
  const [form, setForm] = useState({ name: '', sequence_number: 1, module: '' });
  const [modules, setModules] = useState([]); // TODO: fetch modules for filter & select
  const [filterModule, setFilterModule] = useState('');

  // Fetch modules for filter/select (giả lập, cần thay bằng API thực tế)
  useEffect(() => {
    // TODO: Thay bằng gọi API lấy modules thực tế
    setModules([
      { id: 1, name: 'Module 1' },
      { id: 2, name: 'Module 2' },
    ]);
  }, []);

  // Fetch lessons
  const fetchLessons = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await LessonService.getLessons(filterModule || null);
      setLessons(res.data || []);
    } catch (e) {
      setError('Không thể tải danh sách buổi học');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchLessons(); }, [filterModule]);

  // Thêm/sửa buổi học
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.module || isNaN(Number(form.module))) {
      setError('Vui lòng chọn học phần hợp lệ!');
      return;
    }
    try {
      const payload = {
        ...form,
        module: Number(form.module),
        sequence_number: Number(form.sequence_number),
      };
      if (editLesson) {
        await LessonService.updateLesson(editLesson.id, payload);
      } else {
        await LessonService.createLesson(payload);
      }
      setShowModal(false);
      setEditLesson(null);
      setForm({ name: '', sequence_number: 1, module: '' });
      fetchLessons();
    } catch {
      setError('Không thể lưu buổi học');
    }
  };

  // Xóa buổi học
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa buổi học này?')) return;
    try {
      await LessonService.deleteLesson(id);
      fetchLessons();
    } catch {
      setError('Không thể xóa buổi học');
    }
  };

  // Mở modal thêm/sửa
  const openAdd = () => {
    setEditLesson(null);
    setForm({ name: '', sequence_number: 1, module: '' });
    setShowModal(true);
  };
  const openEdit = (lesson) => {
    setEditLesson(lesson);
    setForm({ name: lesson.name, sequence_number: lesson.sequence_number, module: lesson.module });
    setShowModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý buổi học</h1>
        <button onClick={openAdd} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Thêm buổi học</button>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Lọc theo học phần:</label>
        <select value={filterModule} onChange={e => setFilterModule(e.target.value)} className="border rounded px-2 py-1">
          <option value="">Tất cả học phần</option>
          {modules.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? <div>Đang tải...</div> : (
        <table className="w-full border rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">STT</th>
              <th className="p-2">Tên buổi học</th>
              <th className="p-2">Học phần</th>
              <th className="p-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {lessons.length === 0 ? (
              <tr><td colSpan={4} className="text-center text-gray-500 py-4">Chưa có buổi học nào</td></tr>
            ) : lessons.map((l, idx) => (
              <tr key={l.id} className="border-t">
                <td className="p-2 text-center">{l.sequence_number}</td>
                <td className="p-2 font-medium">{l.name}</td>
                <td className="p-2">{modules.find(m => m.id === l.module)?.name || l.module}</td>
                <td className="p-2 flex gap-2">
                  <button onClick={() => openEdit(l)} className="text-blue-600 hover:underline">Sửa</button>
                  <button onClick={() => handleDelete(l.id)} className="text-red-600 hover:underline">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editLesson ? 'Sửa buổi học' : 'Thêm buổi học'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Tên buổi học *</label>
            <input type="text" className="w-full border rounded px-2 py-1" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className="block font-medium mb-1">Số thứ tự *</label>
            <input type="number" min={1} className="w-full border rounded px-2 py-1" required value={form.sequence_number} onChange={e => setForm(f => ({ ...f, sequence_number: e.target.value }))} />
          </div>
          <div>
            <label className="block font-medium mb-1">Học phần *</label>
            <select className="w-full border rounded px-2 py-1" required value={form.module} onChange={e => setForm(f => ({ ...f, module: e.target.value }))}>
              <option value="">Chọn học phần</option>
              {modules.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-2">Lưu</button>
        </form>
      </Modal>
    </div>
  );
};

export default Lessons; 