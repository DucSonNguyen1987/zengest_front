import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import { useDispatch, useSelector } from 'react-redux';
import { updateTable, deleteTable, updateTablePosition } from '../../store/slices/floorPlanSlice';
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

const Canvas = ({ editable = true, height = 400, dragMode = false, onTableDragEnd }) => {
  const theme = useTheme();
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  
  const dispatch = useDispatch();
  const { currentFloorPlan } = useSelector(state => state.floorPlan);
  const stageRef = useRef(null);
  const containerRef = useRef(null);
  const [selectedId, setSelectedId] = useState(null);
  const [canvasSize, setCanvasSize] = useState({ width: 400, height });
  


useEffect(() => {
  console.log("Canvas props:", { editable, dragMode, onTableDragEnd });
  // Si onTableDragEnd est undefined, mettons un log d'avertissement
  if (!onTableDragEnd) {
    console.warn("onTableDragEnd callback is not provided to Canvas");
  }
}, [editable, dragMode, onTableDragEnd]);






  // État pour le message de succès
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Fermer le snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  // Ajustement du canvas au redimensionnement de la fenêtre
  useEffect(() => {
    const checkSize = () => {
      if (containerRef.current) {
        setCanvasSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    
    // Observer pour détecter les changements dans le DOM parent
    const resizeObserver = new ResizeObserver(() => {
      checkSize();
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
      checkSize(); // Vérifier la taille initiale
    }
    
    // Ajouter également un écouteur de redimensionnement de fenêtre
    window.addEventListener('resize', checkSize);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', checkSize);
    };
  }, []);
  
  // Désélectionner lorsqu'on clique ailleurs que sur une table
  const checkDeselect = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };
  
  // Gérer la suppression avec la touche Delete
  const handleKeyDown = (e) => {
    if (e.keyCode === 46 && selectedId && editable) { // touche Delete
      dispatch(deleteTable(selectedId));
      setSelectedId(null);
      setSnackbar({
        open: true,
        message: 'La table a été supprimée avec succès',
        severity: 'success'
      });
    }
  };
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedId, editable]);

  // Gérer la fin du drag & drop d'une table
 const handleDragEnd = (tableId, newPosition) => {
  console.log(`Canvas - handleDragEnd: tableId=${tableId}, position:`, newPosition);
  
  if (editable && dragMode) {
    console.log("Dispatching updateTablePosition action");
    dispatch(updateTablePosition({ tableId, position: newPosition }));
    
    // Notifier le parent si une fonction de callback a été fournie
    if (onTableDragEnd) {
      console.log("Calling onTableDragEnd callback");
      onTableDragEnd(tableId, newPosition);
    }
    
    setSnackbar({
      open: true,
      message: 'Position de la table mise à jour',
      severity: 'success'
    });
  } else {
    console.warn(`DragEnd ignored. editable=${editable}, dragMode=${dragMode}`);
  }
};
  
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
            {/* Fond du plan de salle */}
            <Rect
              x={0}
              y={0}
              width={canvasSize.width}
              height={canvasSize.height}
              fill={bgColor}
              stroke={strokeColor}
              strokeWidth={1}
            />
            
            {/* Grille en mode édition/déplacement */}
            {dragMode && editable && Array.from({ length: Math.ceil(canvasSize.height / 20) }).map((_, index) => (
              <Rect
                key={`grid-h-${index}`}
                x={0}
                y={index * 20}
                width={canvasSize.width}
                height={1}
                fill="transparent"
                stroke={theme.palette.divider}
                strokeWidth={1}
                dash={[2, 2]}
                opacity={0.2}
              />
            ))}
            
            {dragMode && editable && Array.from({ length: Math.ceil(canvasSize.width / 20) }).map((_, index) => (
              <Rect
                key={`grid-v-${index}`}
                x={index * 20}
                y={0}
                width={1}
                height={canvasSize.height}
                fill="transparent"
                stroke={theme.palette.divider}
                strokeWidth={1}
                dash={[2, 2]}
                opacity={0.2}
              />
            ))}
            
            {/* Affichage des tables */}
            {currentFloorPlan.tables && currentFloorPlan.tables.map((table) => (
              <TableShape
                key={table.id}
                tableData={table}
                isSelected={table.id === selectedId}
                onSelect={() => setSelectedId(table.id)}
                onChange={(newAttrs) => {
                  dispatch(updateTable({
                    ...table,
                    ...newAttrs
                  }));
                }}
                draggable={editable && dragMode}
                isDarkMode={isDark}
                onDragEnd={(newPosition) => handleDragEnd(table.id, newPosition)}
                dragBorderColor={theme.palette.primary.main}
                showDragHandles={dragMode}
              />
            ))}
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
        {/*Montrer si drag actif */}
      {dragMode && (
  <Box
    sx={{
      position: 'absolute',
      top: 12,
      left: 12,
      zIndex: 10,
      padding: '5px 10px',
      backgroundColor: 'red',
      color: 'white',
      borderRadius: '4px',
      fontWeight: 'bold'
    }}
  >
    MODE DRAG ACTIF
  </Box>
)}
      
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

export default Canvas;