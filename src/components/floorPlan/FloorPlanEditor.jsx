import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  Box,
  Paper,
  Button,
  ButtonGroup,
  Slider,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Card,
  CardContent,
  IconButton,
  Chip,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  PanTool as PanIcon,
  Crop as SelectIcon,
  TableBar as TableIcon,
  Block as ObstacleIcon
} from '@mui/icons-material';

// Types d'outils
const TOOLS = {
  SELECT: 'select',
  ADD_TABLE: 'add_table',
  ADD_OBSTACLE: 'add_obstacle',
  PAN: 'pan'
};

// Types de formes
const SHAPES = {
  RECTANGLE: 'rectangle',
  CIRCLE: 'circle',
  SQUARE: 'square'
};

// Composant Table
const Table = ({ table, isSelected, onSelect, onUpdate, onDelete, scale = 1 }) => {
  const handleClick = (e) => {
    e.stopPropagation();
    onSelect(table.id);
  };

  const handleDrag = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    onUpdate(table.id, { x: x / scale, y: y / scale });
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: table.x * scale,
        top: table.y * scale,
        width: table.width * scale,
        height: table.height * scale,
        backgroundColor: table.color || '#e3f2fd',
        border: isSelected ? '3px solid #1976d2' : '2px solid #90caf9',
        borderRadius: table.shape === SHAPES.CIRCLE ? '50%' : '8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: `${12 * scale}px`,
        fontWeight: 'bold',
        color: '#1565c0',
        boxShadow: isSelected ? '0 4px 12px rgba(25, 118, 210, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease',
        userSelect: 'none'
      }}
      onClick={handleClick}
      onMouseDown={handleDrag}
    >
      <div style={{ textAlign: 'center' }}>
        <div>{table.label || `T${table.id}`}</div>
        <div style={{ fontSize: `${10 * scale}px`, opacity: 0.8 }}>
          {table.capacity}p
        </div>
      </div>
    </div>
  );
};

// Composant Obstacle
const Obstacle = ({ obstacle, isSelected, onSelect, onUpdate, onDelete, scale = 1 }) => {
  const handleClick = (e) => {
    e.stopPropagation();
    onSelect(obstacle.id);
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: obstacle.x * scale,
        top: obstacle.y * scale,
        width: obstacle.width * scale,
        height: obstacle.height * scale,
        backgroundColor: obstacle.color || '#ffcdd2',
        border: isSelected ? '3px solid #d32f2f' : '2px solid #f44336',
        borderRadius: obstacle.shape === SHAPES.CIRCLE ? '50%' : '4px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: `${10 * scale}px`,
        color: '#c62828',
        boxShadow: isSelected ? '0 4px 12px rgba(211, 47, 47, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease',
        userSelect: 'none'
      }}
      onClick={handleClick}
    >
      ⚠
    </div>
  );
};

// Composant Canvas
const Canvas = ({ 
  tables, 
  obstacles, 
  selectedId, 
  onSelect, 
  onUpdate, 
  onAdd, 
  tool, 
  zoom,
  canvasSize 
}) => {
  const canvasRef = useRef(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  const handleCanvasClick = (e) => {
    if (tool === TOOLS.SELECT) {
      onSelect(null);
      return;
    }

    if (tool === TOOLS.PAN) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - panOffset.x) / zoom;
    const y = (e.clientY - rect.top - panOffset.y) / zoom;

    if (tool === TOOLS.ADD_TABLE) {
      onAdd('table', { x, y });
    } else if (tool === TOOLS.ADD_OBSTACLE) {
      onAdd('obstacle', { x, y });
    }
  };

  const handleMouseDown = (e) => {
    if (tool === TOOLS.PAN) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isPanning && tool === TOOLS.PAN) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  return (
    <div
      ref={canvasRef}
      style={{
        width: '100%',
        height: canvasSize.height,
        backgroundColor: '#fafafa',
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        position: 'relative',
        overflow: 'hidden',
        cursor: tool === TOOLS.PAN ? 'grab' : tool === TOOLS.SELECT ? 'default' : 'crosshair',
        backgroundImage: 'radial-gradient(circle, #e0e0e0 1px, transparent 1px)',
        backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
        backgroundPosition: `${panOffset.x}px ${panOffset.y}px`
      }}
      onClick={handleCanvasClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
          width: '100%',
          height: '100%'
        }}
      >
        {/* Rendu des tables */}
        {tables.map(table => (
          <Table
            key={table.id}
            table={table}
            isSelected={selectedId === table.id}
            onSelect={onSelect}
            onUpdate={onUpdate}
            scale={1}
          />
        ))}

        {/* Rendu des obstacles */}
        {obstacles.map(obstacle => (
          <Obstacle
            key={obstacle.id}
            obstacle={obstacle}
            isSelected={selectedId === obstacle.id}
            onSelect={onSelect}
            onUpdate={onUpdate}
            scale={1}
          />
        ))}
      </div>
    </div>
  );
};

// Composant principal
const FloorPlanEditor = () => {
  // État principal
  const [tables, setTables] = useState([
    { id: 1, x: 100, y: 100, width: 80, height: 80, shape: SHAPES.RECTANGLE, capacity: 4, label: 'Table 1', color: '#e3f2fd' },
    { id: 2, x: 250, y: 150, width: 60, height: 60, shape: SHAPES.CIRCLE, capacity: 2, label: 'Table 2', color: '#e8f5e8' }
  ]);
  
  const [obstacles, setObstacles] = useState([
    { id: 1, x: 50, y: 300, width: 200, height: 30, shape: SHAPES.RECTANGLE, color: '#ffcdd2' }
  ]);

  const [selectedId, setSelectedId] = useState(null);
  const [tool, setTool] = useState(TOOLS.SELECT);
  const [zoom, setZoom] = useState(1);
  const [canvasSize] = useState({ width: 800, height: 600 });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Historique pour undo/redo
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Propriétés de l'élément sélectionné
  const [newTableProps, setNewTableProps] = useState({
    width: 80,
    height: 80,
    capacity: 4,
    shape: SHAPES.RECTANGLE,
    color: '#e3f2fd'
  });

  const [newObstacleProps, setNewObstacleProps] = useState({
    width: 100,
    height: 30,
    shape: SHAPES.RECTANGLE,
    color: '#ffcdd2'
  });

  // Sélection actuelle
  const selectedItem = useMemo(() => {
    if (!selectedId) return null;
    return tables.find(t => t.id === selectedId) || obstacles.find(o => o.id === selectedId);
  }, [selectedId, tables, obstacles]);

  // Handlers
  const showMessage = useCallback((message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const saveToHistory = useCallback((newTables, newObstacles) => {
    const newState = { tables: newTables, obstacles: newObstacles };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setTables(prevState.tables);
      setObstacles(prevState.obstacles);
      setHistoryIndex(historyIndex - 1);
      showMessage('Action annulée');
    }
  }, [history, historyIndex, showMessage]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setTables(nextState.tables);
      setObstacles(nextState.obstacles);
      setHistoryIndex(historyIndex + 1);
      showMessage('Action refaite');
    }
  }, [history, historyIndex, showMessage]);

  const handleSelect = useCallback((id) => {
    setSelectedId(id);
  }, []);

  const handleUpdate = useCallback((id, updates) => {
    setTables(prev => {
      const newTables = prev.map(table => 
        table.id === id ? { ...table, ...updates } : table
      );
      if (newTables !== prev) {
        saveToHistory(newTables, obstacles);
        return newTables;
      }
      return prev;
    });

    setObstacles(prev => {
      const newObstacles = prev.map(obstacle => 
        obstacle.id === id ? { ...obstacle, ...updates } : obstacle
      );
      if (newObstacles !== prev) {
        saveToHistory(tables, newObstacles);
        return newObstacles;
      }
      return prev;
    });
  }, [tables, obstacles, saveToHistory]);

  const handleAdd = useCallback((type, position) => {
    if (type === 'table') {
      const newTable = {
        id: Math.max(...tables.map(t => t.id), 0) + 1,
        x: position.x,
        y: position.y,
        label: `Table ${tables.length + 1}`,
        ...newTableProps
      };
      const newTables = [...tables, newTable];
      setTables(newTables);
      saveToHistory(newTables, obstacles);
      showMessage('Table ajoutée');
    } else if (type === 'obstacle') {
      const newObstacle = {
        id: Math.max(...obstacles.map(o => o.id), 0) + 1,
        x: position.x,
        y: position.y,
        ...newObstacleProps
      };
      const newObstacles = [...obstacles, newObstacle];
      setObstacles(newObstacles);
      saveToHistory(tables, newObstacles);
      showMessage('Obstacle ajouté');
    }
    setTool(TOOLS.SELECT);
  }, [tables, obstacles, newTableProps, newObstacleProps, saveToHistory, showMessage]);

  const handleDelete = useCallback(() => {
    if (!selectedId) return;

    const newTables = tables.filter(t => t.id !== selectedId);
    const newObstacles = obstacles.filter(o => o.id !== selectedId);
    
    setTables(newTables);
    setObstacles(newObstacles);
    setSelectedId(null);
    saveToHistory(newTables, newObstacles);
    showMessage('Élément supprimé');
  }, [selectedId, tables, obstacles, saveToHistory, showMessage]);

  const handleSave = useCallback(() => {
    const floorPlan = {
      name: 'Mon Plan de Salle',
      tables,
      obstacles,
      createdAt: new Date().toISOString()
    };
    
    // Simulation de sauvegarde
    console.log('Sauvegarde du plan:', floorPlan);
    showMessage('Plan sauvegardé avec succès');
  }, [tables, obstacles, showMessage]);

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Panel gauche - Outils */}
      <Paper sx={{ width: 300, p: 2, m: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom>
          Éditeur de Plan de Salle
        </Typography>

        {/* Outils */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Outils
          </Typography>
          <ButtonGroup orientation="vertical" fullWidth>
            <Button
              variant={tool === TOOLS.SELECT ? 'contained' : 'outlined'}
              startIcon={<SelectIcon />}
              onClick={() => setTool(TOOLS.SELECT)}
            >
              Sélection
            </Button>
            <Button
              variant={tool === TOOLS.ADD_TABLE ? 'contained' : 'outlined'}
              startIcon={<TableIcon />}
              onClick={() => setTool(TOOLS.ADD_TABLE)}
            >
              Ajouter Table
            </Button>
            <Button
              variant={tool === TOOLS.ADD_OBSTACLE ? 'contained' : 'outlined'}
              startIcon={<ObstacleIcon />}
              onClick={() => setTool(TOOLS.ADD_OBSTACLE)}
            >
              Ajouter Obstacle
            </Button>
            <Button
              variant={tool === TOOLS.PAN ? 'contained' : 'outlined'}
              startIcon={<PanIcon />}
              onClick={() => setTool(TOOLS.PAN)}
            >
              Déplacer Vue
            </Button>
          </ButtonGroup>
        </Box>

        {/* Actions */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Actions
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <IconButton 
              onClick={undo} 
              disabled={historyIndex <= 0}
              title="Annuler"
            >
              <UndoIcon />
            </IconButton>
            <IconButton 
              onClick={redo} 
              disabled={historyIndex >= history.length - 1}
              title="Refaire"
            >
              <RedoIcon />
            </IconButton>
            <IconButton 
              onClick={() => setZoom(Math.min(zoom + 0.1, 2))}
              title="Zoom +"
            >
              <ZoomInIcon />
            </IconButton>
            <IconButton 
              onClick={() => setZoom(Math.max(zoom - 0.1, 0.5))}
              title="Zoom -"
            >
              <ZoomOutIcon />
            </IconButton>
            <IconButton 
              onClick={handleDelete} 
              disabled={!selectedId}
              color="error"
              title="Supprimer"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Zoom */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Zoom: {Math.round(zoom * 100)}%
          </Typography>
          <Slider
            value={zoom}
            min={0.5}
            max={2}
            step={0.1}
            onChange={(_, value) => setZoom(value)}
          />
        </Box>

        {/* Propriétés des nouvelles tables */}
        {tool === TOOLS.ADD_TABLE && (
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                Propriétés des Tables
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl size="small">
                  <InputLabel>Forme</InputLabel>
                  <Select
                    value={newTableProps.shape}
                    onChange={(e) => setNewTableProps(prev => ({ ...prev, shape: e.target.value }))}
                  >
                    <MenuItem value={SHAPES.RECTANGLE}>Rectangle</MenuItem>
                    <MenuItem value={SHAPES.CIRCLE}>Cercle</MenuItem>
                    <MenuItem value={SHAPES.SQUARE}>Carré</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Largeur"
                  type="number"
                  size="small"
                  value={newTableProps.width}
                  onChange={(e) => setNewTableProps(prev => ({ ...prev, width: Number(e.target.value) }))}
                />
                <TextField
                  label="Hauteur"
                  type="number"
                  size="small"
                  value={newTableProps.height}
                  onChange={(e) => setNewTableProps(prev => ({ ...prev, height: Number(e.target.value) }))}
                />
                <TextField
                  label="Capacité"
                  type="number"
                  size="small"
                  value={newTableProps.capacity}
                  onChange={(e) => setNewTableProps(prev => ({ ...prev, capacity: Number(e.target.value) }))}
                />
                <TextField
                  label="Couleur"
                  type="color"
                  size="small"
                  value={newTableProps.color}
                  onChange={(e) => setNewTableProps(prev => ({ ...prev, color: e.target.value }))}
                />
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Propriétés des nouveaux obstacles */}
        {tool === TOOLS.ADD_OBSTACLE && (
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                Propriétés des Obstacles
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl size="small">
                  <InputLabel>Forme</InputLabel>
                  <Select
                    value={newObstacleProps.shape}
                    onChange={(e) => setNewObstacleProps(prev => ({ ...prev, shape: e.target.value }))}
                  >
                    <MenuItem value={SHAPES.RECTANGLE}>Rectangle</MenuItem>
                    <MenuItem value={SHAPES.CIRCLE}>Cercle</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Largeur"
                  type="number"
                  size="small"
                  value={newObstacleProps.width}
                  onChange={(e) => setNewObstacleProps(prev => ({ ...prev, width: Number(e.target.value) }))}
                />
                <TextField
                  label="Hauteur"
                  type="number"
                  size="small"
                  value={newObstacleProps.height}
                  onChange={(e) => setNewObstacleProps(prev => ({ ...prev, height: Number(e.target.value) }))}
                />
                <TextField
                  label="Couleur"
                  type="color"
                  size="small"
                  value={newObstacleProps.color}
                  onChange={(e) => setNewObstacleProps(prev => ({ ...prev, color: e.target.value }))}
                />
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Propriétés de l'élément sélectionné */}
        {selectedItem && (
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                Élément Sélectionné
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {selectedItem.label !== undefined && (
                  <TextField
                    label="Nom"
                    size="small"
                    value={selectedItem.label || ''}
                    onChange={(e) => handleUpdate(selectedId, { label: e.target.value })}
                  />
                )}
                {selectedItem.capacity !== undefined && (
                  <TextField
                    label="Capacité"
                    type="number"
                    size="small"
                    value={selectedItem.capacity}
                    onChange={(e) => handleUpdate(selectedId, { capacity: Number(e.target.value) })}
                  />
                )}
                <TextField
                  label="Largeur"
                  type="number"
                  size="small"
                  value={selectedItem.width}
                  onChange={(e) => handleUpdate(selectedId, { width: Number(e.target.value) })}
                />
                <TextField
                  label="Hauteur"
                  type="number"
                  size="small"
                  value={selectedItem.height}
                  onChange={(e) => handleUpdate(selectedId, { height: Number(e.target.value) })}
                />
                <TextField
                  label="Couleur"
                  type="color"
                  size="small"
                  value={selectedItem.color}
                  onChange={(e) => handleUpdate(selectedId, { color: e.target.value })}
                />
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Statistiques */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle2" gutterBottom>
              Statistiques
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Chip 
                label={`${tables.length} Tables`} 
                color="primary" 
                size="small" 
              />
              <Chip 
                label={`${obstacles.length} Obstacles`} 
                color="secondary" 
                size="small" 
              />
              <Chip 
                label={`${tables.reduce((sum, t) => sum + t.capacity, 0)} Places`} 
                color="success" 
                size="small" 
              />
            </Box>
          </CardContent>
        </Card>

        <Divider sx={{ mb: 2 }} />

        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          fullWidth
        >
          Sauvegarder le Plan
        </Button>
      </Paper>

      {/* Zone principale - Canvas */}
      <Box sx={{ flex: 1, p: 1, display: 'flex', flexDirection: 'column' }}>
        <Paper sx={{ flex: 1, p: 2 }}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Plan de Salle
            </Typography>
            <Box>
              {tool !== TOOLS.SELECT && (
                <Alert severity="info" sx={{ display: 'inline-flex' }}>
                  Mode: {tool === TOOLS.ADD_TABLE ? 'Ajout de table' : 
                          tool === TOOLS.ADD_OBSTACLE ? 'Ajout d\'obstacle' : 
                          'Déplacement de vue'} - Cliquez sur le canvas
                </Alert>
              )}
            </Box>
          </Box>
          
          <Canvas
            tables={tables}
            obstacles={obstacles}
            selectedId={selectedId}
            onSelect={handleSelect}
            onUpdate={handleUpdate}
            onAdd={handleAdd}
            tool={tool}
            zoom={zoom}
            canvasSize={canvasSize}
          />
        </Paper>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        message={snackbar.message}
      />
    </Box>
  );
};

export default FloorPlanEditor;