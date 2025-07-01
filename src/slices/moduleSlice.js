import { createSlice } from '@reduxjs/toolkit';
import {
    fetchModulesThunk,
    createModuleThunk,
    updateModuleThunk,
    deleteModuleThunk
} from '../thunks/moduleThunks';

const initialState = {
    modules: [],
    isLoading: false,
    error: null,
};

const moduleSlice = createSlice({
    name: 'module',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Modules
            .addCase(fetchModulesThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchModulesThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.modules = action.payload;
            })
            .addCase(fetchModulesThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Create Module
            .addCase(createModuleThunk.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createModuleThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.modules.push(action.payload);
            })
            .addCase(createModuleThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Update Module
            .addCase(updateModuleThunk.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateModuleThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.modules.findIndex(m => m.id === action.payload.id);
                if (index !== -1) {
                    state.modules[index] = action.payload;
                }
            })
            .addCase(updateModuleThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Delete Module
            .addCase(deleteModuleThunk.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteModuleThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.modules = state.modules.filter(m => m.id !== action.payload);
            })
            .addCase(deleteModuleThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export default moduleSlice.reducer; 