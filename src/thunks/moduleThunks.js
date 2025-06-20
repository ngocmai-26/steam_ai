import { createAsyncThunk } from '@reduxjs/toolkit';
import { mockApiService } from '../services/mockData';

// Fetch all modules
export const fetchModules = createAsyncThunk(
  'module/fetchModules',
  async () => {
    try {
      const response = await mockApiService.getModules();
      return response;
    } catch (error) {
      throw error;
    }
  }
);

// Fetch module by id
export const fetchModuleById = createAsyncThunk(
  'module/fetchModuleById',
  async (id) => {
    try {
      const response = await mockApiService.getModuleById(id);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

// Fetch modules by course id
export const fetchModulesByCourseId = createAsyncThunk(
  'module/fetchModulesByCourseId',
  async (courseId) => {
    try {
      const response = await mockApiService.getModulesByCourseId(courseId);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

// Create new module
export const createModule = createAsyncThunk(
  'module/createModule',
  async (moduleData) => {
    try {
      const response = await mockApiService.createModule(moduleData);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

// Update module
export const updateModuleThunk = createAsyncThunk(
  'module/updateModule',
  async ({ id, moduleData }) => {
    try {
      const response = await mockApiService.updateModule(id, moduleData);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

// Delete module
export const deleteModuleThunk = createAsyncThunk(
  'module/deleteModule',
  async (id) => {
    try {
      await mockApiService.deleteModule(id);
      return id;
    } catch (error) {
      throw error;
    }
  }
); 