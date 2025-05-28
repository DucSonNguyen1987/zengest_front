import { useSelector, useDispatch } from 'react-redux';
import { useMemo, useCallback } from 'react';
import { shallowEqual } from 'react-redux';
import {
  addTable,
  updateTable,
  deleteTable,
  updateTablePosition,
  addObstacle,
  updateObstacle,
  removeObstacle,
  updateObstaclePosition,
  updateObstacleProperties,
  duplicateObstacle,
  switchFloorPlan
} from '../store/slices/floorPlanSlice';

/**
 * Hook optimisé pour les floor plans avec mémorisation
 * ✅ MISE À JOUR: Inclut toutes les actions pour les obstacles
 */
export const useOptimizedFloorPlan = () => {
  const dispatch = useDispatch();
  
  // Sélecteurs optimisés avec shallowEqual
  const floorPlanState = useSelector(state => ({
    currentFloorPlan: state.floorPlan.currentFloorPlan,
    allFloorPlans: state.floorPlan.floorPlans,
    loading: state.floorPlan.loading,
    error: state.floorPlan.error
  }), shallowEqual);
  
  // Tables et obstacles mémorisés
  const tables = useMemo(() => 
    floorPlanState.currentFloorPlan?.tables || [], 
    [floorPlanState.currentFloorPlan?.tables]
  );
  
  const obstacles = useMemo(() => 
    floorPlanState.currentFloorPlan?.obstacles || [], 
    [floorPlanState.currentFloorPlan?.obstacles]
  );
  
  const currentCapacity = useMemo(() => 
    tables.reduce((total, table) => total + (table.capacity || 0), 0),
    [tables]
  );
  
  // ✅ ACTIONS POUR LES TABLES - Actions définies avec useCallback au niveau racine
  const addTableAction = useCallback((table) => dispatch(addTable(table)), [dispatch]);
  const updateTableAction = useCallback((tableId, updates) => dispatch(updateTable({ tableId, updates })), [dispatch]);
  const deleteTableAction = useCallback((tableId) => dispatch(deleteTable(tableId)), [dispatch]);
  const updateTablePositionAction = useCallback((tableId, position) => dispatch(updateTablePosition({ tableId, position })), [dispatch]);
  
  // ✅ ACTIONS POUR LES OBSTACLES - Nouvelles actions complètes
  const addObstacleAction = useCallback((obstacle) => dispatch(addObstacle(obstacle)), [dispatch]);
  const updateObstacleAction = useCallback((obstacleId, updates) => dispatch(updateObstacle({ obstacleId, updates })), [dispatch]);
  const removeObstacleAction = useCallback((obstacleId) => dispatch(removeObstacle(obstacleId)), [dispatch]);
  const updateObstaclePositionAction = useCallback((obstacleId, position) => dispatch(updateObstaclePosition({ obstacleId, position })), [dispatch]);
  const updateObstaclePropertiesAction = useCallback((obstacleId, properties) => dispatch(updateObstacleProperties({ obstacleId, properties })), [dispatch]);
  const duplicateObstacleAction = useCallback((obstacleId) => dispatch(duplicateObstacle({ obstacleId })), [dispatch]);
  
  // ✅ AUTRES ACTIONS
  const switchFloorPlanAction = useCallback((floorPlanId) => dispatch(switchFloorPlan(floorPlanId)), [dispatch]);
  
  // ✅ ACTIONS SIMPLIFIÉES POUR L'UTILISATION
  const updateObstacleComplete = useCallback((obstacleId, updates) => {
    // Fonction helper qui combine position et propriétés
    const { x, y, ...otherUpdates } = updates;
    
    // Si on change la position, utiliser l'action spécifique
    if (x !== undefined || y !== undefined) {
      dispatch(updateObstaclePosition({ obstacleId, position: { x, y } }));
    }
    
    // Si on change d'autres propriétés, utiliser l'action générale
    if (Object.keys(otherUpdates).length > 0) {
      dispatch(updateObstacle({ obstacleId, updates: otherUpdates }));
    }
  }, [dispatch]);
  
  // ✅ FONCTION HELPER POUR OBTENIR UN OBSTACLE PAR ID
  const getObstacleById = useCallback((obstacleId) => {
    return obstacles.find(obstacle => obstacle.id === obstacleId) || null;
  }, [obstacles]);
  
  // ✅ FONCTION HELPER POUR OBTENIR UNE TABLE PAR ID
  const getTableById = useCallback((tableId) => {
    return tables.find(table => table.id === tableId) || null;
  }, [tables]);
  
  // ✅ STATISTIQUES COMPLÈTES
  const statistics = useMemo(() => ({
    totalTables: tables.length,
    totalCapacity: currentCapacity,
    totalObstacles: obstacles.length,
    averageCapacity: tables.length > 0 ? (currentCapacity / tables.length).toFixed(1) : 0,
    obstacleTypes: obstacles.reduce((acc, obstacle) => {
      const type = obstacle.category || obstacle.type || 'autre';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {}),
    floorPlanInfo: {
      name: floorPlanState.currentFloorPlan?.name || 'Sans nom',
      id: floorPlanState.currentFloorPlan?.id,
      hasPerimeter: Array.isArray(floorPlanState.currentFloorPlan?.perimeter) && floorPlanState.currentFloorPlan.perimeter.length > 0,
      capacityLimit: floorPlanState.currentFloorPlan?.capacityLimit || 0
    }
  }), [tables, currentCapacity, obstacles, floorPlanState.currentFloorPlan]);
  
  // ✅ OBJET D'ACTIONS MÉMORISÉ COMPLET
  const actions = useMemo(() => ({
    // Actions tables
    addTable: addTableAction,
    updateTable: updateTableAction,
    deleteTable: deleteTableAction,
    updateTablePosition: updateTablePositionAction,
    getTableById,
    
    // Actions obstacles - COMPLÈTES
    addObstacle: addObstacleAction,
    updateObstacle: updateObstacleAction,
    removeObstacle: removeObstacleAction,
    updateObstaclePosition: updateObstaclePositionAction,
    updateObstacleProperties: updateObstaclePropertiesAction,
    duplicateObstacle: duplicateObstacleAction,
    updateObstacleComplete, // Helper qui combine position + propriétés
    getObstacleById,
    
    // Actions plans
    switchFloorPlan: switchFloorPlanAction
  }), [
    addTableAction,
    updateTableAction,
    deleteTableAction,
    updateTablePositionAction,
    getTableById,
    addObstacleAction,
    updateObstacleAction,
    removeObstacleAction,
    updateObstaclePositionAction,
    updateObstaclePropertiesAction,
    duplicateObstacleAction,
    updateObstacleComplete,
    getObstacleById,
    switchFloorPlanAction
  ]);
  
  return {
    ...floorPlanState,
    tables,
    obstacles,
    currentCapacity,
    statistics,
    ...actions
  };
};