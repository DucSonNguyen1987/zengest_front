// Définition des rôles disponibles dans l'application
// Sous-catégories pour le rôle STAFF: BAR, FLOOR, KITCHEN
export const ROLES = {
  ADMIN: 'admin',
  OWNER: 'owner',
  MANAGER: 'manager',
  STAFF_BAR: 'staff_bar',       // Staff du bar
  STAFF_FLOOR: 'staff_floor',   // Staff en salle
  STAFF_KITCHEN: 'staff_kitchen', // Staff en cuisine
  GUEST: 'guest',
};

// Hiérarchie des rôles (du plus élevé au plus bas)
// Cette hiérarchie permet de vérifier si un rôle a les privilèges suffisants
export const ROLE_HIERARCHY = [
  ROLES.ADMIN,
  ROLES.OWNER,
  ROLES.MANAGER,
  ROLES.STAFF_BAR,
  ROLES.STAFF_FLOOR,
  ROLES.STAFF_KITCHEN,
  ROLES.GUEST,
];

// Définition des permissions par fonctionnalité avec les nouvelles permissions
export const PERMISSIONS = {
  // Permissions existantes
  VIEW_USERS: [ROLES.ADMIN, ROLES.OWNER],
  EDIT_USERS: [ROLES.ADMIN],
  DELETE_USERS: [ROLES.ADMIN],
  
  // Clients
  VIEW_CLIENTS: [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER],
  EDIT_CLIENTS: [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER],
  DELETE_CLIENTS: [ROLES.ADMIN, ROLES.OWNER],
  
  // Projets
  VIEW_PROJECTS: [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER, ROLES.STAFF_BAR, ROLES.STAFF_FLOOR, ROLES.STAFF_KITCHEN],
  EDIT_PROJECTS: [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER],
  DELETE_PROJECTS: [ROLES.ADMIN, ROLES.OWNER],
  
  // Rapports
  VIEW_REPORTS: [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER],
  EXPORT_REPORTS: [ROLES.ADMIN, ROLES.OWNER],
  
  // Paramètres
  EDIT_SETTINGS: [ROLES.ADMIN, ROLES.OWNER],
  
  // Nouvelles permissions pour le restaurant
  
  // Réservations
  CREATE_RESERVATION: [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER, ROLES.STAFF_BAR, ROLES.STAFF_FLOOR, ROLES.STAFF_KITCHEN, ROLES.GUEST],
  EDIT_RESERVATION: [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER, ROLES.STAFF_BAR, ROLES.STAFF_FLOOR, ROLES.STAFF_KITCHEN, ROLES.GUEST],
  CANCEL_RESERVATION: [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER, ROLES.STAFF_BAR, ROLES.STAFF_FLOOR, ROLES.STAFF_KITCHEN, ROLES.GUEST],
  
  // Plan de salle
  CREATE_ROOM_TABLE: [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER],
  EDIT_ROOM_TABLE: [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER],
  DELETE_ROOM_TABLE: [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER],
  
  // Backoffice et interfaces
  ACCESS_BACKOFFICE: [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER, ROLES.STAFF_BAR, ROLES.STAFF_FLOOR, ROLES.STAFF_KITCHEN],
  ACCESS_SHOWCASE: [ROLES.GUEST], // Site vitrine
  
  // Gestion des tables
  VIEW_TABLE_STATUS: [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER, ROLES.STAFF_BAR, ROLES.STAFF_FLOOR, ROLES.STAFF_KITCHEN],
  EDIT_TABLE_STATUS: [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER, ROLES.STAFF_BAR, ROLES.STAFF_FLOOR],
  
  // Commandes
  CREATE_ORDER: [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER, ROLES.STAFF_BAR, ROLES.STAFF_FLOOR],
  EDIT_ORDER: [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER, ROLES.STAFF_BAR, ROLES.STAFF_FLOOR],
  
  // Mise à jour des statuts de commande
  UPDATE_ITEM_STATUS: [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER, ROLES.STAFF_BAR, ROLES.STAFF_KITCHEN],
  
  // Facturation
  CREATE_INVOICE: [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER, ROLES.STAFF_BAR, ROLES.STAFF_FLOOR],
  EDIT_INVOICE: [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER, ROLES.STAFF_BAR, ROLES.STAFF_FLOOR],
};



// Fonction utilitaire pour vérifier si un utilisateur a une permission spécifique
// Exemple: hasPermission('admin', 'EDIT_USERS') => true
export const hasPermission = (userRole, permission) => {
  if (!userRole || !permission) return false;
  return PERMISSIONS[permission]?.includes(userRole) || false;
};

// Fonction utilitaire pour vérifier si un utilisateur a un rôle suffisant
// selon la hiérarchie des rôles
// Exemple: hasRole('admin', 'manager') => true (un admin peut faire tout ce que peut faire un manager)
export const hasRole = (userRole, requiredRole) => {
  if (!userRole || !requiredRole) return false;
  const userRoleIndex = ROLE_HIERARCHY.indexOf(userRole);
  const requiredRoleIndex = ROLE_HIERARCHY.indexOf(requiredRole);
  
  // Plus l'index est petit, plus le rôle est élevé dans la hiérarchie
  return userRoleIndex !== -1 && requiredRoleIndex !== -1 && userRoleIndex <= requiredRoleIndex;
};

// src/api/auth.js - Fonctions API pour l'authentification
import axiosInstance from '../utils/axios';

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

// Fonction pour connecter un utilisateur
export const loginUser = async (credentials) => {
  const response = await axiosInstance.post('/auth/login', credentials);
  return response.data;
};

// Fonction pour enregistrer un nouvel utilisateur
export const registerUser = async (userData) => {
  const response = await axiosInstance.post('/auth/register', userData);
  return response.data;
};

// Fonction pour déconnecter un utilisateur
export const logoutUser = async () => {
  const response = await axiosInstance.post('/auth/logout');
  return response.data;
};

// Fonction pour récupérer les informations de l'utilisateur connecté
export const getCurrentUser = async () => {
  const response = await axiosInstance.get('/auth/me');
  return response.data;
};

// Fonction pour le processus de mot de passe oublié
export const forgotPassword = async (email) => {
  const response = await axiosInstance.post('/auth/forgot-password', { email });
  return response.data;
};

// Fonction pour réinitialiser le mot de passe
export const resetPassword = async (token, newPassword) => {
  const response = await axiosInstance.post('/auth/reset-password', {
    token,
    newPassword,
  });
  return response.data;
};