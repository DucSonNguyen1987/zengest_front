// src/components/common/IconWrapper.jsx
import React from 'react';
import { Box } from '@mui/material';

/**
 * Composant wrapper pour les icônes qui évite les conflits de nommage
 * et standardise l'affichage des icônes dans l'application
 */
const IconWrapper = ({ 
  IconComponent, 
  size = 24, 
  color = 'inherit',
  sx = {},
  ...props 
}) => {
  if (!IconComponent) {
    console.warn('IconWrapper: IconComponent is required');
    return null;
  }

  return (
    <Box
      component={IconComponent}
      sx={{
        fontSize: size,
        color: color,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...sx
      }}
      {...props}
    />
  );
};

export default IconWrapper;

// Exemples d'utilisation :

/**
 * Utilisation de base
 */
/*
import { Add as AddIcon } from '@mui/icons-material';
import IconWrapper from './components/common/IconWrapper';

<IconWrapper 
  IconComponent={AddIcon} 
  size={32} 
  color="primary.main" 
/>
*/

/**
 * Dans un bouton
 */
/*
import { Button } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

<Button
  startIcon={
    <IconWrapper 
      IconComponent={SaveIcon} 
      size={20}
    />
  }
>
  Sauvegarder
</Button>
*/

/**
 * Dans une carte statistique (comme dans Dashboard)
 */
/*
const StatCard = ({ title, value, iconComponent, color = 'primary' }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconWrapper 
          IconComponent={iconComponent}
          size={32}
          color={`${color}.main`}
        />
        <Box>
          <Typography variant="h4">{value}</Typography>
          <Typography variant="body2">{title}</Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);
*/

/**
 * Version avec styled-components pour plus de flexibilité
 */
/*
import { styled } from '@mui/material/styles';

const StyledIconWrapper = styled(Box)(({ theme, size, iconColor }) => ({
  fontSize: size || 24,
  color: iconColor || theme.palette.text.primary,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.1)',
  }
}));

const AnimatedIconWrapper = ({ IconComponent, ...props }) => (
  <StyledIconWrapper component={IconComponent} {...props} />
);
*/