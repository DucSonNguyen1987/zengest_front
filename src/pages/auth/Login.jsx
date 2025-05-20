import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  // Récupération des données d'authentification
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Effet qui s'exécute à chaque changement d'état d'authentification
  useEffect(() => {
    // Si l'utilisateur est déjà authentifié, le rediriger
    if (isAuthenticated) {
      // Redirection vers la page demandée initialement ou le dashboard par défaut
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Rendu du formulaire de connexion
  return <LoginForm />;
};

export default Login;