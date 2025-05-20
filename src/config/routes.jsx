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
import { ROLES } from '../utils/permissions';

// Configuration minimale des routes - à adapter selon vos besoins
const routes = [
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
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
        <DashboardLayout />
    ),
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'floor-plans',
        element: (
          <ProtectedRoute requiredRole={ROLES.MANAGER}>
            <FloorPlanManagement />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
