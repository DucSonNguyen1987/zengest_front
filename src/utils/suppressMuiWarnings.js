// src/utils/suppressMuiWarnings.js
/**
 * Supprime temporairement les warnings MUI Grid pendant la migration
 * À utiliser uniquement pendant la période de transition
 */

const originalConsoleWarn = console.warn;

console.warn = (...args) => {
  // Supprimer les warnings spécifiques à MUI Grid
  const message = args[0];
  if (typeof message === 'string') {
    const muiGridWarnings = [
      'MUI Grid: The `item` prop has been removed',
      'MUI Grid: The `xs` prop has been removed',
      'MUI Grid: The `sm` prop has been removed',
      'MUI Grid: The `md` prop has been removed',
      'MUI Grid: The `lg` prop has been removed',
      'MUI Grid: The `xl` prop has been removed'
    ];
    
    const shouldSuppress = muiGridWarnings.some(warning => 
      message.includes(warning)
    );
    
    if (shouldSuppress) {
      return; // Ne pas afficher le warning
    }
  }
  
  // Afficher tous les autres warnings normalement
  originalConsoleWarn.apply(console, args);
};

// Pour rétablir les warnings plus tard
export const restoreConsoleWarn = () => {
  console.warn = originalConsoleWarn;
};

export default console.warn;