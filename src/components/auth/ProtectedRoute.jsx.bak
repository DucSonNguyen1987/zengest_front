import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { useAuth } from '../../hooks/useAuth';
import { hasRole } from '../../utils/permissions';
import { useColorMode } from '../../context/ThemeContext';

/**
 * Composant de protection des routes qui vérifie:
 * 1. Si l'utilisateur est authentifié
 * 2. Si l'utilisateur a le rôle requis (optionnel)
 */
const ProtectedRoute = ({ requiredRole, children }) => {
  const theme = useTheme();
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  
  // Récupération des données d'authentification
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Afficher un loader pendant le chargement des données d'authentification
  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          background: isDark
            ? `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.15)} 0%, ${alpha(theme.palette.background.default, 0.95)} 100%)`
            : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
        }}
      >
        <CircularProgress 
          size={50} 
          thickness={4}
          sx={{ 
            color: theme.palette.primary.main,
            mb: 2
          }}
        />
        <Typography 
          variant="h6" 
          color="textSecondary"
          sx={{
            fontWeight: 500,
            color: theme.palette.text.secondary
          }}
        >
          Chargement...
        </Typography>
      </Box>
    );
  }

  // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
  if (!isAuthenticated) {
    // On conserve l'URL demandée pour y rediriger après connexion
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Vérifier si un rôle spécifique est requis et si l'utilisateur a ce rôle
  if (requiredRole && !hasRole(user.role, requiredRole)) {
    // Rediriger vers une page "non autorisé" si l'utilisateur n'a pas le rôle requis
    return <Navigate to="/unauthorized" replace />;
  }

  // Si toutes les vérifications sont passées, rendre le contenu protégé
  return children;
};

export default ProtectedRoute;