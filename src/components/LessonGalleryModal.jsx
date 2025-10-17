import React, { useState, useEffect } from 'react';
import LessonGalleryService from '../services/LessonGalleryService';

const LessonGalleryModal = ({
    isOpen,
    onClose,
    lessonId,
    title = "Quản lý ảnh buổi học"
}) => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && lessonId) {
            console.log('LessonGalleryModal: lessonId received:', lessonId, 'type:', typeof lessonId);
            fetchImages();
        }
    }, [isOpen, lessonId]);

    const fetchImages = async () => {
        setLoading(true);
        setError('');

        try {
            // Ensure lessonId is properly converted to string/number
            const lessonIdParam = String(lessonId);
            console.log('LessonGalleryModal: calling API with lessonId:', lessonIdParam);
            const response = await LessonGalleryService.getLessonGalleries(lessonIdParam);

            // Handle the API response structure
            let imagesData = [];
            if (response && response.data && Array.isArray(response.data)) {
                // API returns { data: [...], message: "..." }
                imagesData = response.data;
            } else if (Array.isArray(response)) {
                // Direct array response
                imagesData = response;
            }

            console.log('LessonGalleryModal: processed images data:', imagesData);
            setImages(imagesData);
        } catch (err) {
            console.error('Error fetching images:', err);
            setError('Không thể tải danh sách ảnh');
            setImages([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Kiểm tra loại file
            if (!file.type.startsWith('image/')) {
                setError('Vui lòng chọn file ảnh');
                return;
            }

            // Kiểm tra kích thước file (giới hạn 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('File ảnh không được lớn hơn 5MB');
                return;
            }

            setSelectedFile(file);
            setError('');
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Vui lòng chọn file ảnh');
            return;
        }

        setUploading(true);
        setError('');

        try {
            // Ensure lessonId is properly converted to string
            const lessonIdParam = String(lessonId);
            await LessonGalleryService.uploadLessonImage(lessonIdParam, selectedFile);

            // Reset form và refresh danh sách ảnh
            setSelectedFile(null);
            if (document.getElementById('image-input')) {
                document.getElementById('image-input').value = '';
            }

            // Refresh danh sách ảnh
            await fetchImages();
        } catch (err) {
            console.error('Error uploading image:', err);
            setError('Không thể upload ảnh. Vui lòng thử lại.');
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteImage = async (imageId) => {
        if (!confirm('Bạn có chắc muốn xóa ảnh này?')) {
            return;
        }

        try {
            await LessonGalleryService.deleteLessonImage(imageId);
            await fetchImages();
        } catch (err) {
            console.error('Error deleting image:', err);
            setError('Không thể xóa ảnh. Vui lòng thử lại.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{title}</h2>
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
                <div className="p-4 sm:p-6 overflow-y-auto max-h-[70vh]">
                    {/* Upload Section */}
                    <div className="mb-8">
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Upload ảnh mới</h3>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="image-input" className="block text-sm font-medium text-gray-700 mb-2">
                                    Chọn file ảnh
                                </label>
                                <input
                                    id="image-input"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                            </div>

                            {selectedFile && (
                                <div className="text-sm text-gray-600">
                                    Đã chọn: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                                </div>
                            )}

                            {error && (
                                <div className="text-sm text-red-600">{error}</div>
                            )}

                            <button
                                onClick={handleUpload}
                                disabled={!selectedFile || uploading}
                                className={`px-4 py-2 rounded-lg font-medium ${!selectedFile || uploading
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                    }`}
                            >
                                {uploading ? 'Đang upload...' : 'Upload ảnh'}
                            </button>
                        </div>
                    </div>

                    {/* Gallery Section */}
                    <div>
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Ảnh đã upload</h3>

                        {loading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">Đang tải danh sách ảnh...</p>
                            </div>
                        ) : images.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
                                {images.map((image, index) => {
                                    // Handle different image URL structures
                                    let imageUrls = [];
                                    if (image.image_urls && Array.isArray(image.image_urls)) {
                                        // API returns image_urls array
                                        imageUrls = image.image_urls;
                                    } else if (image.image_url) {
                                        // Single image_url
                                        imageUrls = [image.image_url];
                                    } else if (image.url) {
                                        // Single url
                                        imageUrls = [image.url];
                                    } else if (typeof image === 'string') {
                                        // Direct URL string
                                        imageUrls = [image];
                                    }

                                    return imageUrls.map((imageUrl, urlIndex) => (
                                        <div key={`${image.id || index}-${urlIndex}`} className="relative group">
                                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                                <img
                                                    src={imageUrl}
                                                    alt={`Ảnh ${index + 1}-${urlIndex + 1}`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7Oq86pz4HPhc+JPC90ZXh0Pjwvc3ZnPg==';
                                                    }}
                                                />
                                            </div>

                                            {/* Delete button */}
                                            <button
                                                onClick={() => handleDeleteImage(image.id)}
                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Xóa ảnh"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>

                                            {/* Image info */}
                                            <div className="mt-2 text-xs text-gray-500">
                                                {image.created_at && new Date(image.created_at).toLocaleDateString('vi-VN')}
                                            </div>
                                        </div>
                                    ));
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="text-4xl mb-4">📸</div>
                                <p className="text-gray-600">Chưa có ảnh nào được upload</p>
                            </div>
                        )}
                    </div>
                </div>

               
            </div>
        </div>
    );
};

export default LessonGalleryModal;
