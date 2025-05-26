import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  CssBaseline,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  TableRestaurant as TableIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useColorMode } from '../context/ThemeContext';
import { hasPermission, PERMISSIONS } from '../utils/permissions';

// ==== CACHE OPTIMISÉ POUR getStaffType ====
const staffTypeCache = new Map();

const getStaffType = (userRole) => {
  // Vérifier le cache d'abord pour éviter les recalculs
  if (staffTypeCache.has(userRole)) {
    return staffTypeCache.get(userRole);
  }
  
  // Debug conditionnel seulement en développement
  if (import.meta.env.DEV) {
    console.log('getStaffType called with:', userRole);
  }
  
  let result;
  
  if (!userRole || typeof userRole !== 'string') {
    result = 'Utilisateur';
  } else {
    const roleMap = {
      'admin': 'Administrateur',
      'owner': 'Propriétaire',
      'manager': 'Gestionnaire', 
      'staff_bar': 'Staff Bar',
      'staff_floor': 'Staff Salle',
      'staff_kitchen': 'Staff Cuisine',
      'staff': 'Personnel',
      'server': 'Serveur',
      'host': 'Hôte d\'accueil',
      'chef': 'Chef',
      'waiter': 'Serveur',
      'user': 'Utilisateur',
      'guest': 'Invité'
    };
    
    result = roleMap[userRole.toLowerCase()] || 'Personnel';
  }
  
  // Mettre en cache le résultat
  staffTypeCache.set(userRole, result);
  return result;
};

// ==== CONFIGURATION DE LA NAVIGATION OPTIMISÉE ====
const getNavigationItems = (userRole) => {
  const baseItems = [
    {
      text: 'Tableau de bord',
      icon: <DashboardIcon />,
      path: '/dashboard',
      permission: null // Accessible à tous
    }
  ];

  // Items conditionnels selon les permissions
  const conditionalItems = [
    {
      text: 'Plans de salle',
      icon: <TableIcon />,
      path: '/floor-plans',
      permission: PERMISSIONS.VIEW_PROJECTS
    },
    {
      text: 'Utilisateurs',
      icon: <PeopleIcon />,
      path: '/users',
      permission: PERMISSIONS.VIEW_USERS
    },
    {
      text: 'Paramètres',
      icon: <SettingsIcon />,
      path: '/settings',
      permission: PERMISSIONS.EDIT_SETTINGS
    }
  ];

  // Filtrer selon les permissions de l'utilisateur
  const allowedItems = conditionalItems.filter(item => 
    !item.permission || hasPermission(userRole, item.permission)
  );

  return [...baseItems, ...allowedItems];
};

// ==== COMPOSANT PRINCIPAL OPTIMISÉ ====
const DashboardLayout = () => {
  // ✅ TOUS LES HOOKS DANS L'ORDRE STRICT - AUCUN APRÈS UN RETURN CONDITIONNEL
  
  // Hooks de base React et UI
  const theme = useTheme();
  const { mode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Hook d'authentification
  const { user, logout, isAuthenticated, loading: isLoading } = useAuth();
  
  // États locaux
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  
  // Constantes
  const drawerWidth = 240;

  // ✅ MÉMORISATION OPTIMISÉE - Tous les useMemo avant les returns conditionnels
  
  // Mémoriser le type de staff avec protection contre les valeurs nulles
  const userStaffType = useMemo(() => {
    if (!user?.role) return 'Utilisateur';
    return getStaffType(user.role);
  }, [user?.role]);

  // Mémoriser les items de navigation avec protection
  const navigationItems = useMemo(() => {
    if (!user?.role) return [];
    return getNavigationItems(user.role);
  }, [user?.role]);

  // ✅ HANDLERS MÉMORISÉS - Tous les useCallback avant les returns conditionnels
  
  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(prev => !prev); // Utiliser la forme fonction pour éviter les dépendances
  }, []);

  const handleMenuOpen = useCallback((event) => {
    setAnchorElUser(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorElUser(null);
  }, []);

  const handleLogout = useCallback(async () => {
    handleMenuClose();
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // Forcer la navigation même en cas d'erreur
      navigate('/login');
    }
  }, [logout, navigate]);

  const handleNavigate = useCallback((path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  }, [navigate, isMobile]);

  // ✅ CONTENU DU DRAWER MÉMORISÉ pour éviter les re-renders inutiles
  const drawerContent = useMemo(() => (
    <Box>
      {/* En-tête du drawer avec branding */}
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
          ZENGEST
        </Typography>
      </Toolbar>
      <Divider />
      
      {/* Navigation dynamique basée sur les permissions */}
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigate(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.12),
                  borderRight: `3px solid ${theme.palette.primary.main}`,
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.primary.main,
                  },
                  '& .MuiListItemText-primary': {
                    color: theme.palette.primary.main,
                    fontWeight: 'medium',
                  },
                },
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                },
                borderRadius: '0 20px 20px 0',
                mr: 1,
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path 
                    ? theme.palette.primary.main 
                    : theme.palette.text.secondary,
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontSize: '0.875rem',
                    fontWeight: location.pathname === item.path ? 'medium' : 'normal',
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  ), [navigationItems, location.pathname, handleNavigate, theme]);

  // ✅ EFFET POUR LA SÉCURITÉ - Redirection si non authentifié
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // ✅ MAINTENANT LES RETURNS CONDITIONNELS - APRÈS TOUS LES HOOKS
  
  // Écran de chargement avec design amélioré
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: theme.palette.background.default,
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: 60,
            height: 60,
            border: `4px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            borderTop: `4px solid ${theme.palette.primary.main}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' },
            },
          }}
        />
        <Typography variant="h6" color="text.secondary">
          Chargement de ZENGEST...
        </Typography>
      </Box>
    );
  }

  // Redirection silencieuse si non authentifié
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* AppBar avec design amélioré */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          color: theme.palette.text.primary,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { md: 'none' },
              '&:hover': {
                backgroundColor: alpha(theme.palette.action.hover, 0.1),
              }
            }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'medium' }}>
            {navigationItems.find(item => item.path === location.pathname)?.text || 'Tableau de bord'}
          </Typography>

          {/* Contrôles utilisateur optimisés */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Toggle thème avec animation */}
            <IconButton 
              color="inherit" 
              onClick={toggleColorMode}
              sx={{
                '&:hover': {
                  backgroundColor: alpha(theme.palette.action.hover, 0.1),
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>

            {/* Informations utilisateur avec design amélioré */}
            <Box sx={{ 
              display: { xs: 'none', sm: 'flex' }, 
              alignItems: 'center', 
              gap: 1,
              px: 2,
              py: 0.5,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            }}>
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  opacity: 0.8,
                  fontSize: '0.75rem',
                  backgroundColor: alpha(theme.palette.primary.main, 0.2),
                  px: 1,
                  py: 0.25,
                  borderRadius: 1,
                }}
              >
                {userStaffType}
              </Typography>
            </Box>

            {/* Avatar avec menu optimisé */}
            <IconButton 
              onClick={handleMenuOpen} 
              sx={{ 
                p: 0, 
                ml: 1,
                '&:hover': {
                  transform: 'scale(1.1)',
                },
                transition: 'transform 0.2s ease-in-out',
              }}
            >
              <Avatar
                sx={{ 
                  width: 36, 
                  height: 36,
                  backgroundColor: theme.palette.primary.main,
                  fontWeight: 'bold',
                  boxShadow: theme.shadows[2],
                }}
              >
                {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>

            {/* Menu utilisateur avec design amélioré */}
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 8,
                sx: {
                  mt: 1,
                  borderRadius: 2,
                  minWidth: 200,
                  backgroundColor: alpha(theme.palette.background.paper, 0.95),
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${theme.palette.divider}`,
                },
              }}
            >
              <MenuItem disabled sx={{ opacity: 1 }}>
                <PersonIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {user?.firstName} {user?.lastName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user?.email}
                  </Typography>
                </Box>
              </MenuItem>
              <Divider sx={{ my: 1 }} />
              <MenuItem 
                onClick={() => handleNavigate('/profile')}
                sx={{ 
                  '&:hover': { 
                    backgroundColor: alpha(theme.palette.primary.main, 0.1) 
                  } 
                }}
              >
                <PersonIcon sx={{ mr: 2 }} />
                Mon profil
              </MenuItem>
              <MenuItem 
                onClick={() => handleNavigate('/settings')}
                sx={{ 
                  '&:hover': { 
                    backgroundColor: alpha(theme.palette.primary.main, 0.1) 
                  } 
                }}
              >
                <SettingsIcon sx={{ mr: 2 }} />
                Paramètres
              </MenuItem>
              <Divider sx={{ my: 1 }} />
              <MenuItem 
                onClick={handleLogout}
                sx={{ 
                  color: theme.palette.error.main,
                  '&:hover': { 
                    backgroundColor: alpha(theme.palette.error.main, 0.1) 
                  } 
                }}
              >
                <LogoutIcon sx={{ mr: 2 }} />
                Déconnexion
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer optimisé */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Meilleure performance mobile
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: alpha(theme.palette.background.paper, 0.95),
              backdropFilter: 'blur(10px)',
            },
          }}
        >
          {drawerContent}
        </Drawer>
        
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: alpha(theme.palette.background.paper, 0.95),
              backdropFilter: 'blur(10px)',
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Contenu principal optimisé */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Toolbar /> {/* Espaceur pour l'AppBar */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;