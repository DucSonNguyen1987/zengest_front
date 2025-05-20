import axiosInstance from '../utils/axios';

/**
 * Authentifie un utilisateur avec ses identifiants
 * @param {Object} credentials - Identifiants de l'utilisateur (email, password)
 * @returns {Promise<Object>} - Données de l'utilisateur et token d'authentification
 */
export const loginUser = async (credentials) => {
  const response = await axiosInstance.post('/auth/login', credentials);
  return response.data;
};

/**
 * Enregistre un nouvel utilisateur
 * @param {Object} userData - Données du nouvel utilisateur
 * @returns {Promise<Object>} - Données de confirmation d'enregistrement
 */
export const registerUser = async (userData) => {
  const response = await axiosInstance.post('/auth/register', userData);
  return response.data;
};

/**
 * Déconnecte l'utilisateur courant
 * @returns {Promise<Object>} - Confirmation de déconnexion
 */
export const logoutUser = async () => {
  const response = await axiosInstance.post('/auth/logout');
  return response.data;
};

/**
 * Récupère les informations de l'utilisateur courant
 * @returns {Promise<Object>} - Données de l'utilisateur
 */
export const getCurrentUser = async () => {
  const response = await axiosInstance.get('/auth/me');
  return response.data;
};

/**
 * Initie le processus de récupération de mot de passe
 * @param {string} email - Email de l'utilisateur
 * @returns {Promise<Object>} - Confirmation d'envoi d'email
 */
export const forgotPassword = async (email) => {
  const response = await axiosInstance.post('/auth/forgot-password', { email });
  return response.data;
};

/**
 * Réinitialise le mot de passe avec le token reçu par email
 * @param {string} token - Token de réinitialisation
 * @param {string} newPassword - Nouveau mot de passe
 * @returns {Promise<Object>} - Confirmation de réinitialisation
 */
export const resetPassword = async (token, newPassword) => {
  const response = await axiosInstance.post('/auth/reset-password', {
    token,
    newPassword,
  });
  return response.data;
};

/**
 * Vérifie si un email existe déjà dans la base de données
 * @param {string} email - Email à vérifier
 * @returns {Promise<boolean>} - True si l'email existe déjà
 */
export const checkEmailExists = async (email) => {
  const response = await axiosInstance.post('/auth/check-email', { email });
  return response.data.exists;
};

/**
 * Met à jour les informations du profil utilisateur
 * @param {Object} userData - Nouvelles données utilisateur
 * @returns {Promise<Object>} - Données utilisateur mises à jour
 */
export const updateUserProfile = async (userData) => {
  const response = await axiosInstance.put('/auth/profile', userData);
  return response.data;
};

/**
 * Change le mot de passe de l'utilisateur connecté
 * @param {string} currentPassword - Mot de passe actuel
 * @param {string} newPassword - Nouveau mot de passe
 * @returns {Promise<Object>} - Confirmation de changement
 */
export const changePassword = async (currentPassword, newPassword) => {
  const response = await axiosInstance.post('/auth/change-password', {
    currentPassword,
    newPassword,
  });
  return response.data;
};