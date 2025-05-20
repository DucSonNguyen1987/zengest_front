import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { ROLES } from '../utils/permissions';

// Pages d'authentification
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

// Pages sécurisées
import Dashboard from '../pages/dashboard/Dashboard';
import Profile from '../pages/profile/Profile';
import UserManagement from '../pages/admin/UserManagement';
import Settings from '../pages/admin/Settings';
import Unauthorized from '../pages/errors/Unauthorized';
import NotFound from '../pages/errors/NotFound';

/**
 * Configuration des routes de l'application
 * Structure compatible avec useRoutes() de React Router v6
 */
const routes = [
  // Redirection de la racine vers le dashboard
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  
  // Routes d'authentification (avec AuthLayout)
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: 'reset-password',
        element: <ResetPassword />,
      },
    ],
  },
  
  // Routes protégées (nécessitant une authentification)
  {
    path: '/',
    // Wrapper global qui vérifie l'authentification pour toutes les routes enfants
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      // Dashboard accessible à tous les utilisateurs authentifiés
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      // Profil accessible à tous les utilisateurs authentifiés
      {
        path: 'profile',
        element: <Profile />,
      },
      // Gestion des utilisateurs (accessible uniquement aux Owner et Admin)
      {
        path: 'users',
        element: (
          <ProtectedRoute requiredRole={ROLES.OWNER}>
            <UserManagement />
          </ProtectedRoute>
        ),
      },
      // Paramètres (accessible uniquement aux Owner et Admin)
      {
        path: 'settings',
        element: (
          <ProtectedRoute requiredRole={ROLES.OWNER}>
            <Settings />
          </ProtectedRoute>
        ),
      },
      // Ajoutez d'autres routes protégées selon votre application
    ],
  },
  
  // Page d'accès non autorisé
  {
    path: '/unauthorized',
    element: <Unauthorized />,
  },
  
  // Route par défaut pour les URL non trouvées
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;