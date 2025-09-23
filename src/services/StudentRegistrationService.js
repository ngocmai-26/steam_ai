import axios from '../axiosConfig';
import { getHeaders } from './ApiServices';

export const StudentRegistrationService = {
  // Get list of pending student registrations
  getPendingRegistrations: async (token) => {
    try {
      const response = await axios.get('/back-office/student-registrations', {
        headers: getHeaders(token)
      });
      // Ensure we return the data property of the response
      return response.data || { data: [] };
    } catch (error) {
      throw error;
    }
  },

  // Update student registration status
  updateRegistrationStatus: async (id, data, token) => {
    try {
      const response = await axios.put(`/back-office/student-registrations/${id}`, data, {
        headers: getHeaders(token)
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default StudentRegistrationService;
