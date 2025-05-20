import { configureStore } from '@reduxjs/toolkit';
import floorPlanReducer from './slices/floorPlanSlice';

// Ajoutez d'autres reducers ici selon votre structure
const store = configureStore({
  reducer: {
    floorPlan: floorPlanReducer,
    // autres reducers...
  }
});

export default store;