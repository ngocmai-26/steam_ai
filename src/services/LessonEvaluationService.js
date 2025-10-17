import axios from '../axiosConfig';

class LessonEvaluationService {
  // Lấy danh sách đánh giá cho một buổi học
  static async getLessonEvaluations(lessonId) {
    try {
      const response = await axios.get('/back-office/lesson-evaluations', {
        params: { lesson: lessonId }
      });
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error('Error fetching lesson evaluations:', error);
      return [];
    }
  }

  // Lấy đánh giá của một học viên cụ thể cho một buổi học
  static async getStudentEvaluation(lessonId, studentId) {
    try {
      const response = await axios.get('/back-office/lesson-evaluations', {
        params: { 
          lesson: lessonId,
          student: studentId
        }
      });
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error('Error fetching student evaluation:', error);
      return [];
    }
  }

  // Tạo đánh giá mới
  static async createEvaluation(evaluationData) {
    try {
      const response = await axios.post('/back-office/lesson-evaluations', evaluationData);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error creating evaluation:', error);
      throw error;
    }
  }

  // Cập nhật đánh giá
  static async updateEvaluation(evaluationId, evaluationData) {
    try {
      const response = await axios.put(`/back-office/lesson-evaluations/${evaluationId}`, evaluationData);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error updating evaluation:', error);
      throw error;
    }
  }

  // Xóa đánh giá
  static async deleteEvaluation(evaluationId) {
    try {
      const response = await axios.delete(`/back-office/lesson-evaluations/${evaluationId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting evaluation:', error);
      throw error;
    }
  }

  // Kiểm tra xem học viên đã được đánh giá chưa
  static async checkStudentEvaluated(lessonId, studentId) {
    try {
      const evaluations = await this.getStudentEvaluation(lessonId, studentId);
      return evaluations && evaluations.length > 0;
    } catch (error) {
      console.error('Error checking student evaluation status:', error);
      return false;
    }
  }
}

export default LessonEvaluationService;
