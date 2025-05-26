import { configureStore } from '@reduxjs/toolkit';
import floorPlanReducer from './slices/floorPlanSlice';

// Ajoutez d'autres reducers ici selon votre structure
export const store = configureStore({
  reducer: {
    floorPlan: floorPlanReducer,
    // ... autres reducers
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;