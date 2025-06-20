import { createAsyncThunk } from '@reduxjs/toolkit';
import DashboardService from '../services/DashboardService';

export const fetchDashboardDataThunk = createAsyncThunk(
  'dashboard/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await DashboardService.getData();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Không thể tải dữ liệu dashboard');
    }
  }
); 