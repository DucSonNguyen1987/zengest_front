import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Afficher un message en développement pour indiquer que les mocks sont activés
if (import.meta.env.DEV) {
  console.log('Environnement: DEVELOPMENT');
  console.log('API Mocks: ', import.meta.env.VITE_ENABLE_MOCKS === 'true' ? 'ENABLED' : 'DISABLED');
}

createRoot(document.getElementById('root')).render(  <React.StrictMode>
    <App />
  </React.StrictMode>
);