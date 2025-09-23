import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import NewsService from '../services/NewsService';

// Async thunks
export const fetchNews = createAsyncThunk(
  'news/fetchAll',
  async (_, { getState }) => {
    const token = getState().auth.token;
    const response = await NewsService.getAllNews(token);
    return Array.isArray(response.data) ? response.data : [];
  }
);

export const createNews = createAsyncThunk(
  'news/create',
  async (newsData, { getState }) => {
    const token = getState().auth.token;
    const response = await NewsService.createNews(newsData, token);
    // Handle API response like Course API: response.data.data
    return response.data?.data || response.data || response;
  }
);

export const updateNews = createAsyncThunk(
  'news/update',
  async ({ id, newsData }, { getState }) => {
    const token = getState().auth.token;
    const response = await NewsService.updateNews(id, newsData, token);
    // Handle API response like Course API: response.data.data
    return response.data?.data || response.data || response;
  }
);

export const deleteNews = createAsyncThunk(
  'news/delete',
  async (id, { getState }) => {
    const token = getState().auth.token;
    const response = await NewsService.deleteNews(id, token);
    // Handle API response like Course API: response.data.data
    const responseData = response.data?.data || response.data || response;
    return { id, ...responseData };
  }
);

const newsSlice = createSlice({
  name: 'news',
  initialState: {
    newsList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch news
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading = false;
        state.newsList = action.payload;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create news
      .addCase(createNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNews.fulfilled, (state, action) => {
        state.loading = false;
        state.newsList.push(action.payload);
      })
      .addCase(createNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update news
      .addCase(updateNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNews.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.newsList.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.newsList[index] = action.payload;
        }
      })
      .addCase(updateNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete news
      .addCase(deleteNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNews.fulfilled, (state, action) => {
        state.loading = false;
        state.newsList = state.newsList.filter(item => item.id !== action.payload.id);
      })
      .addCase(deleteNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default newsSlice.reducer;
