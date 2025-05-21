
/**
 * Ce fichier configure une instance Axios personnalisée avec:
 * - Configuration de base (URL, headers)
 * - Intercepteurs pour la gestion automatique des tokens
 * - Gestion des erreurs d'authentification (401)
 * - Intégration conditionnelle des mocks en développement
 */

// Importation des modules nécessaires
import axios from 'axios';                 // Bibliothèque principale pour les requêtes HTTP
import { getToken, removeToken } from './token';  // Utilitaires pour manipuler le token JWT
import setupMock from './mockAdapter';     // Configuration des mocks (utilisé en développement uniquement)

// Récupération de l'URL de l'API depuis les variables d'environnement ou utilisation d'une URL par défaut
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Création d'une instance Axios personnalisée
 * Cette instance sera utilisée pour toutes les requêtes API dans l'application
 */
const axiosInstance = axios.create({
  baseURL: API_URL,                    // URL de base qui sera préfixée à toutes les requêtes
  headers: {
    'Content-Type': 'application/json',  // En-tête par défaut pour toutes les requêtes
  },
});

/**
 * Intercepteur de requêtes
 * Exécuté avant chaque requête pour:
 * - Ajouter automatiquement le token JWT aux en-têtes si disponible
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // Récupération du token JWT depuis le stockage local via notre utilitaire
    const token = getToken();
    
    // Si un token existe, l'ajouter à l'en-tête Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Retour de la configuration modifiée
    return config;
  },
  // En cas d'erreur lors de la préparation de la requête
  (error) => Promise.reject(error)
);

/**
 * Intercepteur de réponses
 * Exécuté après chaque réponse pour:
 * - Gérer les erreurs d'authentification (code 401)
 * - Rediriger vers la page de login si le token est invalide/expiré
 */
axiosInstance.interceptors.response.use(
  // Pour les réponses réussies, renvoyer simplement la réponse
  (response) => response,
  
  // Pour les erreurs, vérifier si c'est une erreur 401 (non autorisé)
  (error) => {
    if (error.response && error.response.status === 401) {
      // Si erreur 401, supprimer le token et rediriger vers la page de login
      removeToken();
      
      // Redirection vers la page de login
      // Utilisation de window.location.href pour une redirection complète de la page
      window.location.href = '/login';
    }
    
    // Propager l'erreur pour qu'elle puisse être gérée ailleurs si nécessaire
    return Promise.reject(error);
  }
);

/**
 * Configuration des mocks en mode développement
 * Permet de développer le frontend sans avoir besoin d'un backend fonctionnel
 */
if (import.meta.env.DEV) {
  // Afficher un message dans la console pour indiquer que les mocks sont activés
  console.log('API Mock activé en environnement de développement');
  
  // Configurer les mocks avec notre instance Axios
  setupMock(axiosInstance);
}

// Exportation de l'instance Axios configurée pour utilisation dans toute l'application
export default axiosInstance;

/**
 * Utilisation typique dans l'application:
 * 
 * import axiosInstance from '../utils/axios';
 * 
 * // Faire une requête GET
 * const getData = async () => {
 *   try {
 *     const response = await axiosInstance.get('/endpoint');
 *     return response.data;
 *   } catch (error) {
 *     console.error('Erreur:', error);
 *     throw error;
 *   }
 * };
 * 
 * // Faire une requête POST
 * const createData = async (data) => {
 *   try {
 *     const response = await axiosInstance.post('/endpoint', data);
 *     return response.data;
 *   } catch (error) {
 *     console.error('Erreur:', error);
 *     throw error;
 *   }
 * };
 */