import React from 'react';
import { Box, Typography, Paper, Container } from '@mui/material';
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
        // Ajouter un pattern subtil en arrière-plan
        '&::before': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: isDark
            ? `radial-gradient(circle at 25% 25%, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 50%),
               radial-gradient(circle at 75% 75%, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 50%)`
            : `radial-gradient(circle at 25% 25%, ${alpha(theme.palette.primary.main, 0.05)} 0%, transparent 50%),
               radial-gradient(circle at 75% 75%, ${alpha(theme.palette.secondary.main, 0.05)} 0%, transparent 50%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }
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
          p: 2,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Container maxWidth="sm" sx={{ width: '100%' }}>
          <Paper
            elevation={0}
            sx={{
              width: '100%',
              maxWidth: '550px', // ✅ Largeur augmentée pour le nouveau LoginForm
              mx: 'auto',
              p: { xs: 3, sm: 4, md: 5 }, // ✅ Padding responsive plus généreux
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: alpha(theme.palette.background.paper, isDark ? 0.8 : 0.9),
              backdropFilter: 'blur(20px)',
              borderRadius: 3, // ✅ Bordures plus arrondies
              boxShadow: isDark
                ? `0 20px 60px ${alpha('#000', 0.3)}, 0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`
                : `0 20px 60px ${alpha(theme.palette.primary.dark, 0.15)}, 0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
              border: `1px solid ${alpha(isDark ? theme.palette.divider : theme.palette.background.paper, 0.5)}`,
              position: 'relative',
              overflow: 'hidden',
              // Effet de brillance subtile
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 1,
                background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, 0.5)}, transparent)`,
              },
              // Animation d'apparition
              animation: 'slideInUp 0.6s ease-out',
              '@keyframes slideInUp': {
                '0%': {
                  opacity: 0,
                  transform: 'translateY(30px)',
                },
                '100%': {
                  opacity: 1,
                  transform: 'translateY(0)',
                },
              },
            }}
          >
            {/* Logo et titre de l'application */}
            <Box sx={{ textAlign: 'center', mb: 4, width: '100%' }}>
              {/* Logo ou icône */}
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 3,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isDark
                    ? `0 8px 32px ${alpha(theme.palette.primary.main, 0.4)}`
                    : `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
                  animation: 'pulse 2s ease-in-out infinite alternate',
                  '@keyframes pulse': {
                    '0%': {
                      transform: 'scale(1)',
                      boxShadow: isDark
                        ? `0 8px 32px ${alpha(theme.palette.primary.main, 0.4)}`
                        : `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
                    },
                    '100%': {
                      transform: 'scale(1.05)',
                      boxShadow: isDark
                        ? `0 12px 40px ${alpha(theme.palette.primary.main, 0.6)}`
                        : `0 12px 40px ${alpha(theme.palette.primary.main, 0.5)}`,
                    },
                  },
                }}
              >
                <Typography 
                  variant="h3" 
                  sx={{ 
                    color: 'white', 
                    fontWeight: 'bold',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  Z
                </Typography>
              </Box>

              <Typography 
                variant="h3" 
                component="h1" 
                sx={{
                  fontWeight: 800,
                  mb: 1,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '-0.02em',
                }}
              >
                ZENGEST
              </Typography>
              
              <Typography 
                variant="h6" 
                sx={{ 
                  color: theme.palette.text.secondary,
                  fontWeight: 400,
                  fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                  letterSpacing: '0.02em',
                }}
              >
                Système de gestion restaurant
              </Typography>
            </Box>
            
            {/* Outlet pour rendre le contenu des routes enfants */}
            <Box sx={{ width: '100%' }}>
              <Outlet />
            </Box>
          </Paper>
        </Container>
      </Box>
      
      {/* Pied de page avec copyright et informations */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          textAlign: 'center',
          background: alpha(theme.palette.background.paper, isDark ? 0.8 : 0.9),
          backdropFilter: 'blur(10px)',
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            mb: 1,
            fontSize: '0.875rem',
          }}
        >
          ©{new Date().getFullYear()} ZENGEST - Gestion de restaurant moderne
        </Typography>
        <Typography 
          variant="caption" 
          color="text.secondary"
          sx={{ 
            fontSize: '0.75rem',
            opacity: 0.7,
          }}
        >
          Version 1.0.0 • Mode développement avec données de test
        </Typography>
      </Box>
    </Box>
  );
};

export default AuthLayout;