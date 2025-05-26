import React, { useState, useEffect } from 'react';
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

// ==== FONCTION getStaffType SÉCURISÉE ====
const getStaffType = (userRole) => {
  console.log('getStaffType called with:', userRole); // Debug
  
  if (!userRole || typeof userRole !== 'string') {
    return 'Utilisateur';
  }

  const roleMap = {
    'admin': 'Administrateur',
    'manager': 'Gestionnaire', 
    'staff': 'Personnel',
    'server': 'Serveur',
    'host': 'Hôte d\'accueil',
    'chef': 'Chef',
    'waiter': 'Serveur',
    'user': 'Utilisateur',
    'guest': 'Invité'
  };

  return roleMap[userRole.toLowerCase()] || 'Personnel';
};

// ==== CONFIGURATION DE LA NAVIGATION ====
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

  // Filtrer selon les permissions
  const allowedItems = conditionalItems.filter(item => 
    !item.permission || hasPermission(userRole, item.permission)
  );

  return [...baseItems, ...allowedItems];
};

// ==== COMPOSANT PRINCIPAL ====
const DashboardLayout = () => {
  const theme = useTheme();
  const { mode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  
  // États du layout
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  
  // Responsive
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const drawerWidth = 240;

  // ==== GESTION DE LA NAVIGATION ====
  const navigationItems = React.useMemo(() => {
    if (!user?.role) return [];
    return getNavigationItems(user.role);
  }, [user?.role]);

  // ==== HANDLERS D'ÉVÉNEMENTS ====
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
    navigate('/login');
  };

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  // ==== VÉRIFICATIONS DE SÉCURITÉ ====
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // ==== AFFICHAGE PENDANT LE CHARGEMENT ====
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: theme.palette.background.default
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Chargement...
        </Typography>
      </Box>
    );
  }

  // ==== AFFICHAGE SI NON AUTHENTIFIÉ ====
  if (!isAuthenticated || !user) {
    return null; // Redirection en cours
  }

  // ==== RENDU DU DRAWER ====
  const drawerContent = (
    <Box>
      {/* En-tête du drawer */}
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          RestaurantApp
        </Typography>
      </Toolbar>
      <Divider />
      
      {/* Navigation */}
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigate(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main + '20',
                  borderRight: `3px solid ${theme.palette.primary.main}`,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path 
                    ? theme.palette.primary.main 
                    : 'inherit'
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                sx={{
                  color: location.pathname === item.path 
                    ? theme.palette.primary.main 
                    : 'inherit'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {navigationItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
          </Typography>

          {/* Contrôles utilisateur */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Toggle thème */}
            <IconButton color="inherit" onClick={toggleColorMode}>
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>

            {/* Informations utilisateur */}
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                {/* UTILISATION SÉCURISÉE DE getStaffType */}
                {getStaffType(user?.role)}
              </Typography>
            </Box>

            {/* Avatar et menu */}
            <IconButton onClick={handleMenuOpen} sx={{ p: 0, ml: 1 }}>
              <Avatar
                sx={{ 
                  width: 32, 
                  height: 32,
                  backgroundColor: theme.palette.primary.main 
                }}
              >
                {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>

            {/* Menu utilisateur */}
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
            >
              <MenuItem disabled>
                <PersonIcon sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="body2">
                    {user?.firstName} {user?.lastName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user?.email}
                  </Typography>
                </Box>
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => handleNavigate('/profile')}>
                <PersonIcon sx={{ mr: 1 }} />
                Mon profil
              </MenuItem>
              <MenuItem onClick={() => handleNavigate('/settings')}>
                <SettingsIcon sx={{ mr: 1 }} />
                Paramètres
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} />
                Déconnexion
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
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
              width: drawerWidth 
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
              width: drawerWidth 
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Contenu principal */}
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