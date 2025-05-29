import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Paper,
  Grid,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Fab,
  Tooltip,
  Badge,
  useMediaQuery
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  TableRestaurant as TableIcon,
  Block as ObstacleIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  MoreVert as MoreIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  PanTool as PanIcon,
  DragIndicator as DragIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Speed as SpeedIcon,
  GetApp as GetAppIcon,
  ArrowBack as ArrowBackIcon,
  ContentCopy as CopyIcon
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';
import { useOptimizedFloorPlan } from '../../hooks/useOptimizedFloorPlan';
import { hasPermission, PERMISSIONS } from '../../utils/permissions';
import { useColorMode } from '../../context/ThemeContext';

// Composants
import Canvas from '../../components/floorPlan/Canvas';
import TableForm from '../../components/floorPlan/TableForm';
import ObstacleForm from '../../components/floorPlan/ObstacleForm';
import FloorPlanForm from '../../components/floorPlan/FloorPlanForm';
import ErrorBoundary from '../../components/common/ErrorBoundary';

// Débug 
import FloorPlanDebugTool from '../../components/floorPlan/FloorPlanDebugTool';


// Types d'outils d'édition
const TOOLS = {
  SELECT: 'select',
  ADD_TABLE: 'add_table', 
  ADD_OBSTACLE: 'add_obstacle',
  PAN: 'pan',
  DRAG: 'drag'
};

// Interface principale de gestion des plans de salle
const FloorPlanManagement = () => {
  const theme = useTheme();
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { user } = useAuth();
  const {
    currentFloorPlan,
    allFloorPlans,
    tables,
    obstacles,
    currentCapacity,
    statistics,
    loading,
    error,
    addTable,
    updateTable,
    deleteTable,
    addObstacle,
    updateObstacle,
    removeObstacle,
    switchFloorPlan,
    getObstacleById,
    duplicateObstacle
  } = useOptimizedFloorPlan();

  // États locaux
  const [activeTab, setActiveTab] = useState(0);
  const [selectedTool, setSelectedTool] = useState(TOOLS.SELECT);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showTableForm, setShowTableForm] = useState(false);
  const [showObstacleForm, setShowObstacleForm] = useState(false); // ✅ État pour le formulaire obstacle
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [zoom, setZoom] = useState(1);

  // Permissions
  const canView = hasPermission(user?.role, PERMISSIONS.VIEW_PROJECTS);
  const canEdit = hasPermission(user?.role, PERMISSIONS.EDIT_PROJECTS);
  const canDelete = hasPermission(user?.role, PERMISSIONS.DELETE_PROJECTS);

  // Effet pour gérer l'action depuis l'URL
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'create' && canEdit) {
      setShowPlanForm(true);
    }
  }, [searchParams, canEdit]);

  // Handlers optimisés
  const showMessage = useCallback((message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  const handleToolChange = useCallback((tool) => {
    setSelectedTool(tool);
    setSelectedItem(null);
  }, []);

  const handleItemSelect = useCallback((item) => {
    setSelectedItem(item);
    setSelectedTool(TOOLS.SELECT);
  }, []);

  const handleAddTable = useCallback(() => {
    if (!canEdit) return;
    
    const newTable = {
      id: `table-${Date.now()}`,
      type: 'table',
      label: `Table ${tables.length + 1}`,
      capacity: 4,
      shape: 'rectangle',
      color: '#e6f7ff',
      x: 200 + (tables.length * 20),
      y: 200 + (tables.length * 20),
      width: 80,
      height: 80,
      rotation: 0
    };
    
    addTable(newTable);
    showMessage('Table ajoutée avec succès');
    setSelectedTool(TOOLS.SELECT);
  }, [canEdit, tables.length, addTable, showMessage]);

  // ✅ CORRECTION: handleAddObstacle ouvre maintenant le formulaire
  const handleAddObstacle = useCallback(() => {
    console.log('🔍 AVANT:', currentFloorPlan?.obstacles?.length, 'obstacles');
    if (!canEdit) return;
    
    // Ouvrir le formulaire au lieu de créer directement l'obstacle
    setShowObstacleForm(true);
    setSelectedTool(TOOLS.SELECT);
  }, [canEdit]);

  const handleItemUpdate = useCallback((updates) => {
    if (!selectedItem || !canEdit) return;
    
    if (selectedItem.type === 'table') {
      updateTable(selectedItem.id, updates);
      showMessage('Table mise à jour');
    } else if (selectedItem.type === 'obstacle') {
      updateObstacle(selectedItem.id, updates);
      showMessage('Obstacle mis à jour');
    }
    
    setSelectedItem(prev => prev ? { ...prev, ...updates } : null);
  }, [selectedItem, canEdit, updateTable, updateObstacle, showMessage]);

  const handleItemDelete = useCallback(() => {
    if (!selectedItem || !canDelete) return;
    
    if (selectedItem.type === 'table') {
      deleteTable(selectedItem.id);
      showMessage('Table supprimée');
    } else if (selectedItem.type === 'obstacle') {
      removeObstacle(selectedItem.id);
      showMessage('Obstacle supprimé');
    }
    
    setSelectedItem(null);
    setShowDeleteDialog(false);
  }, [selectedItem, canDelete, deleteTable, removeObstacle, showMessage]);

  const handleFloorPlanSwitch = useCallback((planId) => {
    switchFloorPlan(planId);
    setSelectedItem(null);
    showMessage('Plan de salle changé');
  }, [switchFloorPlan, showMessage]);

  const handleResetPlan = useCallback((plan) => {
    if (!plan || !canEdit) return;
    
    // Réinitialiser toutes les tables et obstacles
    plan.tables?.forEach(table => {
      deleteTable(table.id);
    });
    
    plan.obstacles?.forEach(obstacle => {
      removeObstacle(obstacle.id);
    });
    
    setSelectedItem(null);
    showMessage('Plan réinitialisé avec succès', 'warning');
  }, [canEdit, deleteTable, removeObstacle, showMessage]);

  const handleMenuOpen = useCallback((event) => {
    setMenuAnchor(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setMenuAnchor(null);
  }, []);

  const handleQuickAddTable = useCallback((tableData) => {
    if (!canEdit) return;
    
    const newTable = {
      id: `table-${Date.now()}`,
      type: 'table',
      ...tableData
    };
    
    addTable(newTable);
    setShowTableForm(false);
    showMessage('Table ajoutée avec succès');
  }, [canEdit, addTable, showMessage]);

  // ✅ CORRECTION: handleAddObstacleWithForm pour créer depuis le formulaire
  const handleAddObstacleWithForm = useCallback((obstacleData) => {
    if (!canEdit) return;
    
    const newObstacle = {
      id: `obstacle-${Date.now()}`,
      type: 'obstacle',
      ...obstacleData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    addObstacle(newObstacle);
    setShowObstacleForm(false);
     setTimeout(() => console.log('🔍 APRÈS:', currentFloorPlan?.obstacles?.length, 'obstacles'), 100);
    showMessage('Obstacle ajouté avec succès');
    
  }, [canEdit, addObstacle, showMessage]);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.2, 2));
    showMessage(`Zoom: ${Math.round((zoom + 0.2) * 100)}%`);
  }, [zoom, showMessage]);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
    showMessage(`Zoom: ${Math.round((zoom - 0.2) * 100)}%`);
  }, [zoom, showMessage]);

  const handleZoomReset = useCallback(() => {
    setZoom(1);
    showMessage('Zoom réinitialisé à 100%');
  }, [showMessage]);

  const handleDuplicateObstacle = useCallback((obstacleId) => {
    if (!canEdit) return;
    
    duplicateObstacle(obstacleId);
    showMessage('Obstacle dupliqué avec succès');
  }, [canEdit, duplicateObstacle, showMessage]);

  const handleObstacleContextMenu = useCallback((obstacleId, event) => {
    event.preventDefault();
    
    const obstacle = getObstacleById(obstacleId);
    if (obstacle) {
      setSelectedItem(obstacle);
      showMessage(`Obstacle "${obstacle.name || obstacle.category}" sélectionné`);
    }
  }, [getObstacleById, showMessage]);

  const handleObstacleQuickEdit = useCallback((obstacleId, property, value) => {
    if (!canEdit) return;
    
    updateObstacle(obstacleId, { [property]: value });
    showMessage(`${property} de l'obstacle mis à jour`);
  }, [canEdit, updateObstacle, showMessage]);

  // Données mémorisées
  const planStats = useMemo(() => {
    if (!currentFloorPlan) return { tables: 0, capacity: 0, obstacles: 0, obstacleTypes: {} };
    
    const obstacleTypes = obstacles.reduce((acc, obstacle) => {
      const type = obstacle.category || obstacle.type || 'autre';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    
    return {
      tables: tables.length,
      capacity: currentCapacity,
      obstacles: obstacles.length,
      obstacleTypes,
      shapes: [...tables, ...obstacles].reduce((acc, item) => {
        acc[item.shape] = (acc[item.shape] || 0) + 1;
        return acc;
      }, {}),
      totalElements: tables.length + obstacles.length
    };
  }, [currentFloorPlan, tables.length, currentCapacity, obstacles]);

  // ✅ CORRECTION: toolsConfig avec le bon handler
  const toolsConfig = useMemo(() => [
    { 
      id: TOOLS.SELECT, 
      label: 'Sélection', 
      icon: <ViewIcon />, 
      disabled: false 
    },
    { 
      id: TOOLS.ADD_TABLE, 
      label: 'Ajouter Table', 
      icon: <TableIcon />, 
      disabled: !canEdit,
      onClick: handleAddTable 
    },
    { 
      id: TOOLS.ADD_OBSTACLE, 
      label: 'Ajouter Obstacle', 
      icon: <ObstacleIcon />, 
      disabled: !canEdit,
      onClick: handleAddObstacle // ✅ Maintenant ouvre le formulaire
    },
    { 
      id: TOOLS.DRAG, 
      label: 'Déplacer', 
      icon: <DragIcon />, 
      disabled: !canEdit 
    },
    { 
      id: TOOLS.PAN, 
      label: 'Vue', 
      icon: <PanIcon />, 
      disabled: false 
    }
  ], [canEdit, handleAddTable, handleAddObstacle]);

  // Rendu conditionnel si pas de permissions
  if (!canView) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          <Typography variant="h6" gutterBottom>
            Accès refusé
          </Typography>
          <Typography>
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </Typography>
        </Alert>
      </Box>
    );
  }

  // État de chargement
  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh',
          background: isDark
            ? `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.15)} 0%, ${alpha(theme.palette.background.default, 0.95)} 100%)`
            : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: `4px solid ${alpha(theme.palette.primary.main, 0.3)}`,
              borderTop: `4px solid ${theme.palette.primary.main}`,
              animation: 'spin 1s linear infinite',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
              }
            }}
          />
          <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>
            Chargement des plans de salle...
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Veuillez patienter pendant que nous récupérons vos données.
        </Typography>
      </Box>
    );
  }

  // Gestion des erreurs
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert 
          severity="error" 
          sx={{
            backgroundColor: isDark 
              ? alpha(theme.palette.error.main, 0.1)
              : alpha(theme.palette.error.main, 0.05),
            borderRadius: 2
          }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={() => window.location.reload()}
              startIcon={<RefreshIcon />}
            >
              Réessayer
            </Button>
          }
        >
          <Typography variant="h6" gutterBottom>
            Erreur de chargement
          </Typography>
          <Typography variant="body2">
            {error.message || 'Une erreur est survenue lors du chargement des plans de salle.'}
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (

    
    <ErrorBoundary>
      <Box sx={{ p: 3, height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* En-tête */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton 
                onClick={() => navigate('/dashboard')}
                sx={{
                  backgroundColor: isDark 
                    ? alpha(theme.palette.primary.main, 0.2)
                    : alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    backgroundColor: isDark 
                      ? alpha(theme.palette.primary.main, 0.3)
                      : alpha(theme.palette.primary.main, 0.2),
                  }
                }}
                title="Retour au tableau de bord"
              >
                <ArrowBackIcon />
              </IconButton>
              
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  color: theme.palette.text.primary,
                  background: isDark 
                    ? `linear-gradient(45deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`
                    : `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Gestion des Plans de Salle
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              {canEdit && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setShowPlanForm(true)}
                  sx={{
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                    boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`
                  }}
                >
                  Nouveau Plan
                </Button>
              )}
              
              <IconButton 
                onClick={handleMenuOpen}
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                  }
                }}
              >
                <MoreIcon />
              </IconButton>
              
              {/* ✅ CORRECTION: Menu d'actions rapides */}
              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    backgroundColor: isDark 
                      ? alpha(theme.palette.background.paper, 0.9)
                      : alpha(theme.palette.background.paper, 0.95),
                    backdropFilter: 'blur(15px)',
                    borderRadius: 2,
                    minWidth: 220,
                    border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.2 : 0.1)}`,
                    boxShadow: isDark 
                      ? `0 8px 32px ${alpha('#000', 0.4)}`
                      : `0 8px 32px ${alpha(theme.palette.primary.main, 0.15)}`
                  }
                }}
              >
                {canEdit && (
                  <MenuItem onClick={() => {
                    setShowTableForm(true);
                    handleMenuClose();
                  }}>
                    <SpeedIcon sx={{ mr: 2 }} />
                    Ajouter Table Rapide
                  </MenuItem>
                )}
                
                {canEdit && (
                  <MenuItem onClick={() => {
                    setShowObstacleForm(true); // ✅ Ouvre directement le formulaire
                    handleMenuClose();
                  }}>
                    <ObstacleIcon sx={{ mr: 2 }} />
                    Ajouter Obstacle
                  </MenuItem>
                )}
                
                {selectedItem?.type === 'obstacle' && canEdit && (
                  <MenuItem onClick={() => {
                    handleDuplicateObstacle(selectedItem.id);
                    handleMenuClose();
                  }}>
                    <CopyIcon sx={{ mr: 2 }} />
                    Dupliquer Obstacle
                  </MenuItem>
                )}
                
                <MenuItem onClick={() => {
                  setActiveTab(1);
                  handleMenuClose();
                }}>
                  <GetAppIcon sx={{ mr: 2 }} />
                  Exporter Plan
                </MenuItem>
                
                <MenuItem onClick={() => {
                  handleZoomReset();
                  handleMenuClose();
                }}>
                  <ZoomInIcon sx={{ mr: 2 }} />
                  Réinitialiser Zoom
                </MenuItem>
                
                <MenuItem onClick={() => {
                  showMessage('Données actualisées');
                  handleMenuClose();
                }}>
                  <RefreshIcon sx={{ mr: 2 }} />
                  Actualiser
                </MenuItem>
                
                <MenuItem 
                  onClick={() => {
                    navigate('/dashboard');
                    handleMenuClose();
                  }}
                  sx={{ 
                    borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    mt: 1,
                    pt: 1
                  }}
                >
                  <ArrowBackIcon sx={{ mr: 2 }} />
                  Retour au Dashboard
                </MenuItem>
              </Menu>
            </Box>
          </Box>

          {/* Sélecteur de plan de salle */}
          {allFloorPlans?.length > 0 && (
            <Tabs
              value={allFloorPlans.findIndex(plan => plan.id === currentFloorPlan?.id)}
              onChange={(e, newValue) => {
                if (newValue >= 0 && allFloorPlans[newValue]) {
                  handleFloorPlanSwitch(allFloorPlans[newValue].id);
                }
              }}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
            >
              {allFloorPlans.map((plan) => (
                <Tab
                  key={plan.id}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {plan.name}
                      <Chip 
                        label={`${plan.tables?.length || 0} tables`}
                        size="small"
                        color={plan.id === currentFloorPlan?.id ? 'primary' : 'default'}
                      />
                      <Chip 
                        label={`${plan.obstacles?.length || 0} obstacles`}
                        size="small"
                        color={plan.id === currentFloorPlan?.id ? 'warning' : 'default'}
                      />
                    </Box>
                  }
                />
              ))}
            </Tabs>
          )}
        </Box>

        {/* Contenu principal avec onglets */}
        {currentFloorPlan ? (
          <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
            {/* Onglets principaux */}
            <Paper
              elevation={0}
              sx={{
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                mb: 2
              }}
            >
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                sx={{ px: 2 }}
              >
                <Tab label="Éditeur" icon={<EditIcon />} iconPosition="start" />
                <Tab label="Utilitaires" icon={<SettingsIcon />} iconPosition="start" />
              </Tabs>
            </Paper>

            {/* Contenu des onglets */}
            {activeTab === 0 && (
              <Grid container spacing={3} sx={{ height: 'calc(100% - 60px)' }}>
                {/* Barre d'outils */}
                <Grid xs={12}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      backgroundColor: alpha(theme.palette.background.paper, 0.8),
                      backdropFilter: 'blur(10px)',
                      borderRadius: 2,
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {toolsConfig.map((tool) => (
                          <Button
                            key={tool.id}
                            variant={selectedTool === tool.id ? 'contained' : 'outlined'}
                            startIcon={tool.icon}
                            disabled={tool.disabled}
                            onClick={() => {
                              if (tool.onClick) {
                                tool.onClick();
                              } else {
                                handleToolChange(tool.id);
                              }
                            }}
                            size="small"
                            sx={{ textTransform: 'none' }}
                          >
                            {isMobile ? '' : tool.label}
                          </Button>
                        ))}
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {/* Contrôles de zoom */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton 
                            size="small" 
                            onClick={handleZoomOut}
                            disabled={zoom <= 0.5}
                            title="Zoom arrière"
                          >
                            <ZoomOutIcon />
                          </IconButton>
                          
                          <Chip
                            label={`${Math.round(zoom * 100)}%`}
                            size="small"
                            onClick={handleZoomReset}
                            sx={{ 
                              cursor: 'pointer',
                              minWidth: '60px',
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              }
                            }}
                          />
                          
                          <IconButton 
                            size="small" 
                            onClick={handleZoomIn}
                            disabled={zoom >= 2}
                            title="Zoom avant"
                          >
                            <ZoomInIcon />
                          </IconButton>
                        </Box>

                        {/* Statistiques */}
                        <Chip
                          icon={<TableIcon />}
                          label={`${planStats.tables} tables`}
                          color="primary"
                          variant="outlined"
                        />
                        <Chip
                          icon={<Badge badgeContent={planStats.capacity} color="success" />}
                          label={`${planStats.capacity} places`}
                          color="success"
                          variant="outlined"
                        />
                        {planStats.obstacles > 0 && (
                          <Chip
                            icon={<ObstacleIcon />}
                            label={`${planStats.obstacles} obstacles`}
                            color="warning"
                            variant="outlined"
                          />
                        )}
                        {Object.keys(planStats.obstacleTypes).length > 0 && (
                          <Tooltip title={`Types: ${Object.entries(planStats.obstacleTypes).map(([type, count]) => `${type} (${count})`).join(', ')}`}>
                            <Chip
                              label={`${Object.keys(planStats.obstacleTypes).length} types`}
                              color="info"
                              variant="outlined"
                              size="small"
                            />
                          </Tooltip>
                        )}
                      </Box>
                    </Box>
                  </Paper>
                </Grid>

                {/* Zone de travail */}
                <Grid xs={12} md={selectedItem ? 8 : 12}>
                  <Paper
                    elevation={0}
                    sx={{
                      height: '600px',
                      backgroundColor: alpha(theme.palette.background.paper, 0.8),
                      backdropFilter: 'blur(10px)',
                      borderRadius: 2,
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      overflow: 'hidden'
                    }}
                  >
                    <Canvas
                      editable={canEdit}
                      dragMode={selectedTool === TOOLS.DRAG}
                      onItemSelect={handleItemSelect}
                      selectedItem={selectedItem}
                      height={600}
                      fixedSize={true}
                      zoom={zoom}
                      obstaclesDraggable={true}
                      onObstacleDragEnd={(obstacleId, position) => {
                        updateObstacle(obstacleId, { x: position.x, y: position.y });
                        showMessage('Position de l\'obstacle mise à jour');
                      }}
                    />
                  </Paper>
                </Grid>

                {/* Panneau de propriétés */}
                {selectedItem && (
                  <Grid xs={12} md={4}>
                    <Paper
                      elevation={0}
                      sx={{
                        height: '600px',
                        backgroundColor: alpha(theme.palette.background.paper, 0.8),
                        backdropFilter: 'blur(10px)',
                        borderRadius: 2,
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        overflow: 'auto'
                      }}
                    >
                      <Box sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                          <Typography variant="h6">
                            Propriétés {selectedItem.type === 'table' ? 'de la table' : 'de l\'obstacle'}
                          </Typography>
                          
                          <Box>
                            {canEdit && selectedItem.type === 'obstacle' && (
                              <IconButton
                                size="small"
                                onClick={() => handleDuplicateObstacle(selectedItem.id)}
                                color="primary"
                                title="Dupliquer"
                              >
                                <CopyIcon />
                              </IconButton>
                            )}
                            {canEdit && (
                              <IconButton
                                size="small"
                                onClick={() => setShowDeleteDialog(true)}
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            )}
                            <IconButton
                              size="small"
                              onClick={() => setSelectedItem(null)}
                            >
                              <CancelIcon />
                            </IconButton>
                          </Box>
                        </Box>

                        {selectedItem.type === 'table' && (
                          <TableForm
                            onSubmit={handleItemUpdate}
                            initialValues={selectedItem}
                            isEdit={true}
                          />
                        )}

                        {selectedItem.type === 'obstacle' && (
                          <ObstacleForm
                            onSubmit={handleItemUpdate}
                            initialValues={selectedItem}
                            isEdit={true}
                          />
                        )}
                      </Box>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            )}

            {/* Onglet Utilitaires */}
            {activeTab === 1 && (
              <Box sx={{ p: 2 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    backgroundColor: isDark 
                      ? alpha(theme.palette.background.paper, 0.6)
                      : alpha(theme.palette.background.paper, 0.8),
                    backdropFilter: 'blur(10px)',
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.2 : 0.1)}`,
                    boxShadow: isDark 
                      ? `0 8px 32px ${alpha('#000', 0.3)}`
                      : `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Utilitaires des Plans de Salle
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Fonctionnalités d'import/export et gestion avancée des plans.
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<GetAppIcon />}
                        onClick={() => {
                          // Export basique en JSON
                          const dataStr = JSON.stringify(currentFloorPlan, null, 2);
                          const dataBlob = new Blob([dataStr], {type: 'application/json'});
                          const url = URL.createObjectURL(dataBlob);
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = `${currentFloorPlan?.name || 'floor-plan'}.json`;
                          link.click();
                          URL.revokeObjectURL(url);
                          showMessage('Plan exporté en JSON');
                        }}
                        disabled={!currentFloorPlan}
                        sx={{ textTransform: 'none' }}
                      >
                        Exporter JSON
                      </Button>
                    </Grid>
                    
                    {canEdit && (
                      <Grid item xs={12} sm={6} md={3}>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<RefreshIcon />}
                          onClick={() => {
                            handleResetPlan(currentFloorPlan);
                          }}
                          disabled={!currentFloorPlan}
                          color="warning"
                          sx={{ textTransform: 'none' }}
                        >
                          Réinitialiser
                        </Button>
                      </Grid>
                    )}
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/dashboard')}
                        sx={{ textTransform: 'none' }}
                      >
                        Retour Dashboard
                      </Button>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={() => {
                          window.location.reload();
                        }}
                        sx={{ textTransform: 'none' }}
                      >
                        Actualiser
                      </Button>
                    </Grid>
                  </Grid>
                  
                  {/* Statistiques détaillées */}
                  {currentFloorPlan && (
                    <Box sx={{ mt: 3, pt: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Statistiques du plan actuel
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                        <Chip 
                          label={`${tables.length} tables`} 
                          size="small" 
                          color="primary" 
                        />
                        <Chip 
                          label={`${currentCapacity} places`} 
                          size="small" 
                          color="success" 
                        />
                        <Chip 
                          label={`${obstacles.length} obstacles`} 
                          size="small" 
                          color="warning" 
                        />
                        <Chip 
                          label={`Plan: ${currentFloorPlan.name}`} 
                          size="small" 
                          color="info" 
                        />
                      </Box>
                      
                      {/* Détail des types d'obstacles */}
                      {Object.keys(planStats.obstacleTypes).length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Types d'obstacles :
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {Object.entries(planStats.obstacleTypes).map(([type, count]) => (
                              <Chip 
                                key={type}
                                label={`${type}: ${count}`} 
                                size="small" 
                                variant="outlined"
                                color="secondary"
                              />
                            ))}
                          </Box>
                        </Box>
                      )}
                      
                      <Typography variant="body2" color="text.secondary">
                        Total d'éléments: {planStats.totalElements} | 
                        Dernière modification: {currentFloorPlan.updatedAt ? 
                          new Date(currentFloorPlan.updatedAt).toLocaleDateString() : 
                          'Inconnue'
                        }
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Box>
            )}
          </Box>
        ) : (
          /* État vide */
          <Paper
            elevation={0}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: 400,
              backgroundColor: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
              border: `1px dashed ${theme.palette.divider}`
            }}
          >
            <TableIcon sx={{ fontSize: 64, color: theme.palette.text.secondary, mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Aucun plan de salle disponible
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
              Créez votre premier plan de salle pour commencer à organiser votre restaurant.
            </Typography>
            {canEdit && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setShowPlanForm(true)}
              >
                Créer un plan
              </Button>
            )}
          </Paper>
        )}

        {/* FAB pour mobile */}
        {isMobile && canEdit && (
          <Fab
            color="primary"
            onClick={() => setShowPlanForm(true)}
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              zIndex: 1000,
              background: isDark
                ? `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`
                : `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              boxShadow: isDark 
                ? `0 8px 32px ${alpha(theme.palette.primary.main, 0.4)}`
                : `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: isDark 
                  ? `0 12px 40px ${alpha(theme.palette.primary.main, 0.5)}`
                  : `0 12px 40px ${alpha(theme.palette.primary.main, 0.4)}`,
              },
              transition: 'all 0.3s ease-in-out'
            }}
          >
            <AddIcon />
          </Fab>
        )}


          {/* Debug */}
         {import.meta.env.NODE_ENV === 'development' && (
          <Box
            sx={{
              position: 'fixed',
              bottom: 20,
              left: 20,
              zIndex: 9999,
              maxWidth: 300,
              maxHeight: 400,
              overflow: 'auto'
            }}
          >
            <FloorPlanDebugTool />
          </Box>
        )}



        {/* ✅ DIALOGS COMPLETS */}
        
        {/* Dialog de création/édition de plan */}
        <Dialog 
          open={showPlanForm} 
          onClose={() => setShowPlanForm(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {currentFloorPlan ? 'Modifier le plan' : 'Nouveau plan de salle'}
          </DialogTitle>
          <DialogContent>
            <FloorPlanForm
              onSubmit={(data) => {
                console.log('Plan data:', data);
                setShowPlanForm(false);
                showMessage('Plan sauvegardé');
              }}
              initialValues={currentFloorPlan}
              isEdit={!!currentFloorPlan}
            />
          </DialogContent>
        </Dialog>

        {/* Dialog d'ajout rapide de table */}
        <Dialog 
          open={showTableForm} 
          onClose={() => setShowTableForm(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Ajouter une table rapidement
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <TableForm
                onSubmit={handleQuickAddTable}
                initialValues={{
                  label: `Table ${tables.length + 1}`,
                  capacity: 4,
                  shape: 'rectangle',
                  color: '#e6f7ff',
                  x: 200 + (tables.length * 30),
                  y: 200 + (tables.length * 30),
                  width: 80,
                  height: 80,
                  rotation: 0
                }}
                isEdit={false}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowTableForm(false)}>
              Annuler
            </Button>
          </DialogActions>
        </Dialog>

        {/* ✅ CORRECTION: Dialog d'ajout d'obstacle avec formulaire complet */}
        <Dialog 
          open={showObstacleForm} 
          onClose={() => setShowObstacleForm(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Ajouter un nouvel obstacle
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <ObstacleForm
                onSubmit={handleAddObstacleWithForm} // ✅ Utilise le handler corrigé
                initialValues={{
                  category: 'mur',
                  name: `Mur ${obstacles.length + 1}`,
                  shape: 'rectangle',
                  color: '#8B4513',
                  x: 100 + (obstacles.length * 30),
                  y: 100 + (obstacles.length * 30),
                  width: 150,
                  height: 20,
                  rotation: 0,
                  description: ''
                }}
                isEdit={false}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowObstacleForm(false)}>
              Annuler
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog de confirmation de suppression */}
        <Dialog
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
        >
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogContent>
            <Typography>
              Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.
            </Typography>
            {selectedItem?.type === 'obstacle' && selectedItem.name && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Obstacle : <strong>{selectedItem.name}</strong> ({selectedItem.category})
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDeleteDialog(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleItemDelete} 
              color="error" 
              variant="contained"
            >
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          sx={{
            '& .MuiSnackbarContent-root': {
              backgroundColor: isDark 
                ? alpha(theme.palette.background.paper, 0.9)
                : alpha(theme.palette.background.paper, 0.95),
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.2 : 0.1)}`,
            }
          }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            variant="filled"
            sx={{
              backgroundColor: isDark 
                ? alpha(theme.palette[snackbar.severity].main, 0.8)
                : alpha(theme.palette[snackbar.severity].main, 0.9),
              color: 'white',
              fontWeight: 500
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ErrorBoundary>

    
  );
};

export default FloorPlanManagement;