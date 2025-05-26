// src/hooks/useIcons.js
import { useMemo } from 'react';
import {
  // Navigation et actions
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  
  // Restaurant spécifique
  Restaurant as RestaurantIcon,
  TableBar as TableIcon,
  EventSeat as ReservationIcon,
  LocalDining as DiningIcon,
  Kitchen as KitchenIcon,
  
  // Utilisateurs et permissions
  People as PeopleIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  SupervisorAccount as ManagerIcon,
  
  // Interface
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Assessment as ReportIcon,
  Business as ProjectIcon,
  Visibility as ViewIcon,
  VisibilityOff as HideIcon,
  
  // États et statuts
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  
  // Navigation
  ArrowBack as BackIcon,
  ArrowForward as ForwardIcon,
  Menu as MenuIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';

/**
 * Hook personnalisé pour gérer les icônes de l'application
 * Évite les conflits de nommage et centralise la gestion des icônes
 */
export const useIcons = () => {
  const icons = useMemo(() => ({
    // Actions communes
    action: {
      add: AddIcon,
      edit: EditIcon,
      delete: DeleteIcon,
      save: SaveIcon,
      cancel: CancelIcon,
      close: CloseIcon,
      search: SearchIcon,
      refresh: RefreshIcon,
    },
    
    // Restaurant
    restaurant: {
      general: RestaurantIcon,
      table: TableIcon,
      reservation: ReservationIcon,
      dining: DiningIcon,
      kitchen: KitchenIcon,
    },
    
    // Utilisateurs
    user: {
      people: PeopleIcon,
      person: PersonIcon,
      admin: AdminIcon,
      manager: ManagerIcon,
    },
    
    // Interface
    ui: {
      dashboard: DashboardIcon,
      settings: SettingsIcon,
      report: ReportIcon,
      project: ProjectIcon,
      view: ViewIcon,
      hide: HideIcon,
    },
    
    // États
    status: {
      success: SuccessIcon,
      error: ErrorIcon,
      warning: WarningIcon,
      info: InfoIcon,
    },
    
    // Navigation
    nav: {
      back: BackIcon,
      forward: ForwardIcon,
      menu: MenuIcon,
      more: MoreIcon,
    }
  }), []);

  // Fonction helper pour obtenir une icône par chemin
  const getIcon = (path) => {
    const keys = path.split('.');
    let icon = icons;
    
    for (const key of keys) {
      icon = icon[key];
      if (!icon) {
        console.warn(`Icon not found at path: ${path}`);
        return null;
      }
    }
    
    return icon;
  };

  // Fonction helper pour obtenir des icônes par rôle utilisateur
  const getIconByRole = (role) => {
    const roleIcons = {
      admin: icons.user.admin,
      owner: icons.user.manager,
      manager: icons.user.manager,
      staff_bar: icons.restaurant.kitchen,
      staff_floor: icons.restaurant.dining,
      staff_kitchen: icons.restaurant.kitchen,
      guest: icons.user.person,
    };
    
    return roleIcons[role] || icons.user.person;
  };

  // Fonction helper pour obtenir des icônes par statut
  const getIconByStatus = (status) => {
    const statusIcons = {
      success: icons.status.success,
      completed: icons.status.success,
      active: icons.status.success,
      error: icons.status.error,
      failed: icons.status.error,
      cancelled: icons.status.error,
      warning: icons.status.warning,
      pending: icons.status.warning,
      info: icons.status.info,
      default: icons.status.info,
    };
    
    return statusIcons[status] || icons.status.info;
  };

  return {
    icons,
    getIcon,
    getIconByRole,
    getIconByStatus,
  };
};

// Hook spécialisé pour les icônes de restaurant
export const useRestaurantIcons = () => {
  const { icons } = useIcons();
  
  const getTableStatusIcon = (status) => {
    switch (status) {
      case 'free':
        return icons.status.success;
      case 'occupied':
        return icons.status.error;
      case 'reserved':
        return icons.status.warning;
      case 'maintenance':
        return icons.status.info;
      default:
        return icons.restaurant.table;
    }
  };

  const getOrderStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return icons.status.warning;
      case 'preparing':
        return icons.restaurant.kitchen;
      case 'ready':
        return icons.status.success;
      case 'served':
        return icons.status.success;
      case 'cancelled':
        return icons.status.error;
      default:
        return icons.restaurant.dining;
    }
  };

  return {
    ...icons.restaurant,
    getTableStatusIcon,
    getOrderStatusIcon,
  };
};

// Exemple d'utilisation dans un composant :
/*
import { useIcons } from '../hooks/useIcons';

const MyComponent = () => {
  const { icons, getIconByRole, getIconByStatus } = useIcons();
  
  return (
    <Box>
      <Button startIcon={<icons.action.add />}>
        Ajouter
      </Button>
      
      <IconButton>
        <icons.ui.settings />
      </IconButton>
      
      {user && (
        <Box>
          {React.createElement(getIconByRole(user.role))}
        </Box>
      )}
      
      <Chip
        icon={React.createElement(getIconByStatus('success'))}
        label="Terminé"
      />
    </Box>
  );
};
*/