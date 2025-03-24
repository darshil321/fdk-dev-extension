import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isCreating: false,
  isEditing: false,
  currentBundleId: null,
  filters: {
    status: 'all',
    sortBy: 'created_at',
    search: ''
  }
};

const bundlesSlice = createSlice({
  name: 'bundles',
  initialState,
  reducers: {
    setIsCreating: (state, action) => {
      state.isCreating = action.payload;
      if (action.payload === true) {
        state.isEditing = false;
        state.currentBundleId = null;
      }
    },
    setIsEditing: (state, action) => {
      state.isEditing = action.payload;
      if (action.payload === false) {
        state.currentBundleId = null;
      }
    },
    setCurrentBundleId: (state, action) => {
      state.currentBundleId = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload
      };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    }
  }
});

export const {
  setIsCreating,
  setIsEditing,
  setCurrentBundleId,
  setFilters,
  resetFilters
} = bundlesSlice.actions;

export default bundlesSlice.reducer;
