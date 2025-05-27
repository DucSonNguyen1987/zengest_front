import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Stage, Layer, Rect, Circle, Line, Group, RegularPolygon } from 'react-konva';
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

// ✅ OPTIMISATION: Cache global pour éviter les recalculs
const VALIDATION_CACHE = new Map();
const VALIDATION_CACHE_MAX_SIZE = 50; // Réduit de 100 à 50

// ✅ OPTIMISATION: Fonction de validation ultra-rapide
const validateDimensions = (width, height, minSize = 5, maxSize = 1000) => {
  const key = `${width}-${height}`;
  
  if (VALIDATION_CACHE.has(key)) {
    return VALIDATION_CACHE.get(key);
  }
  
  const result = {
    width: Math.max(Math.min(Number(width) || minSize, maxSize), minSize),
    height: Math.max(Math.min(Number(height) || minSize, maxSize), minSize)
  };
  
  // Nettoyer le cache si nécessaire
  if (VALIDATION_CACHE.size >= VALIDATION_CACHE_MAX_SIZE) {
    const firstKey = VALIDATION_CACHE.keys().next().value;
    VALIDATION_CACHE.delete(firstKey);
  }
  
  VALIDATION_CACHE.set(key, result);
  return result;
};

// ✅ OPTIMISATION: Debounce plus agressif
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const Canvas = ({ 
  editable = true, 
  height = 400, 
  dragMode = false,
  onTableDragEnd,
  showPerimeter = true,
  showObstacles = true,
  width: propWidth = 800,
  onItemSelect,
  selectedItem,
  onObstacleDragEnd: propOnObstacleDragEnd,
  obstaclesDraggable = false,
  fixedSize = false,
  maxWidth = 800, // Réduit de 1000 à 800
  maxHeight = 600
}) => {
  const theme = useTheme();
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  
  const dispatch = useDispatch();
  
  // ✅ OPTIMISATION: Sélecteur optimisé avec shallowEqual
  const currentFloorPlan = useSelector(state => state.floorPlan.currentFloorPlan, 
    (left, right) => left?.id === right?.id && left?.tables?.length === right?.tables?.length
  );
  
  const stageRef = useRef(null);
  const containerRef = useRef(null);
  const resizeTimeoutRef = useRef(null);
  
  const [selectedId, setSelectedId] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  
  // ✅ OPTIMISATION: État simplifié avec valeurs par défaut stables
  const [canvasSize, setCanvasSize] = useState(() => ({
    width: Math.min(propWidth, maxWidth),
    height: Math.min(height, maxHeight)
  }));
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  // ✅ OPTIMISATION: Resize handler ultra-optimisé
  const updateCanvasSize = useCallback(
    debounce(() => {
      if (fixedSize || !containerRef.current) return;
      
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;
      
      if (containerWidth < 100 || containerHeight < 100) return;
      
      const newWidth = Math.min(containerWidth, maxWidth);
      const newHeight = Math.min(containerHeight, maxHeight);
      
      setCanvasSize(prevSize => {
        // Éviter les updates inutiles
        if (Math.abs(prevSize.width - newWidth) < 20 && Math.abs(prevSize.height - newHeight) < 20) {
          return prevSize;
        }
        return { width: newWidth, height: newHeight };
      });
    }, 200), // Augmenté de 100ms à 200ms
    [propWidth, height, fixedSize, maxWidth, maxHeight]
  );
  
  // ✅ OPTIMISATION: Effect simplifié sans ResizeObserver lourd
  useEffect(() => {
    if (fixedSize) {
      const validatedSize = validateDimensions(propWidth, height, 400, maxWidth);
      setCanvasSize({
        width: Math.min(validatedSize.width, maxWidth),
        height: Math.min(validatedSize.height, maxHeight)
      });
      return;
    }
    
    const handleResize = () => {
      clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = setTimeout(updateCanvasSize, 300);
    };
    
    updateCanvasSize();
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      clearTimeout(resizeTimeoutRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [updateCanvasSize, fixedSize, propWidth, height, maxWidth, maxHeight]);
  
  // ✅ OPTIMISATION: Sync avec selectedItem sans effect
  const effectiveSelectedId = selectedItem?.id || selectedId;
  const effectiveSelectedType = selectedItem?.type || selectedType;
  
  // ✅ OPTIMISATION: Handlers mémorisés et simplifiés
  const checkDeselect = useCallback((e) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
      setSelectedType(null);
      onItemSelect?.(null);
    }
  }, [onItemSelect]);
  
  const handleKeyDown = useCallback((e) => {
    if (e.keyCode === 46 && effectiveSelectedId && editable) {
      if (effectiveSelectedType === 'table') {
        dispatch(deleteTable(effectiveSelectedId));
        setSnackbar({ open: true, message: 'Table supprimée', severity: 'success' });
      } else if (effectiveSelectedType === 'obstacle') {
        dispatch(removeObstacle(effectiveSelectedId));
        setSnackbar({ open: true, message: 'Obstacle supprimé', severity: 'success' });
      }
      setSelectedId(null);
      setSelectedType(null);
      onItemSelect?.(null);
    }
  }, [effectiveSelectedId, effectiveSelectedType, editable, dispatch, onItemSelect]);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // ✅ OPTIMISATION: Handlers de drag simplifiés
  const handleTableDragEnd = useCallback((tableId, newPosition) => {
    if (!editable || !dragMode) return;
    
    dispatch(updateTablePosition({ tableId, position: newPosition }));
    onTableDragEnd?.(tableId, newPosition);
    setSnackbar({ open: true, message: 'Position mise à jour', severity: 'success' });
  }, [editable, dragMode, dispatch, onTableDragEnd]);
  
  const handleObstacleDragEnd = useCallback((obstacleId, newPosition) => {
    if (!editable || !obstaclesDraggable) return;
    
    dispatch(updateObstaclePosition({ obstacleId, position: newPosition }));
    propOnObstacleDragEnd?.(obstacleId, newPosition);
    setSnackbar({ open: true, message: 'Obstacle déplacé', severity: 'success' });
  }, [editable, obstaclesDraggable, dispatch, propOnObstacleDragEnd]);

  const handleItemClick = useCallback((id, type) => {
    setSelectedId(id);
    setSelectedType(type);
    
    if (onItemSelect) {
      const items = type === 'table' ? currentFloorPlan?.tables : currentFloorPlan?.obstacles;
      const item = items?.find(item => item.id === id);
      if (item) {
        onItemSelect({ ...item, type });
      }
    }
  }, [onItemSelect, currentFloorPlan]);
  
  // ✅ OPTIMISATION: Validation ultra-rapide avec early return
  const safeTables = useMemo(() => {
    if (!currentFloorPlan?.tables?.length) return [];
    
    return currentFloorPlan.tables
      .filter(table => table?.id && table.width > 0 && table.height > 0)
      .map(table => ({
        ...table,
        x: Number(table.x) || 0,
        y: Number(table.y) || 0,
        width: Math.max(Number(table.width) || 20, 20),
        height: Math.max(Number(table.height) || 20, 20),
        capacity: Math.max(Number(table.capacity) || 2, 1),
        color: table.color || '#e6f7ff',
        rotation: Number(table.rotation) || 0
      }));
  }, [currentFloorPlan?.tables]);
  
  const safeObstacles = useMemo(() => {
    if (!showObstacles || !currentFloorPlan?.obstacles?.length) return [];
    
    return currentFloorPlan.obstacles
      .filter(obstacle => obstacle?.id && obstacle.width > 0 && obstacle.height > 0)
      .map(obstacle => ({
        ...obstacle,
        x: Number(obstacle.x) || 0,
        y: Number(obstacle.y) || 0,
        width: Math.max(Number(obstacle.width) || 10, 10),
        height: Math.max(Number(obstacle.height) || 10, 10),
        color: obstacle.color || '#FF6384',
        rotation: Number(obstacle.rotation) || 0,
        shape: obstacle.shape || 'rectangle'
      }));
  }, [currentFloorPlan?.obstacles, showObstacles]);
  
  const safePerimeter = useMemo(() => {
    if (!showPerimeter || !Array.isArray(currentFloorPlan?.perimeter) || currentFloorPlan.perimeter.length < 3) {
      return [];
    }
    return currentFloorPlan.perimeter.filter(point => 
      point && typeof point.x === 'number' && typeof point.y === 'number'
    );
  }, [currentFloorPlan?.perimeter, showPerimeter]);
  
  // ✅ OPTIMISATION: Rendu conditionnel optimisé
  if (!currentFloorPlan) {
    return (
      <Paper
        elevation={0}
        ref={containerRef}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: `${Math.min(height, maxHeight)}px`,
          width: fixedSize ? `${Math.min(propWidth, maxWidth)}px` : '100%',
          maxWidth: `${maxWidth}px`,
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
  
  const finalCanvasWidth = Math.min(Math.max(canvasSize.width, 400), maxWidth);
  const finalCanvasHeight = Math.min(Math.max(canvasSize.height, 300), maxHeight);
  
  const bgColor = currentFloorPlan?.backgroundColor || (isDark ? '#1E1E1E' : '#f9f9f9');
  const strokeColor = isDark ? '#333333' : '#dddddd';
  
  return (
    <Box sx={{ position: 'relative' }}>
      <Paper
        elevation={0}
        ref={containerRef}
        sx={{
          height: `${finalCanvasHeight}px`,
          width: fixedSize ? `${finalCanvasWidth}px` : '100%',
          maxWidth: `${maxWidth}px`,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          overflow: 'hidden',
        }}
      >
        <Stage
          ref={stageRef}
          width={finalCanvasWidth}
          height={finalCanvasHeight}
          onMouseDown={checkDeselect}
          onTouchStart={checkDeselect}
        >
          <Layer>
            {/* Background */}
            <Rect
              x={0}
              y={0}
              width={finalCanvasWidth}
              height={finalCanvasHeight}
              fill={bgColor}
              stroke={strokeColor}
              strokeWidth={1}
              listening={false}
            />
            
            {/* Perimeter - Rendu conditionnel */}
            {safePerimeter.length >= 3 && (
              <Line
                points={safePerimeter.flatMap(point => [point.x, point.y])}
                closed={true}
                stroke={currentFloorPlan?.perimeterColor || theme.palette.primary.main}
                fill={`${currentFloorPlan?.perimeterColor || theme.palette.primary.main}15`}
                strokeWidth={2}
                listening={false}
              />
            )}
            
            {/* Obstacles */}
            <Group>
              {safeObstacles.map((obstacle) => {
                const isSelected = effectiveSelectedId === obstacle.id && effectiveSelectedType === 'obstacle';
                const isDraggable = editable && obstaclesDraggable && dragMode;
                
                const commonProps = {
                  key: obstacle.id,
                  fill: obstacle.color,
                  stroke: isSelected ? theme.palette.primary.main : '#FF6384',
                  strokeWidth: isSelected ? 3 : 1,
                  draggable: isDraggable,
                  onClick: () => handleItemClick(obstacle.id, 'obstacle'),
                  onTap: () => handleItemClick(obstacle.id, 'obstacle'),
                };
                
                if (isDraggable) {
                  commonProps.onDragEnd = (e) => {
                    const pos = e.target.position();
                    handleObstacleDragEnd(obstacle.id, pos);
                  };
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
            
            {/* Tables */}
            <Group>
              {safeTables.map((table) => (
                <TableShape
                  key={table.id}
                  table={table}
                  isSelected={table.id === effectiveSelectedId && effectiveSelectedType === 'table'}
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
      
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
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

export default React.memo(Canvas, (prevProps, nextProps) => {
  // Comparaison optimisée pour éviter les re-renders inutiles
  return (
    prevProps.editable === nextProps.editable &&
    prevProps.dragMode === nextProps.dragMode &&
    prevProps.selectedItem?.id === nextProps.selectedItem?.id &&
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height
  );
});