import { createSlice } from '@reduxjs/toolkit';
import { transformMockDataToFloorPlans } from '../../utils/mockDataTransformer.js';

const initialFloorPlans = transformMockDataToFloorPlans();

const initialState = {
  floorPlans: initialFloorPlans,
  currentFloorPlan: initialFloorPlans[0] || null,
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

    // Nouvelle action pour réinitialiser avec les données mockées
    initializeMockData(state) {
      const mockFloorPlans = transformMockDataToFloorPlans();
      state.floorPlans = mockFloorPlans;
      state.currentFloorPlan = mockFloorPlans[0] || null;
      state.loading = false;
      state.error = null;
    },
    
    // Action pour changer de salle
    switchFloorPlan(state, action) {
      const floorPlan = state.floorPlans.find(plan => plan.id === action.payload);
      if (floorPlan) {
        state.currentFloorPlan = floorPlan;
      }
    },
    
    // ACTIONS POUR LES TABLES
    
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
      const { tableId, updates } = action.payload;
      
      if (state.currentFloorPlan && state.currentFloorPlan.tables) {
        const tableIndex = state.currentFloorPlan.tables.findIndex(table => table.id === tableId);
        
        if (tableIndex !== -1) {
          state.currentFloorPlan.tables[tableIndex] = {
            ...state.currentFloorPlan.tables[tableIndex],
            ...updates
          };
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
    
    // Mettre à jour la position d'une table
    updateTablePosition(state, action) {
      const { tableId, position } = action.payload;
      
      if (state.currentFloorPlan && state.currentFloorPlan.tables) {
        const tableIndex = state.currentFloorPlan.tables.findIndex(table => table.id === tableId);
        
        if (tableIndex !== -1) {
          state.currentFloorPlan.tables[tableIndex] = {
            ...state.currentFloorPlan.tables[tableIndex],
            x: position.x,
            y: position.y
          };
        }
      }
    },
    
    // ACTIONS POUR LES OBSTACLES
    
    // Ajouter un obstacle
    addObstacle(state, action) {
      if (state.currentFloorPlan) {
        if (!state.currentFloorPlan.obstacles) {
          state.currentFloorPlan.obstacles = [];
        }
        state.currentFloorPlan.obstacles.push(action.payload);
      }
    },
    
    // ✅ NOUVELLE ACTION: Mettre à jour un obstacle complet
    updateObstacle(state, action) {
      const { obstacleId, updates } = action.payload;
      
      if (state.currentFloorPlan && state.currentFloorPlan.obstacles) {
        const obstacleIndex = state.currentFloorPlan.obstacles.findIndex(
          obstacle => obstacle.id === obstacleId
        );
        
        if (obstacleIndex !== -1) {
          // Fusionner les modifications avec l'obstacle existant
          state.currentFloorPlan.obstacles[obstacleIndex] = {
            ...state.currentFloorPlan.obstacles[obstacleIndex],
            ...updates,
            // S'assurer que l'ID reste inchangé
            id: obstacleId,
            // Ajouter la date de modification
            updatedAt: new Date().toISOString()
          };
        }
      }
    },
    
    // Supprimer un obstacle
    removeObstacle(state, action) {
      if (state.currentFloorPlan && state.currentFloorPlan.obstacles) {
        state.currentFloorPlan.obstacles = state.currentFloorPlan.obstacles.filter(
          obstacle => obstacle.id !== action.payload
        );
      }
    },
    
    // Mettre à jour la position d'un obstacle
    updateObstaclePosition(state, action) {
      const { obstacleId, position } = action.payload;
      
      if (state.currentFloorPlan && state.currentFloorPlan.obstacles) {
        const obstacleIndex = state.currentFloorPlan.obstacles.findIndex(
          obstacle => obstacle.id === obstacleId
        );
        
        if (obstacleIndex !== -1) {
          state.currentFloorPlan.obstacles[obstacleIndex] = {
            ...state.currentFloorPlan.obstacles[obstacleIndex],
            x: position.x,
            y: position.y,
            updatedAt: new Date().toISOString()
          };
        }
      }
    },
    
    // ✅ NOUVELLE ACTION: Mettre à jour les propriétés spécifiques d'un obstacle
    updateObstacleProperties(state, action) {
      const { obstacleId, properties } = action.payload;
      
      if (state.currentFloorPlan && state.currentFloorPlan.obstacles) {
        const obstacleIndex = state.currentFloorPlan.obstacles.findIndex(
          obstacle => obstacle.id === obstacleId
        );
        
        if (obstacleIndex !== -1) {
          const obstacle = state.currentFloorPlan.obstacles[obstacleIndex];
          
          // Mettre à jour les propriétés spécifiées
          Object.keys(properties).forEach(key => {
            if (key !== 'id') { // Protéger l'ID
              obstacle[key] = properties[key];
            }
          });
          
          obstacle.updatedAt = new Date().toISOString();
        }
      }
    },
    
    // ✅ NOUVELLE ACTION: Dupliquer un obstacle
    duplicateObstacle(state, action) {
      const { obstacleId } = action.payload;
      
      if (state.currentFloorPlan && state.currentFloorPlan.obstacles) {
        const originalObstacle = state.currentFloorPlan.obstacles.find(
          obstacle => obstacle.id === obstacleId
        );
        
        if (originalObstacle) {
          const duplicatedObstacle = {
            ...originalObstacle,
            id: `obstacle-${Date.now()}-copy`,
            x: originalObstacle.x + 20, // Décaler légèrement
            y: originalObstacle.y + 20,
            name: `${originalObstacle.name || 'Obstacle'} (copie)`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          state.currentFloorPlan.obstacles.push(duplicatedObstacle);
        }
      }
    },
    
    // AUTRES ACTIONS
    
    // Définir le périmètre
    setPerimeter(state, action) {
      if (state.currentFloorPlan) {
        state.currentFloorPlan.perimeter = action.payload.perimeter;
        state.currentFloorPlan.perimeterShape = action.payload.perimeterShape;
        if (action.payload.perimeterParams) {
          state.currentFloorPlan.perimeterParams = action.payload.perimeterParams;
        }
      }
    },
    
    // Mettre à jour la limite de capacité
    updateCapacityLimit(state, action) {
      if (state.currentFloorPlan) {
        state.currentFloorPlan.capacityLimit = action.payload;
      }
    },
    
    // Sélectionner un plan comme courant
    setCurrentFloorPlan(state, action) {
      state.currentFloorPlan = action.payload;
    },
    
    // Réinitialiser la sélection courante
    clearCurrentFloorPlan(state) {
      state.currentFloorPlan = null;
    },
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
  updateTablePosition,
  setCurrentFloorPlan,
  clearCurrentFloorPlan,
  // Actions exportées pour les obstacles - MISES À JOUR
  addObstacle,
  updateObstacle,
  removeObstacle,
  updateObstaclePosition,
  updateObstacleProperties,
  duplicateObstacle,
  setPerimeter,
  updateCapacityLimit,
  // Initialisation des Mock Datas
  initializeMockData,
  switchFloorPlan
} = floorPlanSlice.actions;

export default floorPlanSlice.reducer;