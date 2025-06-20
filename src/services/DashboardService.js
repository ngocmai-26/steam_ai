import axios from '../axiosConfig';

const DashboardService = {
  getData: () => {
    return axios.get('/dashboard/data');
  },
};

export default DashboardService; 