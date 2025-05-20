import axiosInstance from '../utils/axios';

/**
 * Récupère toutes les tables
 * @returns {Promise<Array>} - Liste des tables
 */
export const getAllTables = async () => {
  const response = await axiosInstance.get('/tables');
  return response.data;
};

/**
 * Récupère une table par son ID
 * @param {string|number} id - ID de la table
 * @returns {Promise<Object>} - Détails de la table
 */
export const getTableById = async (id) => {
  const response = await axiosInstance.get(`/tables/${id}`);
  return response.data;
};

/**
 * Récupère le statut actuel d'une table
 * @param {string|number} id - ID de la table
 * @returns {Promise<Object>} - Statut de la table
 */
export const getTableStatus = async (id) => {
  const response = await axiosInstance.get(`/tables/${id}/status`);
  return response.data;
};

/**
 * Met à jour le statut d'une table
 * @param {string|number} id - ID de la table
 * @param {string} status - Nouveau statut (libre, occupée, réservée)
 * @returns {Promise<Object>} - Table mise à jour
 */
export const updateTableStatus = async (id, status) => {
  const response = await axiosInstance.put(`/tables/${id}/status`, { status });
  return response.data;
};

/**
 * Crée une nouvelle table
 * @param {Object} data - Données de la table (numéro, capacité, position, etc.)
 * @returns {Promise<Object>} - Table créée
 */
export const createTable = async (data) => {
  const response = await axiosInstance.post('/tables', data);
  return response.data;
};

/**
 * Met à jour une table existante
 * @param {string|number} id - ID de la table
 * @param {Object} data - Nouvelles données
 * @returns {Promise<Object>} - Table mise à jour
 */
export const updateTable = async (id, data) => {
  const response = await axiosInstance.put(`/tables/${id}`, data);
  return response.data;
};

/**
 * Supprime une table
 * @param {string|number} id - ID de la table
 * @returns {Promise<Object>} - Confirmation de suppression
 */
export const deleteTable = async (id) => {
  const response = await axiosInstance.delete(`/tables/${id}`);
  return response.data;
};

/**
 * Récupère toutes les tables avec leur statut actuel
 * @returns {Promise<Array>} - Liste des tables avec statut
 */
export const getTablesWithStatus = async () => {
  const response = await axiosInstance.get('/tables/with-status');
  return response.data;
};

/**
 * Récupère les tables par salle
 * @param {string|number} roomId - ID de la salle
 * @returns {Promise<Array>} - Liste des tables dans la salle
 */
export const getTablesByRoom = async (roomId) => {
  const response = await axiosInstance.get(`/rooms/${roomId}/tables`);
  return response.data;
};