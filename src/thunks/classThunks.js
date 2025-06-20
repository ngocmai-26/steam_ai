import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  setLoading,
  setError,
  setClasses,
  addClass,
  updateClass,
  removeClass,
} from '../slices/classSlice';
import { mockApiService } from '../services/mockData';

// Fetch all classes
export const fetchClasses = createAsyncThunk(
  'class/fetchClasses',
  async () => {
    try {
      const response = await mockApiService.getClasses();
      return response;
    } catch (error) {
      throw error;
    }
  }
);

// Create new class
export const createClass = createAsyncThunk(
  'class/createClass',
  async (classData) => {
    try {
      const response = await mockApiService.createClass(classData);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

// Update class
export const updateClassThunk = createAsyncThunk(
  'class/updateClass',
  async ({ id, classData }) => {
    try {
      const response = await mockApiService.updateClass(id, classData);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

// Delete class
export const deleteClassThunk = createAsyncThunk(
  'class/deleteClass',
  async (id) => {
    try {
      await mockApiService.deleteClass(id);
      return id;
    } catch (error) {
      throw error;
    }
  }
); 