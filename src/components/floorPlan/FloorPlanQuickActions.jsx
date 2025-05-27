import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Chip,
  Badge,
  Tooltip,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  useMediaQuery
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import {
  TableRestaurant as FloorPlanIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Dashboard as DashboardIcon,
  MoreVert as MoreIcon,
  Launch as LaunchIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

import { usePermissions } from '../auth/ProtectedRoute';
import { useAuth } from '../../hooks/useAuth';
import { setCurrentFloorPlan } from '../../store/slices/floorPlanSlice';
import { useColorMode } from '../../context/ThemeContext';

/**
 * Composant pour les actions rapides des plans de salle dans la Navbar
 */
export const FloorPlanQuickActions = ({ variant = 'icon' }) => {
  const theme = useTheme();
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { checkPermission } = usePermissions();
  
  // Sélecteurs Redux
  const { floorPlans, currentFloorPlan } = useSelector(state => state.floorPlan);
  
  // États
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  // Permissions
  const canView = checkPermission('VIEW_PROJECTS');
  const canEdit = checkPermission('EDIT_PROJECTS');
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleNavigateToFloorPlans = () => {
    navigate('/floor-plans');
    handleClose();
  };
  
  const handleCreateNewPlan = () => {
    navigate('/floor-plans?action=create');
    handleClose();
  };
  
  const handleSelectPlan = (plan) => {
    dispatch(setCurrentFloorPlan(plan));
    navigate('/floor-plans');
    handleClose();
  };

  if (!canView) {
    return null;
  }

  const activePlansCount = floorPlans?.filter(plan => plan.tables?.length > 0).length || 0;

  if (variant === 'button') {
    return (
      <Box>
        <Tooltip title="Plans de salle">
          <IconButton
            onClick={handleClick}
            sx={{
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              }
            }}
          >
            <Badge 
              badgeContent={activeePlansCount} 
              color="primary"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '0.7rem',
                  height: '16px',
                  minWidth: '16px'
                }
              }}
            >
              <FloorPlanIcon />
            </Badge>
          </IconButton>
        </Tooltip>
        
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 280,
              backgroundColor: alpha(theme.palette.background.paper, 0.95),
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
              boxShadow: `0 8px 32px 0 ${alpha(isDark ? '#000' : theme.palette.primary.dark, 0.1)}`,
              border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
            }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>
              Plans de salle
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {floorPlans?.length || 0} plan(s) • {activeePlansCount} actif(s)
            </Typography>
          </Box>
          
          <Divider />
          
          <MenuItem onClick={handleNavigateToFloorPlans}>
            <ListItemIcon>
              <DashboardIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Voir tous les plans" />
          </MenuItem>
          
          {canEdit && (
            <MenuItem onClick={handleCreateNewPlan}>
              <ListItemIcon>
                <AddIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Nouveau plan" />
            </MenuItem>
          )}
          
          {floorPlans && floorPlans.length > 0 && (
            <>
              <Divider />
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Accès rapide
                </Typography>
              </Box>
              {floorPlans.slice(0, 3).map((plan) => (
                <MenuItem 
                  key={plan.id} 
                  onClick={() => handleSelectPlan(plan)}
                  sx={{
                    backgroundColor: currentFloorPlan?.id === plan.id 
                      ? alpha(theme.palette.primary.main, 0.1) 
                      : 'transparent'
                  }}
                >
                  <ListItemIcon>
                    <FloorPlanIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={plan.name}
                    secondary={`${plan.tables?.length || 0} tables`}
                  />
                  {plan.tables?.length > 0 && (
                    <Chip 
                      label="Actif" 
                      size="small" 
                      color="success" 
                      variant="outlined"
                    />
                  )}
                </MenuItem>
              ))}
              {floorPlans.length > 3 && (
                <MenuItem onClick={handleNavigateToFloorPlans}>
                  <ListItemIcon>
                    <MoreIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={`Voir ${floorPlans.length - 3} autres...`} />
                </MenuItem>
              )}
            </>
          )}
        </Menu>
      </Box>
    );
  }

  return null;
};

/**
 * Composant SpeedDial pour les actions rapides (mobile)
 */
export const FloorPlanSpeedDial = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { checkPermission } = usePermissions();
  const { floorPlans } = useSelector(state => state.floorPlan);
  
  const canView = checkPermission('VIEW_PROJECTS');
  const canEdit = checkPermission('EDIT_PROJECTS');
  
  if (!canView || !isMobile) {
    return null;
  }
  
  const actions = [
    {
      icon: <DashboardIcon />,
      name: 'Voir tous',
      onClick: () => navigate('/floor-plans'),
    },
  ];
  
  if (canEdit) {
    actions.unshift({
      icon: <AddIcon />,
      name: 'Nouveau plan',
      onClick: () => navigate('/floor-plans?action=create'),
    });
  }
  
  return (
    <SpeedDial
      ariaLabel="Actions plans de salle"
      sx={{ 
        position: 'fixed', 
        bottom: 80, 
        right: 16,
        '& .MuiFab-primary': {
          backgroundColor: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          }
        }
      }}
      icon={<SpeedDialIcon icon={<FloorPlanIcon />} openIcon={<LaunchIcon />} />}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={action.onClick}
        />
      ))}
    </SpeedDial>
  );
};

/**
 * Widget d'état des plans de salle pour le tableau de bord
 */
export const FloorPlanStatus = () => {
  const theme = useTheme();
  const { floorPlans, currentFloorPlan } = useSelector(state => state.floorPlan);
  const { checkPermission } = usePermissions();
  const navigate = useNavigate();
  
  const canView = checkPermission('VIEW_PROJECTS');
  
  if (!canView || !floorPlans) {
    return null;
  }
  
  const totalTables = floorPlans.reduce((sum, plan) => sum + (plan.tables?.length || 0), 0);
  const totalCapacity = floorPlans.reduce((sum, plan) => 
    sum + (plan.tables?.reduce((tableSum, table) => tableSum + (table.capacity || 0), 0) || 0), 0
  );
  
  return (
    <Box
      onClick={() => navigate('/floor-plans')}
      sx={{
        p: 2,
        borderRadius: 2,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.15)}`,
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Plans de salle
        </Typography>
        <FloorPlanIcon color="primary" />
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
        <Box>
          <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
            {floorPlans.length}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Plans
          </Typography>
        </Box>
        <Box>
          <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
            {totalTables}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Tables
          </Typography>
        </Box>
        <Box>
          <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
            {totalCapacity}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Places
          </Typography>
        </Box>
      </Box>
      
      {currentFloorPlan && (
        <Chip 
          label={`Actuel: ${currentFloorPlan.name}`}
          size="small"
          color="primary"
          variant="outlined"
        />
      )}
    </Box>
  );
};

export default FloorPlanQuickActions;