// src/components/floorPlan/OptimizedCanvas.jsx - VERSION CORRIGÉE

import React, { useState, useRef, useCallback, useMemo } from 'react';
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




// ✅ CORRECTION 1: Throttle optimisé mais moins agressif
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
  
  // ✅ CORRECTION 2: Sélecteur SANS optimisation pour forcer les updates
  const currentFloorPlan = useSelector(state => state.floorPlan.currentFloorPlan);
  
  const stageRef = useRef(null);
  
  const [selectedId, setSelectedId] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  
  // ✅ CORRECTION 3: Canvas size fixe et simple
  const canvasSize = useMemo(() => ({
    width: Math.min(propWidth || 800, maxWidth),
    height: Math.min(height || 400, maxHeight)
  }), [propWidth, height, maxWidth, maxHeight]);
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // ✅ CORRECTION 4: Handlers avec throttling réduit
  const handleCloseSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  const checkDeselect = useCallback(throttle((e) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
      setSelectedType(null);
      onItemSelect?.(null);
    }
  }, 50), [onItemSelect]); // ✅ Réduit de 100ms à 50ms

  const handleTableDragEnd = useCallback(throttle((tableId, newPosition) => {
    if (!editable || !dragMode) return;
    
    dispatch(updateTablePosition({ tableId, position: newPosition }));
    onTableDragEnd?.(tableId, newPosition);
    setSnackbar({ open: true, message: 'Position mise à jour', severity: 'success' });
  }, 100), [editable, dragMode, dispatch, onTableDragEnd]); // ✅ Réduit de 150ms à 100ms

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
  }, 50), [onItemSelect, currentFloorPlan]); // ✅ Réduit de 100ms à 50ms

  // ✅ CORRECTION 5: Validation ultra-rapide des tables
  const safeTables = useMemo(() => {
    if (!currentFloorPlan?.tables?.length) return [];
    
    return currentFloorPlan.tables
      .filter(table => table?.id && table.width > 0 && table.height > 0)
      .slice(0, 50) // ✅ Limite maintenue
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

  // ✅ CORRECTION 6: Validation optimisée des obstacles avec debug
  const safeObstacles = useMemo(() => {
    console.log('🔍 OptimizedCanvas - currentFloorPlan?.obstacles:', currentFloorPlan?.obstacles);
    console.log('🔍 OptimizedCanvas - showObstacles:', showObstacles);
    
    if (!showObstacles || !currentFloorPlan?.obstacles?.length) {
      console.log('⚠️ OptimizedCanvas - Pas d\'obstacles à afficher');
      return [];
    }
    
    const processed = currentFloorPlan.obstacles
      .filter(obstacle => {
        const isValid = obstacle?.id && obstacle.width > 0 && obstacle.height > 0;
        if (!isValid) {
          console.log('⚠️ OptimizedCanvas - Obstacle invalide:', obstacle);
        }
        return isValid;
      })
      .slice(0, 30) // ✅ Limite augmentée de 20 à 30
      .map(obstacle => {
        const result = {
          ...obstacle,
          x: Number(obstacle.x) || 0,
          y: Number(obstacle.y) || 0,
          width: Math.max(Number(obstacle.width) || 10, 10),
          height: Math.max(Number(obstacle.height) || 10, 10),
          color: obstacle.color || '#FF6384',
          rotation: Number(obstacle.rotation) || 0,
          shape: obstacle.shape || 'rectangle'
        };
        console.log('✅ OptimizedCanvas - Obstacle traité:', result);
        return result;
      });
    
    console.log('📊 OptimizedCanvas - Obstacles finaux:', processed);
    return processed;
  }, [currentFloorPlan?.obstacles, showObstacles]);

  const safePerimeter = useMemo(() => {
    if (!showPerimeter || !Array.isArray(currentFloorPlan?.perimeter) || currentFloorPlan.perimeter.length < 3) {
      return [];
    }
    return currentFloorPlan.perimeter
      .filter(point => point && typeof point.x === 'number' && typeof point.y === 'number')
      .slice(0, 20); // ✅ Limite maintenue
  }, [currentFloorPlan?.perimeter, showPerimeter]);

  // ✅ CORRECTION 7: Rendu conditionnel optimisé
  if (!currentFloorPlan) {
    return (
      <Paper
        elevation={0}
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
          listening={editable}
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
              perfectDrawEnabled={false}
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
                perfectDrawEnabled={false}
              />
            )}
            
            {/* ✅ CORRECTION 8: Obstacles optimisés avec rendu amélioré */}
            <Group listening={editable}>
              {safeObstacles.map((obstacle) => {
                console.log('🎨 OptimizedCanvas - Rendu obstacle:', obstacle.id, obstacle);
                
                const isSelected = selectedId === obstacle.id && selectedType === 'obstacle';
                
                const commonProps = {
                  key: obstacle.id,
                  fill: obstacle.color,
                  stroke: isSelected ? theme.palette.primary.main : '#FF6384',
                  strokeWidth: isSelected ? 3 : 2,
                  perfectDrawEnabled: false,
                  listening: editable,
                };
                
                if (editable) {
                  commonProps.onClick = () => handleItemClick(obstacle.id, 'obstacle');
                  commonProps.onTap = () => handleItemClick(obstacle.id, 'obstacle');
                }
                
                // Rendu selon la forme avec support amélioré
                if (obstacle.shape === 'circle') {
                  return (
                    <Circle
                      {...commonProps}
                      x={obstacle.x}
                      y={obstacle.y}
                      radius={Math.max(obstacle.width/2, 5)}
                    />
                  );
                } else if (obstacle.shape === 'triangle') {
                  return (
                    <RegularPolygon
                      {...commonProps}
                      x={obstacle.x}
                      y={obstacle.y}
                      sides={3}
                      radius={Math.max(obstacle.width/2, 10)}
                      rotation={obstacle.rotation}
                    />
                  );
                } else {
                  // Rectangle par défaut
                  return (
                    <Rect
                      {...commonProps}
                      x={obstacle.x - obstacle.width/2}
                      y={obstacle.y - obstacle.height/2}
                      width={obstacle.width}
                      height={obstacle.height}
                      rotation={obstacle.rotation}
                    />
                  );
                }
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
        
        {/* ✅ CORRECTION 9: Debug counter optimisé */}
        {import.meta.env.NODE_ENV === 'development' && (
          <Box sx={{ position: 'absolute', top: 12, left: 12, zIndex: 10 }}>
            <Chip
              label={`T:${safeTables.length} O:${safeObstacles.length}`}
              size="small"
              color="info"
              variant="outlined"
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.9)',
                fontSize: '0.7rem'
              }}
            />
          </Box>
        )}
      </Paper>
      
      {/* Snackbar optimisé */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
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

// ✅ CORRECTION 10: Suppression complète de React.memo pour éviter les problèmes de cache
// La performance est maintenue par les optimisations internes et useMemo
export default OptimizedCanvas;