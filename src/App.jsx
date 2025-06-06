import React from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import routes from './config/routes.jsx';
import { Provider } from 'react-redux';
import store from './store';
import { ThemeContextProvider } from './context/ThemeContext.jsx'


import './utils/suppressMuiWarnings';



// Composant qui utilise useRoutes pour générer les routes
const AppRoutes = () => {
  const routing = useRoutes(routes);
  return routing;
};

function App() {
  return (
    <Provider store={store}> {/* Ajoutez le Provider Redux ici */}
    <ThemeContextProvider> {/* Configuration globale du theme */}
      <BrowserRouter> {/* Fournit le routage */}
        <AuthProvider> {/* Fournit le contexte d'authentification */}
          <AppRoutes /> {/* Rend les routes définies */}
        </AuthProvider>
      </BrowserRouter>
    </ThemeContextProvider>
    </Provider>
  );
}

export default App;