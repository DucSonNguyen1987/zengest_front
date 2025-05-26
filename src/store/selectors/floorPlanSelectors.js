import { createSelector } from '@reduxjs/toolkit';

// Sélecteur pour tous les plans de salle
export const selectAllFloorPlans = (state) => state.floorPlan.floorPlans;

// Sélecteur pour le plan de salle actuel
export const selectCurrentFloorPlan = (state) => state.floorPlan.currentFloorPlan;

// Sélecteur pour les tables du plan actuel
export const selectCurrentTables = createSelector(
  [selectCurrentFloorPlan],
  (currentFloorPlan) => currentFloorPlan?.tables || []
);

// Sélecteur pour les obstacles du plan actuel
export const selectCurrentObstacles = createSelector(
  [selectCurrentFloorPlan],
  (currentFloorPlan) => currentFloorPlan?.obstacles || []
);

// Sélecteur pour la capacité totale du plan actuel
export const selectCurrentCapacity = createSelector(
  [selectCurrentTables],
  (tables) => tables.reduce((total, table) => total + (table.capacity || 0), 0)
);

// Sélecteur pour le statut de chargement
export const selectFloorPlanLoading = (state) => state.floorPlan.loading;

// Sélecteur pour les erreurs
export const selectFloorPlanError = (state) => state.floorPlan.error;