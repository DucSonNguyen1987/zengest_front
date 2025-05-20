import axios from 'axios';
import { getToken, removeToken } from './token';
import setupMock from './mockAdapter';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Création de l'instance Axios
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT à chaque requête
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs 401 (token expiré ou invalide)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Configuration des mocks en développement uniquement
if (import.meta.env.DEV) {
  console.log('API Mock activé en environnement de développement');
  // Installer le système de mock
  setupMock(axiosInstance);
}

export default axiosInstance;