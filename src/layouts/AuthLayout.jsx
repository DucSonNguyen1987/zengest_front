import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { Outlet } from 'react-router-dom';
import { useColorMode } from '../context/ThemeContext';

const AuthLayout = () => {
  const theme = useTheme();
  const { mode } = useColorMode();
  const isDark = mode === 'dark';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: isDark
          ? `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.15)} 0%, ${alpha(theme.palette.background.default, 0.95)} 100%)`
          : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Contenu centré pour les formulaires d'authentification */}
      <Box
        component="main"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          flexGrow: 1,
          p: 3,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: '400px',
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: alpha(theme.palette.background.paper, 0.7),
            backdropFilter: 'blur(10px)',
            borderRadius: 4,
            boxShadow: `0 8px 32px 0 ${alpha(isDark ? '#000' : theme.palette.primary.dark, 0.1)}`,
            border: `1px solid ${alpha(isDark ? theme.palette.divider : theme.palette.background.paper, 0.5)}`,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
            }
          }}
        >
          {/* Logo ou titre de l'application */}
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{
              fontWeight: 'bold',
              mb: 4,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            ZENGEST
          </Typography>
          
          {/* Outlet pour rendre le contenu des routes enfants */}
          <Box sx={{ width: '100%' }}>
            <Outlet />
          </Box>
        </Paper>
      </Box>
      
      {/* Pied de page avec copyright */}
      <Box
        component="footer"
        sx={{
          py: 2,
          textAlign: 'center',
          background: alpha(theme.palette.background.paper, 0.7),
          backdropFilter: 'blur(10px)',
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Typography 
          variant="body2" 
          color="text.secondary"
        >
          ©{new Date().getFullYear()} ZENGEST
        </Typography>
      </Box>
    </Box>
  );
};

export default AuthLayout;