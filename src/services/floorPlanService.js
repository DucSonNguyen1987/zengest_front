// src/services/floorPlanService.js
import axiosInstance from '../utils/axios';

// 👇 CORRECTION: Utiliser /api/floor-plans au lieu de l'URL complète
const API_URL = '/floor-plans';

const floorPlanService = {
  /**
   * Récupérer tous les plans de salle
   */
  getAll: async () => {
    try {
      const response = await axiosInstance.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching floor plans:', error);
      throw error;
    }
  },

  /**
   * Récupérer un plan spécifique par ID
   */
  getById: async (id) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching floor plan with id ${id}:`, error);
      throw error;
    }
  },

  /**
   * Créer un nouveau plan
   */
  create: async (floorPlanData) => {
    try {
      const response = await axiosInstance.post(API_URL, floorPlanData);
      return response.data;
    } catch (error) {
      console.error('Error creating floor plan:', error);
      throw error;
    }
  },

  /**
   * Mettre à jour un plan existant
   */
  update: async (id, floorPlanData) => {
    try {
      const response = await axiosInstance.put(`${API_URL}/${id}`, floorPlanData);
      return response.data;
    } catch (error) {
      console.error(`Error updating floor plan with id ${id}:`, error);
      throw error;
    }
  },

  /**
   * Supprimer un plan
   */
  delete: async (id) => {
    try {
      await axiosInstance.delete(`${API_URL}/${id}`);
      return id; // Retourne l'ID supprimé pour aider le reducer
    } catch (error) {
      console.error(`Error deleting floor plan with id ${id}:`, error);
      throw error;
    }
  }
};

export default floorPlanService;