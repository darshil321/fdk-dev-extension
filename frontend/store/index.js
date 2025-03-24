import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import { api } from './api';
import { dynamicBundleApi } from './services/bundles';
import bundlesSlice from './slices/bundlesSlice';


export const store = configureStore({
  reducer: {
    bundles: bundlesSlice,
    [dynamicBundleApi.reducerPath]: dynamicBundleApi.reducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      dynamicBundleApi.middleware,
      api.middleware
    ),
});


setupListeners(store.dispatch);
