import { useSelector, useDispatch } from 'react-redux';
import { useMemo, useCallback } from 'react';
import { shallowEqual } from 'react-redux';
import {
  addTable,
  updateTable,
  deleteTable,
  updateTablePosition,
  addObstacle,
  removeObstacle,
  switchFloorPlan
} from '../store/slices/floorPlanSlice';

/**
 * Hook optimisé pour les floor plans avec mémorisation
 * ✅ CORRIGÉ: Hooks appelés au niveau racine uniquement
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
  
  // ✅ CORRECTION: Actions définies avec useCallback au niveau racine
  const addTableAction = useCallback((table) => dispatch(addTable(table)), [dispatch]);
  const updateTableAction = useCallback((tableId, updates) => dispatch(updateTable({ tableId, updates })), [dispatch]);
  const deleteTableAction = useCallback((tableId) => dispatch(deleteTable(tableId)), [dispatch]);
  const updateTablePositionAction = useCallback((tableId, position) => dispatch(updateTablePosition({ tableId, position })), [dispatch]);
  const addObstacleAction = useCallback((obstacle) => dispatch(addObstacle(obstacle)), [dispatch]);
  const removeObstacleAction = useCallback((obstacleId) => dispatch(removeObstacle(obstacleId)), [dispatch]);
  const switchFloorPlanAction = useCallback((floorPlanId) => dispatch(switchFloorPlan(floorPlanId)), [dispatch]);
  
  // ✅ CORRECTION: Objet d'actions mémorisé sans hooks à l'intérieur
  const actions = useMemo(() => ({
    addTable: addTableAction,
    updateTable: updateTableAction,
    deleteTable: deleteTableAction,
    updateTablePosition: updateTablePositionAction,
    addObstacle: addObstacleAction,
    removeObstacle: removeObstacleAction,
    switchFloorPlan: switchFloorPlanAction
  }), [
    addTableAction,
    updateTableAction,
    deleteTableAction,
    updateTablePositionAction,
    addObstacleAction,
    removeObstacleAction,
    switchFloorPlanAction
  ]);
  
  return {
    ...floorPlanState,
    tables,
    obstacles,
    currentCapacity,
    ...actions
  };
};