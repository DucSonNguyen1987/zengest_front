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

// ✅ CORRECTION 1: Debounce optimisé
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
  maxWidth = 800,
  maxHeight = 600
}) => {
  const theme = useTheme();
  const { mode } = useColorMode();
  const isDark = mode === 'dark';

  const dispatch = useDispatch();

  // ✅ CORRECTION 2: Sélecteur sans shallowEqual pour forcer le re-render
  const currentFloorPlan = useSelector(state => state.floorPlan.currentFloorPlan);

  const stageRef = useRef(null);
  const containerRef = useRef(null);
  const resizeTimeoutRef = useRef(null);

  const [selectedId, setSelectedId] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  // ✅ CORRECTION 3: Canvas size avec valeurs stables
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

  // Gestion du resize
  const updateCanvasSize = useCallback(
    debounce(() => {
      if (fixedSize || !containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;

      if (containerWidth < 100 || containerHeight < 100) return;

      const newWidth = Math.min(containerWidth, maxWidth);
      const newHeight = Math.min(containerHeight, maxHeight);

      setCanvasSize(prevSize => {
        if (Math.abs(prevSize.width - newWidth) < 10 && Math.abs(prevSize.height - newHeight) < 10) {
          return prevSize;
        }
        return { width: newWidth, height: newHeight };
      });
    }, 200),
    [propWidth, height, fixedSize, maxWidth, maxHeight]
  );

  useEffect(() => {
    if (fixedSize) {
      setCanvasSize({
        width: Math.min(propWidth, maxWidth),
        height: Math.min(height, maxHeight)
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

  // Sync avec selectedItem
  const effectiveSelectedId = selectedItem?.id || selectedId;
  const effectiveSelectedType = selectedItem?.type || selectedType;

  // Handlers
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

  // ✅ CORRECTION 4: Validation simplifiée des tables
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

  // ✅ CORRECTION 5: Validation simplifiée des obstacles + debug
  const safeObstacles = useMemo(() => {
    console.log('🔍 Canvas - currentFloorPlan?.obstacles:', currentFloorPlan?.obstacles);
    console.log('🔍 Canvas - showObstacles:', showObstacles);

    if (!showObstacles || !currentFloorPlan?.obstacles?.length) {
      console.log('⚠️ Canvas - Pas d\'obstacles à afficher');
      return [];
    }

    const filtered = currentFloorPlan.obstacles
      .filter(obstacle => {
        const isValid = obstacle?.id && obstacle.width > 0 && obstacle.height > 0;
        if (!isValid) {
          console.log('⚠️ Canvas - Obstacle invalide:', obstacle);
        }
        return isValid;
      })
      .map(obstacle => {
        const processed = {
          ...obstacle,
          x: Number(obstacle.x) || 0,
          y: Number(obstacle.y) || 0,
          width: Math.max(Number(obstacle.width) || 10, 10),
          height: Math.max(Number(obstacle.height) || 10, 10),
          color: obstacle.color || '#FF6384',
          rotation: Number(obstacle.rotation) || 0,
          shape: obstacle.shape || 'rectangle'
        };
        console.log('✅ Canvas - Obstacle traité:', processed);
        return processed;
      });

    console.log('📊 Canvas - Obstacles finaux:', filtered);
    return filtered;
  }, [currentFloorPlan?.obstacles, showObstacles]);

  const safePerimeter = useMemo(() => {
    if (!showPerimeter || !Array.isArray(currentFloorPlan?.perimeter) || currentFloorPlan.perimeter.length < 3) {
      return [];
    }
    return currentFloorPlan.perimeter.filter(point =>
      point && typeof point.x === 'number' && typeof point.y === 'number'
    );
  }, [currentFloorPlan?.perimeter, showPerimeter]);

  // Rendu conditionnel pour plan vide
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



            {/* Perimeter */}
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

            {/* ✅ CORRECTION 6: Obstacles avec debug et rendu amélioré */}
            <Group>
              {safeObstacles.map((obstacle) => {
                console.log('🧪 TEST obstacle:', obstacle.id, obstacle.x, obstacle.y, obstacle.width, obstacle.height);

                const isSelected = effectiveSelectedId === obstacle.id && effectiveSelectedType === 'obstacle';
                const isDraggable = editable && obstaclesDraggable && dragMode;

                const commonProps = {
                  key: obstacle.id,
                  fill: "#00FF00",  // ✅ VERT FLUO pour test
                  stroke: "#FF0000", // ✅ CONTOUR ROUGE
                  strokeWidth: 4,    // ✅ CONTOUR ÉPAIS
                  draggable: isDraggable,
                  onClick: () => handleItemClick(obstacle.id, 'obstacle'),
                  onTap: () => handleItemClick(obstacle.id, 'obstacle'),
                };

                // ✅ RECTANGLE avec POSITION et TAILLE FORCÉES pour test
                return (
                  <Rect
                    {...commonProps}
                    x={50}         // ✅ Position en haut à gauche
                    y={100}        // ✅ Position visible
                    width={300}    // ✅ Très large
                    height={100}   // ✅ Très haut
                    rotation={0}
                    // ✅ Force les couleurs
                    fill="#FF0000"     // Rouge vif
                    stroke="#000000"   // Contour noir
                    strokeWidth={5}    // Contour épais
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

        {/* ✅ CORRECTION 7: Debug info en développement */}
        {import.meta.env.NODE_ENV === 'development' && (
          <Box sx={{ position: 'absolute', top: 12, left: 12, zIndex: 10 }}>
            <Chip
              label={`Tables: ${safeTables.length} | Obstacles: ${safeObstacles.length}`}
              size="small"
              color="info"
              variant="outlined"
              sx={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
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

// ✅ CORRECTION 8: Suppression de React.memo pour forcer le re-render
// Le composant se re-render maintenant à chaque changement d'état
export default Canvas;