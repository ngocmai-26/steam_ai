import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import UserService from '../services/UserService';

// Async thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (params = {}, { rejectWithValue }) => {
    try {
      console.log('fetchUsers thunk called with params:', params);
      const response = await UserService.getUsers(params);
      console.log('fetchUsers thunk response:', response);
      return response;
    } catch (error) {
      console.error('fetchUsers thunk error:', error);
      return rejectWithValue(error.response?.data || 'Không thể tải danh sách tài khoản');
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await UserService.createUser(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Không thể tạo tài khoản');
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const response = await UserService.updateUser(id, userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Không thể cập nhật tài khoản');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      await UserService.deleteUser(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Không thể xóa tài khoản');
    }
  }
);

export const fetchUsersByRole = createAsyncThunk(
  'users/fetchUsersByRole',
  async (role, { rejectWithValue }) => {
    try {
      const response = await UserService.getUsers({ role });
      return { role, users: response };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Không thể tải danh sách users');
    }
  }
);

export const changePassword = createAsyncThunk(
  'users/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await UserService.changePassword(passwordData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể thay đổi mật khẩu');
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    usersByRole: {},
    currentUserInfo: null, // Lưu user_info từ API token
    loading: false,
    error: null,
    filters: {
      role: '',
      status: '',
      search: ''
    }
  },
  reducers: {
    setFilters: (state, action) => {
      Object.assign(state.filters, action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
    clearUsers: (state) => {
      state.users = [];
    },
    setCurrentUserInfo: (state, action) => {
      state.currentUserInfo = action.payload;
    },
    clearCurrentUserInfo: (state) => {
      state.currentUserInfo = null;
    }
  },
  extraReducers: (builder) => {
    // fetchUsers
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // createUser
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateUser
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // deleteUser
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(user => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchUsersByRole
      .addCase(fetchUsersByRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersByRole.fulfilled, (state, action) => {
        state.loading = false;
        state.usersByRole[action.payload.role] = action.payload.users;
      })
      .addCase(fetchUsersByRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setFilters, clearError, clearUsers, setCurrentUserInfo, clearCurrentUserInfo } = userSlice.actions;
export default userSlice.reducer; 