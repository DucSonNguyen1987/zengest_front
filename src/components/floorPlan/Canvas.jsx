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

// ===== FONCTIONS DE VALIDATION CRITIQUES =====

const validateDimensions = (width, height, minSize = 5) => {
  const safeWidth = Math.max(Number(width) || minSize, minSize);
  const safeHeight = Math.max(Number(height) || minSize, minSize);
  return { width: safeWidth, height: safeHeight };
};

const validatePosition = (x, y) => {
  const safeX = Number(x) || 0;
  const safeY = Number(y) || 0;
  return { x: safeX, y: safeY };
};

const validateColor = (color, defaultColor = '#cccccc') => {
  return (typeof color === 'string' && color.length > 0) ? color : defaultColor;
};

const validateRotation = (rotation) => {
  const rot = Number(rotation) || 0;
  return isNaN(rot) ? 0 : rot;
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
  debug = false
}) => {
  const theme = useTheme();
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  
  const dispatch = useDispatch();
  const { currentFloorPlan } = useSelector(state => state.floorPlan);
  const stageRef = useRef(null);
  const containerRef = useRef(null);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  
  // États pour les dimensions du canvas - SÉCURISÉS
  const [canvasSize, setCanvasSize] = useState(() => {
    const validatedSize = validateDimensions(propWidth, height, 400);
    return {
      width: Math.max(validatedSize.width, 400),
      height: Math.max(validatedSize.height, 300)
    };
  });
  
  // État pour le message de succès
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Fermer le snackbar
  const handleCloseSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  // Mise à jour sécurisée de la taille du canvas
  const updateCanvasSize = useCallback(() => {
    if (!containerRef.current) return;
    
    try {
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;
      
      const validatedSize = validateDimensions(
        containerWidth || propWidth,
        containerHeight || height,
        400
      );
      
      setCanvasSize(prevSize => {
        if (prevSize.width !== validatedSize.width || prevSize.height !== validatedSize.height) {
          return {
            width: Math.max(validatedSize.width, 400),
            height: Math.max(validatedSize.height, 300)
          };
        }
        return prevSize;
      });
    } catch (error) {
      console.warn('Erreur lors de la mise à jour des dimensions:', error);
    }
  }, [propWidth, height]);
  
  // Observer pour les changements de taille - OPTIMISÉ
  useEffect(() => {
    updateCanvasSize();
    
    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    const handleResize = () => updateCanvasSize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [updateCanvasSize]);
  
  // Synchroniser la sélection avec le parent
  useEffect(() => {
    if (selectedItem) {
      setSelectedId(selectedItem.id);
      setSelectedType(selectedItem.type === 'obstacle' ? 'obstacle' : 'table');
    } else {
      setSelectedId(null);
      setSelectedType(null);
    }
  }, [selectedItem]);
  
  // Désélectionner lorsqu'on clique ailleurs
  const checkDeselect = useCallback((e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
      setSelectedType(null);
      if (onItemSelect) {
        onItemSelect(null);
      }
    }
  }, [onItemSelect]);
  
  // Gérer la suppression avec la touche Delete
  const handleKeyDown = useCallback((e) => {
    if (e.keyCode === 46 && selectedId && editable) {
      if (selectedType === 'table') {
        dispatch(deleteTable(selectedId));
        setSnackbar({
          open: true,
          message: 'La table a été supprimée avec succès',
          severity: 'success'
        });
      } else if (selectedType === 'obstacle') {
        dispatch(removeObstacle(selectedId));
        setSnackbar({
          open: true,
          message: 'L\'obstacle a été supprimé avec succès',
          severity: 'success'
        });
      }
      setSelectedId(null);
      setSelectedType(null);
      if (onItemSelect) {
        onItemSelect(null);
      }
    }
  }, [selectedId, selectedType, editable, dispatch, onItemSelect]);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Gérer la fin du drag & drop d'une table
  const handleTableDragEnd = useCallback((tableId, newPosition) => {
    if (!editable || !dragMode) return;
    
    const validatedPosition = validatePosition(newPosition.x, newPosition.y);
    dispatch(updateTablePosition({ tableId, position: validatedPosition }));
    
    if (onTableDragEnd) {
      onTableDragEnd(tableId, validatedPosition);
    }
    
    setSnackbar({
      open: true,
      message: 'Position de la table mise à jour',
      severity: 'success'
    });
  }, [editable, dragMode, dispatch, onTableDragEnd]);
  
  // Gérer la fin du drag & drop d'un obstacle
  const handleObstacleDragEnd = useCallback((obstacleId, newPosition) => {
    if (!editable || !obstaclesDraggable) return;
    
    const validatedPosition = validatePosition(newPosition.x, newPosition.y);
    dispatch(updateObstaclePosition({ obstacleId, position: validatedPosition }));
    
    if (propOnObstacleDragEnd) {
      propOnObstacleDragEnd(obstacleId, validatedPosition);
    }
    
    setSnackbar({
      open: true,
      message: 'Position de l\'obstacle mise à jour',
      severity: 'success'
    });
  }, [editable, obstaclesDraggable, dispatch, propOnObstacleDragEnd]);

  // Gérer la sélection d'éléments
  const handleItemClick = useCallback((id, type) => {
    setSelectedId(id);
    setSelectedType(type);
    
    if (onItemSelect) {
      // Trouver l'élément dans les données
      let item = null;
      if (type === 'table' && currentFloorPlan?.tables) {
        item = currentFloorPlan.tables.find(t => t.id === id);
      } else if (type === 'obstacle' && currentFloorPlan?.obstacles) {
        item = currentFloorPlan.obstacles.find(o => o.id === id);
      }
      
      if (item) {
        onItemSelect({ ...item, type });
      }
    }
  }, [onItemSelect, currentFloorPlan]);
  
  // ===== VALIDATION ET SÉCURISATION DES DONNÉES =====
  
  // Obstacles validés et sécurisés
  const safeObstacles = useMemo(() => {
    if (!currentFloorPlan?.obstacles || !showObstacles) return [];
    
    return currentFloorPlan.obstacles.filter(obstacle => {
      return obstacle && obstacle.id && 
             typeof obstacle.x === 'number' && 
             typeof obstacle.y === 'number' &&
             typeof obstacle.width === 'number' && obstacle.width > 0 &&
             typeof obstacle.height === 'number' && obstacle.height > 0;
    }).map(obstacle => {
      const validatedDims = validateDimensions(obstacle.width, obstacle.height, 10);
      const validatedPos = validatePosition(obstacle.x, obstacle.y);
      
      return {
        ...obstacle,
        ...validatedDims,
        ...validatedPos,
        color: validateColor(obstacle.color, '#FF6384'),
        rotation: validateRotation(obstacle.rotation),
        shape: obstacle.shape || 'rectangle'
      };
    });
  }, [currentFloorPlan?.obstacles, showObstacles]);
  
  // Tables validées et sécurisées
  const safeTables = useMemo(() => {
    if (!currentFloorPlan?.tables) return [];
    
    return currentFloorPlan.tables.filter(table => {
      return table && table.id && 
             typeof table.x === 'number' && 
             typeof table.y === 'number' &&
             typeof table.width === 'number' && table.width > 0 &&
             typeof table.height === 'number' && table.height > 0;
    }).map(table => {
      const validatedDims = validateDimensions(table.width, table.height, 20);
      const validatedPos = validatePosition(table.x, table.y);
      
      return {
        ...table,
        ...validatedDims,
        ...validatedPos,
        color: validateColor(table.color, '#e6f7ff'),
        rotation: validateRotation(table.rotation),
        capacity: Math.max(Number(table.capacity) || 2, 1)
      };
    });
  }, [currentFloorPlan?.tables]);
  
  // Périmètre validé et sécurisé
  const safePerimeter = useMemo(() => {
    if (!currentFloorPlan?.perimeter || !showPerimeter || !Array.isArray(currentFloorPlan.perimeter)) {
      return [];
    }
    
    return currentFloorPlan.perimeter.filter(point => {
      return point && 
             typeof point.x === 'number' && !isNaN(point.x) &&
             typeof point.y === 'number' && !isNaN(point.y);
    });
  }, [currentFloorPlan?.perimeter, showPerimeter]);
  
  // ===== RENDU DES ÉLÉMENTS SÉCURISÉS =====
  
  // Dessiner le périmètre de manière sécurisée
  const renderPerimeter = useMemo(() => {
    if (safePerimeter.length < 3) return null;
    
    try {
      const points = safePerimeter.flatMap(point => [point.x, point.y]);
      
      return (
        <Line
          points={points}
          closed={true}
          stroke={theme.palette.primary.main}
          fill="rgba(76, 56, 136, 0.1)"
          strokeWidth={2}
          listening={false}
        />
      );
    } catch (error) {
      console.warn('Erreur lors du rendu du périmètre:', error);
      return null;
    }
  }, [safePerimeter, theme]);
  
  // Obstacles rendus de manière sécurisée
  const renderObstacles = useMemo(() => {
    return safeObstacles.map((obstacle) => {
      try {
        const isSelected = selectedId === obstacle.id && selectedType === 'obstacle';
        const isDraggable = editable && obstaclesDraggable && dragMode;
        
        // Props communes pour tous les obstacles
        const commonProps = {
          key: obstacle.id,
          id: obstacle.id,
          fill: obstacle.color,
          stroke: isSelected ? theme.palette.primary.main : '#FF6384',
          strokeWidth: isSelected ? 3 : 1,
          draggable: isDraggable,
          onClick: () => handleItemClick(obstacle.id, 'obstacle'),
          onTap: () => handleItemClick(obstacle.id, 'obstacle'),
          shadowColor: isSelected ? theme.palette.primary.main : 'transparent',
          shadowOpacity: isSelected ? 0.3 : 0,
          shadowOffsetX: isSelected ? 2 : 0,
          shadowOffsetY: isSelected ? 2 : 0,
          shadowBlur: isSelected ? 5 : 0
        };
        
        if (isDraggable) {
          commonProps.onDragEnd = (e) => {
            const pos = e.target.position();
            let newPosition;
            
            if (obstacle.shape === 'rectangle') {
              newPosition = {
                x: pos.x + obstacle.width/2,
                y: pos.y + obstacle.height/2
              };
            } else {
              newPosition = { x: pos.x, y: pos.y };
            }
            
            handleObstacleDragEnd(obstacle.id, newPosition);
          };
        }
        
        // Rendu selon la forme
        if (obstacle.shape === 'rectangle') {
          return (
            <Rect
              {...commonProps}
              x={obstacle.x - obstacle.width/2}
              y={obstacle.y - obstacle.height/2}
              width={obstacle.width}
              height={obstacle.height}
              rotation={obstacle.rotation}
              offsetX={-obstacle.width/2}
              offsetY={-obstacle.height/2}
            />
          );
        } else if (obstacle.shape === 'circle') {
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
              radius={Math.max(obstacle.width/2, 5)}
              rotation={obstacle.rotation}
            />
          );
        }
        
        // Forme par défaut (rectangle)
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
      } catch (error) {
        console.warn(`Erreur lors du rendu de l'obstacle ${obstacle.id}:`, error);
        return null;
      }
    }).filter(Boolean);
  }, [safeObstacles, selectedId, selectedType, editable, obstaclesDraggable, dragMode, theme, handleItemClick, handleObstacleDragEnd]);
  
  // Affichage si aucun plan n'est sélectionné
  if (!currentFloorPlan) {
    return (
      <Paper
        elevation={0}
        ref={containerRef}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: `${height}px`,
          borderRadius: 2,
          border: `1px dashed ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Box sx={{ textAlign: 'center', p: 2 }}>
          <TableRestaurantIcon 
            sx={{ 
              fontSize: 48, 
              color: theme.palette.text.secondary,
              mb: 1
            }} 
          />
          <Typography 
            variant="body1" 
            sx={{ 
              color: theme.palette.text.secondary
            }}
          >
            Aucun plan sélectionné
          </Typography>
        </Box>
      </Paper>
    );
  }
  
  // Couleurs d'arrière-plan du canvas selon le thème
  const bgColor = isDark ? '#1E1E1E' : '#f9f9f9';
  const strokeColor = isDark ? '#333333' : '#dddddd';
  
  // Vérification finale des dimensions avant rendu
  if (canvasSize.width <= 0 || canvasSize.height <= 0) {
    return (
      <Paper
        elevation={0}
        ref={containerRef}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: `${height}px`,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Initialisation du canvas...
        </Typography>
      </Paper>
    );
  }
  
  return (
    <Box sx={{ position: 'relative' }}>
      <Paper
        elevation={0}
        ref={containerRef}
        sx={{
          height: `${height}px`,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Stage
          ref={stageRef}
          width={canvasSize.width}
          height={canvasSize.height}
          onMouseDown={checkDeselect}
          onTouchStart={checkDeselect}
        >
          <Layer>
            {/* Fond du plan de salle - DIMENSIONS VALIDÉES */}
            <Rect
              x={0}
              y={0}
              width={Math.max(canvasSize.width, 1)}
              height={Math.max(canvasSize.height, 1)}
              fill={bgColor}
              stroke={strokeColor}
              strokeWidth={1}
              listening={false}
            />
            
            {/* Grille en mode édition/déplacement */}
            {dragMode && editable && debug && Array.from({ length: Math.ceil(canvasSize.height / 20) }).map((_, index) => (
              <Rect
                key={`grid-h-${index}`}
                x={0}
                y={index * 20}
                width={Math.max(canvasSize.width, 1)}
                height={1}
                fill="transparent"
                stroke={theme.palette.divider}
                strokeWidth={1}
                dash={[2, 2]}
                opacity={0.2}
                listening={false}
              />
            ))}
            
            {dragMode && editable && debug && Array.from({ length: Math.ceil(canvasSize.width / 20) }).map((_, index) => (
              <Rect
                key={`grid-v-${index}`}
                x={index * 20}
                y={0}
                width={1}
                height={Math.max(canvasSize.height, 1)}
                fill="transparent"
                stroke={theme.palette.divider}
                strokeWidth={1}
                dash={[2, 2]}
                opacity={0.2}
                listening={false}
              />
            ))}
            
            {/* Affichage du périmètre */}
            {renderPerimeter}
            
            {/* Affichage des obstacles SÉCURISÉS */}
            <Group>
              {renderObstacles}
            </Group>
            
            {/* Affichage des tables SÉCURISÉES */}
            <Group>
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
        
        {/* Indicateur de mode déplacement */}
        {dragMode && editable && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              zIndex: 10
            }}
          >
            <Chip
              icon={<DragIndicatorIcon />}
              label="Mode déplacement actif"
              color="primary"
              size="small"
              sx={{
                backgroundColor: theme.palette.primary.main,
              }}
            />
          </Box>
        )}
      </Paper>
      
      {/* Message de succès */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ 
            width: '100%',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default React.memo(Canvas);