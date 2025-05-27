import { useEffect, useRef } from 'react';
import { logger } from '../utils/logger';

/**
 * Hook pour surveiller les performances des composants
 */
export const usePerformanceMonitor = (componentName) => {
  // DÉSACTIVÉ TEMPORAIREMENT - CAUSE DES PROBLÈMES DE PERFORMANCE
  return {
    renderCount: 0,
    resetCount: () => {}
  };
};
/**
 * Hook pour mesurer les performances d'une fonction
 */
export const usePerformanceMeasure = () => {
  return (name, fn) => {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    logger.performance(name, end - start);
    return result;
  };
};
