import { createSlice } from '@reduxjs/toolkit';
import { createClass, fetchClasses, updateClassThunk, deleteClassThunk } from '../thunks/classThunks';

const initialState = {
  classes: [],
  isLoading: false,
  error: null,
  isModalOpen: false,
  modalType: 'add', // 'add' or 'edit'
  selectedClass: null,
};

const classSlice = createSlice({
  name: 'class',
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.isModalOpen = true;
      state.modalType = action.payload.type || 'add';
      state.selectedClass = action.payload.class || null;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.modalType = 'add';
      state.selectedClass = null;
    },
  },
  extraReducers: (builder) => {
    // Create class
    builder
      .addCase(createClass.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createClass.fulfilled, (state, action) => {
        state.isLoading = false;
        state.classes.push(action.payload);
      })
      .addCase(createClass.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

    // Fetch classes
    builder
      .addCase(fetchClasses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.classes = action.payload;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

    // Update class
    builder
      .addCase(updateClassThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateClassThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.classes.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.classes[index] = action.payload;
        }
      })
      .addCase(updateClassThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

    // Delete class
    builder
      .addCase(deleteClassThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteClassThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.classes = state.classes.filter(c => c.id !== action.payload);
      })
      .addCase(deleteClassThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { openModal, closeModal } = classSlice.actions;
export default classSlice.reducer; 