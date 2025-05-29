import React from 'react';
import { Box, Typography, Paper, Button, Alert } from '@mui/material';
import { useSelector } from 'react-redux';

const FloorPlanDebugTool = () => {
  const currentFloorPlan = useSelector(state => state.floorPlan.currentFloorPlan);
  const allFloorPlans = useSelector(state => state.floorPlan.floorPlans);
  
  const handleLogState = () => {
    console.log('🔍 DEBUG - État Redux complet:');
    console.log('📋 All Floor Plans:', allFloorPlans);
    console.log('📍 Current Floor Plan:', currentFloorPlan);
    console.log('🏠 Tables:', currentFloorPlan?.tables);
    console.log('🚧 Obstacles:', currentFloorPlan?.obstacles);
    
    // Test d'ajout direct
    console.log('🧪 Test de structure d\'obstacle:');
    const testObstacle = {
      id: `test-${Date.now()}`,
      type: 'obstacle',
      category: 'mur',
      name: 'Test Mur',
      shape: 'rectangle',
      color: '#FF0000',
      x: 150,
      y: 150,
      width: 100,
      height: 20,
      rotation: 0
    };
    console.log('✅ Structure test obstacle:', testObstacle);
  };
  
  const handleTestAdd = () => {
    // Import du hook à utiliser dans le composant parent
    console.log('⚠️ Utilisez addObstacle() dans le composant parent avec:');
    const testObstacle = {
      id: `debug-${Date.now()}`,
      type: 'obstacle',
      category: 'mur',
      name: 'Debug Mur',
      shape: 'rectangle',
      color: '#00FF00',
      x: 200,
      y: 200,
      width: 120,
      height: 30,
      rotation: 0
    };
    console.log(testObstacle);
  };

  return (
    <Paper sx={{ p: 2, m: 2, backgroundColor: '#ffeb3b', color: '#000' }}>
      <Typography variant="h6" gutterBottom>
        🔧 Debug Tool - Obstacles
      </Typography>
      
      <Alert severity="info" sx={{ mb: 2 }}>
        Outil de diagnostic temporaire pour résoudre le problème d'affichage des obstacles
      </Alert>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button variant="outlined" onClick={handleLogState}>
          📊 Log État Redux
        </Button>
        <Button variant="outlined" onClick={handleTestAdd}>
          🧪 Structure Test
        </Button>
      </Box>
      
      {/* Informations en temps réel */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2">
          <strong>Plan actuel:</strong> {currentFloorPlan?.name || 'Aucun'}
        </Typography>
        <Typography variant="body2">
          <strong>Tables:</strong> {currentFloorPlan?.tables?.length || 0}
        </Typography>
        <Typography variant="body2">
          <strong>Obstacles:</strong> {currentFloorPlan?.obstacles?.length || 0}
        </Typography>
        <Typography variant="body2">
          <strong>ID Plan:</strong> {currentFloorPlan?.id || 'N/A'}
        </Typography>
      </Box>
      
      {/* Liste des obstacles */}
      {currentFloorPlan?.obstacles?.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Obstacles détectés:
          </Typography>
          {currentFloorPlan.obstacles.map((obstacle, index) => (
            <Typography key={obstacle.id} variant="body2" sx={{ ml: 1 }}>
              {index + 1}. {obstacle.name || obstacle.id} - {obstacle.shape} - {obstacle.color}
            </Typography>
          ))}
        </Box>
      )}
      
      {/* Instructions */}
      <Box sx={{ mt: 2, p: 1, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 1 }}>
        <Typography variant="caption">
          <strong>Instructions:</strong><br/>
          1. Cliquez sur "Log État Redux" pour voir l'état dans la console<br/>
          2. Essayez d'ajouter un obstacle avec le bouton normal<br/>
          3. Vérifiez si le nombre d'obstacles augmente ici<br/>
          4. Supprimez ce composant une fois le problème résolu
        </Typography>
      </Box>
    </Paper>
  );
};

export default FloorPlanDebugTool;