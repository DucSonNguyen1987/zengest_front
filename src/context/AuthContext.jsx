import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { getCurrentUser, loginUser, registerUser } from '../api/auth';
import { getToken, isTokenValid, removeToken, setToken, clearAuth } from '../utils/token';
import { ROLES } from '../utils/permissions';
import { Alert, Snackbar } from '@mui/material';

export const AuthContext = createContext();

// ✅ VARIABLES GLOBALES SIMPLIFIÉES
let isInitialized = false;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // ✅ INITIALISATION ULTRA-SIMPLIFIÉE - UNE SEULE FOIS
  useEffect(() => {
    if (isInitialized) return;
    
    const initAuth = async () => {
      try {
        const token = getToken();
        
        if (token && isTokenValid()) {
          try {
            const userData = await getCurrentUser();
            setUser(userData);
          } catch (err) {
            if (err.response?.status === 401) {
              clearAuth();
              setUser(null);
            }
          }
        } else {
          if (token) clearAuth();
          setUser(null);
        }
      } catch (err) {
        console.error('Auth init error:', err);
        clearAuth();
        setUser(null);
      } finally {
        setLoading(false);
        isInitialized = true;
      }
    };

    initAuth();
  }, []); // ✅ AUCUNE DÉPENDANCE - UNE SEULE EXÉCUTION

  // ✅ CALLBACKS ULTRA-SIMPLES
  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const response = await loginUser(credentials);
      setToken(response.token);
      setUser(response.user);
      return response.user;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Échec de la connexion';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
    setError(null);
  }, []);

  const register = useCallback(async (userData) => {
    setLoading(true);
    try {
      const response = await registerUser(userData);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Échec de l\'inscription';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ CONTEXT VALUE ULTRA-STABLE
  const contextValue = useMemo(() => ({
    user,
    loading,
    error,
    login,
    logout,
    register,
    isAuthenticated: !!user
  }), [user, loading, error, login, logout, register]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AuthContext.Provider>
  );
};

export default AuthProvider;