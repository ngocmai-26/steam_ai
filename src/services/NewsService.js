import axios from '../axiosConfig';
import { getHeaders } from './ApiServices';

export const NewsService = {
  // Get all news
  getAllNews: async (token) => {
    try {
      const response = await axios.get('/back-office/news', {
        headers: getHeaders(token)
      });
      return response.data || { data: [] };
    } catch (error) {
      throw error;
    }
  },

  // Create new news
  createNews: async (newsData, token) => {
    try {
      console.log('Creating news with data type:', newsData.constructor.name);
      console.log('newsData instance of FormData:', newsData instanceof FormData);

      if (newsData instanceof FormData) {
        console.log('FormData entries:');
        for (let pair of newsData.entries()) {
          const value = pair[1];
          const valueType = value instanceof File ? 'File object' :
                          (typeof value === 'string' && value.startsWith('http') ? 'URL string' : value);
          console.log(pair[0] + ': ' + valueType);
          if (value instanceof File) {
            console.log('  - File name:', value.name);
            console.log('  - File size:', value.size);
            console.log('  - File type:', value.type);
          }
        }
      } else {
        console.log('newsData content:', newsData);
      }

      const headers = {
        "Authorization": `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      };
      console.log('Request headers:', headers);
      console.log('Data type being sent:', newsData.constructor.name);

      const response = await axios.post('/back-office/news', newsData, {
        headers: headers
      });
      console.log('Create news response:', response);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Create news error:', error);
      console.error('Error response:', error.response);
      throw error;
    }
  },

  // Update news
  updateNews: async (id, newsData, token) => {
    try {
      console.log('Updating news with data type:', newsData.constructor.name);
      console.log('newsData instance of FormData:', newsData instanceof FormData);

      if (newsData instanceof FormData) {
        console.log('FormData entries:');
        for (let pair of newsData.entries()) {
          console.log(pair[0] + ': ' + (pair[1] instanceof File ? 'File object' : pair[1]));
        }
      }

      const headers = {
        "Authorization": `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      };
      console.log('Request headers:', headers);
      console.log('Data type being sent:', newsData.constructor.name);

      const response = await axios.put(`/back-office/news/${id}`, newsData, {
        headers: headers
      });
      console.log('Update news response:', response);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Update news error:', error);
      console.error('Error response:', error.response);
      throw error;
    }
  },

  // Delete news
  deleteNews: async (id, token) => {
    try {
      const response = await axios.delete(`/back-office/news/${id}`, {
        headers: getHeaders(token)
      });
      return response.data?.data || response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default NewsService;
