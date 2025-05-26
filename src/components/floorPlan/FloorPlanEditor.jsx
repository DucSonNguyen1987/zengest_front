import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { 
  addObstacle, 
  removeObstacle, 
  setPerimeter, 
  updateCapacityLimit,
  updateTablePosition,
  updateObstaclePosition,
  addTable,
  updateTable,
  deleteTable
} from '../../store/slices/floorPlanSlice';

// Import du composant Canvas
import Canvas from './Canvas';

// Import des composants UI de base
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Slider,
  Divider,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Typography,
  InputAdornment,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction
} from '@mui/material';

// Import séparé pour Snackbar
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Popover from '@mui/material/Popover';

// Icônes MUI
import {
  BorderOuter as BorderOuterIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  DragIndicator as DragIcon,
  Save as SaveIcon,
  Circle as CircleIcon,
  Square as SquareIcon,
  ChangeHistory as TriangleIcon,
  Hexagon as HexagonIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Block as ObstacleIcon
} from '@mui/icons-material';

// react-color pour le sélecteur de couleur
import { SketchPicker } from 'react-color';

// Thème et contexte MUI
import { useTheme, alpha } from '@mui/material/styles';
import { useColorMode } from '../../context/ThemeContext';

const FloorPlanEditor = ({ 
  currentFloorPlan, 
  editable = true, 
  onSaveFloorPlan,
  ...rest
}) => {
  const theme = useTheme();
  const { mode } = useColorMode();
  const isDarkMode = mode === 'dark';
  
  const dispatch = useDispatch();
  const canvasRef = useRef(null);
  const tempPerimeterRef = useRef([]);
  
  // États pour les modes d'édition - SIMPLIFIÉS
  const [editMode, setEditMode] = useState('move'); // 'move', 'addObstacle', 'addTable', 'drawPerimeter'
  const [isDrawingPerimeter, setIsDrawingPerimeter] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // États pour les paramètres d'obstacles
  const [obstacleType, setObstacleType] = useState('rectangle');
  const [obstacleCategory, setObstacleCategory] = useState('mur');
  const [obstacleColor, setObstacleColor] = useState('#FF6384');
  const [obstacleWidth, setObstacleWidth] = useState(60);
  const [obstacleHeight, setObstacleHeight] = useState(40);
  const [obstacleRotation, setObstacleRotation] = useState(0);
  
  // États pour les paramètres de tables
  const [tableShape, setTableShape] = useState('rectangle');
  const [tableCapacity, setTableCapacity] = useState(4);
  const [tableColor, setTableColor] = useState('#e6f7ff');
  const [tableWidth, setTableWidth] = useState(80);
  const [tableHeight, setTableHeight] = useState(80);
  const [tableRotation, setTableRotation] = useState(0);
  const [tableLabel, setTableLabel] = useState('');
  
  // États pour contrôler le rendu du Canvas - OPTIMISÉS
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const [canvasKey] = useState(0);
  
  // État pour l'affichage du color picker
  const [colorPickerAnchorEl, setColorPickerAnchorEl] = useState(null);
  
  // États pour le périmètre
  const [perimeterShape, setPerimeterShape] = useState('custom');
  const [perimeterParams] = useState({ // Lecture seule
    width: 600,
    height: 400,
    radius: 250,
    sides: 6,
    x: 400,
    y: 300
  });
  
  // État pour la capacité limite
  const [capacityLimit, setCapacityLimit] = useState(
    currentFloorPlan?.capacityLimit || 50
  );
  
  // État pour les messages de notification
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  // Définition des types d'obstacles avec leurs propriétés par défaut - MÉMORISÉ
  const obstacleCategories = useMemo(() => ({
    mur: {
      name: 'Mur',
      icon: '🧱',
      defaultShape: 'rectangle',
      defaultColor: '#8B4513',
      defaultWidth: 100,
      defaultHeight: 20,
      description: 'Mur ou cloison'
    },
    poteau: {
      name: 'Poteau',
      icon: '⚫',
      defaultShape: 'circle',
      defaultColor: '#696969',
      defaultWidth: 30,
      defaultHeight: 30,
      description: 'Poteau ou colonne'
    },
    porte: {
      name: 'Porte',
      icon: '🚪',
      defaultShape: 'rectangle',
      defaultColor: '#D2691E',
      defaultWidth: 80,
      defaultHeight: 15,
      description: 'Porte ou passage'
    },
    escalier: {
      name: 'Escalier',
      icon: '🪜',
      defaultShape: 'rectangle',
      defaultColor: '#A0A0A0',
      defaultWidth: 120,
      defaultHeight: 60,
      description: 'Escalier ou marches'
    }
  }), []);

  // Styles adaptatifs selon le thème
  const themeStyles = useMemo(() => ({
    cardBackground: isDarkMode 
      ? alpha(theme.palette.background.paper, 0.8) 
      : theme.palette.background.paper,
    panelHeaderBg: isDarkMode
      ? alpha(theme.palette.primary.main, 0.2)
      : alpha(theme.palette.primary.main, 0.1),
    selectedItemBg: isDarkMode
      ? alpha(theme.palette.primary.main, 0.15)
      : alpha(theme.palette.primary.main, 0.08),
    buttonHoverBg: isDarkMode
      ? alpha(theme.palette.action.hover, 0.1)
      : theme.palette.action.hover,
    colorPreviewBorder: isDarkMode
      ? theme.palette.grey[600]
      : theme.palette.grey[300],
    canvasContainer: {
      backgroundColor: isDarkMode 
        ? theme.palette.grey[900] 
        : theme.palette.background.paper,
      borderColor: isDarkMode 
        ? theme.palette.grey[700] 
        : theme.palette.divider,
    },
    capacityAlert: {
      backgroundColor: isDarkMode
        ? alpha(theme.palette.error.main, 0.1)
        : alpha(theme.palette.error.main, 0.05),
      color: isDarkMode
        ? theme.palette.error.light
        : theme.palette.error.main,
    }
  }), [isDarkMode, theme]);
  
  // Calcul optimisé de la capacité actuelle
  const currentCapacity = useMemo(() => {
    if (!currentFloorPlan?.tables) return 0;
    return currentFloorPlan.tables.reduce((total, table) => total + (table.capacity || 0), 0);
  }, [currentFloorPlan?.tables]);

  // Détermine si le mode drag est actif
  const dragMode = useMemo(() => editMode === 'move', [editMode]);

  // Dimensions fixes du canvas pour éviter l'erreur Konva
  const canvasSize = useMemo(() => ({
    width: Math.max(800, 800), // Toujours >= 800
    height: Math.max(600, 600) // Toujours >= 600
  }), []);

  // ===== CALLBACKS OPTIMISÉS =====
  
  // Fonction pour afficher une notification
  const showNotification = useCallback((message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }, []);

  // Fonction pour appliquer les paramètres par défaut d'une catégorie d'obstacle
  const applyObstacleCategoryDefaults = useCallback((category) => {
    const categoryData = obstacleCategories[category];
    if (categoryData) {
      setObstacleType(categoryData.defaultShape);
      setObstacleColor(categoryData.defaultColor);
      setObstacleWidth(categoryData.defaultWidth);
      setObstacleHeight(categoryData.defaultHeight);
      setObstacleRotation(0);
    }
  }, [obstacleCategories]);

  // Fonction pour vérifier si un point est dans un polygone
  const isPointInPolygon = useCallback((point, polygon) => {
    if (!polygon || polygon.length === 0) return true;
    
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x, yi = polygon[i].y;
      const xj = polygon[j].x, yj = polygon[j].y;
      
      const intersect = ((yi > point.y) !== (yj > point.y))
          && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    
    return inside;
  }, []);

  // Fonction pour ajouter une table
  const handleAddTable = useCallback((x, y) => {
    if (!editable) return;
    
    if (currentFloorPlan?.perimeter && currentFloorPlan.perimeter.length > 0) {
      if (!isPointInPolygon({ x, y }, currentFloorPlan.perimeter)) {
        showNotification("La table doit être placée à l'intérieur du périmètre", 'warning');
        return;
      }
    }
    
    const newTable = {
      id: `table-${Date.now()}`,
      type: 'table',
      shape: tableShape,
      color: tableColor,
      x,
      y,
      width: tableWidth,
      height: tableHeight,
      rotation: tableRotation,
      capacity: tableCapacity,
      label: tableLabel || `Table ${Date.now().toString().slice(-4)}`
    };
    
    dispatch(addTable(newTable));
    showNotification('Table ajoutée avec succès');
  }, [editable, currentFloorPlan?.perimeter, isPointInPolygon, tableShape, tableColor, tableWidth, tableHeight, tableRotation, tableCapacity, tableLabel, dispatch, showNotification]);

  // Fonction pour modifier une table existante
  const handleUpdateTable = useCallback((tableId, updates) => {
    if (!editable) return;
    
    dispatch(updateTable({ tableId, updates }));
    
    if (selectedItem && selectedItem.id === tableId) {
      setSelectedItem(prev => ({ ...prev, ...updates }));
    }
    
    showNotification('Table modifiée avec succès');
  }, [editable, dispatch, selectedItem, showNotification]);

  // Fonction pour supprimer une table
  const handleRemoveTable = useCallback((tableId) => {
    if (!editable) return;
    dispatch(deleteTable(tableId));
    if (selectedItem?.id === tableId) {
      setSelectedItem(null);
    }
    showNotification('Table supprimée avec succès');
  }, [editable, dispatch, selectedItem, showNotification]);

  // Fonction pour ajouter un obstacle
  const handleAddObstacle = useCallback((x, y) => {
    if (!editable) return;
    
    if (currentFloorPlan?.perimeter && currentFloorPlan.perimeter.length > 0) {
      if (!isPointInPolygon({ x, y }, currentFloorPlan.perimeter)) {
        showNotification("L'obstacle doit être placé à l'intérieur du périmètre", 'warning');
        return;
      }
    }
    
    const newObstacle = {
      id: `obstacle-${Date.now()}`,
      type: 'obstacle',
      category: obstacleCategory,
      shape: obstacleType,
      color: obstacleColor,
      x,
      y,
      width: obstacleWidth,
      height: obstacleHeight,
      rotation: obstacleRotation
    };
    
    dispatch(addObstacle(newObstacle));
    showNotification(`${obstacleCategories[obstacleCategory].name} ajouté avec succès`);
  }, [editable, currentFloorPlan?.perimeter, isPointInPolygon, obstacleCategory, obstacleType, obstacleColor, obstacleWidth, obstacleHeight, obstacleRotation, dispatch, showNotification, obstacleCategories]);

  // Fonction pour modifier un obstacle existant
  const handleUpdateObstacle = useCallback((obstacleId, updates) => {
    if (!editable) return;
    
    if (currentFloorPlan?.obstacles) {
      const obstacleIndex = currentFloorPlan.obstacles.findIndex(obs => obs.id === obstacleId);
      if (obstacleIndex !== -1) {
        const updatedObstacle = { 
          ...currentFloorPlan.obstacles[obstacleIndex], 
          ...updates 
        };
        
        dispatch(removeObstacle(obstacleId));
        setTimeout(() => {
          dispatch(addObstacle(updatedObstacle));
        }, 50);
      }
    }
    
    if (selectedItem && selectedItem.id === obstacleId) {
      setSelectedItem(prev => ({ ...prev, ...updates }));
    }
    
    showNotification('Obstacle modifié avec succès');
  }, [editable, currentFloorPlan?.obstacles, dispatch, selectedItem, showNotification]);

  // Fonction pour supprimer un obstacle
  const handleRemoveObstacle = useCallback((obstacleId) => {
    if (!editable) return;
    dispatch(removeObstacle(obstacleId));
    if (selectedItem?.id === obstacleId) {
      setSelectedItem(null);
    }
    showNotification('Obstacle supprimé avec succès');
  }, [editable, dispatch, selectedItem, showNotification]);

  // Fonction pour gérer la sélection d'un élément
  const handleItemSelect = useCallback((item) => {
    setSelectedItem(item);
    if (item && editMode !== 'move') {
      setEditMode('move');
    }
  }, [editMode]);

  // ===== EFFECTS OPTIMISÉS =====
  
  // Effet pour initialiser le Canvas - UNE SEULE FOIS
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCanvasReady(true);
    }, 100); // Délai réduit
    
    return () => clearTimeout(timer);
  }, []); // Pas de dépendances

  // Initialisation des états depuis le plan existant - OPTIMISÉ
  useEffect(() => {
    if (currentFloorPlan?.id) {
      setCapacityLimit(prev => currentFloorPlan.capacityLimit || prev);
      setPerimeterShape(prev => currentFloorPlan.perimeterShape || prev);
    }
  }, [currentFloorPlan?.id]); // Seulement quand l'ID change

  // ===== HANDLERS D'ÉVÉNEMENTS =====
  
  // Gestion des clics sur le canvas
  const handleCanvasClick = useCallback((e) => {
    if (!editable) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (editMode === 'addObstacle') {
      handleAddObstacle(x, y);
    } else if (editMode === 'addTable') {
      handleAddTable(x, y);
    } else if (editMode === 'drawPerimeter') {
      if (!isDrawingPerimeter) {
        setIsDrawingPerimeter(true);
        tempPerimeterRef.current = [{ x, y }];
      } else {
        const firstPoint = tempPerimeterRef.current[0];
        if (tempPerimeterRef.current.length > 2 && 
            Math.sqrt(Math.pow(x - firstPoint.x, 2) + Math.pow(y - firstPoint.y, 2)) < 20) {
          dispatch(setPerimeter({
            perimeterShape: 'custom',
            perimeter: [...tempPerimeterRef.current]
          }));
          setIsDrawingPerimeter(false);
          tempPerimeterRef.current = [];
          showNotification('Périmètre personnalisé créé avec succès');
        } else {
          tempPerimeterRef.current = [...tempPerimeterRef.current, { x, y }];
        }
      }
    } else if (editMode === 'move' && selectedItem) {
      setSelectedItem(null);
    }
  }, [editable, editMode, isDrawingPerimeter, selectedItem, handleAddObstacle, handleAddTable, dispatch, showNotification]);
  
  // Gérer le mode d'édition
  const handleEditModeChange = useCallback((e) => {
    const newMode = e.target.value;
    setEditMode(newMode);
    
    if (newMode !== 'move' && selectedItem) {
      setSelectedItem(null);
    }
  }, [selectedItem]);
  
  // Gérer le drag & drop des tables
  const handleTableDragEnd = useCallback((tableId, newPosition) => {
    if (currentFloorPlan?.perimeter && currentFloorPlan.perimeter.length > 0) {
      if (!isPointInPolygon(newPosition, currentFloorPlan.perimeter)) {
        showNotification("La table doit rester à l'intérieur du périmètre", 'warning');
        return;
      }
    }
    
    dispatch(updateTablePosition({ tableId, position: newPosition }));
    showNotification('Position de la table mise à jour');
  }, [currentFloorPlan?.perimeter, isPointInPolygon, dispatch, showNotification]);
  
  // Gérer le drag & drop des obstacles
  const handleObstacleDragEnd = useCallback((obstacleId, newPosition) => {
    if (currentFloorPlan?.perimeter && currentFloorPlan.perimeter.length > 0) {
      if (!isPointInPolygon(newPosition, currentFloorPlan.perimeter)) {
        showNotification("L'obstacle doit rester à l'intérieur du périmètre", 'warning');
        return;
      }
    }
    
    dispatch(updateObstaclePosition({ obstacleId, position: newPosition }));
    showNotification("Position de l'obstacle mise à jour");
  }, [currentFloorPlan?.perimeter, isPointInPolygon, dispatch, showNotification]);

  const handleCapacityLimitChange = useCallback((event) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value)) {
      setCapacityLimit(value);
      dispatch(updateCapacityLimit(value));
    }
  }, [dispatch]);

  // Handlers pour le color picker
  const handleColorPickerClick = useCallback((event) => {
    setColorPickerAnchorEl(event.currentTarget);
  }, []);
  
  const handleColorPickerClose = useCallback(() => {
    setColorPickerAnchorEl(null);
  }, []);
  
  // Sauvegarde du plan - OPTIMISÉE
  const handleSave = useCallback(async () => {
    if (!onSaveFloorPlan || !currentFloorPlan) {
      showNotification('Impossible de sauvegarder le plan', 'warning');
      return;
    }

    try {
      const updatedFloorPlan = {
        ...currentFloorPlan,
        capacityLimit,
        perimeterShape,
        perimeterParams
      };
      
      onSaveFloorPlan(updatedFloorPlan);
      showNotification('Plan de salle enregistré avec succès');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      showNotification('Erreur lors de la sauvegarde', 'error');
    }
  }, [onSaveFloorPlan, currentFloorPlan, capacityLimit, perimeterShape, perimeterParams, showNotification]);
  
  const handleCloseSnackbar = useCallback(() => {
    setSnackbarOpen(false);
  }, []);
  
  // Fonction pour obtenir l'icône de forme appropriée
  const getShapeIcon = useCallback((shape) => {
    switch (shape) {
      case 'rectangle':
        return <SquareIcon fontSize="small" />;
      case 'circle':
        return <CircleIcon fontSize="small" />;
      case 'triangle':
        return <TriangleIcon fontSize="small" />;
      default:
        return <ObstacleIcon fontSize="small" />;
    }
  }, []);
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        width: '100%' 
      }} 
      {...rest}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 2, 
          width: '100%' 
        }}
      >
        <Box sx={{ flex: '0 0 300px', width: '300px' }}>
          <Card elevation={isDarkMode ? 4 : 2} sx={{ 
            height: '100%',
            backgroundColor: themeStyles.cardBackground,
            border: `1px solid ${isDarkMode ? theme.palette.grey[700] : theme.palette.divider}`
          }}>
            <CardHeader 
              title="Outils d'édition" 
              sx={{ 
                backgroundColor: themeStyles.panelHeaderBg,
                pb: 1,
                color: isDarkMode ? theme.palette.primary.light : theme.palette.primary.main,
                '& .MuiCardHeader-title': {
                  color: isDarkMode ? theme.palette.primary.light : theme.palette.primary.main,
                  fontWeight: 'medium'
                }
              }}
            />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}>
                {/* Mode d'édition SIMPLIFIÉ */}
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Mode d'édition
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={editMode}
                      onChange={handleEditModeChange}
                      disabled={!editable}
                      displayEmpty
                      sx={{ mb: 1 }}
                    >
                      <MenuItem value="move">
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 0.5 }}>
                          <DragIcon fontSize="small" />
                          <Typography>Déplacer & Modifier</Typography>
                        </Box>
                      </MenuItem>
                      <MenuItem value="addTable">
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 0.5 }}>
                          <AddIcon fontSize="small" />
                          <Typography>Ajouter table</Typography>
                        </Box>
                      </MenuItem>
                      <MenuItem value="addObstacle">
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 0.5 }}>
                          <AddIcon fontSize="small" />
                          <Typography>Ajouter obstacle</Typography>
                        </Box>
                      </MenuItem>
                      <MenuItem value="drawPerimeter">
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 0.5 }}>
                          <BorderOuterIcon fontSize="small" />
                          <Typography>Dessiner périmètre</Typography>
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                
                {/* Élément sélectionné avec MODIFICATION INTÉGRÉE */}
                {selectedItem && editMode === 'move' && (
                  <Paper variant="outlined" sx={{ 
                    p: 2, 
                    mb: 2,
                    backgroundColor: themeStyles.selectedItemBg,
                    border: `1px solid ${isDarkMode ? theme.palette.primary.dark : theme.palette.primary.light}`,
                    boxShadow: isDarkMode ? `0 2px 8px ${alpha(theme.palette.common.black, 0.3)}` : 1
                  }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Modification de l'élément
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box 
                        sx={{ 
                          width: 24, 
                          height: 24, 
                          bgcolor: selectedItem.color || '#1976d2',
                          borderRadius: selectedItem.shape === 'circle' ? '50%' : '4px',
                          mr: 1,
                          border: `2px solid ${themeStyles.colorPreviewBorder}`,
                          boxShadow: isDarkMode ? `0 0 4px ${alpha(selectedItem.color || '#1976d2', 0.3)}` : 'none'
                        }} 
                      />
                      <Typography variant="body2">
                        {selectedItem.type === 'obstacle' ? (
                          <>
                            {selectedItem.category && obstacleCategories[selectedItem.category] ? 
                              `${obstacleCategories[selectedItem.category].icon} ${obstacleCategories[selectedItem.category].name}` : 
                              'Obstacle'
                            } - {selectedItem.id}
                          </>
                        ) : (
                          <>
                            Table - {selectedItem.label || selectedItem.id}
                          </>
                        )}
                      </Typography>
                    </Box>

                    {/* Modification des propriétés communes */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      
                      {/* Pour les tables */}
                      {(selectedItem.type === 'table' || selectedItem.capacity !== undefined) && (
                        <>
                          <TextField
                            label="Nom de la table"
                            value={selectedItem.label || ''}
                            onChange={(e) => handleUpdateTable(selectedItem.id, { label: e.target.value })}
                            disabled={!editable}
                            size="small"
                            fullWidth
                          />
                          
                          <Box>
                            <Typography variant="body2" gutterBottom>
                              Capacité: {selectedItem.capacity || 4} personnes
                            </Typography>
                            <Slider
                              min={1}
                              max={12}
                              value={selectedItem.capacity || 4}
                              onChange={(_, value) => handleUpdateTable(selectedItem.id, { capacity: value })}
                              disabled={!editable}
                              marks={[
                                { value: 2, label: '2' },
                                { value: 4, label: '4' },
                                { value: 6, label: '6' },
                                { value: 8, label: '8' }
                              ]}
                            />
                          </Box>
                        </>
                      )}
                      
                      {/* Pour les obstacles */}
                      {selectedItem.type === 'obstacle' && (
                        <>
                          <FormControl fullWidth size="small">
                            <InputLabel>Type d'obstacle</InputLabel>
                            <Select
                              value={selectedItem.category || 'mur'}
                              onChange={(e) => {
                                const newCategory = e.target.value;
                                const categoryData = obstacleCategories[newCategory];
                                const updates = {
                                  category: newCategory,
                                  shape: categoryData.defaultShape,
                                  color: categoryData.defaultColor,
                                  width: categoryData.defaultWidth,
                                  height: categoryData.defaultHeight
                                };
                                handleUpdateObstacle(selectedItem.id, updates);
                              }}
                              disabled={!editable}
                              label="Type d'obstacle"
                            >
                              {Object.entries(obstacleCategories).map(([key, category]) => (
                                <MenuItem key={key} value={key}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <span>{category.icon}</span>
                                    <Typography variant="body2">{category.name}</Typography>
                                  </Box>
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </>
                      )}
                      
                      {/* Propriétés communes : dimensions */}
                      <Box>
                        <Typography variant="body2" gutterBottom>
                          Largeur: {selectedItem.width || 80}px
                        </Typography>
                        <Slider
                          min={20}
                          max={200}
                          value={selectedItem.width || 80}
                          onChange={(_, value) => {
                            if (selectedItem.type === 'obstacle') {
                              handleUpdateObstacle(selectedItem.id, { width: value });
                            } else {
                              handleUpdateTable(selectedItem.id, { width: value });
                            }
                          }}
                          disabled={!editable}
                        />
                      </Box>
                      
                      <Box>
                        <Typography variant="body2" gutterBottom>
                          Hauteur: {selectedItem.height || 80}px
                        </Typography>
                        <Slider
                          min={20}
                          max={200}
                          value={selectedItem.height || 80}
                          onChange={(_, value) => {
                            if (selectedItem.type === 'obstacle') {
                              handleUpdateObstacle(selectedItem.id, { height: value });
                            } else {
                              handleUpdateTable(selectedItem.id, { height: value });
                            }
                          }}
                          disabled={!editable}
                        />
                      </Box>
                      
                      <Box>
                        <Typography variant="body2" gutterBottom>
                          Rotation: {selectedItem.rotation || 0}°
                        </Typography>
                        <Slider
                          min={0}
                          max={360}
                          value={selectedItem.rotation || 0}
                          onChange={(_, value) => {
                            if (selectedItem.type === 'obstacle') {
                              handleUpdateObstacle(selectedItem.id, { rotation: value });
                            } else {
                              handleUpdateTable(selectedItem.id, { rotation: value });
                            }
                          }}
                          disabled={!editable}
                        />
                      </Box>

                      {/* Sélecteur de couleur pour l'élément sélectionné */}
                      <Box>
                        <Typography variant="body2" gutterBottom>
                          Couleur:
                        </Typography>
                        <Button 
                          variant="outlined"
                          onClick={handleColorPickerClick}
                          sx={{ 
                            width: '100%', 
                            backgroundColor: selectedItem.color || '#e6f7ff',
                            color: isDarkMode ? '#fff' : '#333',
                            border: `2px solid ${themeStyles.colorPreviewBorder}`,
                            '&:hover': {
                              backgroundColor: alpha(selectedItem.color || '#e6f7ff', isDarkMode ? 0.9 : 0.8),
                              transform: 'scale(1.02)',
                              boxShadow: isDarkMode 
                                ? `0 4px 12px ${alpha(selectedItem.color || '#e6f7ff', 0.3)}`
                                : `0 2px 8px ${alpha(selectedItem.color || '#e6f7ff', 0.4)}`
                            },
                            transition: 'all 0.2s ease-in-out'
                          }}
                        >
                          {selectedItem.color || '#e6f7ff'}
                        </Button>
                        <Popover
                          open={Boolean(colorPickerAnchorEl)}
                          anchorEl={colorPickerAnchorEl}
                          onClose={handleColorPickerClose}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                          }}
                          PaperProps={{
                            sx: {
                              backgroundColor: isDarkMode ? theme.palette.grey[800] : theme.palette.background.paper,
                              border: `1px solid ${isDarkMode ? theme.palette.grey[600] : theme.palette.divider}`,
                              boxShadow: isDarkMode 
                                ? `0 8px 32px ${alpha(theme.palette.common.black, 0.4)}`
                                : theme.shadows[8]
                            }
                          }}
                        >
                          <Box sx={{ p: 1 }}>
                            <SketchPicker 
                              color={selectedItem.color || '#e6f7ff'}
                              onChange={(color) => {
                                if (selectedItem.type === 'obstacle') {
                                  handleUpdateObstacle(selectedItem.id, { color: color.hex });
                                } else {
                                  handleUpdateTable(selectedItem.id, { color: color.hex });
                                }
                              }}
                              disableAlpha
                            />
                          </Box>
                        </Popover>
                      </Box>

                      {/* Bouton supprimer avec style adaptatif */}
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => {
                          if (selectedItem.type === 'obstacle') {
                            handleRemoveObstacle(selectedItem.id);
                          } else {
                            handleRemoveTable(selectedItem.id);
                          }
                        }}
                        size="small"
                        fullWidth
                        sx={{
                          '&:hover': {
                            transform: 'scale(1.02)',
                            boxShadow: isDarkMode 
                              ? `0 4px 12px ${alpha(theme.palette.error.main, 0.3)}`
                              : `0 2px 8px ${alpha(theme.palette.error.main, 0.4)}`
                          },
                          transition: 'all 0.2s ease-in-out'
                        }}
                      >
                        Supprimer
                      </Button>
                    </Box>
                  </Paper>
                )}
                
                {/* Options de table */}
                {editMode === 'addTable' && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Nouvelle table
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <TextField
                        label="Nom de la table"
                        value={tableLabel}
                        onChange={(e) => setTableLabel(e.target.value)}
                        disabled={!editable}
                        size="small"
                        fullWidth
                        placeholder="Table automatique"
                        helperText="Laissez vide pour un nom automatique"
                      />
                      
                      <FormControl fullWidth size="small">
                        <InputLabel id="table-shape-label">Forme</InputLabel>
                        <Select
                          labelId="table-shape-label"
                          value={tableShape}
                          onChange={(e) => setTableShape(e.target.value)}
                          disabled={!editable}
                          label="Forme"
                        >
                          <MenuItem value="rectangle">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <SquareIcon fontSize="small" />
                              <Typography>Rectangle</Typography>
                            </Box>
                          </MenuItem>
                          <MenuItem value="circle">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <CircleIcon fontSize="small" />
                              <Typography>Cercle</Typography>
                            </Box>
                          </MenuItem>
                        </Select>
                      </FormControl>
                      
                      <Box>
                        <Typography variant="body2" gutterBottom>
                          Capacité: {tableCapacity} personnes
                        </Typography>
                        <Slider
                          min={1}
                          max={12}
                          value={tableCapacity}
                          onChange={(_, value) => setTableCapacity(value)}
                          disabled={!editable}
                          marks={[
                            { value: 2, label: '2' },
                            { value: 4, label: '4' },
                            { value: 6, label: '6' },
                            { value: 8, label: '8' }
                          ]}
                        />
                      </Box>
                      
                      <Box>
                        <Typography variant="body2" gutterBottom>
                          Largeur: {tableWidth}px
                        </Typography>
                        <Slider
                          min={40}
                          max={150}
                          value={tableWidth}
                          onChange={(_, value) => setTableWidth(value)}
                          disabled={!editable}
                        />
                      </Box>
                      
                      <Box>
                        <Typography variant="body2" gutterBottom>
                          Hauteur: {tableHeight}px
                        </Typography>
                        <Slider
                          min={40}
                          max={150}
                          value={tableHeight}
                          onChange={(_, value) => setTableHeight(value)}
                          disabled={!editable}
                        />
                      </Box>
                      
                      <Box>
                        <Typography variant="body2" gutterBottom>
                          Rotation: {tableRotation}°
                        </Typography>
                        <Slider
                          min={0}
                          max={360}
                          value={tableRotation}
                          onChange={(_, value) => setTableRotation(value)}
                          disabled={!editable}
                          aria-labelledby="table-rotation-slider"
                        />
                      </Box>
                      
                      <Box>
                        <Typography variant="body2" gutterBottom>
                          Couleur:
                        </Typography>
                        <Button 
                          variant="outlined"
                          onClick={handleColorPickerClick}
                          sx={{ 
                            width: '100%', 
                            backgroundColor: tableColor,
                            color: isDarkMode ? '#fff' : '#333',
                            border: `2px solid ${themeStyles.colorPreviewBorder}`,
                            '&:hover': {
                              backgroundColor: alpha(tableColor, isDarkMode ? 0.9 : 0.8),
                              transform: 'scale(1.02)',
                              boxShadow: isDarkMode 
                                ? `0 4px 12px ${alpha(tableColor, 0.3)}`
                                : `0 2px 8px ${alpha(tableColor, 0.4)}`
                            },
                            transition: 'all 0.2s ease-in-out'
                          }}
                        >
                          {tableColor}
                        </Button>
                        <Popover
                          open={Boolean(colorPickerAnchorEl)}
                          anchorEl={colorPickerAnchorEl}
                          onClose={handleColorPickerClose}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                          }}
                        >
                          <Box sx={{ p: 1 }}>
                            <SketchPicker 
                              color={tableColor}
                              onChange={(color) => setTableColor(color.hex)}
                              disableAlpha
                            />
                          </Box>
                        </Popover>
                      </Box>
                    </Box>
                  </Box>
                )}
                
                {/* Options d'obstacle */}
                {editMode === 'addObstacle' && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Nouvel obstacle
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="obstacle-category-label">Type d'obstacle</InputLabel>
                        <Select
                          labelId="obstacle-category-label"
                          value={obstacleCategory}
                          onChange={(e) => {
                            setObstacleCategory(e.target.value);
                            applyObstacleCategoryDefaults(e.target.value);
                          }}
                          disabled={!editable}
                          label="Type d'obstacle"
                        >
                          {Object.entries(obstacleCategories).map(([key, category]) => (
                            <MenuItem key={key} value={key}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <span>{category.icon}</span>
                                <Box>
                                  <Typography variant="body2">{category.name}</Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {category.description}
                                  </Typography>
                                </Box>
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      
                      <Box>
                        <Typography variant="body2" gutterBottom>
                          Largeur: {obstacleWidth}px
                        </Typography>
                        <Slider
                          min={20}
                          max={200}
                          value={obstacleWidth}
                          onChange={(_, value) => setObstacleWidth(value)}
                          disabled={!editable}
                        />
                      </Box>
                      
                      <Box>
                        <Typography variant="body2" gutterBottom>
                          Hauteur: {obstacleHeight}px
                        </Typography>
                        <Slider
                          min={20}
                          max={200}
                          value={obstacleHeight}
                          onChange={(_, value) => setObstacleHeight(value)}
                          disabled={!editable}
                        />
                      </Box>
                    </Box>
                  </Box>
                )}
                
                {/* Liste des éléments en mode déplacer */}
                {editMode === 'move' && (
                  <>
                    {/* Liste des tables */}
                    {currentFloorPlan?.tables && currentFloorPlan.tables.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Tables ({currentFloorPlan.tables.length})
                        </Typography>
                        <Paper variant="outlined" sx={{ 
                          maxHeight: '150px', 
                          overflow: 'auto',
                          backgroundColor: isDarkMode ? alpha(theme.palette.background.paper, 0.6) : theme.palette.background.paper,
                          border: `1px solid ${isDarkMode ? theme.palette.grey[600] : theme.palette.divider}`
                        }}>
                          <List dense>
                            {currentFloorPlan.tables.map((table) => (
                              <ListItem 
                                key={table.id} 
                                component="div"
                                sx={{ 
                                  cursor: 'pointer',
                                  '&:hover': { 
                                    backgroundColor: isDarkMode 
                                      ? alpha(theme.palette.action.hover, 0.1) 
                                      : theme.palette.action.hover 
                                  },
                                  backgroundColor: selectedItem?.id === table.id 
                                    ? (isDarkMode 
                                        ? alpha(theme.palette.action.selected, 0.15)
                                        : theme.palette.action.selected)
                                    : 'transparent',
                                  transition: 'background-color 0.2s ease-in-out'
                                }}
                                onClick={() => handleItemSelect(table)}
                              >
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                  {table.shape === 'circle' ? <CircleIcon fontSize="small" /> : <SquareIcon fontSize="small" />}
                                </ListItemIcon>
                                <ListItemText 
                                  primary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <span>{table.label || `Table ${table.id.split('-')[1]}`}</span>
                                      <Box sx={{ 
                                        fontSize: '0.8rem', 
                                        background: isDarkMode ? theme.palette.primary.dark : theme.palette.primary.main, 
                                        color: 'white', 
                                        padding: '2px 6px', 
                                        borderRadius: '10px',
                                        boxShadow: isDarkMode ? `0 2px 4px ${alpha(theme.palette.common.black, 0.3)}` : 'none'
                                      }}>
                                        {table.capacity}p
                                      </Box>
                                    </Box>
                                  }
                                  secondary={`${Math.round(table.x)},${Math.round(table.y)} | ${table.width}×${table.height}px`}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Paper>
                      </Box>
                    )}
                    
                    {/* Liste des obstacles */}
                    {currentFloorPlan?.obstacles && currentFloorPlan.obstacles.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Obstacles ({currentFloorPlan.obstacles.length})
                        </Typography>
                        <Paper variant="outlined" sx={{ maxHeight: '150px', overflow: 'auto' }}>
                          <List dense>
                            {currentFloorPlan.obstacles.map((obstacle) => (
                              <ListItem 
                                key={obstacle.id} 
                                component="div"
                                sx={{ 
                                  cursor: 'pointer',
                                  '&:hover': { backgroundColor: 'action.hover' },
                                  backgroundColor: selectedItem?.id === obstacle.id ? 'action.selected' : 'transparent'
                                }}
                                onClick={() => handleItemSelect(obstacle)}
                              >
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                  {getShapeIcon(obstacle.shape)}
                                </ListItemIcon>
                                <ListItemText 
                                  primary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      {obstacle.category && obstacleCategories[obstacle.category] && (
                                        <span>{obstacleCategories[obstacle.category].icon}</span>
                                      )}
                                      <span>
                                        {obstacle.category && obstacleCategories[obstacle.category] ? 
                                          obstacleCategories[obstacle.category].name : 
                                          'Obstacle'
                                        } {obstacle.id.split('-')[1]}
                                      </span>
                                    </Box>
                                  }
                                  secondary={`${Math.round(obstacle.x)},${Math.round(obstacle.y)} | ${obstacle.width}×${obstacle.height}px`}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Paper>
                      </Box>
                    )}
                  </>
                )}
                
                <Divider />
                
                {/* Capacité de la salle */}
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Capacité de la salle
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      label="Limite de capacité"
                      type="number"
                      value={capacityLimit}
                      onChange={handleCapacityLimitChange}
                      disabled={!editable}
                      size="small"
                      fullWidth
                      inputProps={{ min: 1, max: 200 }}
                    />
                    
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 1.5,
                        backgroundColor: currentCapacity > capacityLimit 
                          ? themeStyles.capacityAlert.backgroundColor
                          : (isDarkMode ? alpha(theme.palette.background.default, 0.8) : theme.palette.background.default),
                        color: currentCapacity > capacityLimit 
                          ? themeStyles.capacityAlert.color
                          : theme.palette.text.primary,
                        fontWeight: currentCapacity > capacityLimit ? 'bold' : 'normal',
                        border: currentCapacity > capacityLimit 
                          ? `2px solid ${isDarkMode ? theme.palette.error.dark : theme.palette.error.main}`
                          : `1px solid ${isDarkMode ? theme.palette.grey[600] : theme.palette.divider}`,
                        transition: 'all 0.3s ease-in-out'
                      }}
                    >
                      <Typography variant="body2">
                        Capacité actuelle: {currentCapacity} / {capacityLimit}
                      </Typography>
                    </Paper>
                  </Box>
                </Box>
                
                <Divider />
                
                {/* Bouton de sauvegarde avec style adaptatif */}
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  disabled={!editable}
                  fullWidth
                  sx={{ 
                    mt: 2,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 'medium',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: isDarkMode 
                        ? `0 6px 16px ${alpha(theme.palette.primary.main, 0.3)}`
                        : `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`
                    },
                    '&:disabled': {
                      backgroundColor: isDarkMode ? theme.palette.grey[700] : theme.palette.grey[300]
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  Enregistrer le plan
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
        
        <Box sx={{ flex: '1 1 auto', minWidth: '500px' }}>
          <Box
            sx={{
              border: `2px solid ${themeStyles.canvasContainer.borderColor}`,
              borderRadius: 2,
              backgroundColor: themeStyles.canvasContainer.backgroundColor,
              height: '600px',
              width: '100%',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: isDarkMode 
                ? `0 8px 32px ${alpha(theme.palette.common.black, 0.4)}`
                : theme.shadows[4],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease-in-out'
            }}
            onClick={handleCanvasClick}
            ref={canvasRef}
          >
            {isCanvasReady ? (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%'
                }}
              >
                <Canvas 
                  key={`canvas-${canvasKey}-${currentFloorPlan?.id || 'default'}`}
                  editable={editable}
                  height={canvasSize.height}
                  width={canvasSize.width}
                  dragMode={dragMode}
                  showPerimeter={true}
                  showObstacles={true}
                  onTableDragEnd={handleTableDragEnd}
                  onObstacleDragEnd={handleObstacleDragEnd}
                  onItemSelect={handleItemSelect}  
                  selectedItem={selectedItem}
                  debug={false}
                  obstaclesDraggable={dragMode}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: theme.palette.text.secondary
                }}
              >
                <Typography variant="body2">Chargement du canvas...</Typography>
              </Box>
            )}
            
            {isCanvasReady && editMode === 'drawPerimeter' && isDrawingPerimeter && (
              <Box 
                sx={{ 
                  position: 'absolute', 
                  bottom: 10, 
                  left: 10, 
                  padding: '8px 12px',
                  backgroundColor: isDarkMode 
                    ? alpha(theme.palette.primary.dark, 0.9)
                    : alpha(theme.palette.primary.main, 0.9),
                  color: theme.palette.primary.contrastText,
                  borderRadius: '8px',
                  boxShadow: isDarkMode 
                    ? `0 4px 16px ${alpha(theme.palette.common.black, 0.4)}`
                    : `0 2px 8px ${alpha(theme.palette.common.black, 0.2)}`,
                  zIndex: 100,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  border: `1px solid ${isDarkMode ? theme.palette.primary.light : theme.palette.primary.dark}`,
                  animation: 'pulse 2s infinite'
                }}
              >
                <BorderOuterIcon fontSize="small" />
                <Typography variant="body2" fontWeight="medium">
                  Mode dessin de périmètre actif
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      
      {/* Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FloorPlanEditor;