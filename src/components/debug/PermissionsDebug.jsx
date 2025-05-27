// src/components/debug/PermissionsDebug.jsx
import React from 'react';
import { Box, Typography, Card, CardContent, Button, Alert } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { hasPermission, PERMISSIONS, ROLES } from '../../utils/permissions';
import { useNavigate } from 'react-router-dom';

const PermissionsDebug = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const checkAllPermissions = () => {
    const permissions = Object.keys(PERMISSIONS);
    return permissions.map(perm => ({
      permission: perm,
      hasAccess: hasPermission(user?.role, PERMISSIONS[perm])
    }));
  };

  const permissionResults = checkAllPermissions();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        🔍 Debug des Permissions
      </Typography>
      
      {/* Informations utilisateur */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            👤 Informations Utilisateur
          </Typography>
          <Typography><strong>Authentifié:</strong> {isAuthenticated ? '✅ Oui' : '❌ Non'}</Typography>
          <Typography><strong>Email:</strong> {user?.email || 'Non disponible'}</Typography>
          <Typography><strong>Nom:</strong> {user?.firstName} {user?.lastName}</Typography>
          <Typography><strong>Rôle:</strong> {user?.role || 'Non défini'}</Typography>
          <Typography><strong>ID:</strong> {user?.id || 'Non disponible'}</Typography>
        </CardContent>
      </Card>

      {/* Test accès direct */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🚀 Tests d'Accès Direct
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              onClick={() => navigate('/floor-plans')}
              color="primary"
            >
              Accéder aux Plans de Salle
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/dashboard')}
            >
              Retour Dashboard
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => window.location.reload()}
            >
              Recharger la Page
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Vérification permissions */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🔐 Vérification des Permissions
          </Typography>
          
          {/* Permission spécifique VIEW_PROJECTS */}
          <Alert 
            severity={hasPermission(user?.role, PERMISSIONS.VIEW_PROJECTS) ? 'success' : 'error'}
            sx={{ mb: 2 }}
          >
            <Typography>
              <strong>VIEW_PROJECTS:</strong> {hasPermission(user?.role, PERMISSIONS.VIEW_PROJECTS) ? '✅ Autorisé' : '❌ Refusé'}
            </Typography>
            <Typography variant="body2">
              Rôles autorisés: {PERMISSIONS.VIEW_PROJECTS?.join(', ') || 'Aucun'}
            </Typography>
          </Alert>

          {/* Toutes les permissions */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 1 }}>
            {permissionResults.map(({ permission, hasAccess }) => (
              <Box key={permission} sx={{ 
                p: 1, 
                bgcolor: hasAccess ? 'success.light' : 'error.light',
                borderRadius: 1,
                color: hasAccess ? 'success.contrastText' : 'error.contrastText'
              }}>
                <Typography variant="body2">
                  {hasAccess ? '✅' : '❌'} {permission}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Rôles disponibles */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📋 Rôles Disponibles
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {Object.values(ROLES).map(role => (
              <Box key={role} sx={{ 
                p: 1, 
                bgcolor: user?.role === role ? 'primary.light' : 'grey.200',
                borderRadius: 1,
                color: user?.role === role ? 'primary.contrastText' : 'text.primary'
              }}>
                <Typography variant="body2">
                  {user?.role === role ? '👤' : '👥'} {role}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PermissionsDebug;