import axios from '../axiosConfig';

const BASE_URL = '/back-office/students';

export class StudentService {
  static async getStudents(query = '') {
    const params = query ? { search: query } : {};
    const response = await axios.get(BASE_URL, { params });
    return response.data.data;
  }

  static async getStudentById(id) {
    try {
      const response = await axios.get(`${BASE_URL}/${id}`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error fetching student by ID:', error);
      throw error;
    }
  }

  static async createStudent(studentData) {
    // studentData có thể là FormData nếu có avatar
    // Không set Content-Type, để axiosConfig interceptor xử lý
    const response = await axios.post(BASE_URL, studentData);
    return response.data.data;
  }

  static async updateStudent(id, studentData) {
    // Không set Content-Type, để axiosConfig interceptor xử lý
    const response = await axios.put(`${BASE_URL}/${id}`, studentData);
    return response.data.data;
  }

  static async deleteStudent(id) {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data.data;
  }
} 