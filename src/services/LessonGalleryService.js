import axios from '../axiosConfig';

class LessonGalleryService {
  // Lấy danh sách ảnh của lesson
  static async getLessonGalleries(lessonId) {
    try {
      const response = await axios.get(`/back-office/lesson-galleries?lesson=${lessonId}`);
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error('Error fetching lesson galleries:', error);
      throw error;
    }
  }

  // Upload ảnh cho lesson
  static async uploadLessonImage(lessonId, imageFile) {
    try {
      const formData = new FormData();
      formData.append('lesson', lessonId);
      formData.append('image', imageFile);

      const response = await axios.post('/back-office/lesson-galleries', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error uploading lesson image:', error);
      throw error;
    }
  }

  // Xóa ảnh (nếu cần)
  static async deleteLessonImage(imageId) {
    try {
      const response = await axios.delete(`/back-office/lesson-galleries/${imageId}`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error deleting lesson image:', error);
      throw error;
    }
  }
}

export default LessonGalleryService;
