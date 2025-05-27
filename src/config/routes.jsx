import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/dashboard/Dashboard';
import NotFound from '../pages/errors/NotFound';
import FloorPlanManagement from '../pages/floorPlan/FloorPlanManagement';

import ProtectedRoute from '../components/auth/ProtectedRoute';
import { ROLES, PERMISSIONS } from '../utils/permissions';

// Composant pour rediriger selon le rôle
const RoleBasedRedirect = () => {
  return <Navigate to="/dashboard" replace />;
};

// Configuration complète des routes
const routes = [
  {
    path: '/',
    element: <RoleBasedRedirect />,
  },
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
    ],
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'floor-plans',
        element: (
          <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_PROJECTS}>
            <FloorPlanManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: 'floor-plans/:id',
        element: (
          <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_PROJECTS}>
            <FloorPlanManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: 'floor-plans/:id/edit',
        element: (
          <ProtectedRoute requiredPermission={PERMISSIONS.EDIT_PROJECTS}>
            <FloorPlanManagement />
          </ProtectedRoute>
        ),
      },
      // Routes supplémentaires pour les fonctionnalités futures
      {
        path: 'reservations',
        element: (
          <ProtectedRoute>
            <div>Réservations (à implémenter)</div>
          </ProtectedRoute>
        ),
      },
      {
        path: 'orders',
        element: (
          <ProtectedRoute>
            <div>Commandes (à implémenter)</div>
          </ProtectedRoute>
        ),
      },
      {
        path: 'users',
        element: (
          <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_USERS}>
            <div>Gestion utilisateurs (à implémenter)</div>
          </ProtectedRoute>
        ),
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute requiredPermission={PERMISSIONS.EDIT_SETTINGS}>
            <div>Paramètres (à implémenter)</div>
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <div>Profil utilisateur (à implémenter)</div>
          </ProtectedRoute>
        ),
      },
    ],
  },
  // Page d'erreur pour accès non autorisé
  {
    path: '/unauthorized',
    element: (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h1>Accès non autorisé</h1>
        <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        <button onClick={() => window.history.back()}>
          Retour
        </button>
      </div>
    ),
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;