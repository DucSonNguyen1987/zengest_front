import React, { createContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { getCurrentUser, loginUser, registerUser } from '../api/auth';
import { getToken, isTokenValid, removeToken, setToken, clearAuth } from '../utils/token';

export const AuthContext = createContext();

// ✅ OPTIMISATION: Variables globales pour éviter les re-initialisations
let isInitialized = false;
let initPromise = null;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // ✅ OPTIMISATION: Ref pour éviter les callbacks sur les états volatils
  const userRef = useRef(user);
  const loadingRef = useRef(loading);
  
  useEffect(() => {
    userRef.current = user;
    loadingRef.current = loading;
  }, [user, loading]);

  // ✅ OPTIMISATION: Initialisation une seule fois avec promesse cachée
  useEffect(() => {
    if (isInitialized && initPromise) {
      initPromise.then(() => setLoading(false));
      return;
    }
    
    if (isInitialized) {
      setLoading(false);
      return;
    }
    
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

    initPromise = initAuth();
  }, []); // ✅ Aucune dépendance

  // ✅ OPTIMISATION: Callbacks ultra-stables avec useRef
  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    
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
  }, []); // ✅ Aucune dépendance

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
    setError(null);
  }, []); // ✅ Aucune dépendance

  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    
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
  }, []); // ✅ Aucune dépendance

  // ✅ OPTIMISATION: Context value ultra-stable
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
    </AuthContext.Provider>
  );
};

export default AuthProvider;