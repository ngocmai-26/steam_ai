import React, { useState, useEffect } from 'react';
import LessonDocumentationService from '../../services/LessonDocumentationService';

const LessonDocumentationModal = ({
    isOpen,
    onClose,
    lessonId,
    title = "Quản lý tài liệu buổi học"
}) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newLink, setNewLink] = useState('');
    const [newName, setNewName] = useState('');
    const [editingDoc, setEditingDoc] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && lessonId) {
            fetchDocuments();
        }
    }, [isOpen, lessonId]);

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const data = await LessonDocumentationService.getLessonDocumentations(lessonId);
            setDocuments(data);
        } catch (error) {
            console.error('Error fetching documents:', error);
            setError('Không thể tải danh sách tài liệu');
        } finally {
            setLoading(false);
        }
    };

    const handleAddDocument = async () => {
        if (!newLink.trim()) {
            setError('Vui lòng nhập link tài liệu');
            return;
        }

        try {
            await LessonDocumentationService.createLessonDocumentation({
                lesson: lessonId,
                link: newLink.trim(),
                name: newName.trim() || 'Tài liệu buổi học'
            });
            setNewLink('');
            setNewName('');
            setError('');
            await fetchDocuments();
        } catch (error) {
            setError('Không thể thêm tài liệu');
        }
    };

    const handleUpdateDocument = async () => {
        if (!editingDoc || !editingDoc.link.trim()) {
            setError('Vui lòng nhập link tài liệu');
            return;
        }

        try {
            await LessonDocumentationService.updateLessonDocumentation(editingDoc.id, {
                link: editingDoc.link.trim()
            });
            setEditingDoc(null);
            setError('');
            await fetchDocuments();
        } catch (error) {
            setError('Không thể cập nhật tài liệu');
        }
    };

    const handleDeleteDocument = async (docId) => {
        if (!confirm('Bạn có chắc muốn xóa tài liệu này?')) {
            return;
        }

        try {
            await LessonDocumentationService.deleteLessonDocumentation(docId);
            await fetchDocuments();
        } catch (error) {
            setError('Không thể xóa tài liệu');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Add new document */}
                    <div className="mb-6 space-y-3">
                        <div>
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="Tên tài liệu..."
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newLink}
                                onChange={(e) => setNewLink(e.target.value)}
                                placeholder="Nhập link tài liệu..."
                                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <button
                                onClick={handleAddDocument}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                Thêm
                            </button>
                        </div>
                        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                    </div>

                    {/* Documents list */}
                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center py-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                            </div>
                        ) : documents.length > 0 ? (
                            documents.map((doc) => (
                                <div key={doc.id} className="space-y-3">
                                    <div className="flex items-center gap-2 p-3 border rounded-lg">
                                        {editingDoc?.id === doc.id ? (
                                            <>
                                                <input
                                                    type="text"
                                                    value={editingDoc.link}
                                                    onChange={(e) => setEditingDoc({ ...editingDoc, link: e.target.value })}
                                                    className="flex-1 p-2 border border-gray-300 rounded-lg"
                                                />
                                                <button
                                                    onClick={handleUpdateDocument}
                                                    className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                                >
                                                    Lưu
                                                </button>
                                                <button
                                                    onClick={() => setEditingDoc(null)}
                                                    className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                                >
                                                    Hủy
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex-1">
                                                    <div className="font-medium text-gray-800">
                                                        {doc.name || 'Tài liệu buổi học'}
                                                    </div>
                                                    <div className="text-sm text-gray-500 truncate">
                                                        {doc.link}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setEditingDoc(doc)}
                                                    className="p-1 text-gray-600 hover:text-gray-800"
                                                    title="Sửa link"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteDocument(doc.id)}
                                                    className="p-1 text-red-600 hover:text-red-800"
                                                    title="Xóa tài liệu"
                                                >
                                                    🗑️
                                                </button>
                                            </>
                                        )}
                                    </div>
                                    {/* Hiển thị tài liệu dưới dạng iframe */}
                                    <div 
                                        style={{
                                            position: 'relative',
                                            width: '100%',
                                            height: 0,
                                            paddingTop: '56.25%',
                                            paddingBottom: 0,
                                            boxShadow: '0 2px 8px 0 rgba(63,69,81,0.16)',
                                            marginTop: '1.6em',
                                            marginBottom: '0.9em',
                                            overflow: 'hidden',
                                            borderRadius: '8px',
                                            willChange: 'transform'
                                        }}
                                    >
                                        <iframe
                                            src={doc.link.includes('canva.com') 
                                                ? (doc.link.includes('/view?') ? `${doc.link}&embed` : `${doc.link}?embed`)
                                                : doc.link}
                                            style={{
                                                position: 'absolute',
                                                width: '100%',
                                                height: '100%',
                                                top: 0,
                                                left: 0,
                                                border: 'none',
                                                padding: 0,
                                                margin: 0
                                            }}
                                            loading="lazy"
                                            allowFullScreen={true}
                                            allow="fullscreen"
                                        />
                                    </div>
                                    <a 
                                        href={doc.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        Mở trong tab mới
                                    </a>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4 text-gray-500">
                                Chưa có tài liệu nào
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end p-6 border-t bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LessonDocumentationModal;
