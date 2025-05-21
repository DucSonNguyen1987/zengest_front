import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Avatar, 
  Menu, 
  MenuItem, 
  Divider, 
  Box, 
  Tabs, 
  Tab, 
  ListItemIcon, 
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { 
  Person as PersonIcon, 
  Settings as SettingsIcon, 
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useColorMode } from '../../context/ThemeContext';

const Navbar = () => {
  const theme = useTheme();
  const { mode, toggleColorMode } = useColorMode();
  const isDark = mode === 'dark';
  
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // État pour le menu utilisateur
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Pour le menu hamburger sur mobile
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Définir la valeur active pour les onglets
  const currentTab = location.pathname === '/' ? 0 : 
                     location.pathname === '/dashboard' ? 1 : false;

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
    navigate('/login');
  };
  
  // Fonctions pour gérer le menu utilisateur
  const handleOpenUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };
  
  // Fonctions pour le menu mobile
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  // Fonction pour naviguer et fermer le menu mobile
  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          background: isDark 
            ? alpha(theme.palette.background.paper, 0.7)
            : alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          color: theme.palette.text.primary,
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Logo et titre de l'application */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleMobileMenu}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            <Typography 
              variant="h6" 
              component={Link} 
              to="/" 
              sx={{
                fontWeight: 'bold',
                textDecoration: 'none',
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent'
              }}
            >
              ZENGEST
            </Typography>
          </Box>

          {/* Navigation principale - cachée sur mobile */}
          {!isMobile && (
            <Tabs 
              value={currentTab} 
              indicatorColor="primary"
              textColor="primary"
              sx={{ 
                '& .MuiTab-root': { 
                  textTransform: 'none',
                  minWidth: 100,
                  fontWeight: 500
                } 
              }}
            >
              <Tab 
                label="Accueil" 
                component={Link} 
                to="/" 
                sx={{ color: currentTab === 0 ? theme.palette.primary.main : theme.palette.text.secondary }}
              />
              {isAuthenticated && (
                <Tab 
                  label="Tableau de bord" 
                  component={Link} 
                  to="/dashboard" 
                  sx={{ color: currentTab === 1 ? theme.palette.primary.main : theme.palette.text.secondary }}
                />
              )}
              {/* Ajoutez d'autres onglets selon les besoins */}
            </Tabs>
          )}

          {/* Zone de droite avec bouton de thème et profil */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Bouton de basculement du thème */}
            <IconButton 
              onClick={toggleColorMode} 
              color="inherit"
              sx={{ mr: 1 }}
            >
              {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>

            {/* Affichage conditionnel selon l'état d'authentification */}
            {isAuthenticated ? (
              <>
                <IconButton
                  onClick={handleOpenUserMenu}
                  sx={{ ml: 1 }}
                >
                  <Avatar 
                    sx={{ 
                      width: 35, 
                      height: 35,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                    }}
                  >
                    {user?.firstName?.charAt(0) || <PersonIcon />}
                  </Avatar>
                </IconButton>
                
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseUserMenu}
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
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                      {user?.firstName} {user?.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user?.email}
                    </Typography>
                  </Box>
                  
                  <Divider />
                  
                  <MenuItem component={Link} to="/profile" onClick={handleCloseUserMenu}>
                    <ListItemIcon>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="body2">Mon profil</Typography>
                  </MenuItem>
                  
                  <MenuItem component={Link} to="/settings" onClick={handleCloseUserMenu}>
                    <ListItemIcon>
                      <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="body2">Paramètres</Typography>
                  </MenuItem>
                  
                  <Divider />
                  
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" sx={{ color: theme.palette.error.main }} />
                    </ListItemIcon>
                    <Typography variant="body2" color="error">Déconnexion</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button 
                variant="contained" 
                color="primary"
                component={Link}
                to="/login"
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 3,
                  py: 1,
                  backgroundColor: isDark 
                    ? alpha(theme.palette.primary.main, 0.9)
                    : theme.palette.primary.main,
                  boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.3)}`,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  }
                }}
              >
                Connexion
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Menu mobile */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        PaperProps={{
          sx: {
            width: 250,
            background: alpha(theme.palette.background.paper, 0.9),
            backdropFilter: 'blur(10px)',
          }
        }}
      >
        <Box sx={{ pt: 8, px: 2 }}>
          <Typography 
            variant="h6" 
            sx={{
              fontWeight: 'bold',
              mb: 2,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent'
            }}
          >
            ZENGEST
          </Typography>
          
          <Divider sx={{ mb: 2 }} />
          
          <List>
            <ListItem 
              button 
              selected={location.pathname === '/'} 
              onClick={() => handleNavigation('/')}
              sx={{ 
                borderRadius: 2,
                mb: 1,
                '&.Mui-selected': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              <ListItemText primary="Accueil" />
            </ListItem>
            
            {isAuthenticated && (
              <ListItem 
                button 
                selected={location.pathname === '/dashboard'} 
                onClick={() => handleNavigation('/dashboard')}
                sx={{ 
                  borderRadius: 2,
                  mb: 1,
                  '&.Mui-selected': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                <ListItemText primary="Tableau de bord" />
              </ListItem>
            )}
            
            {/* Menu complémentaire pour mobile */}
            {isAuthenticated ? (
              <>
                <Divider sx={{ my: 2 }} />
                
                <ListItem 
                  button 
                  onClick={() => {
                    handleNavigation('/profile');
                  }}
                  sx={{ borderRadius: 2, mb: 1 }}
                >
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Mon profil" />
                </ListItem>
                
                <ListItem 
                  button 
                  onClick={() => {
                    handleNavigation('/settings');
                  }}
                  sx={{ borderRadius: 2, mb: 1 }}
                >
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Paramètres" />
                </ListItem>
                
                <Divider sx={{ my: 2 }} />
                
                <ListItem 
                  button 
                  onClick={() => {
                    toggleMobileMenu();
                    logout();
                    navigate('/login');
                  }}
                  sx={{ 
                    borderRadius: 2,
                    color: theme.palette.error.main,
                  }}
                >
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" sx={{ color: theme.palette.error.main }} />
                  </ListItemIcon>
                  <ListItemText primary="Déconnexion" />
                </ListItem>
              </>
            ) : (
              <Box sx={{ px: 2, py: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  fullWidth
                  onClick={() => {
                    toggleMobileMenu();
                    navigate('/login');
                  }}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    py: 1,
                  }}
                >
                  Connexion
                </Button>
              </Box>
            )}
          </List>
        </Box>
      </Drawer>
      
      {/* Espace pour compenser la hauteur de l'AppBar */}
      <Toolbar />
    </>
  );
};

export default Navbar;