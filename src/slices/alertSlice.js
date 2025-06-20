import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  msg: {},
};

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    setAlert: (state, action) => {
      state.msg = action.payload;
    },
  },
});

export const { setAlert } = alertSlice.actions;
export default alertSlice.reducer; 