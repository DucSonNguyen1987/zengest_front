// src/hooks/useOptimizedPermissions.js - HOOK OPTIMISÉ PERFORMANCE

import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { hasPermission, hasRole, PERMISSION_KEYS, ROLES } from '../utils/permissions';

/**
 * Hook optimisé pour les permissions avec mémorisation
 * ✅ SOLUTION: Évite les appels répétés à hasPermission
 */
export const useOptimizedPermissions = () => {
  const { user } = useAuth();
  const userRole = user?.role;

  // ✅ OPTIMISATION 1: Mémoriser toutes les permissions fréquemment utilisées
  const permissions = useMemo(() => {
    if (!userRole) {
      return {
        canViewProjects: false,
        canEditProjects: false,
        canDeleteProjects: false,
        canViewUsers: false,
        canEditUsers: false,
        canDeleteUsers: false,
        canViewReports: false,
        canEditSettings: false,
        canCreateReservation: false,
        canEditReservation: false,
        canAccessBackoffice: false,
        isAdmin: false,
        isOwner: false,
        isManager: false,
        isStaff: false,
        isGuest: false,
      };
    }

    return {
      // Permissions projets/plans de salle
      canViewProjects: hasPermission(userRole, PERMISSION_KEYS.VIEW_PROJECTS),
      canEditProjects: hasPermission(userRole, PERMISSION_KEYS.EDIT_PROJECTS),
      canDeleteProjects: hasPermission(userRole, PERMISSION_KEYS.DELETE_PROJECTS),
      
      // Permissions utilisateurs
      canViewUsers: hasPermission(userRole, PERMISSION_KEYS.VIEW_USERS),
      canEditUsers: hasPermission(userRole, PERMISSION_KEYS.EDIT_USERS),
      canDeleteUsers: hasPermission(userRole, PERMISSION_KEYS.DELETE_USERS),
      
      // Autres permissions
      canViewReports: hasPermission(userRole, PERMISSION_KEYS.VIEW_REPORTS),
      canEditSettings: hasPermission(userRole, PERMISSION_KEYS.EDIT_SETTINGS),
      canCreateReservation: hasPermission(userRole, PERMISSION_KEYS.CREATE_RESERVATION),
      canEditReservation: hasPermission(userRole, PERMISSION_KEYS.EDIT_RESERVATION),
      canAccessBackoffice: hasPermission(userRole, PERMISSION_KEYS.ACCESS_BACKOFFICE),
      
      // Rôles
      isAdmin: userRole === ROLES.ADMIN,
      isOwner: userRole === ROLES.OWNER,
      isManager: userRole === ROLES.MANAGER,
      isStaff: [ROLES.STAFF_BAR, ROLES.STAFF_FLOOR, ROLES.STAFF_KITCHEN].includes(userRole),
      isGuest: userRole === ROLES.GUEST,
    };
  }, [userRole]); // ✅ CRITIQUE: Se re-calcule SEULEMENT si le rôle change

  // ✅ OPTIMISATION 2: Fonctions helper mémorisées
  const checkPermission = useMemo(() => 
    (permissionKey) => hasPermission(userRole, permissionKey),
    [userRole]
  );

  const checkRole = useMemo(() => 
    (requiredRole) => hasRole(userRole, requiredRole),
    [userRole]
  );

  const checkMultiplePermissions = useMemo(() => 
    (permissionKeys) => permissionKeys.every(key => hasPermission(userRole, key)),
    [userRole]
  );

  const checkAnyPermission = useMemo(() => 
    (permissionKeys) => permissionKeys.some(key => hasPermission(userRole, key)),
    [userRole]
  );

  return {
    ...permissions,
    userRole,
    user,
    
    // Fonctions helper (pour cas spéciaux)
    checkPermission,
    checkRole,
    checkMultiplePermissions,
    checkAnyPermission,
  };
};

/**
 * Hook spécialisé pour FloorPlan (évite la re-création d'objets)
 */
export const useFloorPlanPermissions = () => {
  const { user } = useAuth();
  const userRole = user?.role;

  return useMemo(() => ({
    canView: hasPermission(userRole, PERMISSION_KEYS.VIEW_PROJECTS),
    canEdit: hasPermission(userRole, PERMISSION_KEYS.EDIT_PROJECTS),
    canDelete: hasPermission(userRole, PERMISSION_KEYS.DELETE_PROJECTS),
    canAccessBackoffice: hasPermission(userRole, PERMISSION_KEYS.ACCESS_BACKOFFICE),
  }), [userRole]);
};

/**
 * Hook pour les permissions admin
 */
export const useAdminPermissions = () => {
  const { user } = useAuth();
  const userRole = user?.role;

  return useMemo(() => ({
    canViewUsers: hasPermission(userRole, PERMISSION_KEYS.VIEW_USERS),
    canEditUsers: hasPermission(userRole, PERMISSION_KEYS.EDIT_USERS),
    canDeleteUsers: hasPermission(userRole, PERMISSION_KEYS.DELETE_USERS),
    canEditSettings: hasPermission(userRole, PERMISSION_KEYS.EDIT_SETTINGS),
    canViewReports: hasPermission(userRole, PERMISSION_KEYS.VIEW_REPORTS),
    isAdmin: userRole === ROLES.ADMIN,
    isOwner: userRole === ROLES.OWNER,
  }), [userRole]);
};

export default useOptimizedPermissions;