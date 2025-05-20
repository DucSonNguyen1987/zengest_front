import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { hasRole } from '../../utils/permissions';
import { Spin } from 'antd';

/**
 * Composant de protection des routes qui vérifie:
 * 1. Si l'utilisateur est authentifié
 * 2. Si l'utilisateur a le rôle requis (optionnel)
 */
const ProtectedRoute = ({ requiredRole, children }) => {
  // Récupération des données d'authentification
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Afficher un spinner pendant le chargement des données d'authentification
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="Chargement..." />
      </div>
    );
  }

  // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
  if (!isAuthenticated) {
    // On conserve l'URL demandée pour y rediriger après connexion
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Vérifier si un rôle spécifique est requis et si l'utilisateur a ce rôle
  if (requiredRole && !hasRole(user.role, requiredRole)) {
    // Rediriger vers une page "non autorisé" si l'utilisateur n'a pas le rôle requis
    return <Navigate to="/unauthorized" replace />;
  }

  // Si toutes les vérifications sont passées, rendre le contenu protégé
  return children;
};

export default ProtectedRoute;