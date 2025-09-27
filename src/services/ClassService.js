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
   * Get students by classroom ID
   * @param {string|number} classroomId - Classroom ID
   * @returns {Promise} - Promise with students data
   */
  static async getStudentsByClassroom(classroomId) {
    try {
      const response = await axios.get(`${CLASS_ENDPOINTS.CLASSES}/${classroomId}/students`);
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error('Error fetching students for classroom:', error);
      return [];
    }
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
    try {
      const response = await axios.get(COURSE_REGISTRATION_URL, { params });
      return response.data?.data || response.data || []; // trả về mảng đăng ký
    } catch (error) {
      console.error('Error fetching registrations:', error);
      throw error;
    }
  }

  // Đăng ký lớp học mới
  static async createRegistration(data) {
    try {
      // Format data theo API mới
      const registrationData = {
        student: data.student,
        class_room: data.class_room,
        note: data.note || '',
        amount: data.amount || '0',
        contact_for_anonymous: {
          student_name: data.contact_for_anonymous?.student_name || '',
          parent_name: data.contact_for_anonymous?.parent_name || '',
          parent_phone: data.contact_for_anonymous?.parent_phone || '',
          parent_email: data.contact_for_anonymous?.parent_email || ''
        }
      };

      const response = await axios.post(COURSE_REGISTRATION_URL, registrationData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data?.data || response.data; // trả về object đăng ký vừa tạo
    } catch (error) {
      console.error('Error creating registration:', error);

      // Handle validation errors specifically
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData?.contact_for_anonymous) {
          // Extract validation errors from nested structure
          const validationErrors = [];
          for (const [field, errors] of Object.entries(errorData.contact_for_anonymous)) {
            if (Array.isArray(errors) && errors.length > 0) {
              validationErrors.push(...errors);
            }
          }
          if (validationErrors.length > 0) {
            throw new Error(validationErrors.join(', '));
          }
        }
        if (errorData?.message) {
          throw new Error(errorData.message);
        }
      }

      // Re-throw error with more context
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Có lỗi xảy ra khi đăng ký lớp học');
      }
    }
  }

  // Hủy đăng ký lớp học
  static async cancelRegistration(registrationId) {
    try {
      const response = await axios.delete(`${COURSE_REGISTRATION_URL}/${registrationId}`);
      return response.data;
    } catch (error) {
      console.error('Error canceling registration:', error);
      // Re-throw error with more context
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Có lỗi xảy ra khi hủy đăng ký lớp học');
      }
    }
  }

  // Tìm registration ID dựa trên student và class
  static async findRegistration(studentId, classId) {
    try {
      const registrations = await this.getRegistrations({ student: studentId });
      const registration = registrations.find(reg => {
        const regClassId = typeof reg.class_room === 'object' ? reg.class_room.id : reg.class_room;
        return regClassId === classId && ['approved', 'pending'].includes(reg.status);
      });
      return registration;
    } catch (error) {
      console.error('Error finding registration:', error);
      throw error;
    }
  }
} 