// src/components/floorPlan/OptimizedCanvas.jsx - VERSION OPTIMISÉE PERFORMANCE

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Stage, Layer, Rect, Circle, Line, Group } from 'react-konva';
import { useDispatch, useSelector } from 'react-redux';
import { 
  deleteTable, 
  updateTablePosition,
  updateObstaclePosition,
  removeObstacle
} from '../../store/slices/floorPlanSlice';
import TableShape from './TableShape';
import { 
  Box, 
  Paper, 
  Typography, 
  Snackbar, 
  Alert,
  Chip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { 
  TableRestaurant as TableRestaurantIcon,
  DragIndicator as DragIndicatorIcon
} from '@mui/icons-material';
import { useColorMode } from '../../context/ThemeContext';

// ✅ OPTIMISATION 1: Throttle pour les événements fréquents
const throttle = (func, delay) => {
  let timeoutId;
  let lastExecTime = 0;
  return function (...args) {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
};

// ✅ OPTIMISATION 2: Cache de validation global
const validationCache = new Map();
const VALIDATION_CACHE_SIZE = 30; // Réduit significativement

const validateDimensions = (width, height, minSize = 5, maxSize = 800) => {
  const key = `${width}-${height}-${minSize}-${maxSize}`;
  
  if (validationCache.has(key)) {
    return validationCache.get(key);
  }
  
  const result = {
    width: Math.max(Math.min(Number(width) || minSize, maxSize), minSize),
    height: Math.max(Math.min(Number(height) || minSize, maxSize), minSize)
  };
  
  if (validationCache.size >= VALIDATION_CACHE_SIZE) {
    const firstKey = validationCache.keys().next().value;
    validationCache.delete(firstKey);
  }
  
  validationCache.set(key, result);
  return result;
};

const OptimizedCanvas = ({ 
  editable = true, 
  height = 400, 
  dragMode = false,
  onTableDragEnd,
  showPerimeter = true,
  showObstacles = true,
  width: propWidth = 800,
  onItemSelect,
  selectedItem,
  obstaclesDraggable = false,
  fixedSize = false,
  maxWidth = 800,
  maxHeight = 600
}) => {
  const theme = useTheme();
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  
  const dispatch = useDispatch();
  
  // ✅ OPTIMISATION 3: Sélecteur ultra-simple avec égalité stricte
  const currentFloorPlan = useSelector(state => state.floorPlan.currentFloorPlan);
  
  const stageRef = useRef(null);
  const containerRef = useRef(null);
  
  const [selectedId, setSelectedId] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  
  // ✅ OPTIMISATION 4: Canvas size fixe pour éviter les recalculs
  const canvasSize = useMemo(() => ({
    width: Math.min(propWidth || 800, maxWidth),
    height: Math.min(height || 400, maxHeight)
  }), [propWidth, height, maxWidth, maxHeight]);
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // ✅ OPTIMISATION 5: Handlers throttlés pour éviter les spams
  const handleCloseSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  const checkDeselect = useCallback(throttle((e) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
      setSelectedType(null);
      onItemSelect?.(null);
    }
  }, 100), [onItemSelect]); // ✅ Throttle à 100ms

  // ✅ OPTIMISATION 6: Keyboard handler optimisé
  const handleKeyDown = useCallback(throttle((e) => {
    if (e.keyCode === 46 && selectedId && editable) {
      if (selectedType === 'table') {
        dispatch(deleteTable(selectedId));
        setSnackbar({ open: true, message: 'Table supprimée', severity: 'success' });
      } else if (selectedType === 'obstacle') {
        dispatch(removeObstacle(selectedId));
        setSnackbar({ open: true, message: 'Obstacle supprimé', severity: 'success' });
      }
      setSelectedId(null);
      setSelectedType(null);
      onItemSelect?.(null);
    }
  }, 200), [selectedId, selectedType, editable, dispatch, onItemSelect]); // ✅ Throttle plus agressif

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // ✅ OPTIMISATION 7: Drag handlers ultra-simples
  const handleTableDragEnd = useCallback(throttle((tableId, newPosition) => {
    if (!editable || !dragMode) return;
    
    dispatch(updateTablePosition({ tableId, position: newPosition }));
    onTableDragEnd?.(tableId, newPosition);
    setSnackbar({ open: true, message: 'Position mise à jour', severity: 'success' });
  }, 150), [editable, dragMode, dispatch, onTableDragEnd]);

  const handleItemClick = useCallback(throttle((id, type) => {
    setSelectedId(id);
    setSelectedType(type);
    
    if (onItemSelect) {
      const items = type === 'table' ? currentFloorPlan?.tables : currentFloorPlan?.obstacles;
      const item = items?.find(item => item.id === id);
      if (item) {
        onItemSelect({ ...item, type });
      }
    }
  }, 100), [onItemSelect, currentFloorPlan]);

  // ✅ OPTIMISATION 8: Validation ultra-rapide avec early returns
  const safeTables = useMemo(() => {
    if (!currentFloorPlan?.tables?.length) return [];
    
    return currentFloorPlan.tables
      .filter(table => table?.id && table.width > 0 && table.height > 0)
      .slice(0, 50) // ✅ Limite pour éviter le surrendu
      .map(table => {
        const validated = validateDimensions(table.width, table.height, 20, 200);
        return {
          ...table,
          x: Number(table.x) || 0,
          y: Number(table.y) || 0,
          width: validated.width,
          height: validated.height,
          capacity: Math.max(Number(table.capacity) || 2, 1),
          color: table.color || '#e6f7ff',
          rotation: Number(table.rotation) || 0
        };
      });
  }, [currentFloorPlan?.tables]);

  const safeObstacles = useMemo(() => {
    if (!showObstacles || !currentFloorPlan?.obstacles?.length) return [];
    
    return currentFloorPlan.obstacles
      .filter(obstacle => obstacle?.id && obstacle.width > 0 && obstacle.height > 0)
      .slice(0, 20) // ✅ Limite obstacles
      .map(obstacle => {
        const validated = validateDimensions(obstacle.width, obstacle.height, 10, 300);
        return {
          ...obstacle,
          x: Number(obstacle.x) || 0,
          y: Number(obstacle.y) || 0,
          width: validated.width,
          height: validated.height,
          color: obstacle.color || '#FF6384',
          rotation: Number(obstacle.rotation) || 0,
          shape: obstacle.shape || 'rectangle'
        };
      });
  }, [currentFloorPlan?.obstacles, showObstacles]);

  const safePerimeter = useMemo(() => {
    if (!showPerimeter || !Array.isArray(currentFloorPlan?.perimeter) || currentFloorPlan.perimeter.length < 3) {
      return [];
    }
    return currentFloorPlan.perimeter
      .filter(point => point && typeof point.x === 'number' && typeof point.y === 'number')
      .slice(0, 20); // ✅ Limite points périmètre
  }, [currentFloorPlan?.perimeter, showPerimeter]);

  // ✅ OPTIMISATION 9: Rendu conditionnel ultra-simple
  if (!currentFloorPlan) {
    return (
      <Paper
        elevation={0}
        ref={containerRef}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: `${canvasSize.height}px`,
          width: `${canvasSize.width}px`,
          borderRadius: 2,
          border: `1px dashed ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Box sx={{ textAlign: 'center', p: 2 }}>
          <TableRestaurantIcon 
            sx={{ fontSize: 48, color: theme.palette.text.secondary, mb: 1 }} 
          />
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
            Aucun plan sélectionné
          </Typography>
        </Box>
      </Paper>
    );
  }

  const bgColor = currentFloorPlan?.backgroundColor || (isDark ? '#1E1E1E' : '#f9f9f9');
  const strokeColor = isDark ? '#333333' : '#dddddd';

  return (
    <Box sx={{ position: 'relative' }}>
      <Paper
        elevation={0}
        ref={containerRef}
        sx={{
          height: `${canvasSize.height}px`,
          width: `${canvasSize.width}px`,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          overflow: 'hidden',
        }}
      >
        <Stage
          ref={stageRef}
          width={canvasSize.width}
          height={canvasSize.height}
          onMouseDown={checkDeselect}
          onTouchStart={checkDeselect}
          listening={editable} // ✅ Désactiver si non éditable
        >
          <Layer>
            {/* Background optimisé */}
            <Rect
              x={0}
              y={0}
              width={canvasSize.width}
              height={canvasSize.height}
              fill={bgColor}
              stroke={strokeColor}
              strokeWidth={1}
              listening={false}
              perfectDrawEnabled={false} // ✅ Performance Konva
            />
            
            {/* Perimeter optimisé */}
            {safePerimeter.length >= 3 && (
              <Line
                points={safePerimeter.flatMap(point => [point.x, point.y])}
                closed={true}
                stroke={currentFloorPlan?.perimeterColor || theme.palette.primary.main}
                fill={`${currentFloorPlan?.perimeterColor || theme.palette.primary.main}15`}
                strokeWidth={2}
                listening={false}
                perfectDrawEnabled={false} // ✅ Performance
              />
            )}
            
            {/* Obstacles optimisés */}
            <Group listening={editable}>
              {safeObstacles.map((obstacle) => {
                const isSelected = selectedId === obstacle.id && selectedType === 'obstacle';
                
                const commonProps = {
                  key: obstacle.id,
                  fill: obstacle.color,
                  stroke: isSelected ? theme.palette.primary.main : '#FF6384',
                  strokeWidth: isSelected ? 3 : 1,
                  perfectDrawEnabled: false, // ✅ Performance
                  listening: editable,
                };
                
                if (editable) {
                  commonProps.onClick = () => handleItemClick(obstacle.id, 'obstacle');
                  commonProps.onTap = () => handleItemClick(obstacle.id, 'obstacle');
                }
                
                return obstacle.shape === 'circle' ? (
                  <Circle
                    {...commonProps}
                    x={obstacle.x}
                    y={obstacle.y}
                    radius={Math.max(obstacle.width/2, 5)}
                  />
                ) : (
                  <Rect
                    {...commonProps}
                    x={obstacle.x - obstacle.width/2}
                    y={obstacle.y - obstacle.height/2}
                    width={obstacle.width}
                    height={obstacle.height}
                    rotation={obstacle.rotation}
                  />
                );
              })}
            </Group>
            
            {/* Tables optimisées */}
            <Group listening={editable}>
              {safeTables.map((table) => (
                <TableShape
                  key={table.id}
                  table={table}
                  isSelected={table.id === selectedId && selectedType === 'table'}
                  onSelect={() => handleItemClick(table.id, 'table')}
                  draggable={editable && dragMode}
                  isDarkMode={isDark}
                  onDragEnd={(newPosition) => handleTableDragEnd(table.id, newPosition)}
                  dragBorderColor={theme.palette.primary.main}
                />
              ))}
            </Group>
          </Layer>
        </Stage>
        
        {/* Drag Mode Indicator */}
        {dragMode && editable && (
          <Box sx={{ position: 'absolute', bottom: 12, right: 12, zIndex: 10 }}>
            <Chip
              icon={<DragIndicatorIcon />}
              label="Mode déplacement"
              color="primary"
              size="small"
            />
          </Box>
        )}
      </Paper>
      
      {/* Snackbar optimisé */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000} // ✅ Plus rapide
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// ✅ OPTIMISATION 10: Comparaison React.memo ultra-simple
export default React.memo(OptimizedCanvas, (prevProps, nextProps) => {
  return (
    prevProps.editable === nextProps.editable &&
    prevProps.dragMode === nextProps.dragMode &&
    prevProps.selectedItem?.id === nextProps.selectedItem?.id &&
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height &&
    prevProps.showPerimeter === nextProps.showPerimeter &&
    prevProps.showObstacles === nextProps.showObstacles
  );
});