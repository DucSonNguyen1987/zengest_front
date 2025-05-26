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
        console.log('🔐 Initialisation de l\'authentification...');
        
        if (isTokenValid()) {
          console.log('✅ Token valide trouvé, récupération des données utilisateur...');
          // Utilisation de getToken() au lieu d'accéder directement au localStorage
          const userData = await getCurrentUser();
          setUser(userData);
          console.log('👤 Utilisateur connecté:', userData);
        } else {
          console.log('❌ Token invalide ou inexistant');
          // Utilisation de removeToken() de manière cohérente
          removeToken();
          setUser(null);
        }
      } catch (err) {
        console.error('❌ Échec de l\'initialisation de l\'authentification:', err);
        removeToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Fonction de login avec gestion d'erreur améliorée
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔑 Tentative de connexion pour:', credentials.email);
      
      const response = await loginUser(credentials);
      
      console.log('✅ Connexion réussie:', response);
      
      // Utilisation de setToken() au lieu d'accéder directement au localStorage
      setToken(response.token);
      setUser(response.user);
      
      message.success('Connexion réussie');
      showMessage('Connexion réussie', 'success');
      
      return response.user;
    } catch (err) {
      console.error('❌ Erreur lors de la connexion:', err);
      
      // Gestion d'erreur plus détaillée
      let errorMessage = 'Échec de la connexion';
      
      if (err.response) {
        // Erreur de réponse du serveur
        if (err.response.status === 401) {
          errorMessage = 'Email ou mot de passe incorrect';
        } else if (err.response.status === 404) {
          errorMessage = 'Service d\'authentification non disponible. Vérifiez que les mocks sont activés.';
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        } else {
          errorMessage = `Erreur serveur: ${err.response.status}`;
        }
      } else if (err.request) {
        // Erreur de réseau
        errorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion réseau ou la configuration des mocks.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      message.error(errorMessage);
      showMessage(errorMessage, 'error');
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fonction de logout
  const logout = () => {
    console.log('🚪 Déconnexion de l\'utilisateur');
    // Utilisation de removeToken() de manière cohérente
    removeToken();
    setUser(null);
    setError(null);
    message.success('Déconnexion réussie');
    showMessage('Déconnexion réussie', 'success');
  };

  // Fonction d'enregistrement avec gestion des sous-catégories de staff
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📝 Tentative d\'inscription pour:', userData.email);
      
      // Traitement spécial pour le rôle "staff" avec sous-catégories
      let processedData = { ...userData };
      
      if (userData.role === 'staff' && userData.staffType) {
        processedData.role = userData.staffType;
        delete processedData.staffType;
      }
      
      const response = await registerUser(processedData);
      
      console.log('✅ Inscription réussie:', response);
      
      message.success('Inscription réussie. Veuillez vous connecter.');
      showMessage('Inscription réussie. Veuillez vous connecter.', 'success');
      
      return response;
    } catch (err) {
      console.error('❌ Erreur lors de l\'inscription:', err);
      
      let errorMessage = 'Échec de l\'inscription';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      message.error(errorMessage);
      showMessage(errorMessage, 'error');
      
      throw new Error(errorMessage);
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