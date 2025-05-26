import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Hook personnalisé qui encapsule l'accès au contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // Protection en cas d'utilisation hors du AuthProvider
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};