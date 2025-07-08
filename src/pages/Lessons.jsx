import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { LessonService } from '../services/LessonService';
import Modal from '../components/Modal';
import Table from '../components/Table';
import { ButtonAction } from '../components/Table';
import { toast } from 'react-toastify';

const Lessons = () => {
  const user = useSelector(state => state.auth.user);
  const isTeacher = user?.role === 'teacher';
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editLesson, setEditLesson] = useState(null);
  const [form, setForm] = useState({ name: '', sequence_number: 1, module: '' });
  const [modules, setModules] = useState([]); // TODO: fetch modules for filter & select
  const [filterModule, setFilterModule] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

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
      let params = {};
      if (filterModule) params.module = filterModule;
      if (isTeacher && user?.id) params.teacher = user.id;
      const res = await LessonService.getLessons(params);
      setLessons(res.data || res || []);
    } catch (e) {
      setError('Không thể tải danh sách buổi học');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchLessons(); }, [filterModule, isTeacher, user]);

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

  // Upload ảnh buổi học
  const handleOpenUpload = (lesson) => {
    setSelectedLesson(lesson);
    setShowUploadModal(true);
  };
  const handleUploadImage = async (e) => {
    e.preventDefault();
    const file = e.target.elements.image.files[0];
    if (!file || !selectedLesson) return;
    setUploading(true);
    try {
      await LessonService.uploadLessonGallery(selectedLesson.id, file);
      setShowUploadModal(false);
      toast.success('Upload ảnh thành công!');
    } finally {
      setUploading(false);
    }
  };

  // Xem gallery ảnh buổi học
  const handleOpenGallery = async (lesson) => {
    setSelectedLesson(lesson);
    setShowGalleryModal(true);
    const images = await LessonService.getLessonGalleries({ lesson: lesson.id });
    setGalleryImages(images || []);
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

  // Định nghĩa columns cho Table component
  const columns = [
    {
      header: 'STT',
      key: 'sequence_number',
      render: (item) => <span className="text-center w-full block">{item.sequence_number}</span>,
    },
    {
      header: 'Tên buổi học',
      key: 'name',
      render: (item) => <span className="font-medium">{item.name}</span>,
    },
    {
      header: 'Học phần',
      key: 'module',
      render: (item) => modules.find(m => m.id === item.module)?.name || item.module,
    },
    {
      header: 'Thao tác',
      key: 'actions',
      render: (item) => (
        <div className="flex gap-2 justify-center flex-wrap">
          <ButtonAction color="blue" onClick={() => openEdit(item)}>
            <span className="sm:hidden">
              {/* icon edit */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3h3z" /></svg>
            </span>
            <span className="hidden sm:inline">Sửa</span>
          </ButtonAction>
          <ButtonAction color="red" onClick={() => handleDelete(item.id)}>
            <span className="sm:hidden">
              {/* icon trash */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </span>
            <span className="hidden sm:inline">Xóa</span>
          </ButtonAction>
          {isTeacher && (
            <ButtonAction color="indigo" onClick={() => handleOpenUpload(item)}>
              <span className="sm:hidden">
                {/* icon upload */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" /></svg>
              </span>
              <span className="hidden sm:inline">Up ảnh</span>
            </ButtonAction>
          )}
          <ButtonAction color="indigo" onClick={() => handleOpenGallery(item)}>
            <span className="sm:hidden">
              {/* icon gallery */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M16 3H8a2 2 0 00-2 2v0a2 2 0 002 2h8a2 2 0 002-2v0a2 2 0 00-2-2z" /></svg>
            </span>
            <span className="hidden sm:inline">Xem ảnh</span>
          </ButtonAction>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full px-2 sm:px-4 md:px-8 py-4 md:py-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">Quản lý buổi học</h1>
        <button onClick={openAdd} className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base">
          Thêm buổi học
        </button>
      </div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-2">
        <label className="block text-base font-medium mb-1 sm:mb-0 text-gray-700">Lọc theo học phần:</label>
        <select value={filterModule} onChange={e => setFilterModule(e.target.value)} className="border border-gray-400 rounded-lg px-4 py-2 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 text-base bg-white shadow-sm">
          <option value="">Tất cả học phần</option>
          {modules.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </div>
      {error && <div className="text-red-500 mb-4 font-semibold">{error}</div>}
      {loading ? <div>Đang tải...</div> : (
        <div className="-mx-2 sm:-mx-4 md:-mx-8">
          <div className="bg-white rounded-lg shadow p-2 sm:p-4 overflow-x-auto">
            <Table
              columns={columns}
              data={lessons}
              emptyMessage="Chưa có buổi học nào"
            />
          </div>
        </div>
      )}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editLesson ? 'Sửa buổi học' : 'Thêm buổi học'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Tên buổi học *</label>
            <input type="text" className="w-full border border-gray-400 rounded-lg px-4 py-2 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 bg-white shadow-sm" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Số thứ tự *</label>
            <input type="number" min={1} className="w-full border border-gray-400 rounded-lg px-4 py-2 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 bg-white shadow-sm" required value={form.sequence_number} onChange={e => setForm(f => ({ ...f, sequence_number: e.target.value }))} />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Học phần *</label>
            <select className="w-full border border-gray-400 rounded-lg px-4 py-2 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 bg-white shadow-sm" required value={form.module} onChange={e => setForm(f => ({ ...f, module: e.target.value }))}>
              <option value="">Chọn học phần</option>
              {modules.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <button type="submit" className="bg-green-600 text-white px-8 py-2 rounded-xl hover:bg-green-700 mt-2 font-bold shadow-lg transition">Lưu</button>
        </form>
      </Modal>
      {/* Modal upload ảnh */}
      <Modal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} title={selectedLesson ? `Up ảnh buổi học: ${selectedLesson.name}` : 'Up ảnh buổi học'}>
        <form onSubmit={handleUploadImage} className="space-y-4">
          <input type="file" name="image" accept="image/*" required className="block w-full" />
          <button type="submit" disabled={uploading} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition w-full">
            {uploading ? 'Đang upload...' : 'Upload'}
          </button>
        </form>
      </Modal>
      {/* Modal xem gallery ảnh */}
      <Modal isOpen={showGalleryModal} onClose={() => setShowGalleryModal(false)} title={selectedLesson ? `Ảnh buổi học: ${selectedLesson.name}` : 'Ảnh buổi học'}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {galleryImages && galleryImages.length > 0 ? (
            galleryImages.flatMap(img =>
              (img.image_urls || []).map((url, idx) => (
                <img
                  key={img.id + '-' + idx}
                  src={url}
                  alt="lesson gallery"
                  className="rounded-lg w-full object-cover cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => { setSelectedImage(url); setShowImageModal(true); }}
                />
              ))
            )
          ) : <div className="col-span-2 text-gray-500">Chưa có ảnh nào</div>}
        </div>
      </Modal>
      {/* Modal xem ảnh lớn */}
      <Modal isOpen={showImageModal} onClose={() => setShowImageModal(false)} title="Xem ảnh lớn">
        {selectedImage && (
          <img src={selectedImage} alt="Ảnh lớn" className="w-full h-auto max-h-[70vh] object-contain rounded-xl mx-auto" />
        )}
      </Modal>
    </div>
  );
};

export default Lessons; 