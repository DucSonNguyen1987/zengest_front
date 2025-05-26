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
const ENABLE_MOCKS = import.meta.env.VITE_ENABLE_MOCKS === 'true' || import.meta.env.DEV;

// Debug des variables d'environnement
console.log('🔧 Configuration Axios:');
console.log('- API_URL:', API_URL);
console.log('- ENABLE_MOCKS:', ENABLE_MOCKS);
console.log('- NODE_ENV:', import.meta.env.MODE);
console.log('- DEV mode:', import.meta.env.DEV);

/**
 * Création d'une instance Axios personnalisée
 * Cette instance sera utilisée pour toutes les requêtes API dans l'application
 */
const axiosInstance = axios.create({
  baseURL: API_URL,                    // URL de base qui sera préfixée à toutes les requêtes
  headers: {
    'Content-Type': 'application/json',  // En-tête par défaut pour toutes les requêtes
  },
  timeout: 10000, // Timeout de 10 secondes
});

/**
 * Intercepteur de requêtes
 * Exécuté avant chaque requête pour:
 * - Ajouter automatiquement le token JWT aux en-têtes si disponible
 */
axiosInstance.interceptors.request.use(
  (config) => { // ✅ CORRECTION: Retirer l'underscore
    // Récupération du token JWT depuis le stockage local via notre utilitaire
    const token = getToken();
    
    // Si un token existe, l'ajouter à l'en-tête Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log pour debug
    console.log('📤 Requête:', config.method?.toUpperCase(), config.url);
    
    // Retour de la configuration modifiée
    return config;
  },
  // En cas d'erreur lors de la préparation de la requête
  (error) => {
    console.error('❌ Erreur de requête:', error);
    return Promise.reject(error);
  }
);

/**
 * Intercepteur de réponses
 * Exécuté après chaque réponse pour:
 * - Gérer les erreurs d'authentification (code 401)
 * - Rediriger vers la page de login si le token est invalide/expiré
 */
axiosInstance.interceptors.response.use(
  // Pour les réponses réussies, renvoyer simplement la réponse
  (response) => {
    console.log('📥 Réponse:', response.status, response.config.url);
    return response;
  },
  
  // Pour les erreurs, vérifier si c'est une erreur 401 (non autorisé)
  (error) => {
    console.error('❌ Erreur de réponse:', error.response?.status, error.config?.url);
    
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
if (ENABLE_MOCKS) {
  // Afficher un message dans la console pour indiquer que les mocks sont activés
  console.log('🎭 API Mock activé en environnement de développement');
  
  // Configurer les mocks avec notre instance Axios
  setupMock(axiosInstance);
} else {
  console.log('🌐 Utilisation de l\'API réelle:', API_URL);
}

// Exportation de l'instance Axios configurée pour utilisation dans toute l'application
export default axiosInstance;