import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentBundle: null,
  isCreating: false,
};

const bundlesSlice = createSlice({
  name: 'bundles',
  initialState,
  reducers: {
    setCurrentBundle: (state, action) => {
      state.currentBundle = action.payload;
    },
    setIsCreating: (state, action) => {
      state.isCreating = action.payload;
    },
  },
});

export const { setCurrentBundle, setIsCreating } = bundlesSlice.actions;
export default bundlesSlice.reducer;
