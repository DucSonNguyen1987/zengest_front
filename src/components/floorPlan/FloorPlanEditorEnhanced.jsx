// Effet pour s'assurer que dragMode est correctement mis à jour
  useEffect(() => {
    console.log("Mode d'édition:", editMode, "dragMode:", dragMode);
    setDragMode(editMode === 'move');
  }, [editMode]);  // Calcul de la capacité actuelle en fonction des tables
  useEffect(() => {
    if (currentFloorPlan?.tables) {
      const totalCapacity = currentFloorPlan.tables.reduce(
        (total, table) => total + (table.capacity || 0), 
        0
      );
      setCurrentCapacity(totalCapacity);
    }
  }, [currentFloorPlan]);import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { 
  addObstacle, 
  removeObstacle, 
  setPerimeter, 
  updateCapacityLimit,
  updateTablePosition,
  updateObstaclePosition
} from '../../store/slices/floorPlanSlice';

// Import du composant Canvas
import Canvas from './Canvas';

// Composants MUI
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
  Popover,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton
} from '@mui/material';

// Importer Snackbar séparément pour éviter les problèmes
import Snackbar from '@mui/material/Snackbar';

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

const FloorPlanEditorEnhanced = ({ 
  currentFloorPlan, 
  editable = true, 
  onSaveFloorPlan,
  ...rest
}) => {
  const theme = useTheme();
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  
  const dispatch = useDispatch();
  const canvasRef = useRef(null);
  
  // États pour les modes d'édition
  const [editMode, setEditMode] = useState('move'); // 'move', 'addObstacle', 'drawPerimeter'
  const [isDrawingPerimeter, setIsDrawingPerimeter] = useState(false);
  const [dragMode, setDragMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // États pour les paramètres d'obstacles
  const [obstacleType, setObstacleType] = useState('rectangle');
  const [obstacleColor, setObstacleColor] = useState('#FF6384');
  const [obstacleSize, setObstacleSize] = useState(40);
  
  // États pour définir les dimensions du canvas
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: 800,
    height: 600
  });
  
  // État pour l'affichage du color picker
  const [colorPickerAnchorEl, setColorPickerAnchorEl] = useState(null);
  
  // États pour le périmètre
  const [perimeterShape, setPerimeterShape] = useState('custom');
  const [perimeterParams, setPerimeterParams] = useState({
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
  const [currentCapacity, setCurrentCapacity] = useState(0);
  
  // État pour les messages de notification - simplification pour éviter les erreurs
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  // Référence temporaire pour le dessin du périmètre
  const tempPerimeterRef = useRef([]);
  
  // Effet pour définir les dimensions du canvas au chargement et au redimensionnement
  useEffect(() => {
    const updateCanvasDimensions = () => {
      if (canvasRef.current) {
        const containerWidth = canvasRef.current.clientWidth;
        const containerHeight = canvasRef.current.clientHeight;
        
        // Définir des dimensions qui respectent les proportions
        setCanvasDimensions({
          width: containerWidth,
          height: containerHeight
        });
      }
    };
    
    // Mettre à jour au chargement initial
    updateCanvasDimensions();
    
    // Ajouter un écouteur de redimensionnement pour ajuster dynamiquement
    window.addEventListener('resize', updateCanvasDimensions);
    
    // Nettoyage
    return () => {
      window.removeEventListener('resize', updateCanvasDimensions);
    };
  }, []);
  
  // Initialisation des états depuis le plan existant
  useEffect(() => {
    console.log("Plan chargé:", currentFloorPlan?.id);
    if (currentFloorPlan) {
      if (currentFloorPlan.capacityLimit) {
        setCapacityLimit(currentFloorPlan.capacityLimit);
      }
      if (currentFloorPlan.perimeter) {
        setPerimeterShape(currentFloorPlan.perimeterShape || 'custom');
      }
    }
  }, [currentFloorPlan]);
  
  // Effet pour s'assurer que dragMode est correctement mis à jour
  useEffect(() => {
    console.log("Mode d'édition:", editMode, "dragMode:", dragMode);
    setDragMode(editMode === 'move');
  }, [editMode]);
  
  // Fonction simplifiée pour afficher une notification
  const showNotification = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };
  
  // Fonction pour ajouter un obstacle
  const handleAddObstacle = (x, y) => {
    if (!editable) return;
    
    // Vérifier si la position est à l'intérieur du périmètre (si défini)
    if (currentFloorPlan?.perimeter && currentFloorPlan.perimeter.length > 0) {
      if (!isPointInPolygon({ x, y }, currentFloorPlan.perimeter)) {
        // Alerter que l'obstacle doit être dans le périmètre
        showNotification("L'obstacle doit être placé à l'intérieur du périmètre", 'warning');
        return;
      }
    }
    
    const newObstacle = {
      id: `obstacle-${Date.now()}`,
      type: 'obstacle',
      shape: obstacleType,
      color: obstacleColor,
      x,
      y,
      width: obstacleSize,
      height: obstacleSize,
      rotation: 0
    };
    
    dispatch(addObstacle(newObstacle));
    showNotification('Obstacle ajouté avec succès');
  };
  
  // Fonction pour supprimer un obstacle
  const handleRemoveObstacle = (obstacleId) => {
    if (!editable) return;
    dispatch(removeObstacle(obstacleId));
    setSelectedItem(null); // Désélectionner après suppression
    showNotification('Obstacle supprimé avec succès');
  };
  
  // Fonction pour gérer la sélection d'un élément
  const handleItemSelect = (item) => {
    console.log("Item sélectionné:", item);
    setSelectedItem(item);
    
    // Si on sélectionne un élément, passer en mode déplacement
    if (item && editMode !== 'move') {
      setEditMode('move');
      setDragMode(true);
    }
  };
  
  // Créer une forme de périmètre prédéfinie
  const createPredefinedPerimeter = (shape) => {
    if (!editable) return;
    
    console.log("Création d'un périmètre:", shape, perimeterParams);
    
    setPerimeterShape(shape);
    const centerX = perimeterParams.x;
    const centerY = perimeterParams.y;
    let points = [];
    
    switch (shape) {
      case 'rectangle': {
        const width = perimeterParams.width;
        const height = perimeterParams.height;
        points = [
          { x: centerX - width/2, y: centerY - height/2 },
          { x: centerX + width/2, y: centerY - height/2 },
          { x: centerX + width/2, y: centerY + height/2 },
          { x: centerX - width/2, y: centerY + height/2 }
        ];
        break;
      }
        
      case 'circle': {
        const radius = perimeterParams.radius;
        const segments = 36; // Nombre de segments pour approximer un cercle
        
        for (let i = 0; i < segments; i++) {
          const angle = (i / segments) * Math.PI * 2;
          points.push({
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius
          });
        }
        break;
      }
        
      case 'triangle': {
        const size = perimeterParams.radius;
        points = [
          { x: centerX, y: centerY - size },
          { x: centerX + size * 0.866, y: centerY + size * 0.5 }, // 0.866 = sin(60°)
          { x: centerX - size * 0.866, y: centerY + size * 0.5 }
        ];
        break;
      }
        
      case 'polygon': {
        const polySize = perimeterParams.radius;
        const sides = perimeterParams.sides;
        
        for (let i = 0; i < sides; i++) {
          const angle = (i / sides) * Math.PI * 2;
          points.push({
            x: centerX + Math.cos(angle) * polySize,
            y: centerY + Math.sin(angle) * polySize
          });
        }
        break;
      }
        
      default:
        break;
    }
    
    // Dispatch l'action pour mettre à jour le périmètre dans le store
    dispatch(setPerimeter({
      perimeterShape: shape,
      perimeter: points,
      perimeterParams
    }));
    
    showNotification('Périmètre mis à jour avec succès');
  };
  
  // Fonction pour vérifier si un point est dans un polygone
  const isPointInPolygon = (point, polygon) => {
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
  };
  
  // Gestion des clics sur le canvas
  const handleCanvasClick = (e) => {
    if (!editable) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (editMode === 'addObstacle') {
      handleAddObstacle(x, y);
    } else if (editMode === 'drawPerimeter') {
      if (!isDrawingPerimeter) {
        setIsDrawingPerimeter(true);
        tempPerimeterRef.current = [{ x, y }];
      } else {
        // Si on clique près du premier point, fermer le périmètre
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
    } else if (editMode === 'move') {
      // Désélectionner lorsqu'on clique sur le canvas vide
      if (selectedItem) {
        setSelectedItem(null);
      }
    }
  };
  
  // Gérer le mode d'édition
  const handleEditModeChange = (e) => {
    const newMode = e.target.value;
    console.log("Mode d'édition changé:", newMode);
    setEditMode(newMode);
    setDragMode(newMode === 'move');
    
    // Si on quitte le mode déplacement, désélectionner l'élément
    if (newMode !== 'move' && selectedItem) {
      setSelectedItem(null);
    }
  };
  
  // Gérer le drag & drop des tables
  const handleTableDragEnd = (tableId, newPosition) => {
    // Vérifier si la position est dans le périmètre
    if (currentFloorPlan?.perimeter && currentFloorPlan.perimeter.length > 0) {
      if (!isPointInPolygon(newPosition, currentFloorPlan.perimeter)) {
        showNotification("La table doit rester à l'intérieur du périmètre", 'warning');
        return;
      }
    }
    
    dispatch(updateTablePosition({ tableId, position: newPosition }));
    showNotification('Position de la table mise à jour');
  };
  
  // Gérer le drag & drop des obstacles
  const handleObstacleDragEnd = (obstacleId, newPosition) => {
    console.log("Obstacle déplacé:", obstacleId, newPosition);
    
    // Vérifier si la position est dans le périmètre
    if (currentFloorPlan?.perimeter && currentFloorPlan.perimeter.length > 0) {
      if (!isPointInPolygon(newPosition, currentFloorPlan.perimeter)) {
        showNotification("L'obstacle doit rester à l'intérieur du périmètre", 'warning');
        return;
      }
    }
    
    dispatch(updateObstaclePosition({ obstacleId, position: newPosition }));
    showNotification("Position de l'obstacle mise à jour");
  };
  
  // Gérer l'ouverture du color picker
  const handleColorPickerClick = (event) => {
    setColorPickerAnchorEl(event.currentTarget);
  };
  
  // Gérer la fermeture du color picker
  const handleColorPickerClose = () => {
    setColorPickerAnchorEl(null);
  };
  
  // Mise à jour de la capacité limite
  const handleCapacityLimitChange = (event) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value)) {
      setCapacityLimit(value);
      dispatch(updateCapacityLimit(value));
    }
  };
  
  // Mise à jour des paramètres de périmètre
  const handlePerimeterParamChange = (param, value) => {
    console.log("Paramètre de périmètre modifié:", param, value);
    
    const updatedParams = {
      ...perimeterParams,
      [param]: value
    };
    
    setPerimeterParams(updatedParams);
    
    // Si le périmètre existe déjà, le mettre à jour automatiquement
    if (perimeterShape !== 'custom' && currentFloorPlan?.perimeter && currentFloorPlan.perimeter.length > 0) {
      setTimeout(() => createPredefinedPerimeter(perimeterShape), 100);
    }
  };
  
  // Sauvegarde du plan
  const handleSave = () => {
    if (onSaveFloorPlan && currentFloorPlan) {
      onSaveFloorPlan({
        ...currentFloorPlan,
        capacityLimit,
        perimeterShape,
        perimeterParams
      });
      
      showNotification('Plan de salle enregistré avec succès');
    }
  };
  
  // Fermer le snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  // Obtenir la couleur de texte appropriée selon le thème
  const getTextColor = () => isDark ? theme.palette.text.primary : theme.palette.text.primary;
  
  // Fonction pour obtenir l'icône de forme appropriée
  const getShapeIcon = (shape) => {
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
  };
  
  // Rendu du composant
  return (
    <Box 
      sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}
      {...rest}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', width: '100%' }}>
        <div style={{ flex: '0 0 300px', width: '300px' }}>>
          <Card elevation={2} sx={{ height: '100%' }}>
            <CardHeader 
              title="Outils d'édition" 
              sx={{ 
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                pb: 1 
              }}
            />
            <CardContent>
              <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '16px' }}>
                {/* Mode d'édition */}
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
                        <div direction="row" alignItems="center" spacing={1}>
                          <DragIcon fontSize="small" />
                          <Typography>Déplacer</Typography>
                        </div>
                      </MenuItem>
                      <MenuItem value="addObstacle">
                        <div direction="row" alignItems="center" spacing={1}>
                          <AddIcon fontSize="small" />
                          <Typography>Ajouter obstacle</Typography>
                        </div>
                      </MenuItem>
                      <MenuItem value="drawPerimeter">
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '4px' }}>
                              <BorderOuterIcon fontSize="small" />
                              <Typography>Dessiner périmètre</Typography>
                            </div>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                
                {/* Élément sélectionné */}
                {selectedItem && (
                  <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Élément sélectionné
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box 
                        sx={{ 
                          width: 24, 
                          height: 24, 
                          bgcolor: selectedItem.color || '#1976d2',
                          borderRadius: selectedItem.shape === 'circle' ? '50%' : '4px',
                          mr: 1
                        }} 
                      />
                      <Typography variant="body2">
                        {selectedItem.type === 'obstacle' ? 'Obstacle' : 'Table'} - {selectedItem.id}
                      </Typography>
                    </Box>
                    
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {selectedItem.type === 'obstacle' && (
                          <Button
                            variant="contained"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleRemoveObstacle(selectedItem.id)}
                            size="small"
                          >
                            Supprimer
                          </Button>
                        )}
                      </div>
                  </Paper>
                )}
                
                {/* Options d'obstacle */}
                {editMode === 'addObstacle' && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Options d'obstacle
                    </Typography>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="obstacle-type-label">Forme</InputLabel>
                        <Select
                          labelId="obstacle-type-label"
                          value={obstacleType}
                          onChange={(e) => setObstacleType(e.target.value)}
                          disabled={!editable}
                          label="Forme"
                        >
                          <MenuItem value="rectangle">
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '4px' }}>
                              <SquareIcon fontSize="small" />
                              <Typography>Rectangle</Typography>
                            </div>
                          </MenuItem>
                          <MenuItem value="circle">
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '4px' }}>
                              <CircleIcon fontSize="small" />
                              <Typography>Cercle</Typography>
                            </div>
                          </MenuItem>
                          <MenuItem value="triangle">
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '4px' }}>
                              <TriangleIcon fontSize="small" />
                              <Typography>Triangle</Typography>
                            </div>
                          </MenuItem>
                        </Select>
                      </FormControl>
                      
                      <Box>
                        <Typography variant="body2" gutterBottom>
                          Taille: {obstacleSize}px
                        </Typography>
                        <Slider
                          min={20}
                          max={100}
                          value={obstacleSize}
                          onChange={(_, value) => setObstacleSize(value)}
                          disabled={!editable}
                          aria-labelledby="obstacle-size-slider"
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
                            backgroundColor: obstacleColor,
                            color: '#fff',
                            '&:hover': {
                              backgroundColor: alpha(obstacleColor, 0.9)
                            }
                          }}
                        >
                          {obstacleColor}
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
                              color={obstacleColor}
                              onChange={(color) => setObstacleColor(color.hex)}
                              disableAlpha
                            />
                          </Box>
                        </Popover>
                      </Box>
                    </div>
                  </Box>
                )}
                
                {/* Liste des obstacles */}
                {editMode === 'move' && currentFloorPlan?.obstacles && currentFloorPlan.obstacles.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Obstacles ({currentFloorPlan.obstacles.length})
                    </Typography>
                    <Paper variant="outlined" sx={{ maxHeight: '200px', overflow: 'auto' }}>
                      <List dense>
                        {currentFloorPlan.obstacles.map((obstacle) => (
                          <ListItem 
                            key={obstacle.id} 
                            button 
                            selected={selectedItem?.id === obstacle.id}
                            onClick={() => handleItemSelect(obstacle)}
                          >
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              {getShapeIcon(obstacle.shape)}
                            </ListItemIcon>
                            <ListItemText 
                              primary={`Obstacle ${obstacle.id.split('-')[1]}`} 
                              secondary={`Position: ${Math.round(obstacle.x)},${Math.round(obstacle.y)}`}
                            />
                            {selectedItem?.id === obstacle.id && (
                              <ListItemSecondaryAction>
                                <IconButton 
                                  edge="end" 
                                  aria-label="delete" 
                                  size="small"
                                  onClick={() => handleRemoveObstacle(obstacle.id)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </ListItemSecondaryAction>
                            )}
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  </Box>
                )}
                
                {/* Options de périmètre */}
                {editMode === 'drawPerimeter' && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Options de périmètre
                    </Typography>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="perimeter-shape-label">Type de forme</InputLabel>
                        <Select
                          labelId="perimeter-shape-label"
                          value={perimeterShape}
                          onChange={(e) => {
                            setPerimeterShape(e.target.value);
                            if (e.target.value !== 'custom') {
                              createPredefinedPerimeter(e.target.value);
                            }
                          }}
                          disabled={!editable}
                          label="Type de forme"
                        >
                          <MenuItem value="custom">
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '4px' }}>
                              <EditIcon fontSize="small" />
                              <Typography>Personnalisé</Typography>
                            </div>
                          </MenuItem>
                          <MenuItem value="rectangle">
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '4px' }}>
                              <SquareIcon fontSize="small" />
                              <Typography>Rectangle</Typography>
                            </div>
                          </MenuItem>
                          <MenuItem value="circle">
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '4px' }}>
                              <CircleIcon fontSize="small" />
                              <Typography>Cercle</Typography>
                            </div>
                          </MenuItem>
                          <MenuItem value="triangle">
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '4px' }}>
                              <TriangleIcon fontSize="small" />
                              <Typography>Triangle</Typography>
                            </div>
                          </MenuItem>
                          <MenuItem value="polygon">
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '4px' }}>
                              <HexagonIcon fontSize="small" />
                              <Typography>Polygone</Typography>
                            </div>
                          </MenuItem>
                        </Select>
                      </FormControl>
                      
                      {perimeterShape !== 'custom' && (
                        <Paper variant="outlined" sx={{ p: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Paramètres de forme
                          </Typography>
                          
                          {(perimeterShape === 'rectangle') && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                              <TextField
                                label="Largeur"
                                type="number"
                                InputProps={{ 
                                  endAdornment: <InputAdornment position="end">px</InputAdornment>
                                }}
                                value={perimeterParams.width}
                                onChange={(e) => handlePerimeterParamChange('width', parseInt(e.target.value))}
                                disabled={!editable}
                                size="small"
                                fullWidth
                                inputProps={{ min: 100, max: 1200 }}
                              />
                              <TextField
                                label="Hauteur"
                                type="number"
                                InputProps={{ 
                                  endAdornment: <InputAdornment position="end">px</InputAdornment>
                                }}
                                value={perimeterParams.height}
                                onChange={(e) => handlePerimeterParamChange('height', parseInt(e.target.value))}
                                disabled={!editable}
                                size="small"
                                fullWidth
                                inputProps={{ min: 100, max: 800 }}
                              />
                            </div>
                          )}
                          
                          {(perimeterShape === 'circle' || perimeterShape === 'triangle' || perimeterShape === 'polygon') && (
                            <TextField
                              label="Rayon"
                              type="number"
                              InputProps={{ 
                                endAdornment: <InputAdornment position="end">px</InputAdornment>
                              }}
                              value={perimeterParams.radius}
                              onChange={(e) => handlePerimeterParamChange('radius', parseInt(e.target.value))}
                              disabled={!editable}
                              size="small"
                              fullWidth
                              inputProps={{ min: 50, max: 400 }}
                              sx={{ mb: 2 }}
                            />
                          )}
                          
                          {perimeterShape === 'polygon' && (
                            <TextField
                              label="Nombre de côtés"
                              type="number"
                              value={perimeterParams.sides}
                              onChange={(e) => handlePerimeterParamChange('sides', parseInt(e.target.value))}
                              disabled={!editable}
                              size="small"
                              fullWidth
                              inputProps={{ min: 3, max: 12 }}
                              sx={{ mb: 2 }}
                            />
                          )}
                          
                          <Button
                            variant="contained"
                            onClick={() => createPredefinedPerimeter(perimeterShape)}
                            disabled={!editable}
                            fullWidth
                            startIcon={<CheckIcon />}
                          >
                            Appliquer
                          </Button>
                        </Paper>
                      )}
                      
                      {perimeterShape === 'custom' && (
                        <Box>
                          {isDrawingPerimeter ? (
                            <Typography variant="body2">
                              Cliquez pour ajouter des points. Cliquez près du premier point pour fermer.
                            </Typography>
                          ) : (
                            <Button
                              variant="contained"
                              startIcon={<BorderOuterIcon />}
                              onClick={() => {
                                setIsDrawingPerimeter(true);
                                tempPerimeterRef.current = [];
                              }}
                              disabled={!editable}
                              fullWidth
                            >
                              Commencer à dessiner
                            </Button>
                          )}
                        </Box>
                      )}
                      
                      {currentFloorPlan?.perimeter && currentFloorPlan.perimeter.length > 0 && (
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => {
                            dispatch(setPerimeter({
                              perimeterShape: 'custom',
                              perimeter: []
                            }));
                            setIsDrawingPerimeter(false);
                            
                            showNotification('Périmètre supprimé', 'info');
                          }}
                          disabled={!editable}
                        >
                          Effacer périmètre
                        </Button>
                      )}
                    </div>
                  </Box>
                )}
                
                <Divider />
                
                {/* Capacité de la salle */}
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Capacité de la salle
                  </Typography>
                  <div spacing={2}>
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
                        backgroundColor: theme.palette.background.default,
                        color: currentCapacity > capacityLimit 
                          ? theme.palette.error.main 
                          : getTextColor(),
                        fontWeight: currentCapacity > capacityLimit ? 'bold' : 'normal'
                      }}
                    >
                      <Typography variant="body2">
                        Capacité actuelle: {currentCapacity} / {capacityLimit}
                      </Typography>
                    </Paper>
                  </div>
                </Box>
                
                <Divider />
                
                {/* Bouton de sauvegarde */}
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  disabled={!editable}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Enregistrer le plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div style={{ flex: '1 1 auto', minWidth: '500px' }}>
          <Box
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 1,
              backgroundColor: theme.palette.background.paper,
              height: '600px',
              width: '100%',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: 1
            }}
            onClick={handleCanvasClick}
            ref={canvasRef}
          >
            {/* Intégration du composant Canvas */}
            {/* Canvas avec dimensions fixes et debug props */}
            <Canvas 
              editable={editable}
              height={600}
              width={800}
              dragMode={dragMode}
              showPerimeter={true}
              showObstacles={true}
              onTableDragEnd={handleTableDragEnd}
              onObstacleDragEnd={handleObstacleDragEnd}
              onItemSelect={handleItemSelect}  
              selectedItem={selectedItem}
              debug={true}
              style={{ 
                maxWidth: '100%', 
                maxHeight: '100%',
                position: 'absolute',
                top: 0,
                left: 0
              }}
            />
            
            {/* Indicateur de mode dessin */}
            {editMode === 'drawPerimeter' && isDrawingPerimeter && (
              <Box 
                sx={{ 
                  position: 'absolute', 
                  bottom: 10, 
                  left: 10, 
                  padding: '8px 12px',
                  backgroundColor: alpha(theme.palette.primary.main, 0.9),
                  color: theme.palette.primary.contrastText,
                  borderRadius: '4px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  zIndex: 100,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <BorderOuterIcon fontSize="small" />
                <Typography variant="body2" fontWeight="medium">
                  Mode dessin de périmètre actif
                </Typography>
              </Box>
            )}
          </Box>
                  </div>
      </div>
      
      {/* Notifications - simplifiées pour éviter l'erreur */}
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

export default FloorPlanEditorEnhanced;