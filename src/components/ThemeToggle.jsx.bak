import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';  // Icône "lune" pour le mode sombre
import Brightness7Icon from '@mui/icons-material/Brightness7';  // Icône "soleil" pour le mode clair
import { useColorMode } from '../context/ThemeContext';

const ThemeToggle = () => {
  const theme = useTheme();
  const { toggleColorMode, mode } = useColorMode();
  
  return (
    <Tooltip title={mode === 'dark' ? 'Passer au mode clair' : 'Passer au mode sombre'}>
      <IconButton 
        onClick={toggleColorMode} 
        color="inherit" 
        aria-label="toggle theme"
        sx={{ 
          ml: 1,
          // Utiliser les couleurs du thème actuel
          backgroundColor: mode === 'dark' 
            ? theme.palette.primary.dark 
            : theme.palette.primary.light,
          opacity: 0.8,
          color: '#fff',
          // Ajouter une légère animation de rotation au changement
          transition: 'transform 0.3s, background-color 0.3s',
          '&:hover': { 
            transform: 'rotate(12deg)',
            backgroundColor: mode === 'dark'
              ? theme.palette.primary.main
              : theme.palette.primary.main,
            opacity: 1
          }
        }}
      >
        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;