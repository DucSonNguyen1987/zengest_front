// ==========================================
// API POUR LA GESTION DES RÔLES UTILISATEURS
// ==========================================

// src/api/userRole.js - Services d'API pour les rôles utilisateurs
import axiosInstance from '../utils/axios';

/**
 * Récupère tous les rôles utilisateurs disponibles
 * @returns {Promise<Array>} - Liste des rôles utilisateurs
 */
export const getAllUserRoles = async () => {
  const response = await axiosInstance.get('/user-roles');
  return response.data;
};

/**
 * Récupère les détails d'un rôle spécifique
 * @param {string} roleId - Identifiant du rôle (admin, owner, staff_bar, etc.)
 * @returns {Promise<Object>} - Détails du rôle
 */
export const getUserRoleById = async (roleId) => {
  const response = await axiosInstance.get(`/user-roles/${roleId}`);
  return response.data;
};

/**
 * Récupère tous les utilisateurs ayant un rôle spécifique
 * @param {string} roleId - Identifiant du rôle
 * @returns {Promise<Array>} - Liste des utilisateurs ayant ce rôle
 */
export const getUsersByRole = async (roleId) => {
  const response = await axiosInstance.get(`/user-roles/${roleId}/users`);
  return response.data;
};

/**
 * Vérifie si un utilisateur a un rôle spécifique
 * @param {string} userId - Identifiant de l'utilisateur
 * @param {string} roleId - Identifiant du rôle à vérifier
 * @returns {Promise<boolean>} - True si l'utilisateur a ce rôle
 */
export const checkUserHasRole = async (userId, roleId) => {
  try {
    const response = await axiosInstance.get(`/users/${userId}/roles/${roleId}`);
    return response.data.hasRole;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return false;
    }
    throw error;
  }
};

/**
 * Attribue un rôle à un utilisateur (admin uniquement)
 * @param {string} userId - Identifiant de l'utilisateur
 * @param {string} roleId - Identifiant du rôle à attribuer
 * @returns {Promise<Object>} - Confirmation de l'attribution
 */
export const assignRoleToUser = async (userId, roleId) => {
  const response = await axiosInstance.post(`/users/${userId}/roles`, { roleId });
  return response.data;
};

/**
 * Retire un rôle à un utilisateur (admin uniquement)
 * @param {string} userId - Identifiant de l'utilisateur
 * @param {string} roleId - Identifiant du rôle à retirer
 * @returns {Promise<Object>} - Confirmation du retrait
 */
export const removeRoleFromUser = async (userId, roleId) => {
  const response = await axiosInstance.delete(`/users/${userId}/roles/${roleId}`);
  return response.data;
};

