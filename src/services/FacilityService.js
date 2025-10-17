import axios from '../axiosConfig';

const FACILITY_ENDPOINTS = {
  FACILITIES: '/back-office/facilities',
  FACILITY_IMAGES: '/back-office/facility-images'
};

// Hàm helper để đảm bảo dữ liệu trả về luôn là một mảng
const ensureArray = (data) => {
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === 'object') {
    // Nếu là một đối tượng không null, coi nó là một phần tử duy nhất
    return [data];
  }
  return []; // Mặc định trả về mảng rỗng
};

export const FacilityService = {
  // Lấy danh sách cơ sở vật chất
  getFacilities: async () => {
    try {
      const response = await axios.get(FACILITY_ENDPOINTS.FACILITIES);
      return ensureArray(response.data.data);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      throw error;
    }
  },

  // Tạo cơ sở vật chất mới
  createFacility: async (facilityData) => {
    try {
      const formData = new FormData();
      formData.append('name', facilityData.name);
      if (facilityData.description) {
        formData.append('description', facilityData.description);
      }
      
      const response = await axios.post(FACILITY_ENDPOINTS.FACILITIES, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error creating facility:', error);
      throw error;
    }
  },

  // Cập nhật cơ sở vật chất
  updateFacility: async (id, facilityData) => {
    try {
      const formData = new FormData();
      formData.append('name', facilityData.name);
      if (facilityData.description) {
        formData.append('description', facilityData.description);
      }
      
      const response = await axios.put(`${FACILITY_ENDPOINTS.FACILITIES}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error updating facility:', error);
      throw error;
    }
  },

  // Xóa cơ sở vật chất
  deleteFacility: async (id) => {
    try {
      const response = await axios.delete(`${FACILITY_ENDPOINTS.FACILITIES}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting facility:', error);
      throw error;
    }
  },

  // Tạo hình ảnh cho cơ sở vật chất
  createFacilityImage: async (facilityId, imageFile) => {
    try {
      const formData = new FormData();
      formData.append('facility', facilityId);
      formData.append('image', imageFile);
      
      const response = await axios.post(FACILITY_ENDPOINTS.FACILITY_IMAGES, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error creating facility image:', error);
      throw error;
    }
  },

  // Lấy hình ảnh của cơ sở vật chất
  getFacilityImages: async (facilityId) => {
    try {
      const response = await axios.get(`${FACILITY_ENDPOINTS.FACILITY_IMAGES}/${facilityId}`);
      return ensureArray(response.data.data);
    } catch (error) {
      console.error('Error fetching facility images:', error);
      throw error;
    }
  },

  // Xóa hình ảnh của cơ sở vật chất
  deleteFacilityImage: async (imageId) => {
    try {
      const response = await axios.delete(`${FACILITY_ENDPOINTS.FACILITY_IMAGES}/${imageId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting facility image:', error);
      throw error;
    }
  }
};

export default FacilityService;
