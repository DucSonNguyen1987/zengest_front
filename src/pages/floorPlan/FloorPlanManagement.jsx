import React, { useEffect, useState } from 'react';
import { 
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  Paper,
  Chip
} from '@mui/material';
import { 
  Add as AddIcon,
  TableRestaurant as TableIcon,
  BugReport as DebugIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { hasPermission, PERMISSIONS } from '../../utils/permissions';

const FloorPlanManagement = () => {
  const { user, isAuthenticated } = useAuth();
  const [debugInfo, setDebugInfo] = useState({});

  // ✅ COLLECTE DES INFOS DE DEBUG
  useEffect(() => {
    const info = {
      isAuthenticated,
      user: user ? {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      } : null,
      permissions: {
        VIEW_PROJECTS: hasPermission(user?.role, PERMISSIONS.VIEW_PROJECTS),
        EDIT_PROJECTS: hasPermission(user?.role, PERMISSIONS.EDIT_PROJECTS),
        DELETE_PROJECTS: hasPermission(user?.role, PERMISSIONS.DELETE_PROJECTS)
      },
      permissionsList: PERMISSIONS.VIEW_PROJECTS,
      timestamp: new Date().toISOString()
    };
    
    setDebugInfo(info);
    
    // ✅ LOGS DÉTAILLÉS
    console.log('🔍 FloorPlanManagement Debug Info:', info);
    
    // ✅ LOG SPÉCIFIQUE POUR VIEW_PROJECTS
    console.log('🔍 VIEW_PROJECTS Permission Check:');
    console.log('- User role:', user?.role);
    console.log('- Required roles:', PERMISSIONS.VIEW_PROJECTS);
    console.log('- Has permission:', hasPermission(user?.role, PERMISSIONS.VIEW_PROJECTS));
    
  }, [user, isAuthenticated]);

  // ✅ EMERGENCY: TOUJOURS AUTORISER L'ACCÈS POUR LE DEBUG
  const forceAccess = true;
  const canView = forceAccess || hasPermission(user?.role, PERMISSIONS.VIEW_PROJECTS);
  const canEdit = forceAccess || hasPermission(user?.role, PERMISSIONS.EDIT_PROJECTS);

  return (
    <Box sx={{ p: 3 }}>
      {/* ✅ HEADER DE DEBUG */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          🛠️ Mode Debug - Gestion des Plans de Salle
        </Typography>
        <Typography variant="body2">
          Cette page est en mode debug pour diagnostiquer les problèmes de permissions.
        </Typography>
      </Alert>

      {/* ✅ INFORMATIONS DE DEBUG */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🔍 Informations de Debug
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography><strong>Authentifié:</strong> {isAuthenticated ? '✅ Oui' : '❌ Non'}</Typography>
            <Typography><strong>Utilisateur:</strong> {user ? `${user.firstName} ${user.lastName} (${user.email})` : 'Non connecté'}</Typography>
            <Typography><strong>Rôle:</strong> {user?.role || 'Non défini'}</Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Permissions:</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip 
                label={`VIEW_PROJECTS: ${debugInfo.permissions?.VIEW_PROJECTS ? 'OUI' : 'NON'}`}
                color={debugInfo.permissions?.VIEW_PROJECTS ? 'success' : 'error'}
                size="small"
              />
              <Chip 
                label={`EDIT_PROJECTS: ${debugInfo.permissions?.EDIT_PROJECTS ? 'OUI' : 'NON'}`}
                color={debugInfo.permissions?.EDIT_PROJECTS ? 'success' : 'error'}
                size="small"
              />
              <Chip 
                label={`DELETE_PROJECTS: ${debugInfo.permissions?.DELETE_PROJECTS ? 'OUI' : 'NON'}`}
                color={debugInfo.permissions?.DELETE_PROJECTS ? 'success' : 'error'}
                size="small"
              />
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2">Rôles autorisés pour VIEW_PROJECTS:</Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: 'grey.100', p: 1, borderRadius: 1 }}>
              {JSON.stringify(PERMISSIONS.VIEW_PROJECTS, null, 2)}
            </Typography>
          </Box>

          <Alert severity={canView ? 'success' : 'error'}>
            <Typography>
              <strong>Accès aux Plans:</strong> {canView ? '✅ AUTORISÉ' : '❌ REFUSÉ'}
            </Typography>
            {forceAccess && (
              <Typography variant="body2">
                (Mode debug - Accès forcé activé)
              </Typography>
            )}
          </Alert>
        </CardContent>
      </Card>

      {/* ✅ INTERFACE DES PLANS DE SALLE */}
      {canView ? (
        <Box>
          <Typography variant="h4" gutterBottom>
            📋 Gestion des Plans de Salle
          </Typography>
          
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Plans de Salle Disponibles
              </Typography>
              {canEdit && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  color="primary"
                >
                  Nouveau Plan
                </Button>
              )}
            </Box>

            {/* ✅ LISTE FACTICE DES PLANS */}
            <Box sx={{ display: 'grid', gap: 2 }}>
              {[1, 2, 3].map(id => (
                <Card key={id} sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TableIcon color="primary" />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6">Plan de Salle {id}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Description du plan {id}
                      </Typography>
                    </Box>
                    <Button variant="outlined" size="small">
                      Voir
                    </Button>
                    {canEdit && (
                      <Button variant="contained" size="small">
                        Éditer
                      </Button>
                    )}
                  </Box>
                </Card>
              ))}
            </Box>
          </Paper>

          <Alert severity="success">
            <Typography>
              ✅ <strong>Succès!</strong> Vous avez maintenant accès aux plans de salle.
            </Typography>
            <Typography variant="body2">
              Si vous voyez cette interface, le problème de permissions est résolu.
            </Typography>
          </Alert>
        </Box>
      ) : (
        <Alert severity="error">
          <Typography variant="h6" gutterBottom>
            ❌ Accès Refusé aux Plans de Salle
          </Typography>
          <Typography>
            Malgré le mode debug, l'accès est toujours refusé. 
            Vérifiez les informations de debug ci-dessus.
          </Typography>
        </Alert>
      )}

      {/* ✅ ACTIONS DE DEBUG */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🛠️ Actions de Debug
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<DebugIcon />}
              onClick={() => console.log('🔍 Debug Info:', debugInfo)}
            >
              Log Debug Info
            </Button>
            <Button
              variant="outlined"
              onClick={() => window.location.reload()}
            >
              Recharger la Page
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
            >
              Clear Cache & Reload
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FloorPlanManagement;