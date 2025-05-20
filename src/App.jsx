import React from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import frFR from 'antd/lib/locale/fr_FR'; // Support du français pour Ant Design
import { AuthProvider } from './context/AuthContext';
import routes from './config/routes';

// Composant qui utilise useRoutes pour générer les routes
const AppRoutes = () => {
  const routing = useRoutes(routes);
  return routing;
};

function App() {
  return (
    <ConfigProvider locale={frFR}> {/* Configuration globale d'Ant Design */}
      <BrowserRouter> {/* Fournit le routage */}
        <AuthProvider> {/* Fournit le contexte d'authentification */}
          <AppRoutes /> {/* Rend les routes définies */}
        </AuthProvider>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;