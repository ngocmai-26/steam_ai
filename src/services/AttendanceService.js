import axios from '../axiosConfig';

class AttendanceService {
  // Lấy danh sách điểm danh cho một buổi học
  static async getAttendances(lessonId) {
    try {
      
      // // Kiểm tra xem API có tồn tại không bằng cách gọi với timeout ngắn
      const response = await axios.get('/back-office/attendances', {
        params: { lesson: lessonId },
      });
      
      
      // Kiểm tra response status
      if (response.status >= 200 && response.status < 300) {
        return response.data?.data || response.data || [];
      } else {
        return [];
      }
      
    } catch (error) {
      console.error('Error fetching attendances from /back-office/attendances:', error);
      
      
      
      // Không throw error để tránh logout, chỉ return empty array
      return [];
    }
  }

  // // Lấy chi tiết điểm danh theo ID
  // static async getAttendanceById(id) {
  //   try {
  //     const response = await axios.get(`/back-office/attendance/${id}`);
  //     return response.data?.data || response.data;
  //   } catch (error) {
  //     console.error('Error fetching attendance:', error);
  //     throw error;
  //   }
  // }

  // Tạo điểm danh mới
  static async createAttendance({ student, lesson, status, note }) {
    try {
      const response = await axios.post('/back-office/attendances', {
        student,
        lesson,
        status,
        note
      });
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error creating attendance:', error);
      throw error;
    }
  }

  // Cập nhật điểm danh
  static async updateAttendance(id, data) {
    try {
      const response = await axios.put(`/back-office/attendance/${id}`, data);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error updating attendance:', error);
      throw error;
    }
  }

  // Xóa điểm danh
  static async deleteAttendance(id) {
    try {
      const response = await axios.delete(`/back-office/attendance/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting attendance:', error);
      throw error;
    }
  }

  // Lấy điểm danh theo lớp học
  static async getAttendancesByClass(classId, params = {}) {
    try {
      const response = await axios.get(`/back-office/attendance/class/${classId}`, { params });
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error('Error fetching attendances by class:', error);
      throw error;
    }
  }

  // Lấy điểm danh theo học viên
  static async getAttendancesByStudent(studentId, params = {}) {
    try {
      const response = await axios.get(`/back-office/attendance/student/${studentId}`, { params });
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error('Error fetching attendances by student:', error);
      throw error;
    }
  }

  // Lấy điểm danh theo buổi học
  static async getAttendancesByLesson(lessonId, params = {}) {
    try {
      const response = await axios.get(`/back-office/attendance/lesson/${lessonId}`, { params });
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error('Error fetching attendances by lesson:', error);
      throw error;
    }
  }

  // Điểm danh hàng loạt cho một buổi học
  static async bulkAttendance(lessonId, attendances) {
    try {
      const response = await axios.post(`/back-office/attendance/bulk/${lessonId}`, { attendances });
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error bulk attendance:', error);
      throw error;
    }
  }

  // Lấy thống kê điểm danh
  static async getAttendanceStats(params = {}) {
    try {
      const response = await axios.get('/back-office/attendance/stats', { params });
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error fetching attendance stats:', error);
      throw error;
    }
  }

  // Test API endpoint mà không gây logout
  static async testAttendanceAPI(lessonId) {
    try {
      
      const response = await axios.get('/back-office/attendances', {
        params: { lesson: lessonId },
        timeout: 3000 // 3 giây timeout
      });
      
      return { success: true, data: response.data };
      
    } catch (error) {
      if (error.response) {
        return { success: false, status: error.response.status, message: 'API exists but returned error' };
      } else if (error.request) {
        return { success: false, message: 'No response from server' };
      } else {
        return { success: false, message: error.message };
      }
    }
  }
}

export default AttendanceService; 