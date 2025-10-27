import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  msg: null,
};

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    setAlert: (state, action) => {
      state.msg = action.payload;
    },
    clearAlert: (state) => {
      state.msg = null;
    },
  },
});

export const { setAlert, clearAlert } = alertSlice.actions;
export default alertSlice.reducer; 