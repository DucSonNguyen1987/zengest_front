import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton
} from '@mui/material';
import {
  Download as DownloadIcon,
  Upload as UploadIcon,
  ContentCopy as CopyIcon,
  Settings as SettingsIcon,
  History as HistoryIcon,
  Share as ShareIcon,
  Print as PrintIcon,
  Visibility as PreviewIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { useColorMode } from '../../context/ThemeContext';

const FloorPlanUtils = ({ 
  currentFloorPlan, 
  onImport, 
  onExport, 
  onDuplicate,
  onReset,
  canEdit = false 
}) => {
  const theme = useTheme();
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  
  const [openDialog, setOpenDialog] = useState(null);
  const [exportFormat, setExportFormat] = useState('json');
  const [importData, setImportData] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Gérer l'export du plan
  const handleExport = () => {
    if (!currentFloorPlan) return;
    
    try {
      let dataToExport;
      let filename;
      let mimeType;
      
      switch (exportFormat) {
        case 'json': {
          dataToExport = JSON.stringify(currentFloorPlan, null, 2);
          filename = `${currentFloorPlan.name || 'floor-plan'}.json`;
          mimeType = 'application/json';
          break;
        }
          
        case 'csv': {
          // Export des tables en CSV
          const csvHeaders = 'ID,Label,Capacity,Shape,X,Y,Width,Height,Color\n';
          const csvRows = currentFloorPlan.tables?.map(table => 
            `${table.id},${table.label},${table.capacity},${table.shape},${table.x},${table.y},${table.width},${table.height},${table.color}`
          ).join('\n') || '';
          dataToExport = csvHeaders + csvRows;
          filename = `${currentFloorPlan.name || 'floor-plan'}-tables.csv`;
          mimeType = 'text/csv';
          break;
        }
          
        case 'svg': {
          // Export basique en SVG (simplifié)
          const svgContent = generateSVG(currentFloorPlan);
          dataToExport = svgContent;
          filename = `${currentFloorPlan.name || 'floor-plan'}.svg`;
          mimeType = 'image/svg+xml';
          break;
        }
          
        default:
          throw new Error('Format non supporté');
      }
      
      // Créer et télécharger le fichier
      const blob = new Blob([dataToExport], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setOpenDialog(null);
      onExport?.(currentFloorPlan, exportFormat);
      
    } catch (err) {
      setError(`Erreur lors de l'export: ${err.message}`);
    }
  };

  // Gérer l'import du plan
  const handleImport = () => {
    try {
      const parsedData = JSON.parse(importData);
      
      // Validation basique
      if (!parsedData.name || !Array.isArray(parsedData.tables)) {
        throw new Error('Format de données invalide');
      }
      
      onImport?.(parsedData);
      setOpenDialog(null);
      setImportData('');
      setError('');
      
    } catch (err) {
      setError(`Erreur lors de l'import: ${err.message}`);
    }
  };

  // Gérer l'import depuis un fichier
  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const parsedData = JSON.parse(content);
        onImport?.(parsedData);
        setOpenDialog(null);
        setError('');
      } catch (err) {
        setError(`Erreur lors de la lecture du fichier: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  // Générer un SVG basique (simplifié)
  const generateSVG = (plan) => {
    const width = 800;
    const height = 600;
    
    let svgContent = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
    svgContent += `<rect width="100%" height="100%" fill="${isDark ? '#1e1e1e' : '#f9f9f9'}"/>`;
    
    // Ajouter les tables
    plan.tables?.forEach(table => {
      if (table.shape === 'circle') {
        svgContent += `<circle cx="${table.x}" cy="${table.y}" r="${table.width/2}" fill="${table.color}" stroke="#333" stroke-width="1"/>`;
      } else {
        svgContent += `<rect x="${table.x - table.width/2}" y="${table.y - table.height/2}" width="${table.width}" height="${table.height}" fill="${table.color}" stroke="#333" stroke-width="1"/>`;
      }
      svgContent += `<text x="${table.x}" y="${table.y}" text-anchor="middle" dy=".3em" font-family="Arial" font-size="12">${table.label || table.id}</text>`;
    });
    
    // Ajouter les obstacles
    plan.obstacles?.forEach(obstacle => {
      if (obstacle.shape === 'circle') {
        svgContent += `<circle cx="${obstacle.x}" cy="${obstacle.y}" r="${obstacle.width/2}" fill="${obstacle.color}" stroke="#333" stroke-width="1"/>`;
      } else {
        svgContent += `<rect x="${obstacle.x - obstacle.width/2}" y="${obstacle.y - obstacle.height/2}" width="${obstacle.width}" height="${obstacle.height}" fill="${obstacle.color}" stroke="#333" stroke-width="1"/>`;
      }
    });
    
    svgContent += '</svg>';
    return svgContent;
  };

  // Calculer les statistiques du plan
  const getStatistics = () => {
    if (!currentFloorPlan) return null;
    
    const totalTables = currentFloorPlan.tables?.length || 0;
    const totalCapacity = currentFloorPlan.tables?.reduce((sum, table) => sum + (table.capacity || 0), 0) || 0;
    const totalObstacles = currentFloorPlan.obstacles?.length || 0;
    const avgCapacity = totalTables > 0 ? (totalCapacity / totalTables).toFixed(1) : 0;
    
    return {
      totalTables,
      totalCapacity,
      totalObstacles,
      avgCapacity,
      createdAt: currentFloorPlan.createdAt,
      updatedAt: currentFloorPlan.updatedAt
    };
  };

  const statistics = getStatistics();

  return (
    <Box>
      {/* Carte des utilitaires */}
      <Card
        elevation={0}
        sx={{
          backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.7 : 0.8),
          backdropFilter: 'blur(10px)',
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Utilitaires
          </Typography>
          
          <Grid container spacing={2}>
            {/* Export */}
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => setOpenDialog('export')}
                disabled={!currentFloorPlan}
                sx={{ textTransform: 'none' }}
              >
                Exporter
              </Button>
            </Grid>

            {/* Import */}
            {canEdit && (
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<UploadIcon />}
                  onClick={() => setOpenDialog('import')}
                  sx={{ textTransform: 'none' }}
                >
                  Importer
                </Button>
              </Grid>
            )}

            {/* Dupliquer */}
            {canEdit && (
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<CopyIcon />}
                  onClick={() => onDuplicate?.(currentFloorPlan)}
                  disabled={!currentFloorPlan}
                  sx={{ textTransform: 'none' }}
                >
                  Dupliquer
                </Button>
              </Grid>
            )}

            {/* Aperçu d'impression */}
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<PrintIcon />}
                onClick={() => setOpenDialog('print')}
                disabled={!currentFloorPlan}
                sx={{ textTransform: 'none' }}
              >
                Imprimer
              </Button>
            </Grid>

            {/* Réinitialiser */}
            {canEdit && (
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="warning"
                  startIcon={<DeleteIcon />}
                  onClick={() => setOpenDialog('reset')}
                  disabled={!currentFloorPlan}
                  sx={{ textTransform: 'none' }}
                >
                  Réinitialiser
                </Button>
              </Grid>
            )}
          </Grid>

          {/* Statistiques */}
          {statistics && (
            <Box sx={{ mt: 3 }}>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Statistiques du plan
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  label={`${statistics.totalTables} tables`} 
                  size="small" 
                  color="primary" 
                />
                <Chip 
                  label={`${statistics.totalCapacity} places`} 
                  size="small" 
                  color="success" 
                />
                <Chip 
                  label={`${statistics.avgCapacity} places/table`} 
                  size="small" 
                  color="info" 
                />
                {statistics.totalObstacles > 0 && (
                  <Chip 
                    label={`${statistics.totalObstacles} obstacles`} 
                    size="small" 
                    color="warning" 
                  />
                )}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Dialog d'export */}
      <Dialog 
        open={openDialog === 'export'} 
        onClose={() => setOpenDialog(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Exporter le plan de salle</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Format d'export</InputLabel>
              <Select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                label="Format d'export"
              >
                <MenuItem value="json">JSON (complet)</MenuItem>
                <MenuItem value="csv">CSV (tables uniquement)</MenuItem>
                <MenuItem value="svg">SVG (aperçu visuel)</MenuItem>
              </Select>
            </FormControl>

            <Alert severity="info">
              <Typography variant="body2">
                <strong>JSON:</strong> Format complet incluant toutes les données<br/>
                <strong>CSV:</strong> Données des tables pour analyse<br/>
                <strong>SVG:</strong> Image vectorielle pour impression
              </Typography>
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(null)}>
            Annuler
          </Button>
          <Button 
            onClick={handleExport} 
            variant="contained"
            startIcon={<DownloadIcon />}
          >
            Exporter
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog d'import */}
      <Dialog 
        open={openDialog === 'import'} 
        onClose={() => setOpenDialog(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Importer un plan de salle</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Méthode 1: Télécharger un fichier
            </Typography>
            <input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
            <Button
              variant="outlined"
              onClick={() => fileInputRef.current?.click()}
              startIcon={<UploadIcon />}
              sx={{ mb: 3 }}
            >
              Choisir un fichier JSON
            </Button>

            <Typography variant="subtitle2" gutterBottom>
              Méthode 2: Coller les données JSON
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={8}
              placeholder="Collez ici le contenu JSON du plan..."
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              variant="outlined"
            />

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(null)}>
            Annuler
          </Button>
          <Button 
            onClick={handleImport} 
            variant="contained"
            disabled={!importData.trim()}
            startIcon={<UploadIcon />}
          >
            Importer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog d'aperçu d'impression */}
      <Dialog 
        open={openDialog === 'print'} 
        onClose={() => setOpenDialog(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Aperçu d'impression</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              Fonctionnalité en développement. Vous pouvez exporter en SVG pour imprimer.
            </Alert>
            
            {statistics && (
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {currentFloorPlan?.name}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        <strong>Tables:</strong> {statistics.totalTables}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Capacité totale:</strong> {statistics.totalCapacity}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        <strong>Obstacles:</strong> {statistics.totalObstacles}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Capacité moyenne:</strong> {statistics.avgCapacity}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(null)}>
            Fermer
          </Button>
          <Button 
            onClick={() => {
              setExportFormat('svg');
              setOpenDialog('export');
            }}
            variant="contained"
            startIcon={<DownloadIcon />}
          >
            Exporter en SVG
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmation de réinitialisation */}
      <Dialog 
        open={openDialog === 'reset'} 
        onClose={() => setOpenDialog(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: theme.palette.warning.main }}>
          Réinitialiser le plan de salle
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Attention !</strong> Cette action va supprimer toutes les tables et obstacles du plan actuel.
              </Typography>
            </Alert>
            
            <Typography variant="body2" color="text.secondary">
              Cette action est irréversible. Voulez-vous vraiment réinitialiser le plan "{currentFloorPlan?.name}" ?
            </Typography>

            {statistics && (
              <Box sx={{ mt: 2, p: 2, backgroundColor: alpha(theme.palette.warning.main, 0.1), borderRadius: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  Éléments qui seront supprimés :
                </Typography>
                <Typography variant="body2">
                  • {statistics.totalTables} tables ({statistics.totalCapacity} places)
                </Typography>
                <Typography variant="body2">
                  • {statistics.totalObstacles} obstacles
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(null)}>
            Annuler
          </Button>
          <Button 
            onClick={() => {
              onReset?.(currentFloorPlan);
              setOpenDialog(null);
            }}
            color="warning"
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Réinitialiser
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FloorPlanUtils;