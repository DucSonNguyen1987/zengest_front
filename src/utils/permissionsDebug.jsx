import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Divider
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  BugReport as BugIcon
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { useAuth } from '../../hooks/useAuth';
import { useColorMode } from '../../context/ThemeContext';
import { 
  ROLES, 
  PERMISSIONS, 
  hasPermission, 
  hasRole, 
  canAccessRestaurantFeature 
} from '../../utils/permissions';

const PermissionsDebug = () => {
  const theme = useTheme();
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  const { user, isAuthenticated } = useAuth();

  // Test de toutes les permissions pour l'utilisateur actuel
  const permissionTests = Object.entries(PERMISSIONS).map(([permissionName, allowedRoles]) => ({
    permission: permissionName,
    allowedRoles,
    hasAccess: hasPermission(user?.role, permissionName),
    userRole: user?.role
  }));

  // Test des rôles
  const roleTests = Object.entries(ROLES).map(([roleName, roleValue]) => ({
    roleName,
    roleValue,
    hasRole: hasRole(user?.role, roleValue),
    isCurrentRole: user?.role === roleValue
  }));

  // Test des fonctionnalités restaurant
  const restaurantFeatures = [
    'reservation',
    'floorPlan', 
    'orders',
    'kitchen',
    'bar',
    'billing'
  ];

  const featureTests = restaurantFeatures.map(feature => ({
    feature,
    hasAccess: canAccessRestaurantFeature(user?.role, feature)
  }));

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* En-tête */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 700,
            color: theme.palette.primary.main,
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2
          }}
        >
          <BugIcon sx={{ fontSize: 40 }} />
          Debug des Permissions
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Diagnostic complet du système de permissions ZENGEST
        </Typography>
      </Box>

      {/* Informations utilisateur */}
      <Card 
        elevation={0}
        sx={{
          mb: 3,
          backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.7 : 0.8),
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon color="primary" />
            Informations Utilisateur
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">État d'authentification</Typography>
              <Chip 
                label={isAuthenticated ? 'Connecté' : 'Non connecté'}
                color={isAuthenticated ? 'success' : 'error'}
                icon={isAuthenticated ? <CheckIcon /> : <CancelIcon />}
                sx={{ mb: 2 }}
              />
              
              {user && (
                <>
                  <Typography variant="body2" color="text.secondary">Utilisateur</Typography>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {user.firstName} {user.lastName}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">Email</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {user.email}
                  </Typography>
                </>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              {user && (
                <>
                  <Typography variant="body2" color="text.secondary">Rôle actuel</Typography>
                  <Chip 
                    label={user.role}
                    color="primary"
                    sx={{ mb: 2, fontSize: '1rem', fontWeight: 'bold' }}
                  />
                  
                  <Typography variant="body2" color="text.secondary">ID Utilisateur</Typography>
                  <Typography variant="body1" sx={{ mb: 1, fontFamily: 'monospace' }}>
                    {user.id}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">Dernière connexion</Typography>
                  <Typography variant="body1">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Inconnue'}
                  </Typography>
                </>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tests détaillés */}
      <Box sx={{ mb: 3 }}>
        {/* Test des permissions */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SecurityIcon color="primary" />
              Test des Permissions ({permissionTests.filter(t => t.hasAccess).length}/{permissionTests.length})
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper} elevation={0}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Permission</TableCell>
                    <TableCell>Rôles autorisés</TableCell>
                    <TableCell>Votre rôle</TableCell>
                    <TableCell align="center">Accès</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {permissionTests.map((test) => (
                    <TableRow 
                      key={test.permission}
                      sx={{ 
                        backgroundColor: test.hasAccess 
                          ? alpha(theme.palette.success.main, 0.1)
                          : alpha(theme.palette.error.main, 0.1)
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {test.permission}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {test.allowedRoles.map(role => (
                            <Chip 
                              key={role}
                              label={role}
                              size="small"
                              color={role === test.userRole ? 'primary' : 'default'}
                              variant={role === test.userRole ? 'filled' : 'outlined'}
                            />
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={test.userRole || 'Non défini'}
                          size="small"
                          color={test.userRole ? 'primary' : 'default'}
                        />
                      </TableCell>
                      <TableCell align="center">
                        {test.hasAccess ? (
                          <CheckIcon color="success" />
                        ) : (
                          <CancelIcon color="error" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>

        {/* Test des rôles */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">
              Test des Rôles ({roleTests.filter(t => t.hasRole).length}/{roleTests.length})
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {roleTests.map((test) => (
                <Grid item xs={12} sm={6} md={4} key={test.roleName}>
                  <Card 
                    variant="outlined"
                    sx={{
                      backgroundColor: test.isCurrentRole 
                        ? alpha(theme.palette.primary.main, 0.1)
                        : 'transparent',
                      border: test.isCurrentRole 
                        ? `2px solid ${theme.palette.primary.main}`
                        : `1px solid ${theme.palette.divider}`
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {test.roleName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {test.roleValue}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip 
                          label={test.isCurrentRole ? 'Rôle actuel' : 'Autre rôle'}
                          size="small"
                          color={test.isCurrentRole ? 'primary' : 'default'}
                        />
                        {test.hasRole ? (
                          <CheckIcon color="success" />
                        ) : (
                          <CancelIcon color="error" />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Test des fonctionnalités restaurant */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">
              Fonctionnalités Restaurant ({featureTests.filter(t => t.hasAccess).length}/{featureTests.length})
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {featureTests.map((test) => (
                <Grid item xs={12} sm={6} md={4} key={test.feature}>
                  <Card variant="outlined">
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                          {test.feature}
                        </Typography>
                        {test.hasAccess ? (
                          <CheckIcon color="success" />
                        ) : (
                          <CancelIcon color="error" />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Résumé et recommandations */}
      <Card 
        elevation={0}
        sx={{
          backgroundColor: alpha(theme.palette.info.main, 0.1),
          border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom color="info.main">
            📊 Résumé des Accès
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">Permissions accordées</Typography>
              <Typography variant="h4" color="success.main">
                {permissionTests.filter(t => t.hasAccess).length}/{permissionTests.length}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">Fonctionnalités disponibles</Typography>
              <Typography variant="h4" color="primary.main">
                {featureTests.filter(t => t.hasAccess).length}/{featureTests.length}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="body2" color="text.secondary">Niveau d'accès</Typography>
              <Typography variant="h4" color="info.main">
                {Math.round((permissionTests.filter(t => t.hasAccess).length / permissionTests.length) * 100)}%
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Recommandations */}
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
            💡 Recommandations
          </Typography>
          
          {!isAuthenticated && (
            <Alert severity="error" sx={{ mb: 1 }}>
              Vous n'êtes pas connecté. Connectez-vous pour accéder aux fonctionnalités.
            </Alert>
          )}
          
          {isAuthenticated && !user?.role && (
            <Alert severity="warning" sx={{ mb: 1 }}>
              Aucun rôle défini. Contactez un administrateur pour vous attribuer un rôle.
            </Alert>
          )}
          
          {user?.role === 'guest' && (
            <Alert severity="info" sx={{ mb: 1 }}>
              Vous avez un accès limité en tant qu'invité. Demandez à un manager de vous attribuer plus de permissions.
            </Alert>
          )}
          
          {permissionTests.filter(t => t.hasAccess).length === 0 && isAuthenticated && (
            <Alert severity="error" sx={{ mb: 1 }}>
              Aucune permission accordée. Votre compte peut avoir un problème de configuration.
            </Alert>
          )}
          
          {permissionTests.filter(t => t.hasAccess).length > 0 && (
            <Alert severity="success">
              Vous avez accès à {permissionTests.filter(t => t.hasAccess).length} permissions sur {permissionTests.length}. 
              Votre compte fonctionne correctement !
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Informations de développement */}
      <Card 
        elevation={0}
        sx={{
          mt: 3,
          backgroundColor: alpha(theme.palette.warning.main, 0.1),
          border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom color="warning.main">
            🔧 Informations de Développement
          </Typography>
          
          <Typography variant="body2" paragraph>
            Cette page de debug est disponible uniquement en mode développement pour diagnostiquer 
            les problèmes de permissions. Elle affiche toutes les informations nécessaires pour 
            comprendre pourquoi un utilisateur peut ou ne peut pas accéder à certaines fonctionnalités.
          </Typography>
          
          <Typography variant="body2" paragraph>
            <strong>Mode actuel :</strong> {isDark ? 'Sombre' : 'Clair'}<br />
            <strong>Environnement :</strong> {import.meta.env.MODE}<br />
            <strong>Version permissions :</strong> Emergency Fix v1.0
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            En cas de problème, vérifiez que l'utilisateur a bien un rôle défini et que 
            ce rôle est inclus dans la liste des rôles autorisés pour la permission concernée.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PermissionsDebug;