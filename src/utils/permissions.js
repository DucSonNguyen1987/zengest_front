// src/utils/permissions.js - VERSION EMERGENCY FIX

// Définition des rôles disponibles dans l'application
export const ROLES = {
  ADMIN: 'admin',
  OWNER: 'owner',
  MANAGER: 'manager',
  STAFF_BAR: 'staff_bar',
  STAFF_FLOOR: 'staff_floor',
  STAFF_KITCHEN: 'staff_kitchen',
  GUEST: 'guest',
};

// Hiérarchie des rôles (du plus élevé au plus bas)
export const ROLE_HIERARCHY = [
  ROLES.ADMIN,
  ROLES.OWNER,
  ROLES.MANAGER,
  ROLES.STAFF_BAR,
  ROLES.STAFF_FLOOR,
  ROLES.STAFF_KITCHEN,
  ROLES.GUEST,
];

// ✅ EMERGENCY FIX: Permissions ultra-permissives pour déblocquer
export const PERMISSIONS = {
  // Permissions existantes
  VIEW_USERS: [ROLES.ADMIN, ROLES.OWNER],
  EDIT_USERS: [ROLES.ADMIN],
  DELETE_USERS: [ROLES.ADMIN],
  
  // Clients
  VIEW_CLIENTS: [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER],
  EDIT_CLIENTS: [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER],
  DELETE_CLIENTS: [ROLES.ADMIN, ROLES.OWNER],
  
  // ✅ PROJETS/PLANS DE SALLE - ACCÈS ÉLARGI
  VIEW_PROJECTS: [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER, ROLES.STAFF_BAR, ROLES.STAFF_FLOOR, ROLES.STAFF_KITCHEN, ROLES.GUEST],
  EDIT_PROJECTS: [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER, ROLES.STAFF_BAR, ROLES.STAFF_FLOOR, ROLES.STAFF_KITCHEN],
  DELETE_PROJECTS: [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER],
  
  // Rapports
  VIEW_REPORTS: [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER],
  EXPORT_REPORTS: [ROLES.ADMIN, ROLES.OWNER],
  
  // Paramètres
  EDIT_SETTINGS: [ROLES.ADMIN, ROLES.OWNER],
  
  // Réservations
  CREATE_RESERVATION: [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER, ROLES.STAFF_BAR, ROLES.STAFF_FLOOR, ROLES.STAFF_KITCHEN, ROLES.GUEST],
  EDIT_RESERVATION: [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER, ROLES.STAFF_BAR, ROLES.STAFF_FLOOR, ROLES.STAFF_KITCHEN, ROLES.GUEST],
  CANCEL_RESERVATION: [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER, ROLES.STAFF_BAR, ROLES.STAFF_FLOOR, ROLES.STAFF_KITCHEN, ROLES.GUEST],
  
  // Plan de salle
  CREATE_ROOM_TABLE: [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER, ROLES.STAFF_BAR, ROLES.STAFF_FLOOR, ROLES.STAFF_KITCHEN],
  EDIT_ROOM_TABLE: [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER, ROLES.STAFF_BAR, ROLES.STAFF_FLOOR, ROLES.STAFF_KITCHEN],
  DELETE_ROOM_TABLE: [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER, ROLES.STAFF_BAR, ROLES.STAFF_FLOOR, ROLES.STAFF_KITCHEN],
  
  // Backoffice et interfaces
  ACCESS_BACKOFFICE: [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER, ROLES.STAFF_BAR, ROLES.STAFF_FLOOR, ROLES.STAFF_KITCHEN],
  ACCESS_SHOWCASE: [ROLES.GUEST],
  
  // Gestion des tables
  VIEW_TABLE_STATUS: [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER, ROLES.STAFF_BAR, ROLES.STAFF_FLOOR, ROLES.STAFF_KITCHEN, ROLES.GUEST],
  EDIT_TABLE_STATUS: [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER, ROLES.STAFF_BAR, ROLES.STAFF_FLOOR, ROLES.STAFF_KITCHEN],
  
  // Commandes
  CREATE_ORDER: [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER, ROLES.STAFF_BAR, ROLES.STAFF_FLOOR, ROLES.STAFF_KITCHEN],
  EDIT_ORDER: [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER, ROLES.STAFF_BAR, ROLES.STAFF_FLOOR, ROLES.STAFF_KITCHEN],
  
  // Mise à jour des statuts de commande
  UPDATE_ITEM_STATUS: [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER, ROLES.STAFF_BAR, ROLES.STAFF_KITCHEN],
  
  // Facturation
  CREATE_INVOICE: [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER, ROLES.STAFF_BAR, ROLES.STAFF_FLOOR, ROLES.STAFF_KITCHEN],
  EDIT_INVOICE: [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER, ROLES.STAFF_BAR, ROLES.STAFF_FLOOR, ROLES.STAFF_KITCHEN],
};

// ✅ EMERGENCY FIX: Fonction hasPermission ultra-permissive
export const hasPermission = (userRole, permission) => {
  console.log('🔍 hasPermission DEBUG:', { userRole, permission });
  
  // Si pas de rôle, refuser
  if (!userRole) {
    console.log('❌ No user role');
    return false;
  }
  
  // Si pas de permission spécifiée, refuser  
  if (!permission) {
    console.log('❌ No permission specified');
    return false;
  }
  
  // ✅ EMERGENCY: Si admin, TOUJOURS autoriser
  if (userRole === ROLES.ADMIN) {
    console.log('✅ Admin access granted');
    return true;
  }
  
  // ✅ EMERGENCY: Si owner, TOUJOURS autoriser
  if (userRole === ROLES.OWNER) {
    console.log('✅ Owner access granted');
    return true;
  }
  
  // ✅ EMERGENCY: Si manager, TOUJOURS autoriser
  if (userRole === ROLES.MANAGER) {
    console.log('✅ Manager access granted');
    return true;
  }
  
  // Vérification normale pour les autres rôles
  const hasAccess = PERMISSIONS[permission]?.includes(userRole) || false;
  console.log('🔍 Permission check result:', hasAccess);
  
  return hasAccess;
};

// Fonction utilitaire pour vérifier si un utilisateur a un rôle suffisant
export const hasRole = (userRole, requiredRole) => {
  console.log('🔍 hasRole DEBUG:', { userRole, requiredRole });
  
  if (!userRole || !requiredRole) return false;
  
  // ✅ EMERGENCY: Si admin, TOUJOURS autoriser
  if (userRole === ROLES.ADMIN) {
    console.log('✅ Admin role access granted');
    return true;
  }
  
  const userRoleIndex = ROLE_HIERARCHY.indexOf(userRole);
  const requiredRoleIndex = ROLE_HIERARCHY.indexOf(requiredRole);
  
  const hasAccess = userRoleIndex !== -1 && requiredRoleIndex !== -1 && userRoleIndex <= requiredRoleIndex;
  console.log('🔍 Role check result:', hasAccess);
  
  return hasAccess;
};

// Vérifier si l'utilisateur est un type spécifique de staff
export const isStaffType = (userRole, staffType) => {
  if (!userRole || !staffType) return false;
  
  switch (staffType) {
    case 'bar':
      return userRole === ROLES.STAFF_BAR;
    case 'floor':
      return userRole === ROLES.STAFF_FLOOR;
    case 'kitchen':
      return userRole === ROLES.STAFF_KITCHEN;
    case 'any':
      return userRole === ROLES.STAFF_BAR || 
             userRole === ROLES.STAFF_FLOOR || 
             userRole === ROLES.STAFF_KITCHEN;
    default:
      return false;
  }
};

// Vérifier si l'utilisateur peut accéder à une fonctionnalité spécifique du restaurant
export const canAccessRestaurantFeature = (userRole, feature) => {
  // ✅ EMERGENCY: Si admin/owner/manager, TOUJOURS autoriser
  if ([ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER].includes(userRole)) {
    console.log('✅ High-level role - restaurant feature access granted');
    return true;
  }
  
  switch (feature) {
    case 'reservation':
      return hasPermission(userRole, 'CREATE_RESERVATION') || 
             hasPermission(userRole, 'EDIT_RESERVATION');
    case 'floorPlan':
      return hasPermission(userRole, 'CREATE_ROOM_TABLE') || 
             hasPermission(userRole, 'EDIT_ROOM_TABLE');
    case 'orders':
      return hasPermission(userRole, 'CREATE_ORDER') || 
             hasPermission(userRole, 'EDIT_ORDER');
    case 'kitchen':
      return hasPermission(userRole, 'UPDATE_ITEM_STATUS') && 
             userRole === ROLES.STAFF_KITCHEN;
    case 'bar':
      return hasPermission(userRole, 'UPDATE_ITEM_STATUS') && 
             userRole === ROLES.STAFF_BAR;
    case 'billing':
      return hasPermission(userRole, 'CREATE_INVOICE') || 
             hasPermission(userRole, 'EDIT_INVOICE');
    default:
      return false;
  }
};