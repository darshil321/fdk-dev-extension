import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import { dynamicBundleApi } from './services/dynamicBundleApi';

// Import slices
import bundlesSlice from './slices/bundlesSlice';

// Main store configuration
export const store = configureStore({
  reducer: {
    bundles: bundlesSlice,
    // Add dynamicBundleApi reducer
    [dynamicBundleApi.reducerPath]: dynamicBundleApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      dynamicBundleApi.middleware
    ),
});

// Enable refetchOnFocus and refetchOnReconnect
setupListeners(store.dispatch);
