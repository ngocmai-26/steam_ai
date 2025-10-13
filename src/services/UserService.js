import axios from '../axiosConfig';

class UserService {
  // Lấy danh sách users với các filter
  static async getUsers(params = {}) {
    try {
      const response = await axios.get('/back-office/users', { params });
      
      // Xử lý cấu trúc dữ liệu trả về
      let users = [];
      if (response.data?.data) {
        users = response.data.data;
      } else if (Array.isArray(response.data)) {
        users = response.data;
      } else if (response.data?.results) {
        users = response.data.results;
      }
      
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // Lấy user theo ID
  static async getUserById(id) {
    try {
      const response = await axios.get(`/back-office/root/users/${id}`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  // Tạo user mới
  static async createUser(userData) {
    try {
      const response = await axios.post('/back-office/root/users', userData);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Cập nhật user
  static async updateUser(id, userData) {
    try {
      const response = await axios.put(`/back-office/root/users/${id}`, userData);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Xóa user
  static async deleteUser(id) {
    try {
      const response = await axios.delete(`/back-office/root/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Cập nhật trạng thái user
  static async updateUserStatus(id, status) {
    try {
      const response = await axios.patch(`/back-office/root/users/${id}/status`, { status });
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  // Thay đổi mật khẩu
  static async changePassword(passwordData) {
    try {
      const response = await axios.post('/back-office/root/users/change-password', passwordData);
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }
}

export default UserService; 