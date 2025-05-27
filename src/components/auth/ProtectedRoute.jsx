import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography, Alert, Button } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { Lock as LockIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { hasRole, hasPermission } from '../../utils/permissions';
import { useColorMode } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

/**
 * Composant de protection des routes qui vérifie:
 * 1. Si l'utilisateur est authentifié
 * 2. Si l'utilisateur a le rôle requis (optionnel)
 * 3. Si l'utilisateur a la permission requise (optionnel)
 */
const ProtectedRoute = ({ 
  requiredRole, 
  requiredPermission, 
  children,
  fallbackPath = '/login',
  showUnauthorized = true 
}) => {
  const theme = useTheme();
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  const navigate = useNavigate();
  
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
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Vérifier si un rôle spécifique est requis et si l'utilisateur a ce rôle
  if (requiredRole && !hasRole(user.role, requiredRole)) {
    if (!showUnauthorized) {
      return <Navigate to="/unauthorized" replace />;
    }

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          p: 3,
          background: isDark
            ? `linear-gradient(135deg, ${alpha(theme.palette.error.dark, 0.1)} 0%, ${alpha(theme.palette.background.default, 0.95)} 100%)`
            : `linear-gradient(135deg, ${alpha(theme.palette.error.light, 0.05)} 0%, ${alpha(theme.palette.error.main, 0.02)} 100%)`,
        }}
      >
        <LockIcon 
          sx={{ 
            fontSize: 64, 
            color: theme.palette.error.main, 
            mb: 2 
          }} 
        />
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{
            fontWeight: 600,
            color: theme.palette.error.main,
            textAlign: 'center'
          }}
        >
          Accès non autorisé
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{
            textAlign: 'center',
            mb: 3,
            maxWidth: 400
          }}
        >
          Votre rôle actuel ({user?.role}) ne vous permet pas d'accéder à cette page. 
          Un rôle "{requiredRole}" est requis.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            Retour
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/dashboard')}
          >
            Tableau de bord
          </Button>
        </Box>
      </Box>
    );
  }

  // Vérifier si une permission spécifique est requise et si l'utilisateur a cette permission
  if (requiredPermission && !hasPermission(user.role, requiredPermission)) {
    if (!showUnauthorized) {
      return <Navigate to="/unauthorized" replace />;
    }

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          p: 3,
          background: isDark
            ? `linear-gradient(135deg, ${alpha(theme.palette.warning.dark, 0.1)} 0%, ${alpha(theme.palette.background.default, 0.95)} 100%)`
            : `linear-gradient(135deg, ${alpha(theme.palette.warning.light, 0.05)} 0%, ${alpha(theme.palette.warning.main, 0.02)} 100%)`,
        }}
      >
        <LockIcon 
          sx={{ 
            fontSize: 64, 
            color: theme.palette.warning.main, 
            mb: 2 
          }} 
        />
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{
            fontWeight: 600,
            color: theme.palette.warning.main,
            textAlign: 'center'
          }}
        >
          Permission insuffisante
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{
            textAlign: 'center',
            mb: 3,
            maxWidth: 400
          }}
        >
          Votre compte ne dispose pas des permissions nécessaires pour accéder à cette fonctionnalité.
        </Typography>
        
        <Alert 
          severity="info" 
          sx={{ 
            mb: 3, 
            maxWidth: 500,
            backgroundColor: alpha(theme.palette.info.main, 0.1)
          }}
        >
          <Typography variant="body2">
            <strong>Votre rôle :</strong> {user?.role}<br />
            <strong>Permission requise :</strong> {requiredPermission}<br />
            <strong>Contact :</strong> Contactez votre administrateur pour obtenir les permissions nécessaires.
          </Typography>
        </Alert>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            Retour
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/dashboard')}
          >
            Tableau de bord
          </Button>
        </Box>
      </Box>
    );
  }

  // Si toutes les vérifications sont passées, rendre le contenu protégé
  return children;
};

// Hook personnalisé pour faciliter les vérifications de permissions dans les composants
export const usePermissions = () => {
  const { user, isAuthenticated } = useAuth();

  const checkRole = (requiredRole) => {
    return isAuthenticated && hasRole(user?.role, requiredRole);
  };

  const checkPermission = (requiredPermission) => {
    return isAuthenticated && hasPermission(user?.role, requiredPermission);
  };

  const checkMultiplePermissions = (permissions = []) => {
    return permissions.every(permission => checkPermission(permission));
  };

  const checkAnyPermission = (permissions = []) => {
    return permissions.some(permission => checkPermission(permission));
  };

  return {
    user,
    isAuthenticated,
    checkRole,
    checkPermission,
    checkMultiplePermissions,
    checkAnyPermission,
    userRole: user?.role,
  };
};

export default ProtectedRoute;