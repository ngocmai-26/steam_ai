import axios from '../axiosConfig';
import { LESSON_ENDPOINTS, MODULE_ENDPOINTS, CLASS_ENDPOINTS } from '../constants/api';

// Đánh giá buổi học
const EVALUATION_CRITERIA_URL = '/back-office/evaluation-criteria';
const LESSON_EVALUATION_URL = '/back-office/lesson-evaluations';

export class LessonService {
  // Lấy danh sách buổi học theo module (và các filter khác nếu cần)
  static async getLessons(moduleId, params = {}) {
    try {
      const query = { ...params };
      if (moduleId) query.module = moduleId;
      const res = await axios.get('/back-office/lessons', { params: query });
      return Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      return [];
    }
  }

  // Lấy chi tiết buổi học theo ID
  static async getLessonById(id) {
    try {
      // Thử gọi API với filter để lấy lesson cụ thể
      const response = await axios.get('/back-office/lessons', { 
        params: { id: id } 
      });
      
      // Nếu có data, trả về lesson đầu tiên
      const lessons = Array.isArray(response.data?.data) ? response.data.data : (Array.isArray(response.data) ? response.data : []);
      if (lessons.length > 0) {
        return lessons[0]; // Trả về lesson đầu tiên tìm được
      }
      
      throw new Error('Lesson not found');
    } catch (error) {
      console.error('Error fetching lesson detail:', error);
      throw error;
    }
  }

  // Thêm buổi học mới
  static async createLesson(data) {
    const response = await axios.post(LESSON_ENDPOINTS.LESSONS, data);
    return response.data;
  }

  // Sửa buổi học
  static async updateLesson(id, data) {
    const response = await axios.put(LESSON_ENDPOINTS.LESSON_DETAIL(id), data);
    return response.data;
  }

  // Xóa buổi học
  static async deleteLesson(id) {
    const response = await axios.delete(LESSON_ENDPOINTS.LESSON_DETAIL(id));
    return response.data;
  }

  // Lấy tất cả tiêu chí đánh giá
  static async getEvaluationCriteria() {
    const response = await axios.get(EVALUATION_CRITERIA_URL);
    // Nếu response.data là mảng, trả về luôn
    if (Array.isArray(response.data)) return response.data;
    // Nếu response.data.data là mảng, trả về data
    if (Array.isArray(response.data?.data)) return response.data.data;
    // Trường hợp khác, trả về mảng rỗng
    return [];
  }

  // Lấy tất cả đánh giá học viên (có thể filter theo class, student)
  static async getLessonEvaluations(params = {}) {
    const response = await axios.get(LESSON_EVALUATION_URL, { params });
    return response.data.data;
  }

  // Kiểm tra đánh giá của học viên cho buổi học cụ thể
  static async getStudentLessonEvaluation(lessonId, studentId) {
    try {
      const response = await axios.get(LESSON_EVALUATION_URL, {
        params: {
          lesson: lessonId,
          student: studentId
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching student lesson evaluation:', error);
      return null;
    }
  }

  // Tạo mới đánh giá học viên
  static async createLessonEvaluation(data) {
    const response = await axios.post(LESSON_EVALUATION_URL, data);
    return response.data.data;
  }

  // Sửa đánh giá học viên
  static async updateLessonEvaluation(id, data) {
    const response = await axios.put(`${LESSON_EVALUATION_URL}/${id}`, data);
    return response.data.data;
  }

  // Xóa đánh giá học viên
  static async deleteLessonEvaluation(id) {
    const response = await axios.delete(`${LESSON_EVALUATION_URL}/${id}`);
    return response.data.data;
  }

  // Lấy chi tiết đánh giá học viên
  static async getLessonEvaluationById(id) {
    const response = await axios.get(`/back-office/lesson-evaluations/${id}`);
    return response.data.data;
  }

  // Tạo check-in cho buổi học
  static async createLessonCheckIn(data) {
    try {
      const response = await axios.post('/back-office/lesson-checkins', data);
      return response.data;
    } catch (error) {
      console.error('Error creating lesson check-in:', error);
      throw error;
    }
  }

  // Lấy thông tin check-in của teacher cho lesson
  static async getLessonCheckIn(teacherId, lessonId) {
    try {
      const response = await axios.get('/back-office/lesson-checkins', {
        params: {
          teacher: teacherId,
          lesson: lessonId
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching lesson check-in:', error);
      throw error;
    }
  }

  // Lấy danh sách hình ảnh buổi học (có thể filter theo lesson, module, class_room)
  static async getLessonGalleries(params = {}) {
    const response = await axios.get('/back-office/lesson-galleries', { params });
    return response.data.data;
  }

  // Upload hình ảnh cho buổi học
  static async uploadLessonGallery(lessonId, file) {
    const formData = new FormData();
    formData.append('lesson', lessonId);
    formData.append('image', file);
    const response = await axios.post('/back-office/lesson-galleries', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  // Lấy danh sách modules từ API
  static async getModules(params = {}) {
    try {
      const response = await axios.get(MODULE_ENDPOINTS.MODULES, { params });
      return Array.isArray(response.data?.data) ? response.data.data : (Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching modules:', error);
      return [];
    }
  }

  // Lấy danh sách classes từ API
  static async getClasses(params = {}) {
    try {
      const response = await axios.get(CLASS_ENDPOINTS.CLASSES, { params });
      return Array.isArray(response.data?.data) ? response.data.data : (Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching classes:', error);
      return [];
    }
  }
}

export default LessonService; 