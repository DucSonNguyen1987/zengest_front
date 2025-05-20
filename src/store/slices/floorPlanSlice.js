import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  floorPlans: [],
  currentFloorPlan: null,
  loading: false,
  error: null
};

const floorPlanSlice = createSlice({
  name: 'floorPlan',
  initialState,
  reducers: {
    // Récupérer tous les plans
    fetchFloorPlansStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchFloorPlansSuccess(state, action) {
      state.floorPlans = action.payload;
      state.loading = false;
    },
    fetchFloorPlansFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Récupérer un plan spécifique
    fetchFloorPlanStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchFloorPlanSuccess(state, action) {
      state.currentFloorPlan = action.payload;
      state.loading = false;
    },
    fetchFloorPlanFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Créer un nouveau plan
    createFloorPlanStart(state) {
      state.loading = true;
      state.error = null;
    },
    createFloorPlanSuccess(state, action) {
      state.floorPlans.push(action.payload);
      state.currentFloorPlan = action.payload;
      state.loading = false;
    },
    createFloorPlanFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Mettre à jour un plan
    updateFloorPlanStart(state) {
      state.loading = true;
      state.error = null;
    },
    updateFloorPlanSuccess(state, action) {
      const index = state.floorPlans.findIndex(plan => plan.id === action.payload.id);
      if (index !== -1) {
        state.floorPlans[index] = action.payload;
      }
      state.currentFloorPlan = action.payload;
      state.loading = false;
    },
    updateFloorPlanFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Supprimer un plan
    deleteFloorPlanStart(state) {
      state.loading = true;
      state.error = null;
    },
    deleteFloorPlanSuccess(state, action) {
      state.floorPlans = state.floorPlans.filter(plan => plan.id !== action.payload);
      if (state.currentFloorPlan && state.currentFloorPlan.id === action.payload) {
        state.currentFloorPlan = null;
      }
      state.loading = false;
    },
    deleteFloorPlanFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Ajouter une table au plan courant
    addTable(state, action) {
      if (state.currentFloorPlan) {
        if (!state.currentFloorPlan.tables) {
          state.currentFloorPlan.tables = [];
        }
        state.currentFloorPlan.tables.push(action.payload);
      }
    },
    
    // Mettre à jour une table
    updateTable(state, action) {
      if (state.currentFloorPlan && state.currentFloorPlan.tables) {
        const index = state.currentFloorPlan.tables.findIndex(table => table.id === action.payload.id);
        if (index !== -1) {
          state.currentFloorPlan.tables[index] = action.payload;
        }
      }
    },
    
    // Supprimer une table
    deleteTable(state, action) {
      if (state.currentFloorPlan && state.currentFloorPlan.tables) {
        state.currentFloorPlan.tables = state.currentFloorPlan.tables.filter(
          table => table.id !== action.payload
        );
      }
    },
    
    // Sélectionner un plan comme courant
    setCurrentFloorPlan(state, action) {
      state.currentFloorPlan = action.payload;
    },
    
    // Réinitialiser la sélection courante
    clearCurrentFloorPlan(state) {
      state.currentFloorPlan = null;
    }
  }
});

export const {
  fetchFloorPlansStart,
  fetchFloorPlansSuccess,
  fetchFloorPlansFailure,
  fetchFloorPlanStart,
  fetchFloorPlanSuccess,
  fetchFloorPlanFailure,
  createFloorPlanStart,
  createFloorPlanSuccess,
  createFloorPlanFailure,
  updateFloorPlanStart,
  updateFloorPlanSuccess,
  updateFloorPlanFailure,
  deleteFloorPlanStart,
  deleteFloorPlanSuccess,
  deleteFloorPlanFailure,
  addTable,
  updateTable,
  deleteTable,
  setCurrentFloorPlan,
  clearCurrentFloorPlan
} = floorPlanSlice.actions;

export default floorPlanSlice.reducer;