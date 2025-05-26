// ==========================================
// AUTHCONTEXT OPTIMISÉ - SOLUTION DÉFINITIVE
// ==========================================

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { getCurrentUser, loginUser, registerUser } from '../api/auth';
import { getToken, isTokenValid, removeToken, setToken, clearAuth } from '../utils/token';
import { message } from 'antd';
import { ROLES } from '../utils/permissions';
import { Alert, Snackbar } from '@mui/material';

export const AuthContext = createContext();

// ✅ SOLUTION : Flag global pour éviter les doubles initialisations
let isInitializing = false;
let initializationPromise = null;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [authInitialized, setAuthInitialized] = useState(false);

  // Fonction pour afficher les messages
  const showMessage = useCallback((message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  // Fermeture du snackbar
  const handleCloseSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  // Fonction pour nettoyer l'état d'authentification
  const resetAuthState = useCallback(() => {
    setUser(null);
    setError(null);
    clearAuth();
  }, []);

  // ✅ FONCTION D'INITIALISATION AVEC PROTECTION GLOBALE
  const initializeAuth = useCallback(async () => {
    // Si une initialisation est déjà en cours, attendre qu'elle se termine
    if (isInitializing && initializationPromise) {
      return initializationPromise;
    }

    // Si déjà initialisé, ne rien faire
    if (authInitialized) {
      return;
    }

    // Marquer comme en cours d'initialisation
    isInitializing = true;
    
    // Créer la promesse d'initialisation
    initializationPromise = (async () => {
      try {
        if (import.meta.env.DEV) {
          console.log('🔐 Initialisation de l\'authentification...');
        }
        
        setLoading(true);
        
        // Vérification préalable du token
        const token = getToken();
        if (import.meta.env.DEV) {
          console.log('🎫 Token présent:', !!token);
        }
        
        if (token) {
          if (import.meta.env.DEV) {
            console.log('🔍 Vérification de la validité du token...');
          }
          
          // Vérifier la validité du token
          const tokenIsValid = isTokenValid();
          
          if (tokenIsValid) {
            if (import.meta.env.DEV) {
              console.log('✅ Token valide, récupération des données utilisateur...');
            }
            
            try {
              const userData = await getCurrentUser();
              setUser(userData);
              if (import.meta.env.DEV) {
                console.log('👤 Utilisateur connecté:', userData);
              }
              showMessage('Connexion automatique réussie', 'success');
            } catch (fetchError) {
              console.warn('⚠️ Erreur lors de la récupération des données utilisateur:', fetchError);
              
              if (fetchError.response?.status === 401) {
                if (import.meta.env.DEV) {
                  console.log('🧹 Token invalide côté serveur, nettoyage...');
                }
                resetAuthState();
              } else {
                setError('Impossible de récupérer les données utilisateur');
                showMessage('Erreur de connexion, veuillez vous reconnecter', 'warning');
              }
            }
          } else {
            if (import.meta.env.DEV) {
              console.log('❌ Token invalide ou expiré, nettoyage...');
            }
            resetAuthState();
          }
        } else {
          if (import.meta.env.DEV) {
            console.log('📭 Aucun token trouvé, utilisateur non connecté');
          }
          setUser(null);
        }
      } catch (err) {
        console.error('❌ Erreur critique lors de l\'initialisation de l\'authentification:', err);
        resetAuthState();
        setError('Erreur d\'initialisation de l\'authentification');
        showMessage('Erreur d\'authentification, veuillez vous connecter', 'error');
      } finally {
        setLoading(false);
        setAuthInitialized(true);
        // Marquer l'initialisation comme terminée
        isInitializing = false;
        initializationPromise = null;
        
        if (import.meta.env.DEV) {
          console.log('🏁 Initialisation de l\'authentification terminée');
        }
      }
    })();

    return initializationPromise;
  }, [authInitialized, showMessage, resetAuthState]);

  // ✅ EFFET D'INITIALISATION OPTIMISÉ
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Fonction de login avec gestion d'erreur améliorée
  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      if (import.meta.env.DEV) {
        console.log('🔑 Tentative de connexion pour:', credentials.email);
      }
      
      const response = await loginUser(credentials);
      
      if (import.meta.env.DEV) {
        console.log('✅ Connexion réussie:', response);
      }
      
      // Validation du token reçu
      if (!response.token) {
        throw new Error('Aucun token reçu du serveur');
      }
      
      // Sauvegarder le token et les données utilisateur
      setToken(response.token);
      setUser(response.user);
      
      message.success('Connexion réussie');
      showMessage('Connexion réussie', 'success');
      
      return response.user;
    } catch (err) {
      console.error('❌ Erreur lors de la connexion:', err);
      
      let errorMessage = 'Échec de la connexion';
      
      if (err.response) {
        switch (err.response.status) {
          case 401:
            errorMessage = 'Email ou mot de passe incorrect';
            break;
          case 404:
            errorMessage = 'Service d\'authentification non disponible. Vérifiez que les mocks sont activés.';
            break;
          case 422:
            errorMessage = 'Données de connexion invalides';
            break;
          case 500:
            errorMessage = 'Erreur serveur, veuillez réessayer plus tard';
            break;
          default:
            errorMessage = err.response.data?.message || `Erreur serveur: ${err.response.status}`;
        }
      } else if (err.request) {
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
  }, [showMessage]);

  // Fonction de logout
  const logout = useCallback(() => {
    if (import.meta.env.DEV) {
      console.log('🚪 Déconnexion de l\'utilisateur');
    }
    
    try {
      resetAuthState();
      message.success('Déconnexion réussie');
      showMessage('Déconnexion réussie', 'success');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      resetAuthState();
      showMessage('Déconnexion effectuée', 'info');
    }
  }, [resetAuthState, showMessage]);

  // Fonction d'enregistrement
  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      if (import.meta.env.DEV) {
        console.log('📝 Tentative d\'inscription pour:', userData.email);
      }
      
      let processedData = { ...userData };
      
      if (userData.role === 'staff' && userData.staffType) {
        processedData.role = userData.staffType;
        delete processedData.staffType;
      }
      
      const response = await registerUser(processedData);
      
      if (import.meta.env.DEV) {
        console.log('✅ Inscription réussie:', response);
      }
      
      message.success('Inscription réussie. Veuillez vous connecter.');
      showMessage('Inscription réussie. Veuillez vous connecter.', 'success');
      
      return response;
    } catch (err) {
      console.error('❌ Erreur lors de l\'inscription:', err);
      
      let errorMessage = 'Échec de l\'inscription';
      
      if (err.response) {
        switch (err.response.status) {
          case 400:
            errorMessage = err.response.data?.message || 'Données d\'inscription invalides';
            break;
          case 409:
            errorMessage = 'Un compte existe déjà avec cet email';
            break;
          case 422:
            errorMessage = 'Informations incomplètes ou invalides';
            break;
          default:
            errorMessage = err.response.data?.message || 'Erreur lors de l\'inscription';
        }
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
  }, [showMessage]);

  // Fonctions utilitaires
  const getStaffType = useCallback(() => {
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
  }, [user]);

  const isStaff = useCallback(() => {
    if (!user) return false;
    return user.role === ROLES.STAFF_BAR || 
           user.role === ROLES.STAFF_FLOOR || 
           user.role === ROLES.STAFF_KITCHEN;
  }, [user]);

  // Fonction pour forcer la réinitialisation
  const forceReset = useCallback(() => {
    if (import.meta.env.DEV) {
      console.log('🔄 Réinitialisation forcée de l\'authentification');
    }
    
    // Reset des flags globaux
    isInitializing = false;
    initializationPromise = null;
    
    resetAuthState();
    setLoading(false);
    setAuthInitialized(false);
    showMessage('Authentification réinitialisée', 'info');
  }, [resetAuthState, showMessage]);

  // ✅ VALEUR MEMORISÉE POUR ÉVITER LES RE-RENDERS
  const contextValue = React.useMemo(() => ({
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
    forceReset,
    authInitialized
  }), [
    user,
    loading,
    error,
    login,
    logout,
    register,
    getStaffType,
    isStaff,
    showMessage,
    forceReset,
    authInitialized
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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
    </AuthContext.Provider>
  );
};

// ✅ EXPORT NOMMÉ POUR FAST REFRESH COMPATIBILITY
export { AuthProvider as default };