import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Divider,
  useMediaQuery,
  Tooltip,
  Badge,
  Paper,
  CircularProgress
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Visibility as ViewIcon,
  TableRestaurant as TableIcon,
  People as PeopleIcon,
  Close as CloseIcon,
  Menu as MenuIcon,
  Fullscreen as FullscreenIcon,
  Download as DownloadIcon,
  Share as ShareIcon
} from '@mui/icons-material';

// Imports des actions Redux
import { 
  fetchFloorPlansStart,
  fetchFloorPlansSuccess,
  fetchFloorPlansFailure,
  createFloorPlanStart,
  createFloorPlanSuccess,
  createFloorPlanFailure,
  updateFloorPlanStart,
  updateFloorPlanSuccess,
  updateFloorPlanFailure,
  deleteFloorPlanStart,
  deleteFloorPlanSuccess,
  deleteFloorPlanFailure,
  setCurrentFloorPlan
} from '../../store/slices/floorPlanSlice';

// Imports des composants
import FloorPlanEditor from '../../components/floorPlan/FloorPlanEditor';
import FloorPlanForm from '../../components/floorPlan/FloorPlanForm';
import Canvas from '../../components/floorPlan/Canvas';
import ErrorBoundary from '../../components/common/ErrorBoundary';

// Imports des utilitaires
import { useAuth } from '../../hooks/useAuth';
import { hasPermission, PERMISSIONS } from '../../utils/permissions';
import { useColorMode } from '../../context/ThemeContext';
import floorPlanService from '../../services/floorPlanService';

const FloorPlanManagement = () => {
  const theme = useTheme();
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  
  // Sélecteurs Redux
  const { floorPlans, currentFloorPlan, loading } = useSelector(state => state.floorPlan);
  
  // États locaux
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('create'); // 'create', 'edit', 'view'
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);

  // Vérification des permissions
  const canView = hasPermission(user?.role, PERMISSIONS.VIEW_PROJECTS);
  const canEdit = hasPermission(user?.role, PERMISSIONS.EDIT_PROJECTS);
  const canDelete = hasPermission(user?.role, PERMISSIONS.DELETE_PROJECTS);

  // Fonction pour afficher les notifications
  const showNotification = useCallback((message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  }, []);

  // Chargement initial des plans
  useEffect(() => {
    const loadFloorPlans = async () => {
      try {
        dispatch(fetchFloorPlansStart());
        const data = await floorPlanService.getAll();
        dispatch(fetchFloorPlansSuccess(data));
      } catch (error) {
        dispatch(fetchFloorPlansFailure(error.message));
        showNotification('Erreur lors du chargement des plans', 'error');
      }
    };
    
    if (canView) {
      loadFloorPlans();
    }
  }, [dispatch, canView, showNotification]);

  // Gestion des paramètres URL pour ouvrir le dialog de création
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'create' && canEdit) {
      handleCreatePlan();
      setSearchParams({}); // Nettoyer l'URL
    }
  }, [searchParams, canEdit]);

  // Gestionnaires d'événements
  const handleCreatePlan = () => {
    if (!canEdit) {
      showNotification('Vous n\'avez pas la permission de créer des plans', 'error');
      return;
    }
    setDialogMode('create');
    setSelectedPlan(null);
    setDialogOpen(true);
  };

  const handleEditPlan = (plan) => {
    if (!canEdit) {
      showNotification('Vous n\'avez pas la permission de modifier des plans', 'error');
      return;
    }
    setDialogMode('edit');
    setSelectedPlan(plan);
    dispatch(setCurrentFloorPlan(plan));
    setDialogOpen(true);
  };

  const handleViewPlan = (plan) => {
    setDialogMode('view');
    setSelectedPlan(plan);
    dispatch(setCurrentFloorPlan(plan));
    setDialogOpen(true);
  };

  const handleDeleteClick = (plan) => {
    if (!canDelete) {
      showNotification('Vous n\'avez pas la permission de supprimer des plans', 'error');
      return;
    }
    setPlanToDelete(plan);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!planToDelete) return;
    
    try {
      dispatch(deleteFloorPlanStart());
      await floorPlanService.delete(planToDelete.id);
      dispatch(deleteFloorPlanSuccess(planToDelete.id));
      showNotification('Plan supprimé avec succès');
      setDeleteConfirmOpen(false);
      setPlanToDelete(null);
    } catch (error) {
      dispatch(deleteFloorPlanFailure(error.message));
      showNotification('Erreur lors de la suppression', 'error');
    }
  };

  const handleSavePlan = async (planData) => {
    try {
      if (dialogMode === 'create') {
        dispatch(createFloorPlanStart());
        const data = await floorPlanService.create(planData);
        dispatch(createFloorPlanSuccess(data));
        showNotification('Plan créé avec succès');
      } else if (dialogMode === 'edit') {
        dispatch(updateFloorPlanStart());
        const data = await floorPlanService.update(planData.id, planData);
        dispatch(updateFloorPlanSuccess(data));
        showNotification('Plan mis à jour avec succès');
      }
      setDialogOpen(false);
    } catch (error) {
      const action = dialogMode === 'create' ? createFloorPlanFailure : updateFloorPlanFailure;
      dispatch(action(error.message));
      showNotification(`Erreur lors de la ${dialogMode === 'create' ? 'création' : 'mise à jour'}`, 'error');
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedPlan(null);
  };

  const handleSelectPlan = (plan) => {
    dispatch(setCurrentFloorPlan(plan));
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  // Calcul des statistiques
  const getStatistics = () => {
    const totalTables = floorPlans.reduce((sum, plan) => sum + (plan.tables?.length || 0), 0);
    const totalCapacity = floorPlans.reduce((sum, plan) => 
      sum + (plan.tables?.reduce((tableSum, table) => tableSum + (table.capacity || 0), 0) || 0), 0
    );
    
    return {
      totalPlans: floorPlans.length,
      totalTables,
      totalCapacity,
      averageCapacity: totalTables > 0 ? Math.round(totalCapacity / totalTables) : 0
    };
  };

  const stats = getStatistics();

  // Rendu du contenu des plans
  const renderPlanCard = (plan) => (
    <Card 
      key={plan.id}
      elevation={2}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          elevation: 4,
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.15)}`,
        },
        border: currentFloorPlan?.id === plan.id 
          ? `2px solid ${theme.palette.primary.main}` 
          : `1px solid ${theme.palette.divider}`,
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
            {plan.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {plan.tables && (
              <Chip 
                label={`${plan.tables.length} tables`} 
                size="small" 
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {plan.description || 'Aucune description'}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <TableIcon fontSize="small" color="primary" />
            <Typography variant="body2">
              {plan.tables?.length || 0} tables
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <PeopleIcon fontSize="small" color="primary" />
            <Typography variant="body2">
              {plan.tables?.reduce((sum, table) => sum + (table.capacity || 0), 0) || 0} places
            </Typography>
          </Box>
        </Box>

        {/* Aperçu miniature du plan */}
        <Box 
          sx={{ 
            height: 120, 
            border: `1px solid ${theme.palette.divider}`, 
            borderRadius: 1,
            overflow: 'hidden',
            backgroundColor: alpha(theme.palette.background.default, 0.5),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {plan.tables && plan.tables.length > 0 ? (
            <Canvas
              editable={false}
              height={118}
              width={200}
              dragMode={false}
              fixedSize={true}
              maxWidth={200}
              maxHeight={118}
            />
          ) : (
            <Typography variant="body2" color="text.secondary">
              Plan vide
            </Typography>
          )}
        </Box>
      </CardContent>
      
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          size="small" 
          startIcon={<ViewIcon />}
          onClick={() => handleViewPlan(plan)}
        >
          Voir
        </Button>
        {canEdit && (
          <Button 
            size="small" 
            startIcon={<EditIcon />}
            onClick={() => handleEditPlan(plan)}
          >
            Éditer
          </Button>
        )}
        {canDelete && (
          <Button 
            size="small" 
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => handleDeleteClick(plan)}
          >
            Supprimer
          </Button>
        )}
      </CardActions>
    </Card>
  );

  // Vérification des permissions
  if (!canView) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Vous n'avez pas la permission d'accéder aux plans de salle.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      {/* En-tête */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            Plans de Salle
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gérez vos plans de salle et l'agencement de votre restaurant
          </Typography>
        </Box>
        
        {canEdit && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreatePlan}
            size="large"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.3)}`,
            }}
          >
            Nouveau plan
          </Button>
        )}
      </Box>

      {/* Statistiques */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
              {stats.totalPlans}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Plans de salle
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
              {stats.totalTables}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tables total
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
              {stats.totalCapacity}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Places total
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
              {stats.averageCapacity}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Places/table
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Contenu principal */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress size={60} />
        </Box>
      ) : floorPlans.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <TableIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Aucun plan de salle
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Créez votre premier plan de salle pour commencer à organiser votre restaurant.
          </Typography>
          {canEdit && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreatePlan}
            >
              Créer mon premier plan
            </Button>
          )}
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {floorPlans.map(renderPlanCard)}
        </Grid>
      )}

      {/* FAB pour mobile */}
      {canEdit && isMobile && (
        <Fab
          color="primary"
          aria-label="add"
          onClick={handleCreatePlan}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
          }}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Dialog principal */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="xl"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            minHeight: '80vh',
            ...(isMobile && { m: 0, height: '100vh' })
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <Typography variant="h6">
            {dialogMode === 'create' ? 'Nouveau plan de salle' : 
             dialogMode === 'edit' ? 'Modifier le plan de salle' : 
             'Visualiser le plan de salle'}
          </Typography>
          <IconButton onClick={handleCloseDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0 }}>
          <ErrorBoundary>
            {dialogMode === 'create' ? (
              <FloorPlanForm
                onSubmit={handleSavePlan}
                showAdvancedConfig={true}
              />
            ) : (
              <FloorPlanEditor
                currentFloorPlan={selectedPlan}
                editable={canEdit && dialogMode === 'edit'}
                onSaveFloorPlan={handleSavePlan}
              />
            )}
          </ErrorBoundary>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer le plan "{planToDelete?.name}" ? 
            Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setNotification(prev => ({ ...prev, open: false }))}
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FloorPlanManagement;