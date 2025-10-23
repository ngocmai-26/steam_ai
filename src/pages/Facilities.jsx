import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { HiPlus, HiPencil, HiTrash, HiEye, HiPhotograph } from 'react-icons/hi';
import { 
  fetchFacilities, 
  deleteFacility, 
  createFacilityImage,
  deleteFacilityImage,
  selectFacilities, 
  selectFacilitiesLoading, 
  selectFacilitiesError,
  clearError 
} from '../slices/facilitySlice';
import { getThumbnailUrl } from '../utils/imageUtils';
import ImageWithFallback from '../components/ImageWithFallback';
import FacilityForm from '../components/FacilityForm';
import Modal from '../components/Modal';
import Loading from '../components/Loading';
import Table from '../components/Table';
import FacilityService from '../services/FacilityService';

const Facilities = () => {
  const dispatch = useDispatch();
  const facilities = useSelector(selectFacilities);
  const loading = useSelector(selectFacilitiesLoading);
  const error = useSelector(selectFacilitiesError);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [formMode, setFormMode] = useState('create'); // 'create' or 'edit'

  useEffect(() => {
    dispatch(fetchFacilities());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleCreateFacility = () => {
    setSelectedFacility(null);
    setFormMode('create');
    setIsFormModalOpen(true);
  };

  const handleEditFacility = (facility) => {
    setSelectedFacility(facility);
    setFormMode('edit');
    setIsFormModalOpen(true);
  };

  const handleDeleteFacility = async (facility) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa cơ sở vật chất "${facility.name}"?`)) {
      try {
        await dispatch(deleteFacility(facility.id)).unwrap();
        toast.success('Xóa cơ sở vật chất thành công');
      } catch (error) {
        toast.error(error || 'Có lỗi xảy ra khi xóa cơ sở vật chất');
      }
    }
  };

  const handleViewImages = (facility) => {
    setSelectedFacility(facility);
    setIsImageModalOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormModalOpen(false);
    setSelectedFacility(null);
    dispatch(fetchFacilities());
  };

  const handleFormClose = () => {
    setIsFormModalOpen(false);
    setSelectedFacility(null);
  };

  const handleImageModalClose = () => {
    setIsImageModalOpen(false);
    setSelectedFacility(null);
  };

  // Desktop table columns
  const columns = [
    {
      key: 'name',
      title: 'Tên cơ sở vật chất',
      render: (facility) => (
        <div className="font-medium text-gray-900">{facility.name}</div>
      )
    },
    {
      key: 'description',
      title: 'Mô tả',
      render: (facility) => (
        <div className="text-gray-600 max-w-xs truncate">
          {facility.description || 'Không có mô tả'}
        </div>
      )
    },
    {
      key: 'created_at',
      title: 'Ngày tạo',
      render: (facility) => (
        <div className="text-gray-600">
          {new Date(facility.created_at).toLocaleDateString('vi-VN')}
        </div>
      )
    },
    {
      key: 'actions',
      title: 'Thao tác',
      render: (facility) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleViewImages(facility)}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
            title="Xem hình ảnh"
          >
            <HiPhotograph className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEditFacility(facility)}
            className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
            title="Chỉnh sửa"
          >
            <HiPencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteFacility(facility)}
            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
            title="Xóa"
          >
            <HiTrash className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý cơ sở vật chất</h1>
            <p className="text-gray-600 mt-1">Quản lý thông tin và hình ảnh cơ sở vật chất</p>
          </div>
          <button
            onClick={handleCreateFacility}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <HiPlus className="w-5 h-5 mr-2" />
            Thêm cơ sở vật chất
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <Table
          data={facilities}
          columns={columns}
          emptyMessage="Chưa có cơ sở vật chất nào"
        />
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {facilities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Chưa có cơ sở vật chất nào
          </div>
        ) : (
          facilities.map((facility) => (
            <div key={facility.id} className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{facility.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {facility.description || 'Không có mô tả'}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Tạo ngày: {new Date(facility.created_at).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleViewImages(facility)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  title="Xem hình ảnh"
                >
                  <HiPhotograph className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEditFacility(facility)}
                  className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                  title="Chỉnh sửa"
                >
                  <HiPencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteFacility(facility)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  title="Xóa"
                >
                  <HiTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Facility Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={handleFormClose}
        title={formMode === 'create' ? 'Thêm cơ sở vật chất' : 'Chỉnh sửa cơ sở vật chất'}
        maxWidth="max-w-2xl"
        showFooter={false}
      >
        <FacilityForm
          facility={selectedFacility}
          mode={formMode}
          onSuccess={handleFormSuccess}
          onCancel={handleFormClose}
        />
      </Modal>

      {/* Image Modal */}
      <Modal
        isOpen={isImageModalOpen}
        onClose={handleImageModalClose}
        title={`Hình ảnh - ${selectedFacility?.name}`}
        maxWidth="max-w-4xl"
      >
        <FacilityImageManager
          facility={selectedFacility}
          onClose={handleImageModalClose}
        />
      </Modal>
    </div>
  );
};

// Component để quản lý hình ảnh của cơ sở vật chất
const FacilityImageManager = ({ facility, onClose }) => {
  const dispatch = useDispatch();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (facility) {
      loadImages();
    }
  }, [facility]);

  const loadImages = async () => {
    setLoading(true);
    try {
      const data = await FacilityService.getFacilityImages(facility.id);
      setImages(data);
    } catch (error) {
      console.error('Error loading images:', error);
      toast.error('Lỗi khi tải hình ảnh');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      await dispatch(createFacilityImage({ facilityId: facility.id, imageFile: file })).unwrap();
      toast.success('Tải lên hình ảnh thành công');
      loadImages(); // Reload images
    } catch (error) {
      toast.error(error || 'Lỗi khi tải lên hình ảnh');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hình ảnh này?')) {
      try {
        await dispatch(deleteFacilityImage(imageId)).unwrap();
        toast.success('Xóa hình ảnh thành công');
        loadImages(); // Reload images
      } catch (error) {
        toast.error(error || 'Lỗi khi xóa hình ảnh');
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-4">
      {/* Upload Section */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className={`cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <HiPhotograph className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">
            {uploading ? 'Đang tải lên...' : 'Nhấp để tải lên hình ảnh'}
          </p>
        </label>
      </div>

      {/* Images Grid */}
      {images.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Chưa có hình ảnh nào
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="relative group">
              <ImageWithFallback
                src={image.image_url}
                alt={facility.name}
                className="w-full h-32 object-cover rounded-lg"
                fallbackSrc="https://via.placeholder.com/400x300?text=No+Image"
              />
              <button
                onClick={() => handleDeleteImage(image.id)}
                className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <HiTrash className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Facilities;
