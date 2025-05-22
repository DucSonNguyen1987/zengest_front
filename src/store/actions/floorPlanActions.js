// src/store/actions/floorPlanActions.js
import {
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
  deleteFloorPlanFailure
} from '../slices/floorPlanSlice';

// Données mock - stockage local pour simuler une base de données
let mockFloorPlans = [
  {
    id: '1', // Changé de 'plan-1' à '1' pour correspondre aux logs
    name: 'Plan de restaurant principal',
    description: 'Plan de la salle principale - 20 tables',
    capacityLimit: 50,
    tables: [
      {
        id: '101',
        label: 'Table 1',
        capacity: 4,
        shape: 'rectangle',
        width: 80,
        height: 80,
        x: 100,
        y: 100,
        rotation: 0,
        color: '#f0f0f0'
      },
      {
        id: '102',
        label: 'Table 2',
        capacity: 2,
        shape: 'circle',
        width: 60,
        height: 60,
        x: 250,
        y: 150,
        rotation: 0,
        color: '#e6f7ff'
      },
      {
        id: '103',
        label: 'Table 3',
        capacity: 6,
        shape: 'rectangle',
        width: 100,
        height: 60,
        x: 150,
        y: 250,
        rotation: 0,
        color: '#f6ffed'
      }
    ],
    obstacles: [
      {
        id: 'obstacle-1',
        type: 'obstacle',
        category: 'mur',
        shape: 'rectangle',
        color: '#8B4513',
        x: 50,
        y: 350,
        width: 200,
        height: 20,
        rotation: 0
      },
      {
        id: 'obstacle-2',
        type: 'obstacle',
        category: 'poteau',
        shape: 'circle',
        color: '#696969',
        x: 400,
        y: 200,
        width: 30,
        height: 30,
        rotation: 0
      }
    ],
    perimeter: [
      { x: 50, y: 50 },
      { x: 750, y: 50 },
      { x: 750, y: 550 },
      { x: 50, y: 550 }
    ],
    perimeterShape: 'rectangle',
    perimeterParams: {
      width: 700,
      height: 500,
      x: 400,
      y: 300
    }
  },
  {
    id: '2',
    name: 'Terrasse',
    description: 'Plan de la terrasse extérieure',
    capacityLimit: 30,
    tables: [],
    obstacles: []
  }
];

// Fonction utilitaire pour simuler un délai réseau
const simulateNetworkDelay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Action pour récupérer tous les plans
export const fetchFloorPlans = () => async (dispatch) => {
  try {
    dispatch(fetchFloorPlansStart());
    await simulateNetworkDelay(500);
    dispatch(fetchFloorPlansSuccess([...mockFloorPlans])); // Clone pour éviter les modifications directes
  } catch (error) {
    dispatch(fetchFloorPlansFailure(error.message));
  }
};

// Action pour récupérer un plan spécifique
export const fetchFloorPlan = (id) => async (dispatch) => {
  try {
    dispatch(fetchFloorPlanStart());
    await simulateNetworkDelay();
    
    const plan = mockFloorPlans.find(p => p.id === id);
    if (plan) {
      dispatch(fetchFloorPlanSuccess({...plan})); // Clone pour éviter les modifications directes
    } else {
      throw new Error('Plan non trouvé');
    }
  } catch (error) {
    dispatch(fetchFloorPlanFailure(error.message));
  }
};

// Action pour créer un nouveau plan
export const createFloorPlan = (floorPlanData) => async (dispatch) => {
  try {
    dispatch(createFloorPlanStart());
    await simulateNetworkDelay();
    
    // Générer un ID si non fourni
    const newPlan = {
      ...floorPlanData,
      id: floorPlanData.id || `plan-${Date.now()}`,
      tables: floorPlanData.tables || []
    };
    
    // Ajouter le nouveau plan à notre "base de données" mock
    mockFloorPlans.push(newPlan);
    
    dispatch(createFloorPlanSuccess({...newPlan}));
    return {...newPlan};
  } catch (error) {
    dispatch(createFloorPlanFailure(error.message));
    throw error;
  }
};

// Action pour mettre à jour un plan
export const updateFloorPlan = (id, floorPlanData) => async (dispatch) => {
  try {
    dispatch(updateFloorPlanStart());
    await simulateNetworkDelay();
    
    // Trouver l'index du plan à mettre à jour
    const index = mockFloorPlans.findIndex(plan => plan.id === id);
    
    if (index === -1) {
      throw new Error('Plan non trouvé');
    }
    
    // Mettre à jour le plan
    const updatedPlan = {
      ...mockFloorPlans[index],
      ...floorPlanData,
      id // Garantir que l'ID reste inchangé
    };
    
    // Remplacer l'ancien plan dans notre "base de données" mock
    mockFloorPlans[index] = updatedPlan;
    
    dispatch(updateFloorPlanSuccess({...updatedPlan}));
    return {...updatedPlan};
  } catch (error) {
    dispatch(updateFloorPlanFailure(error.message));
    throw error;
  }
};

// Action pour supprimer un plan
export const deleteFloorPlan = (id) => async (dispatch) => {
  try {
    dispatch(deleteFloorPlanStart());
    await simulateNetworkDelay();
    
    // Vérifier si le plan existe
    const planExists = mockFloorPlans.some(plan => plan.id === id);
    
    if (!planExists) {
      throw new Error('Plan non trouvé');
    }
    
    // Filtrer la liste pour retirer le plan
    mockFloorPlans = mockFloorPlans.filter(plan => plan.id !== id);
    
    dispatch(deleteFloorPlanSuccess(id));
    return id;
  } catch (error) {
    dispatch(deleteFloorPlanFailure(error.message));
    throw error;
  }
};