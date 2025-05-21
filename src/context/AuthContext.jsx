// ==========================================
// CORRECTION DE L'UTILISATION DE getToken()
// ==========================================

// src/context/AuthContext.jsx - Version corrigée utilisant getToken de manière cohérente
import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser, loginUser, registerUser } from '../api/auth';
import {  getToken, isTokenValid, removeToken, setToken } from '../utils/token';
import { message } from 'antd';
import { ROLES } from '../utils/permissions';
import {Alert, Snackbar} from '@mui/material';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({open: false, message: '', severity:'success'});


  // Fonction pour afficher les messages
  const showMessage = (message, severity = 'success') => {
    setSnackbar ({open: true, message, severity});
  };

  // Fermeture du snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({...snackbar, open: false});
  };
  

  // Initialisation: vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (isTokenValid()) {
          // Utilisation de getToken() au lieu d'accéder directement au localStorage
          const userData = await getCurrentUser();
          setUser(userData);
        } else {
          // Utilisation de removeToken() de manière cohérente
          removeToken();
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to initialize auth:', err);
        removeToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Fonction de login
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await loginUser(credentials);
      // Utilisation de setToken() au lieu d'accéder directement au localStorage
      setToken(response.token);
      setUser(response.user);
      message.success('Connexion réussie');
      return response.user;
    } catch (err) {
      setError(err.response?.data?.message || 'Échec de la connexion');
      message.error('Échec de la connexion');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fonction de logout
  const logout = () => {
    // Utilisation de removeToken() de manière cohérente
    removeToken();
    setUser(null);
    message.success('Déconnexion réussie');
  };

  // Fonction d'enregistrement avec gestion des sous-catégories de staff
  const register = async (userData) => {
    try {
      setLoading(true);
      
      // Traitement spécial pour le rôle "staff" avec sous-catégories
      let processedData = { ...userData };
      
      if (userData.role === 'staff' && userData.staffType) {
        processedData.role = userData.staffType;
        delete processedData.staffType;
      }
      
      const response = await registerUser(processedData);
      message.success('Inscription réussie. Veuillez vous connecter.');
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Échec de l\'inscription');
      message.error('Échec de l\'inscription');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fonction utilitaire pour déterminer le type de staff
  const getStaffType = () => {
    if (!user) return null;
    
    switch(user.role) {
      case ROLES.STAFF_BAR:
        return 'bar';
      case ROLES.STAFF_FLOOR:
        return 'floor';
      case ROLES.STAFF_KITCHEN:
        return 'kitchen';
      default:
        return null;
    }
  };

  // Fonction pour vérifier si l'utilisateur est un membre du staff
  const isStaff = () => {
    if (!user) return false;
    return user.role === ROLES.STAFF_BAR || 
           user.role === ROLES.STAFF_FLOOR || 
           user.role === ROLES.STAFF_KITCHEN;
  };

  // Valeur fournie par le contexte
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    getStaffType,
    isStaff,
    showMessage,
  };

  return <AuthContext.Provider value={value}>
  {children}
  <Snackbar
  open={snackbar.open}
  autoHideDuration={6000}
  onClose={handleCloseSnackbar}
  anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
  >
    <Alert
    onClose={handleCloseSnackbar}
    severity={snackbar.severity}
    sx={{
      backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(240, 240, 242, 0.8)',
            borderRadius: '12px'
    }}
    >
      {snackbar.message}
    </Alert>
  </Snackbar>
  </AuthContext.Provider>;
};
