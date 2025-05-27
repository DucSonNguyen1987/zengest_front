import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent,
  Paper,
  alpha,
  useTheme
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { 
  People as PeopleIcon, 
  Business as ProjectIcon, 
  Assessment as ReportIcon,
  Restaurant as RestaurantIcon,
  TableBar as TableIcon,
  EventSeat as ReservationIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { hasPermission } from '../../utils/permissions';
import { useColorMode } from '../../context/ThemeContext';
import { FloorPlanStatus } from '../../components/floorPlan/FloorPlanQuickActions';

const Dashboard = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const { mode } = useColorMode();
  const isDark = mode === 'dark';

  // Composant pour les cartes statistiques
  const StatCard = ({ title, value, icon: IconComponent, color = 'primary' }) => (
    <Card 
      elevation={0}
      sx={{
        height: '100%',
        background: isDark 
          ? `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.1)}, ${alpha(theme.palette[color].main, 0.2)})`
          : `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.05)}, ${alpha(theme.palette[color].main, 0.1)})`,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
        borderRadius: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: isDark 
            ? `0 8px 32px ${alpha(theme.palette[color].main, 0.3)}`
            : `0 8px 32px ${alpha(theme.palette[color].main, 0.2)}`,
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700,
                color: theme.palette[color].main,
                mb: 1
              }}
            >
              {value}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: theme.palette.text.secondary,
                fontWeight: 500
              }}
            >
              {title}
            </Typography>
          </Box>
          <Box
            sx={{
              p: 2,
              borderRadius: '50%',
              backgroundColor: alpha(theme.palette[color].main, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <IconComponent 
              sx={{ 
                fontSize: 32, 
                color: theme.palette[color].main 
              }} 
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* En-tête du tableau de bord */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: 1,
            background: isDark 
              ? `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
              : `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Tableau de bord
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: theme.palette.text.secondary,
            fontWeight: 400
          }}
        >
          Bienvenue, {user?.firstName} {user?.lastName} ({user?.role})
        </Typography>
      </Box>
      
      {/* Cartes statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Statistiques pour le restaurant */}
        <Grid xs={12} sm={6} md={3}>
          <StatCard
            title="Tables"
            value="24"
            icon={TableIcon}
            color="primary"
          />
        </Grid>
        
        <Grid xs={12} sm={6} md={3}>
          <StatCard
            title="Réservations"
            value="18"
            icon={ReservationIcon}
            color="success"
          />
        </Grid>
        
        <Grid xs={12} sm={6} md={3}>
          <StatCard
            title="Commandes"
            value="42"
            icon={RestaurantIcon}
            color="warning"
          />
        </Grid>

        {/* Statistiques conditionnelles selon les permissions */}
        {hasPermission(user?.role, 'VIEW_USERS') && (
          <Grid xs={12} sm={6} md={3}>
            <StatCard
              title="Personnel"
              value="12"
              icon={PeopleIcon}
              color="info"
            />
          </Grid>
        )}
        
        {hasPermission(user?.role, 'VIEW_PROJECTS') && (
          <Grid xs={12} sm={6} md={3}>
            <StatCard
              title="Plans de salle"
              value="3"
              icon={ProjectIcon}
              color="secondary"
            />
            <FloorPlanStatus />
          </Grid>
        )}
        
        {hasPermission(user?.role, 'VIEW_REPORTS') && (
          <Grid xs={12} sm={6} md={3}>
            <StatCard
              title="Rapports"
              value="8"
              icon={ReportIcon}
              color="error"
            />
          </Grid>
        )}
      </Grid>
      
      {/* Contenu supplémentaire du tableau de bord */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.7 : 0.8),
          backdropFilter: 'blur(10px)',
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 2,
            color: theme.palette.text.primary,
            fontWeight: 600
          }}
        >
          Aperçu de l'activité
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: theme.palette.text.secondary,
            lineHeight: 1.6
          }}
        >
          Contenu personnalisé selon le rôle de l'utilisateur: <strong>{user?.role}</strong>
        </Typography>
        
        {/* Zone pour ajouter des graphiques, tableaux, etc. */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Ici vous pouvez ajouter des graphiques, des tableaux de données en temps réel, 
            des notifications importantes, etc.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Dashboard;