import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createZenTheme } from '../theme/zenTheme';

// Création du contexte
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
  mode: 'light',
});

// Hook personnalisé pour utiliser le contexte
export const useColorMode = () => useContext(ColorModeContext);

// Fournisseur du thème qui gère le basculement entre les modes
export const ThemeContextProvider = ({ children }) => {
  // Déterminer le mode initial (préférence système ou stockée)
  const getInitialMode = () => {
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode) {
      return savedMode;
    }
    
    // Vérifier la préférence du système
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDarkMode ? 'dark' : 'light';
  };

  const [mode, setMode] = useState(getInitialMode);

  // Effet pour sauvegarder la préférence
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);
  
  // Fonction pour basculer entre les modes
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      mode,
    }),
    [mode],
  );

  // Créer le thème dynamiquement en fonction du mode
  const theme = useMemo(() => createZenTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};