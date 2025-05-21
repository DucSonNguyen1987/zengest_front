import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Drawer, 
  List, 
  ListItem,
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  IconButton, 
  Typography, 
  Avatar, 
  Badge, 
  Menu, 
  MenuItem, 
  Divider, 
  Tooltip, 
  Collapse, 
  
  useMediaQuery
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

// Material Icons
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ReceiptIcon from '@mui/icons-material/Receipt';
import HomeIcon from '@mui/icons-material/Home';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PersonIcon from '@mui/icons-material/Person';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

// Import des hooks et utilitaires existants
import { useAuth } from '../hooks/useAuth';
import { hasPermission, ROLES } from '../utils/permissions';
import { useColorMode } from '../context/ThemeContext'; // Supposons que ce contexte est déjà créé

// Largeur du drawer
const drawerWidth = 250;

const DashboardLayout = () => {
  // État pour le drawer
  const [open, setOpen] = useState(true);
  
  // États pour les menus dropdown
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  
  // État pour les sous-menus
  const [subMenuOpen, setSubMenuOpen] = useState({
    restaurant: true,
    admin: false
  });

  // Accès au thème et au mode de couleur
  const theme = useTheme();
  const { mode, toggleColorMode } = useColorMode();
  const isDark = mode === 'dark';
  
  // Détection de la taille d'écran
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  
  // Hooks de routing
  const navigate = useNavigate();
  const location = useLocation();
  
  // Données d'authentification
  const { user, logout, getStaffType, isStaff } = useAuth();
  const staffType = getStaffType();

  // Fermeture automatique sur petit écran
  useEffect(() => {
    if (isSmallScreen) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isSmallScreen]);

  // Gestionnaires d'événements pour les menus et sous-menus
  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleSubMenuToggle = (menuId) => {
    setSubMenuOpen(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const handleLogout = () => {
    handleUserMenuClose();
    logout();
    navigate('/login');
  };

  // Fonction pour obtenir l'icône de staff appropriée
  const getStaffIcon = () => {
    if (!staffType) return <PersonIcon />;
    
    switch(staffType) {
      case 'bar':
        return <LocalCafeIcon />;
      case 'floor':
        return <StorefrontIcon />;
      case 'kitchen':
        return <ShoppingCartIcon />;
      default:
        return <PersonIcon />;
    }
  };

  // Fonction pour vérifier si un chemin est actif
  const isPathActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: isDark 
            ? alpha(theme.palette.background.paper, 0.7)
            : alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(10px)',
          boxShadow: `0 4px 20px ${alpha(isDark ? '#000' : theme.palette.primary.dark, 0.1)}`,
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(open && !isSmallScreen && {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: `${drawerWidth}px`,
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
      >
        <Toolbar>
          {/* Bouton du drawer */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2,
              ...(open && !isSmallScreen && { display: 'none' }) 
            }}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Titre */}
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 500
            }}
          >
            ZENGEST
          </Typography>
          
          {/* Bouton de notifications */}
          <Tooltip title="Notifications">
            <IconButton 
              color="inherit" 
              sx={{ mr: 1 }}
              onClick={handleNotificationMenuOpen}
            >
              <Badge badgeContent={5} color="primary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          
          {/* Menu notifications */}
          <Menu
            anchorEl={notificationAnchorEl}
            open={Boolean(notificationAnchorEl)}
            onClose={handleNotificationMenuClose}
            PaperProps={{
              sx: {
                background: alpha(theme.palette.background.paper, 0.9),
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
                boxShadow: `0 8px 32px 0 ${alpha(isDark ? '#000' : theme.palette.primary.dark, 0.1)}`,
                border: `1px solid ${alpha(isDark ? theme.palette.divider : theme.palette.background.paper, 0.5)}`,
                width: 320,
                maxHeight: 400,
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Typography sx={{ p: 2, fontWeight: 500 }}>Notifications</Typography>
            <Divider />
            
            {/* Liste des notifications */}
            {[1, 2, 3, 4, 5].map((notification) => (
              <MenuItem key={notification} onClick={handleNotificationMenuClose}>
                <Typography variant="body2">Notification {notification}</Typography>
              </MenuItem>
            ))}
          </Menu>
          
          {/* Toggle du thème */}
          <Tooltip title={isDark ? "Mode clair" : "Mode sombre"}>
            <IconButton onClick={toggleColorMode} color="inherit" sx={{ ml: 1 }}>
              {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>
          
          {/* Avatar utilisateur */}
          <Tooltip title="Profil">
            <IconButton
              onClick={handleUserMenuOpen}
              color="inherit"
              size="small"
              sx={{ ml: 1 }}
            >
              <Avatar 
                sx={{ 
                  width: 38, 
                  height: 38,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                }}
              >
                {getStaffIcon()}
              </Avatar>
            </IconButton>
          </Tooltip>
          
          {/* Menu utilisateur */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleUserMenuClose}
            PaperProps={{
              sx: {
                background: alpha(theme.palette.background.paper, 0.9),
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
                boxShadow: `0 8px 32px 0 ${alpha(isDark ? '#000' : theme.palette.primary.dark, 0.1)}`,
                border: `1px solid ${alpha(isDark ? theme.palette.divider : theme.palette.background.paper, 0.5)}`,
                minWidth: 180,
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            {/* Informations utilisateur */}
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                {user?.firstName} {user?.lastName}
                {isStaff() && ` (${staffType.toUpperCase()})`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
              <Typography variant="caption" sx={{ 
                display: 'inline-block', 
                mt: 1, 
                px: 1, 
                py: 0.5, 
                borderRadius: 1,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main
              }}>
                {user?.role}
              </Typography>
            </Box>
            
            <Divider />
            
            {/* Options du menu */}
            <MenuItem component={Link} to="/profile" onClick={handleUserMenuClose}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Mon profil" />
            </MenuItem>
            
            {hasPermission(user?.role, 'EDIT_SETTINGS') && (
              <MenuItem component={Link} to="/settings" onClick={handleUserMenuClose}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Paramètres" />
              </MenuItem>
            )}
            
            <Divider />
            
            {/* Option de déconnexion */}
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" sx={{ color: theme.palette.error.main }} />
              </ListItemIcon>
              <ListItemText 
                primary="Déconnexion" 
                primaryTypographyProps={{ 
                  color: theme.palette.error.main 
                }} 
              />
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      {/* Drawer - Menu latéral */}
      <Drawer
        variant={isSmallScreen ? 'temporary' : 'permanent'}
        open={open}
        onClose={isSmallScreen ? handleDrawerToggle : undefined}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: isDark 
              ? alpha(theme.palette.background.paper, 0.7)
              : alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(10px)',
            borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          },
        }}
      >
        {/* En-tête du drawer */}
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: [2],
            py: 1.5,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          {/* Logo */}
          <Typography 
            variant="h5" 
            component="div" 
            sx={{ 
              fontWeight: 'bold',
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent'
            }}
          >
            ZENGEST
          </Typography>
          
          {/* Bouton pour fermer le drawer */}
          {!isSmallScreen && (
            <IconButton onClick={handleDrawerToggle}>
              <ChevronLeftIcon />
            </IconButton>
          )}
        </Toolbar>
        
        <Divider />
        
        {/* Navigation principale */}
        <List component="nav" sx={{ pt: 1 }}>
          {/* Tableau de bord */}
          <ListItemButton  
            component={Link} 
            to="/dashboard"
            selected={isPathActive('/dashboard')}
            sx={{ 
              borderRadius: 2,
              mx: 1,
              mb: 0.5,
              '&.Mui-selected': {
                backgroundColor: alpha(theme.palette.primary.main, isDark ? 0.25 : 0.15),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, isDark ? 0.35 : 0.25),
                },
              },
            }}
          >
            <ListItemIcon>
              <DashboardIcon 
                color={isPathActive('/dashboard') ? 'primary' : 'inherit'} 
              />
            </ListItemIcon>
            <ListItemText primary="Tableau de bord" />
          </ListItemButton>
          
          {/* Section Restaurant */}
          {hasPermission(user?.role, 'ACCESS_BACKOFFICE') && (
            <>
              <ListItemButton 
                onClick={() => handleSubMenuToggle('restaurant')} 
                sx={{ 
                  borderRadius: 2,
                  mx: 1,
                  mb: 0.5,
                  backgroundColor: subMenuOpen.restaurant 
                    ? alpha(theme.palette.primary.main, isDark ? 0.2 : 0.1)
                    : 'transparent',
                }}
              >
                <ListItemIcon>
                  <StorefrontIcon 
                    color={subMenuOpen.restaurant ? 'primary' : 'inherit'} 
                  />
                </ListItemIcon>
                <ListItemText primary="Restaurant" />
                {subMenuOpen.restaurant ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              
              <Collapse in={subMenuOpen.restaurant} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {/* Réservations */}
                  <ListItemButton 
                     
                    component={Link} 
                    to="/reservations"
                    selected={isPathActive('/reservations')}
                    sx={{ 
                      pl: 4, 
                      borderRadius: 2,
                      mx: 1,
                      mb: 0.5,
                      '&.Mui-selected': {
                        backgroundColor: alpha(theme.palette.primary.main, isDark ? 0.25 : 0.15),
                      },
                    }}
                  >
                    <ListItemIcon>
                      <AccessTimeIcon 
                        color={isPathActive('/reservations') ? 'primary' : 'inherit'} 
                      />
                    </ListItemIcon>
                    <ListItemText primary="Réservations" />
                  </ListItemButton>
                  
                  {/* Plan de salle */}
                  {hasPermission(user?.role, 'VIEW_TABLE_STATUS') && (
                    <ListItemButton 
                       
                      component={Link} 
                      to="/floor-plans"
                      selected={isPathActive('/floor-plans')}
                      sx={{ 
                        pl: 4, 
                        borderRadius: 2,
                        mx: 1,
                        mb: 0.5,
                        '&.Mui-selected': {
                          backgroundColor: alpha(theme.palette.primary.main, isDark ? 0.25 : 0.15),
                        },
                      }}
                    >
                      <ListItemIcon>
                        <TableRestaurantIcon 
                          color={isPathActive('/floor-plans') ? 'primary' : 'inherit'} 
                        />
                      </ListItemIcon>
                      <ListItemText primary="Plan de salle" />
                    </ListItemButton>
                  )}
                  
                  {/* Commandes */}
                  {hasPermission(user?.role, 'CREATE_ORDER') && (
                    <ListItemButton 
                       
                      component={Link} 
                      to="/orders"
                      selected={isPathActive('/orders')}
                      sx={{ 
                        pl: 4, 
                        borderRadius: 2,
                        mx: 1,
                        mb: 0.5,
                        '&.Mui-selected': {
                          backgroundColor: alpha(theme.palette.primary.main, isDark ? 0.25 : 0.15),
                        },
                      }}
                    >
                      <ListItemIcon>
                        <ShoppingCartIcon 
                          color={isPathActive('/orders') ? 'primary' : 'inherit'} 
                        />
                      </ListItemIcon>
                      <ListItemText primary="Commandes" />
                    </ListItemButton>
                  )}
                  
                  {/* Interface Cuisine */}
                  {user?.role === ROLES.STAFF_KITCHEN && (
                    <ListItemButton 
                       
                      component={Link} 
                      to="/kitchen"
                      selected={isPathActive('/kitchen')}
                      sx={{ 
                        pl: 4, 
                        borderRadius: 2,
                        mx: 1,
                        mb: 0.5,
                        '&.Mui-selected': {
                          backgroundColor: alpha(theme.palette.primary.main, isDark ? 0.25 : 0.15),
                        },
                      }}
                    >
                      <ListItemIcon>
                        <ShoppingCartIcon 
                          color={isPathActive('/kitchen') ? 'primary' : 'inherit'} 
                        />
                      </ListItemIcon>
                      <ListItemText primary="Cuisine" />
                    </ListItemButton>
                  )}
                  
                  {/* Interface Bar */}
                  {user?.role === ROLES.STAFF_BAR && (
                    <ListItemButton 
                       
                      component={Link} 
                      to="/bar"
                      selected={isPathActive('/bar')}
                      sx={{ 
                        pl: 4, 
                        borderRadius: 2,
                        mx: 1,
                        mb: 0.5,
                        '&.Mui-selected': {
                          backgroundColor: alpha(theme.palette.primary.main, isDark ? 0.25 : 0.15),
                        },
                      }}
                    >
                      <ListItemIcon>
                        <LocalCafeIcon 
                          color={isPathActive('/bar') ? 'primary' : 'inherit'} 
                        />
                      </ListItemIcon>
                      <ListItemText primary="Bar" />
                    </ListItemButton>
                  )}
                  
                  {/* Facturation */}
                  {hasPermission(user?.role, 'CREATE_INVOICE') && (
                    <ListItemButton 
                       
                      component={Link} 
                      to="/billing"
                      selected={isPathActive('/billing')}
                      sx={{ 
                        pl: 4, 
                        borderRadius: 2,
                        mx: 1,
                        mb: 0.5,
                        '&.Mui-selected': {
                          backgroundColor: alpha(theme.palette.primary.main, isDark ? 0.25 : 0.15),
                        },
                      }}
                    >
                      <ListItemIcon>
                        <ReceiptIcon 
                          color={isPathActive('/billing') ? 'primary' : 'inherit'} 
                        />
                      </ListItemIcon>
                      <ListItemText primary="Facturation" />
                    </ListItemButton>
                  )}
                </List>
              </Collapse>
            </>
          )}
          
          {/* Site vitrine */}
          {hasPermission(user?.role, 'ACCESS_SHOWCASE') && (
            <ListItemButton 
               
              component={Link} 
              to="/showcase"
              selected={isPathActive('/showcase')}
              sx={{ 
                borderRadius: 2,
                mx: 1,
                mb: 0.5,
                '&.Mui-selected': {
                  backgroundColor: alpha(theme.palette.primary.main, isDark ? 0.25 : 0.15),
                },
              }}
            >
              <ListItemIcon>
                <HomeIcon 
                  color={isPathActive('/showcase') ? 'primary' : 'inherit'} 
                />
              </ListItemIcon>
              <ListItemText primary="Site vitrine" />
            </ListItemButton>
          )}
          
          {/* Section Administration */}
          {(user?.role === ROLES.ADMIN || user?.role === ROLES.OWNER || user?.role === ROLES.MANAGER) && (
            <>
              <ListItemButton 
                onClick={() => handleSubMenuToggle('admin')} 
                sx={{ 
                  borderRadius: 2,
                  mx: 1,
                  mb: 0.5,
                  backgroundColor: subMenuOpen.admin 
                    ? alpha(theme.palette.primary.main, isDark ? 0.2 : 0.1)
                    : 'transparent',
                }}
              >
                <ListItemIcon>
                  <SettingsIcon 
                    color={subMenuOpen.admin ? 'primary' : 'inherit'} 
                  />
                </ListItemIcon>
                <ListItemText primary="Administration" />
                {subMenuOpen.admin ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              
              <Collapse in={subMenuOpen.admin} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {/* Gestion des utilisateurs */}
                  {hasPermission(user?.role, 'VIEW_USERS') && (
                    <ListItemButton 
                       
                      component={Link} 
                      to="/users"
                      selected={isPathActive('/users')}
                      sx={{ 
                        pl: 4, 
                        borderRadius: 2,
                        mx: 1,
                        mb: 0.5,
                        '&.Mui-selected': {
                          backgroundColor: alpha(theme.palette.primary.main, isDark ? 0.25 : 0.15),
                        },
                      }}
                    >
                      <ListItemIcon>
                        <PeopleIcon 
                          color={isPathActive('/users') ? 'primary' : 'inherit'} 
                        />
                      </ListItemIcon>
                      <ListItemText primary="Utilisateurs" />
                    </ListItemButton>
                  )}
                  
                  {/* Configuration des salles */}
                  {hasPermission(user?.role, 'CREATE_ROOM_TABLE') && (
                    <ListItemButton 
                       
                      component={Link} 
                      to="/room-config"
                      selected={isPathActive('/room-config')}
                      sx={{ 
                        pl: 4, 
                        borderRadius: 2,
                        mx: 1,
                        mb: 0.5,
                        '&.Mui-selected': {
                          backgroundColor: alpha(theme.palette.primary.main, isDark ? 0.25 : 0.15),
                        },
                      }}
                    >
                      <ListItemIcon>
                        <TableRestaurantIcon 
                          color={isPathActive('/room-config') ? 'primary' : 'inherit'} 
                        />
                      </ListItemIcon>
                      <ListItemText primary="Configuration des salles" />
                    </ListItemButton>
                  )}
                  
                  {/* Paramètres */}
                  {hasPermission(user?.role, 'EDIT_SETTINGS') && (
                    <ListItemButton 
                       
                      component={Link} 
                      to="/settings"
                      selected={isPathActive('/settings')}
                      sx={{ 
                        pl: 4, 
                        borderRadius: 2,
                        mx: 1,
                        mb: 0.5,
                        '&.Mui-selected': {
                          backgroundColor: alpha(theme.palette.primary.main, isDark ? 0.25 : 0.15),
                        },
                      }}
                    >
                      <ListItemIcon>
                        <SettingsIcon 
                          color={isPathActive('/settings') ? 'primary' : 'inherit'} 
                        />
                      </ListItemIcon>
                      <ListItemText primary="Paramètres" />
                    </ListItemButton>
                  )}
                </List>
              </Collapse>
            </>
          )}
        </List>
      </Drawer>
      
      {/* Contenu principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          ml: { xs: 0, md: open ? `${drawerWidth}px` : 0 },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          minHeight: '100vh',
          pt: 8, // Pour compenser l'AppBar
          background: isDark
            ? `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.15)} 0%, ${alpha(theme.palette.background.default, 0.95)} 100%)`
            : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
        }}
      >
        <Box
          sx={{
            background: alpha(theme.palette.background.paper, isDark ? 0.7 : 0.8),
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            boxShadow: `0 8px 32px 0 ${alpha(isDark ? '#000' : theme.palette.primary.dark, 0.1)}`,
            border: `1px solid ${alpha(isDark ? theme.palette.divider : theme.palette.background.paper, 0.5)}`,
            p: 3,
            mb: 2,
            minHeight: '80vh',
            overflow: 'auto'
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;