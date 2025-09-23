import axios from '../axiosConfig';

class LessonDocumentationService {
    // Lấy danh sách tài liệu của buổi học
    static async getLessonDocumentations(lessonId) {
        try {
            const response = await axios.get('/back-office/lesson-documentations', {
                params: { lesson: lessonId }
            });
            return response.data?.data || response.data || [];
        } catch (error) {
            console.error('Error fetching lesson documentations:', error);
            return [];
        }
    }

    // Thêm tài liệu mới
    static async createLessonDocumentation(data) {
        try {
            const response = await axios.post('/back-office/lesson-documentations', data);
            return response.data?.data || response.data;
        } catch (error) {
            console.error('Error creating lesson documentation:', error);
            throw error;
        }
    }

    // Cập nhật tài liệu
    static async updateLessonDocumentation(id, data) {
        try {
            const response = await axios.put(`/back-office/lesson-documentations/${id}`, data);
            return response.data?.data || response.data;
        } catch (error) {
            console.error('Error updating lesson documentation:', error);
            throw error;
        }
    }

    // Xóa tài liệu
    static async deleteLessonDocumentation(id) {
        try {
            const response = await axios.delete(`/back-office/lesson-documentations/${id}`);
            return response.data?.data || response.data;
        } catch (error) {
            console.error('Error deleting lesson documentation:', error);
            throw error;
        }
    }
}

export default LessonDocumentationService;
