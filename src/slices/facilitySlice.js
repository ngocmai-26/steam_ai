import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import FacilityService from '../services/FacilityService';

// Async thunks
export const fetchFacilities = createAsyncThunk(
  'facilities/fetchFacilities',
  async (_, { rejectWithValue }) => {
    try {
      const data = await FacilityService.getFacilities();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi tải danh sách cơ sở vật chất');
    }
  }
);

export const createFacility = createAsyncThunk(
  'facilities/createFacility',
  async (facilityData, { rejectWithValue }) => {
    try {
      const data = await FacilityService.createFacility(facilityData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi tạo cơ sở vật chất');
    }
  }
);

export const updateFacility = createAsyncThunk(
  'facilities/updateFacility',
  async ({ id, facilityData }, { rejectWithValue }) => {
    try {
      const data = await FacilityService.updateFacility(id, facilityData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi cập nhật cơ sở vật chất');
    }
  }
);

export const deleteFacility = createAsyncThunk(
  'facilities/deleteFacility',
  async (id, { rejectWithValue }) => {
    try {
      await FacilityService.deleteFacility(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi xóa cơ sở vật chất');
    }
  }
);

export const createFacilityImage = createAsyncThunk(
  'facilities/createFacilityImage',
  async ({ facilityId, imageFile }, { rejectWithValue }) => {
    try {
      const data = await FacilityService.createFacilityImage(facilityId, imageFile);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi tải lên hình ảnh');
    }
  }
);

export const deleteFacilityImage = createAsyncThunk(
  'facilities/deleteFacilityImage',
  async (imageId, { rejectWithValue }) => {
    try {
      await FacilityService.deleteFacilityImage(imageId);
      return imageId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi xóa hình ảnh');
    }
  }
);

const facilitySlice = createSlice({
  name: 'facilities',
  initialState: {
    facilities: [],
    loading: false,
    error: null,
    currentFacility: null,
    facilityImages: [],
    imagesLoading: false,
    imagesError: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearImagesError: (state) => {
      state.imagesError = null;
    },
    setCurrentFacility: (state, action) => {
      state.currentFacility = action.payload;
    },
    clearCurrentFacility: (state) => {
      state.currentFacility = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch facilities
      .addCase(fetchFacilities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFacilities.fulfilled, (state, action) => {
        state.loading = false;
        state.facilities = action.payload;
      })
      .addCase(fetchFacilities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create facility
      .addCase(createFacility.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFacility.fulfilled, (state, action) => {
        state.loading = false;
        state.facilities.push(action.payload);
      })
      .addCase(createFacility.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update facility
      .addCase(updateFacility.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFacility.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.facilities.findIndex(facility => facility.id === action.payload.id);
        if (index !== -1) {
          state.facilities[index] = action.payload;
        }
      })
      .addCase(updateFacility.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete facility
      .addCase(deleteFacility.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFacility.fulfilled, (state, action) => {
        state.loading = false;
        state.facilities = state.facilities.filter(facility => facility.id !== action.payload);
      })
      .addCase(deleteFacility.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create facility image
      .addCase(createFacilityImage.pending, (state) => {
        state.imagesLoading = true;
        state.imagesError = null;
      })
      .addCase(createFacilityImage.fulfilled, (state, action) => {
        state.imagesLoading = false;
        state.facilityImages.push(action.payload);
      })
      .addCase(createFacilityImage.rejected, (state, action) => {
        state.imagesLoading = false;
        state.imagesError = action.payload;
      })
      
      // Delete facility image
      .addCase(deleteFacilityImage.pending, (state) => {
        state.imagesLoading = true;
        state.imagesError = null;
      })
      .addCase(deleteFacilityImage.fulfilled, (state, action) => {
        state.imagesLoading = false;
        state.facilityImages = state.facilityImages.filter(image => image.id !== action.payload);
      })
      .addCase(deleteFacilityImage.rejected, (state, action) => {
        state.imagesLoading = false;
        state.imagesError = action.payload;
      });
  }
});

export const { clearError, clearImagesError, setCurrentFacility, clearCurrentFacility } = facilitySlice.actions;

export const selectFacilities = (state) => state.facilities.facilities;
export const selectFacilitiesLoading = (state) => state.facilities.loading;
export const selectFacilitiesError = (state) => state.facilities.error;
export const selectCurrentFacility = (state) => state.facilities.currentFacility;
export const selectFacilityImages = (state) => state.facilities.facilityImages;
export const selectImagesLoading = (state) => state.facilities.imagesLoading;
export const selectImagesError = (state) => state.facilities.imagesError;

export default facilitySlice.reducer;
