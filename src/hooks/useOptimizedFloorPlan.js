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
  
  // Actions mémorisées
  const actions = useMemo(() => ({
    addTable: useCallback((table) => dispatch(addTable(table)), [dispatch]),
    updateTable: useCallback((tableId, updates) => dispatch(updateTable({ tableId, updates })), [dispatch]),
    deleteTable: useCallback((tableId) => dispatch(deleteTable(tableId)), [dispatch]),
    updateTablePosition: useCallback((tableId, position) => dispatch(updateTablePosition({ tableId, position })), [dispatch]),
    addObstacle: useCallback((obstacle) => dispatch(addObstacle(obstacle)), [dispatch]),
    removeObstacle: useCallback((obstacleId) => dispatch(removeObstacle(obstacleId)), [dispatch]),
    switchFloorPlan: useCallback((floorPlanId) => dispatch(switchFloorPlan(floorPlanId)), [dispatch])
  }), [dispatch]);
  
  return {
    ...floorPlanState,
    tables,
    obstacles,
    currentCapacity,
    ...actions
  };
};
