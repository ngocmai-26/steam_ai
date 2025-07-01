import axios from '../axiosConfig';
import { CLASS_ENDPOINTS } from '../constants/api';

/**
 * Class Service - Handles all class-related API calls using JSON format
 */
export class ClassService {
  /**
   * Get all classes
   * @param {number} courseId - Optional course ID to filter classes
   * @returns {Promise} - Promise with classes data
   */
  static async getClasses(courseId = null) {
    const params = courseId ? { course_id: courseId } : {};
    const response = await axios.get(CLASS_ENDPOINTS.CLASSES, { params });
    return response.data;
  }

  /**
   * Get class by ID
   * @param {string|number} id - Class ID
   * @returns {Promise} - Promise with class data
   */
  static async getClassById(id) {
    const response = await axios.get(CLASS_ENDPOINTS.CLASS_DETAIL(id));
    return response.data;
  }

  /**
   * Create new class
   * @param {Object} classData - Class data as JSON object
   * @returns {Promise} - Promise with created class data
   */
  static async createClass(classData) {
    const response = await axios.post(CLASS_ENDPOINTS.CLASSES, classData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  }

  /**
   * Update class
   * @param {string|number} id - Class ID
   * @param {Object} classData - Updated class data as JSON object
   * @returns {Promise} - Promise with updated class data
   */
  static async updateClass(id, classData) {
    const response = await axios.put(CLASS_ENDPOINTS.CLASS_DETAIL(id), classData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  }

  /**
   * Delete class
   * @param {string|number} id - Class ID
   * @returns {Promise} - Promise with deletion result
   */
  static async deleteClass(id) {
    const response = await axios.delete(CLASS_ENDPOINTS.CLASS_DETAIL(id));
    return response.data;
  }

  /**
   * Get classes by course ID
   * @param {string|number} courseId - Course ID
   * @returns {Promise} - Promise with classes data
   */
  static async getClassesByCourse(courseId) {
    const params = { course_id: courseId };
    const response = await axios.get(CLASS_ENDPOINTS.CLASSES, { params });
    return response.data;
  }

  /**
   * Search classes with filters
   * @param {Object} filters - Search filters
   * @returns {Promise} - Promise with search results
   */
  static async searchClasses(filters = {}) {
    const response = await axios.get(CLASS_ENDPOINTS.CLASSES, { params: filters });
    return response.data;
  }

  /**
   * Get class statistics
   * @param {string|number} classId - Class ID
   * @returns {Promise} - Promise with statistics data
   */
  static async getClassStatistics(classId) {
    const response = await axios.get(`${CLASS_ENDPOINTS.CLASS_DETAIL(classId)}/statistics`);
    return response.data;
  }

  /**
   * Update class status
   * @param {string|number} id - Class ID
   * @param {string} status - New status ('active', 'inactive', 'completed')
   * @returns {Promise} - Promise with updated class data
   */
  static async updateClassStatus(id, status) {
    const response = await axios.patch(CLASS_ENDPOINTS.CLASS_DETAIL(id), { status }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  }

  /**
   * Bulk update classes
   * @param {Array} classIds - Array of class IDs
   * @param {Object} updateData - Data to update
   * @returns {Promise} - Promise with update result
   */
  static async bulkUpdateClasses(classIds, updateData) {
    const response = await axios.patch(`${CLASS_ENDPOINTS.CLASSES}/bulk`, {
      class_ids: classIds,
      ...updateData
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  }

  /**
   * Bulk delete classes
   * @param {Array} classIds - Array of class IDs
   * @returns {Promise} - Promise with deletion result
   */
  static async bulkDeleteClasses(classIds) {
    const response = await axios.delete(`${CLASS_ENDPOINTS.CLASSES}/bulk`, {
      data: { class_ids: classIds },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  }

  /**
   * Validate class data
   * @param {Object} classData - Class data to validate
   * @returns {Object} - Validation result
   */
  static validateClassData(classData) {
    const errors = {};

    if (!classData.name || classData.name.trim() === '') {
      errors.name = 'Tên lớp học là bắt buộc';
    }

    if (!classData.course) {
      errors.course = 'Khóa học là bắt buộc';
    }

    if (classData.start_date && classData.end_date) {
      const startDate = new Date(classData.start_date);
      const endDate = new Date(classData.end_date);
      
      if (startDate >= endDate) {
        errors.end_date = 'Ngày kết thúc phải sau ngày bắt đầu';
      }
    }

    if (classData.max_students && classData.max_students <= 0) {
      errors.max_students = 'Số học viên tối đa phải lớn hơn 0';
    }

    if (classData.schedule) {
      try {
        if (typeof classData.schedule === 'string') {
          JSON.parse(classData.schedule);
        }
      } catch (error) {
        errors.schedule = 'Lịch học phải là JSON hợp lệ';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Format class data for API
   * @param {Object} classData - Raw class data
   * @returns {Object} - Formatted class data
   */
  static formatClassData(classData) {
    const formatted = { ...classData };

    // Convert dates to ISO string format
    if (formatted.start_date instanceof Date) {
      formatted.start_date = formatted.start_date.toISOString().split('T')[0];
    }
    if (formatted.end_date instanceof Date) {
      formatted.end_date = formatted.end_date.toISOString().split('T')[0];
    }

    // Convert numbers
    if (formatted.max_students) {
      formatted.max_students = parseInt(formatted.max_students);
    }
    if (formatted.teacher) {
      formatted.teacher = parseInt(formatted.teacher);
    }
    if (formatted.teaching_assistant) {
      formatted.teaching_assistant = parseInt(formatted.teaching_assistant);
    }

    // Parse schedule if it's a string
    if (formatted.schedule && typeof formatted.schedule === 'string') {
      try {
        formatted.schedule = JSON.parse(formatted.schedule);
      } catch (error) {
        console.warn('Invalid schedule JSON:', error);
        formatted.schedule = null;
      }
    }

    // Convert course to number if present
    if (formatted.course) {
      formatted.course = parseInt(formatted.course, 10);
      if (isNaN(formatted.course)) {
        delete formatted.course;
      }
    }

    // Remove null/undefined values
    Object.keys(formatted).forEach(key => {
      if (formatted[key] === null || formatted[key] === undefined || formatted[key] === '') {
        delete formatted[key];
      }
    });

    return formatted;
  }
}

export default ClassService;

// Service cho đăng ký lớp học
const COURSE_REGISTRATION_URL = '/back-office/course-registrations';

export class CourseRegistrationService {
  // Lấy danh sách đăng ký (có thể filter theo student, class_room, status)
  static async getRegistrations(params = {}) {
    const response = await axios.get(COURSE_REGISTRATION_URL, { params });
    return response.data.data; // trả về mảng đăng ký
  }

  // Đăng ký lớp học mới
  static async createRegistration(data) {
    const response = await axios.post(COURSE_REGISTRATION_URL, data);
    return response.data.data; // trả về object đăng ký vừa tạo
  }
} 