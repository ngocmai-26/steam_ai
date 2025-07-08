import axios from '../axiosConfig';
import { LESSON_ENDPOINTS } from '../constants/api';

// Đánh giá buổi học
const EVALUATION_CRITERIA_URL = '/back-office/evaluation-criteria';
const LESSON_EVALUATION_URL = '/back-office/lesson-evaluations';

export class LessonService {
  // Lấy danh sách buổi học, có thể filter theo module, teacher
  static async getLessons(params = {}) {
    const response = await axios.get(LESSON_ENDPOINTS.LESSONS, { params });
    return response.data;
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
    console.log("aaa", response.data);
    // Nếu response.data là mảng, trả về luôn
    if (Array.isArray(response.data)) return response.data;
    // Nếu response.data.data là mảng, trả về data
    if (Array.isArray(response.data?.data)) return response.data.data;
    // Trường hợp khác, trả về mảng rỗng
    return [];
  }

  // Lấy tất cả đánh giá buổi học (có thể filter theo class, lesson, student)
  static async getLessonEvaluations(params = {}) {
    const response = await axios.get(LESSON_EVALUATION_URL, { params });
    return response.data.data;
  }

  // Tạo mới đánh giá buổi học
  static async createLessonEvaluation(data) {
    const response = await axios.post(LESSON_EVALUATION_URL, data);
    return response.data.data;
  }

  // Sửa đánh giá buổi học
  static async updateLessonEvaluation(id, data) {
    const response = await axios.put(`${LESSON_EVALUATION_URL}/${id}`, data);
    return response.data.data;
  }

  // Xóa đánh giá buổi học
  static async deleteLessonEvaluation(id) {
    const response = await axios.delete(`${LESSON_EVALUATION_URL}/${id}`);
    return response.data.data;
  }

  // Lấy chi tiết đánh giá buổi học
  static async getLessonEvaluationById(id) {
    const response = await axios.get(`/back-office/lesson-evaluations/${id}`);
    return response.data.data;
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
} 