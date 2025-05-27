import axios from 'axios';
import { getToken, removeToken } from './token';
import setupMock from './mockAdapter';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const ENABLE_MOCKS = import.meta.env.VITE_ENABLE_MOCKS === 'true' || import.meta.env.DEV;

// ✅ LOGS SIMPLIFIÉS
const ENABLE_LOGS = import.meta.env.DEV && !import.meta.env.VITE_REDUCE_LOGS;

if (ENABLE_LOGS) {
  console.log('🔧 Configuration Axios:', { API_URL, ENABLE_MOCKS });
}

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// ✅ INTERCEPTEURS SIMPLIFIÉS
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

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ✅ MOCKS SIMPLIFIÉS
if (ENABLE_MOCKS) {
  if (ENABLE_LOGS) console.log('🎭 API Mock activé');
  setupMock(axiosInstance);
}

export default axiosInstance;