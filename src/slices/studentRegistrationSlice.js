import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import StudentRegistrationService from '../services/StudentRegistrationService';

// Async thunks
export const fetchPendingRegistrations = createAsyncThunk(
  'studentRegistration/fetchPending',
  async (_, { getState }) => {
    const token = getState().auth.token;
    const response = await StudentRegistrationService.getPendingRegistrations(token);
    // Ensure response.data is an array
    return Array.isArray(response.data) ? response.data : [];
  }
);

export const updateRegistrationStatus = createAsyncThunk(
  'studentRegistration/updateStatus',
  async ({ id, data }, { getState }) => {
    const token = getState().auth.token;
    const response = await StudentRegistrationService.updateRegistrationStatus(id, data, token);
    return response;
  }
);

const studentRegistrationSlice = createSlice({
  name: 'studentRegistration',
  initialState: {
    pendingRegistrations: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch pending registrations
      .addCase(fetchPendingRegistrations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingRegistrations.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingRegistrations = action.payload;
      })
      .addCase(fetchPendingRegistrations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update registration status
      .addCase(updateRegistrationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRegistrationStatus.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the updated registration from the pending list
        state.pendingRegistrations = state.pendingRegistrations.filter(
          reg => reg.id !== action.payload.id
        );
      })
      .addCase(updateRegistrationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default studentRegistrationSlice.reducer;
