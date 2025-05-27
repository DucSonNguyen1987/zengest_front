// src/pages/floorPlan/OptimizedFloorPlanManagement.jsx - VERSION OPTIMISÉE

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
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';
import { useOptimizedFloorPlan } from '../../hooks/useOptimizedFloorPlan';
import { useFloorPlanPermissions } from '../../hooks/useOptimizedPermissions'; // ✅ Hook optimisé
import { useColorMode } from '../../context/ThemeContext';

// Composants optimisés
import OptimizedCanvas from '../../components/floorPlan/OptimizedCanvas'; // ✅ Canvas optimisé
import TableForm from '../../components/floorPlan/TableForm';
import ObstacleForm from '../../components/floorPlan/ObstacleForm';
import FloorPlanForm from '../../components/floorPlan/FloorPlanForm';
import ErrorBoundary from '../../components/common/ErrorBoundary';

// ✅ OPTIMISATION 1: Constantes pour éviter les re-créations
const TOOLS = {
  SELECT: 'select',
  ADD_TABLE: 'add_table', 
  ADD_OBSTACLE: 'add_obstacle',
  PAN: 'pan',
  DRAG: 'drag'
};

const INITIAL_SNACKBAR = { open: false, message: '', severity: 'success' };

const OptimizedFloorPlanManagement = () => {
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
    loading,
    error,
    addTable,
    updateTable,
    deleteTable,
    addObstacle,
    removeObstacle,
    switchFloorPlan
  } = useOptimizedFloorPlan();

  // ✅ OPTIMISATION 2: Hook de permissions optimisé (calculé une seule fois)
  const { canView, canEdit, canDelete } = useFloorPlanPermissions();

  // ✅ OPTIMISATION 3: États locaux minimaux
  const [activeTab, setActiveTab] = useState(0);
  const [selectedTool, setSelectedTool] = useState(TOOLS.SELECT);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showTableForm, setShowTableForm] = useState(false);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [snackbar, setSnackbar] = useState(INITIAL_SNACKBAR);
  const [zoom, setZoom] = useState(1);

  // ✅ OPTIMISATION 4: Effet pour l'action URL (optimisé)
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'create' && canEdit) {
      setShowPlanForm(true);
    }
  }, [searchParams.get('action'), canEdit]); // ✅ Dépendance précise

  // ✅ OPTIMISATION 5: Handlers mémorisés avec useCallback
  const showMessage = useCallback((message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar(INITIAL_SNACKBAR);
  }, []);

  const handleToolChange = useCallback((tool) => {
    setSelectedTool(tool);
    setSelectedItem(null);
  }, []);

  const handleItemSelect = useCallback((item) => {
    setSelectedItem(item);
    setSelectedTool(TOOLS.SELECT);
  }, []);

  // ✅ OPTIMISATION 6: Actions avec early returns
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

  const handleAddObstacle = useCallback(() => {
    if (!canEdit) return;
    
    const newObstacle = {
      id: `obstacle-${Date.now()}`,
      type: 'obstacle',
      shape: 'rectangle',
      color: '#FF6384',
      x: 100 + (obstacles.length * 15),
      y: 100 + (obstacles.length * 15),
      width: 100,
      height: 30,
      rotation: 0
    };
    
    addObstacle(newObstacle);
    showMessage('Obstacle ajouté avec succès');
    setSelectedTool(TOOLS.SELECT);
  }, [canEdit, obstacles.length, addObstacle, showMessage]);

  const handleItemUpdate = useCallback((updates) => {
    if (!selectedItem || !canEdit) return;
    
    if (selectedItem.type === 'table') {
      updateTable(selectedItem.id, updates);
      showMessage('Table mise à jour');
    }
    
    setSelectedItem(prev => prev ? { ...prev, ...updates } : null);
  }, [selectedItem, canEdit, updateTable, showMessage]);

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

  // ✅ OPTIMISATION 7: Menu handlers ultra-simples
  const handleMenuOpen = useCallback((event) => {
    setMenuAnchor(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setMenuAnchor(null);
  }, []);

  // ✅ OPTIMISATION 8: Zoom handlers optimisés
  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.2, 2));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoom(1);
    showMessage('Zoom réinitialisé à 100%');
  }, [showMessage]);

  // ✅ OPTIMISATION 9: Données mémorisées
  const planStats = useMemo(() => {
    if (!currentFloorPlan) return { tables: 0, capacity: 0, obstacles: 0 };
    
    return {
      tables: tables.length,
      capacity: currentCapacity,
      obstacles: obstacles.length
    };
  }, [currentFloorPlan, tables.length, currentCapacity, obstacles.length]);

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
      onClick: handleAddObstacle 
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

  // ✅ OPTIMISATION 10: Early returns pour éviter le rendu inutile
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

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh',
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
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert 
          severity="error" 
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
        {/* En-tête optimisé */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton 
                onClick={() => navigate('/dashboard')}
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                  }
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  color: theme.palette.text.primary,
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
                >
                  Nouveau Plan
                </Button>
              )}
              
              <IconButton onClick={handleMenuOpen}>
                <MoreIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Sélecteur de plan simplifié */}
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
            >
              {allFloorPlans.map((plan) => (
                <Tab
                  key={plan.id}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {plan.name}
                      <Chip 
                        label={`${plan.tables?.length || 0}`}
                        size="small"
                        color={plan.id === currentFloorPlan?.id ? 'primary' : 'default'}
                      />
                    </Box>
                  }
                />
              ))}
            </Tabs>
          )}
        </Box>

        {/* Contenu principal optimisé */}
        {currentFloorPlan ? (
          <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
            {/* Barre d'outils simplifiée */}
            <Paper sx={{ p: 2, mb: 2 }}>
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

                {/* Statistiques */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    icon={<TableIcon />}
                    label={`${planStats.tables}`}
                    color="primary"
                    size="small"
                  />
                  <Chip
                    icon={<Badge badgeContent={planStats.capacity} color="success" />}
                    label={`${planStats.capacity}`}
                    color="success"
                    size="small"
                  />
                  {planStats.obstacles > 0 && (
                    <Chip
                      icon={<ObstacleIcon />}
                      label={`${planStats.obstacles}`}
                      color="warning"
                      size="small"
                    />
                  )}
                </Box>
              </Box>
            </Paper>

            {/* Canvas optimisé */}
            <Grid container spacing={3}>
              <Grid xs={12} md={selectedItem ? 8 : 12}>
                <OptimizedCanvas
                  editable={canEdit}
                  dragMode={selectedTool === TOOLS.DRAG}
                  onItemSelect={handleItemSelect}
                  selectedItem={selectedItem}
                  height={600}
                  fixedSize={true}
                  maxWidth={800}
                  maxHeight={600}
                />
              </Grid>

              {/* Panneau de propriétés (si sélection) */}
              {selectedItem && (
                <Grid xs={12} md={4}>
                  <Paper sx={{ height: '600px', overflow: 'auto', p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h6">
                        Propriétés {selectedItem.type === 'table' ? 'de la table' : 'de l\'obstacle'}
                      </Typography>
                      
                      <Box>
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
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Box>
        ) : (
          /* État vide */
          <Paper
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: 400,
              borderRadius: 2,
              border: `1px dashed ${theme.palette.divider}`
            }}
          >
            <TableIcon sx={{ fontSize: 64, color: theme.palette.text.secondary, mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Aucun plan de salle disponible
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

        {/* Dialogs et Snackbar (inchangés mais optimisés) */}
        
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
    </ErrorBoundary>
  );
};

export default React.memo(OptimizedFloorPlanManagement);