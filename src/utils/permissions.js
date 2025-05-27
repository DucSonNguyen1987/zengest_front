// src/utils/permissions.js - VERSION OPTIMISÉE PERFORMANCE

// ✅ OPTIMISATION 1: Définition des rôles (inchangé)
export const ROLES = {
  ADMIN: 'admin',
  OWNER: 'owner',
  MANAGER: 'manager',
  STAFF_BAR: 'staff_bar',
  STAFF_FLOOR: 'staff_floor',
  STAFF_KITCHEN: 'staff_kitchen',
  GUEST: 'guest',
};

// ✅ OPTIMISATION 2: Hiérarchie des rôles (pour comparaisons rapides)
const ROLE_LEVELS = {
  [ROLES.ADMIN]: 1,
  [ROLES.OWNER]: 2,
  [ROLES.MANAGER]: 3,
  [ROLES.STAFF_BAR]: 4,
  [ROLES.STAFF_FLOOR]: 4,
  [ROLES.STAFF_KITCHEN]: 4,
  [ROLES.GUEST]: 5,
};

// ✅ OPTIMISATION 3: Permissions comme STRINGS (plus d'arrays)
export const PERMISSION_KEYS = {
  VIEW_USERS: 'VIEW_USERS',
  EDIT_USERS: 'EDIT_USERS',
  DELETE_USERS: 'DELETE_USERS',
  VIEW_PROJECTS: 'VIEW_PROJECTS',
  EDIT_PROJECTS: 'EDIT_PROJECTS',
  DELETE_PROJECTS: 'DELETE_PROJECTS',
  VIEW_REPORTS: 'VIEW_REPORTS',
  EDIT_SETTINGS: 'EDIT_SETTINGS',
  CREATE_RESERVATION: 'CREATE_RESERVATION',
  EDIT_RESERVATION: 'EDIT_RESERVATION',
  ACCESS_BACKOFFICE: 'ACCESS_BACKOFFICE',
};

// ✅ OPTIMISATION 4: Map de permissions pour accès O(1)
const PERMISSION_MAP = new Map([
  [PERMISSION_KEYS.VIEW_USERS, [ROLES.ADMIN, ROLES.OWNER]],
  [PERMISSION_KEYS.EDIT_USERS, [ROLES.ADMIN]],
  [PERMISSION_KEYS.DELETE_USERS, [ROLES.ADMIN]],
  [PERMISSION_KEYS.VIEW_PROJECTS, [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER, ROLES.STAFF_BAR, ROLES.STAFF_FLOOR, ROLES.STAFF_KITCHEN, ROLES.GUEST]],
  [PERMISSION_KEYS.EDIT_PROJECTS, [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER, ROLES.STAFF_BAR, ROLES.STAFF_FLOOR, ROLES.STAFF_KITCHEN]],
  [PERMISSION_KEYS.DELETE_PROJECTS, [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER]],
  [PERMISSION_KEYS.VIEW_REPORTS, [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER]],
  [PERMISSION_KEYS.EDIT_SETTINGS, [ROLES.ADMIN, ROLES.OWNER]],
  [PERMISSION_KEYS.CREATE_RESERVATION, [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER, ROLES.STAFF_BAR, ROLES.STAFF_FLOOR, ROLES.STAFF_KITCHEN, ROLES.GUEST]],
  [PERMISSION_KEYS.EDIT_RESERVATION, [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER, ROLES.STAFF_BAR, ROLES.STAFF_FLOOR, ROLES.STAFF_KITCHEN, ROLES.GUEST]],
  [PERMISSION_KEYS.ACCESS_BACKOFFICE, [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER, ROLES.STAFF_BAR, ROLES.STAFF_FLOOR, ROLES.STAFF_KITCHEN]],
]);

// ✅ OPTIMISATION 5: Cache des résultats pour éviter les recalculs
const permissionCache = new Map();
const CACHE_MAX_SIZE = 100;

// ✅ OPTIMISATION 6: Fonction hasPermission ultra-rapide
export const hasPermission = (userRole, permissionKey) => {
  // Validation rapide
  if (!userRole || !permissionKey) return false;
  
  // Admin a toujours accès (court-circuit ultra-rapide)
  if (userRole === ROLES.ADMIN) return true;
  
  // Vérification cache
  const cacheKey = `${userRole}-${permissionKey}`;
  if (permissionCache.has(cacheKey)) {
    return permissionCache.get(cacheKey);
  }
  
  // Calcul et mise en cache
  const allowedRoles = PERMISSION_MAP.get(permissionKey);
  const hasAccess = allowedRoles ? allowedRoles.includes(userRole) : false;
  
  // Nettoyer le cache si nécessaire
  if (permissionCache.size >= CACHE_MAX_SIZE) {
    const firstKey = permissionCache.keys().next().value;
    permissionCache.delete(firstKey);
  }
  
  permissionCache.set(cacheKey, hasAccess);
  return hasAccess;
};

// ✅ OPTIMISATION 7: Fonction hasRole optimisée
export const hasRole = (userRole, requiredRole) => {
  if (!userRole || !requiredRole) return false;
  if (userRole === ROLES.ADMIN) return true;
  
  const userLevel = ROLE_LEVELS[userRole];
  const requiredLevel = ROLE_LEVELS[requiredRole];
  
  return userLevel !== undefined && requiredLevel !== undefined && userLevel <= requiredLevel;
};

// ✅ OPTIMISATION 8: Fonctions utilitaires optimisées
export const isStaffType = (userRole, staffType) => {
  if (!userRole || !staffType) return false;
  
  switch (staffType) {
    case 'bar': return userRole === ROLES.STAFF_BAR;
    case 'floor': return userRole === ROLES.STAFF_FLOOR;
    case 'kitchen': return userRole === ROLES.STAFF_KITCHEN;
    case 'any': return [ROLES.STAFF_BAR, ROLES.STAFF_FLOOR, ROLES.STAFF_KITCHEN].includes(userRole);
    default: return false;
  }
};

// ✅ OPTIMISATION 9: Clear cache function pour les tests
export const clearPermissionCache = () => {
  permissionCache.clear();
};

// ✅ OPTIMISATION 10: Compatibilité avec l'ancien système
export const PERMISSIONS = PERMISSION_KEYS;