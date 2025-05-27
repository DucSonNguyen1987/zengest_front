import React, { useState, useMemo, useCallback } from 'react';
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

// ✅ CACHE SIMPLE ET STATIQUE
const roleDisplayNames = {
  'admin': 'Administrateur',
  'owner': 'Propriétaire',
  'manager': 'Gestionnaire',
  'staff_bar': 'Staff Bar',
  'staff_floor': 'Staff Salle',
  'staff_kitchen': 'Staff Cuisine',
  'guest': 'Invité'
};

// ✅ NAVIGATION STATIQUE
const allNavigationItems = [
  {
    text: 'Tableau de bord',
    icon: DashboardIcon,
    path: '/dashboard',
    permission: null
  },
  {
    text: 'Plans de salle',
    icon: TableIcon,
    path: '/floor-plans',
    permission: PERMISSIONS.VIEW_PROJECTS
  },
  {
    text: 'Utilisateurs',
    icon: PeopleIcon,
    path: '/users',
    permission: PERMISSIONS.VIEW_USERS
  },
  {
    text: 'Paramètres',
    icon: SettingsIcon,
    path: '/settings',
    permission: PERMISSIONS.EDIT_SETTINGS
  }
];

const DashboardLayout = () => {
  const theme = useTheme();
  const { mode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { user, logout, isAuthenticated, loading: isLoading } = useAuth();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  
  const drawerWidth = 240;

  // ✅ MÉMORISATION ULTRA-SIMPLE
  const userDisplayName = user?.role ? (roleDisplayNames[user.role] || 'Personnel') : 'Utilisateur';
  
  const navigationItems = useMemo(() => {
    if (!user?.role) return allNavigationItems.slice(0, 1); // Juste dashboard
    
    return allNavigationItems.filter(item => 
      !item.permission || hasPermission(user.role, item.permission)
    );
  }, [user?.role]);

  // ✅ HANDLERS ULTRA-SIMPLES
  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(prev => !prev);
  }, []);

  const handleMenuOpen = useCallback((event) => {
    setAnchorElUser(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorElUser(null);
  }, []);

  const handleLogout = useCallback(() => {
    handleMenuClose();
    logout();
    navigate('/login');
  }, [logout, navigate]);

  const handleNavigate = useCallback((path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  }, [navigate, isMobile]);

  // ✅ AFFICHAGE CONDITIONNEL SIMPLE
  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Typography>Chargement...</Typography>
      </Box>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(10px)',
          color: theme.palette.text.primary,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {navigationItems.find(item => item.path === location.pathname)?.text || 'Tableau de bord'}
          </Typography>

          <IconButton color="inherit" onClick={toggleColorMode}>
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          <Typography variant="body2" sx={{ mx: 2, display: { xs: 'none', sm: 'block' } }}>
            {user?.firstName} {user?.lastName} ({userDisplayName})
          </Typography>

          <IconButton onClick={handleMenuOpen}>
            <Avatar sx={{ width: 32, height: 32 }}>
              {user?.firstName?.charAt(0) || 'U'}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorElUser}
            open={Boolean(anchorElUser)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleNavigate('/profile')}>
              <PersonIcon sx={{ mr: 2 }} />
              Mon profil
            </MenuItem>
            <MenuItem onClick={() => handleNavigate('/settings')}>
              <SettingsIcon sx={{ mr: 2 }} />
              Paramètres
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 2 }} />
              Déconnexion
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: drawerWidth },
          }}
        >
          <Toolbar>
            <Typography variant="h6">ZENGEST</Typography>
          </Toolbar>
          <Divider />
          <List>
            {navigationItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => handleNavigate(item.path)}
                >
                  <ListItemIcon>
                    <item.icon />
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
        
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { width: drawerWidth },
          }}
          open
        >
          <Toolbar>
            <Typography variant="h6">ZENGEST</Typography>
          </Toolbar>
          <Divider />
          <List>
            {navigationItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => handleNavigate(item.path)}
                >
                  <ListItemIcon>
                    <item.icon />
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;