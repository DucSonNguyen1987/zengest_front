import { useSelector, useDispatch } from 'react-redux';
import {
  selectCurrentFloorPlan,
  selectCurrentTables,
  selectCurrentObstacles,
  selectCurrentCapacity,
  selectAllFloorPlans
} from '../store/selectors/floorPlanSelectors';
import {
  addTable,
  updateTable,
  deleteTable,
  updateTablePosition,
  addObstacle,
  removeObstacle,
  switchFloorPlan
} from '../store/slices/floorPlanSlice';

export const useFloorPlan = () => {
  const dispatch = useDispatch();
  
  // Sélecteurs
  const currentFloorPlan = useSelector(selectCurrentFloorPlan);
  const tables = useSelector(selectCurrentTables);
  const obstacles = useSelector(selectCurrentObstacles);
  const currentCapacity = useSelector(selectCurrentCapacity);
  const allFloorPlans = useSelector(selectAllFloorPlans);
  
  // Actions
  const actions = {
    addTable: (table) => dispatch(addTable(table)),
    updateTable: (tableId, updates) => dispatch(updateTable({ tableId, updates })),
    deleteTable: (tableId) => dispatch(deleteTable(tableId)),
    updateTablePosition: (tableId, position) => dispatch(updateTablePosition({ tableId, position })),
    addObstacle: (obstacle) => dispatch(addObstacle(obstacle)),
    removeObstacle: (obstacleId) => dispatch(removeObstacle(obstacleId)),
    switchFloorPlan: (floorPlanId) => dispatch(switchFloorPlan(floorPlanId))
  };
  
  return {
    currentFloorPlan,
    tables,
    obstacles,
    currentCapacity,
    allFloorPlans,
    ...actions
  };
};