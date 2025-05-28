import React, { useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Grid, 
  Paper, 
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Slider,
  InputAdornment,
  Chip,
  Tooltip,
  Divider,
  Alert
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { ChromePicker } from 'react-color';
import { useColorMode } from '../../context/ThemeContext';

const ObstacleForm = ({ onSubmit, initialValues, isEdit = false }) => {
  const theme = useTheme();
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  
  // État pour le sélecteur de couleur
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  
  // ✅ MISE À JOUR: Presets de couleurs étendus pour tous les types d'obstacles
  const colorPresets = {
    mur: '#8B4513',        // Marron pour les murs
    poteau: '#696969',     // Gris pour les poteaux  
    porte: '#DEB887',      // Beige pour les portes
    escalier: '#4682B4',   // Bleu acier pour les escaliers
    bar: '#2F4F4F',        // Gris ardoise pour le bar
    cuisine: '#FF6347',    // Rouge tomate pour la cuisine
    toilettes: '#87CEEB',   // Bleu ciel pour les toilettes
    decoration: '#9370DB',  // Violet moyen pour la décoration
    mobilier: '#CD853F',   // Brun pour le mobilier
    technique: '#FF8C00',  // Orange pour l'équipement technique
    autre: '#FF6384'       // Rose pour les autres
  };
  
  // ✅ MISE À JOUR: Configurations par défaut selon le type
  const getDefaultConfig = (category) => {
    const configs = {
      mur: { width: 150, height: 20, shape: 'rectangle' },
      poteau: { width: 40, height: 40, shape: 'circle' },
      porte: { width: 80, height: 15, shape: 'rectangle' },
      escalier: { width: 120, height: 80, shape: 'rectangle' },
      bar: { width: 200, height: 60, shape: 'rectangle' },
      cuisine: { width: 100, height: 100, shape: 'rectangle' },
      toilettes: { width: 80, height: 80, shape: 'rectangle' },
      decoration: { width: 50, height: 50, shape: 'circle' },
      mobilier: { width: 100, height: 60, shape: 'rectangle' },
      technique: { width: 60, height: 60, shape: 'rectangle' },
      autre: { width: 80, height: 30, shape: 'rectangle' }
    };
    
    return configs[category] || configs.autre;
  };
  
  // ✅ HELPER: Obtenir le nom d'affichage d'une catégorie
  const getCategoryDisplayName = (category) => {
    const displayNames = {
      mur: 'Mur',
      poteau: 'Poteau',
      porte: 'Porte',
      escalier: 'Escalier',
      bar: 'Comptoir',
      cuisine: 'Zone cuisine',
      toilettes: 'Toilettes',
      decoration: 'Décoration',
      mobilier: 'Mobilier',
      technique: 'Équipement',
      autre: 'Obstacle'
    };
    
    return displayNames[category] || 'Obstacle';
  };
  
  // État du formulaire
  const [formValues, setFormValues] = React.useState({
    category: 'mur',
    name: '',
    shape: 'rectangle',
    width: 100,
    height: 30,
    color: '#8B4513',
    x: 100,
    y: 100,
    rotation: 0,
    description: '',
    ...initialValues
  });
  
  // Mettre à jour les valeurs du formulaire quand initialValues change
  useEffect(() => {
    if (initialValues) {
      setFormValues({
        category: 'mur',
        name: '',
        shape: 'rectangle',
        width: 100,
        height: 30,
        color: '#8B4513',
        x: 100,
        y: 100,
        rotation: 0,
        description: '',
        ...initialValues
      });
    }
  }, [initialValues]);
  
  // Gérer les changements dans le formulaire
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Gérer les changements numériques
  const handleNumberChange = (name) => (event) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value)) {
      setFormValues(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Gérer le changement de rotation avec le slider
  const handleRotationChange = (event, newValue) => {
    setFormValues(prev => ({
      ...prev,
      rotation: newValue
    }));
  };
  
  // Gérer le changement de couleur
  const handleColorChange = (color) => {
    setFormValues(prev => ({
      ...prev,
      color: color.hex
    }));
  };
  
  // ✅ MISE À JOUR: Gérer le changement de catégorie avec configuration automatique
  const handleCategoryChange = (event) => {
    const category = event.target.value;
    const defaultConfig = getDefaultConfig(category);
    
    setFormValues(prev => ({
      ...prev,
      category: category,
      color: colorPresets[category] || prev.color,
      // Appliquer la configuration par défaut seulement si c'est un nouvel obstacle
      ...(isEdit ? {} : {
        width: defaultConfig.width,
        height: defaultConfig.height,
        shape: defaultConfig.shape
      }),
      // Mettre à jour le nom si ce n'est pas défini
      name: prev.name || getCategoryDisplayName(category)
    }));
  };
  
  // Gérer la soumission du formulaire
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...formValues,
      id: initialValues?.id || `obstacle-${Date.now()}`,
      type: 'obstacle',
      // S'assurer que le nom est défini
      name: formValues.name || getCategoryDisplayName(formValues.category),
      // Ajouter des métadonnées
      createdAt: initialValues?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    // Réinitialiser le formulaire seulement si ce n'est pas une édition
    if (!isEdit) {
      const defaultCategory = 'mur';
      const defaultConfig = getDefaultConfig(defaultCategory);
      
      setFormValues({
        category: defaultCategory,
        name: '',
        shape: defaultConfig.shape,
        width: defaultConfig.width,
        height: defaultConfig.height,
        color: colorPresets[defaultCategory],
        x: 100,
        y: 100,
        rotation: 0,
        description: ''
      });
    }
  };
  
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.7 : 0.8),
        backdropFilter: 'blur(10px)',
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 2,
          color: theme.palette.text.primary,
          fontWeight: 500
        }}
      >
        {isEdit ? 'Modifier l\'obstacle' : 'Ajouter un obstacle'}
      </Typography>
      
      {/* Aperçu de l'obstacle */}
      {formValues.category && (
        <Alert 
          severity="info" 
          sx={{ 
            mb: 2,
            backgroundColor: alpha(colorPresets[formValues.category], 0.1),
            borderColor: alpha(colorPresets[formValues.category], 0.3)
          }}
        >
          <Typography variant="body2">
            <strong>Type:</strong> {getCategoryDisplayName(formValues.category)} | 
            <strong> Forme:</strong> {formValues.shape === 'circle' ? 'Rond' : formValues.shape === 'triangle' ? 'Triangle' : 'Rectangle'} | 
            <strong> Taille:</strong> {formValues.width}×{formValues.height}px
          </Typography>
        </Alert>
      )}
      
      <Box 
        component="form" 
        onSubmit={handleSubmit} 
        noValidate
      >
        <Grid container spacing={2}>
          {/* Catégorie d'obstacle */}
          <Grid item xs={12}>
            <FormControl 
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backdropFilter: 'blur(4px)',
                  backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.4 : 0.6),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.5 : 0.7),
                  },
                  '&.Mui-focused': {
                    backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.6 : 0.8),
                  }
                }
              }}
            >
              <InputLabel id="category-label">Type d'obstacle</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                name="category"
                value={formValues.category}
                onChange={handleCategoryChange}
                label="Type d'obstacle"
              >
                <MenuItem value="mur">🧱 Mur</MenuItem>
                <MenuItem value="poteau">🏛️ Poteau</MenuItem>
                <MenuItem value="porte">🚪 Porte</MenuItem>
                <MenuItem value="escalier">🪜 Escalier</MenuItem>
                <MenuItem value="bar">🍺 Comptoir/Bar</MenuItem>
                <MenuItem value="cuisine">👨‍🍳 Zone cuisine</MenuItem>
                <MenuItem value="toilettes">🚻 Toilettes</MenuItem>
                <MenuItem value="decoration">🌿 Décoration</MenuItem>
                <MenuItem value="mobilier">🛋️ Mobilier fixe</MenuItem>
                <MenuItem value="technique">⚡ Équipement technique</MenuItem>
                <MenuItem value="autre">❓ Autre</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {/* Nom/Label de l'obstacle */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Nom de l'obstacle"
              placeholder="Ex: Mur principal, Poteau central..."
              value={formValues.name || ''}
              onChange={handleChange}
              variant="outlined"
              InputProps={{
                sx: {
                  backdropFilter: 'blur(4px)',
                  backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.4 : 0.6),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.5 : 0.7),
                  },
                  '&.Mui-focused': {
                    backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.6 : 0.8),
                  }
                }
              }}
            />
          </Grid>
          
          {/* Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="description"
              name="description"
              label="Description (optionnel)"
              placeholder="Ex: Mur porteur, Colonne décorative..."
              value={formValues.description}
              onChange={handleChange}
              variant="outlined"
              multiline
              rows={2}
              InputProps={{
                sx: {
                  backdropFilter: 'blur(4px)',
                  backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.4 : 0.6),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.5 : 0.7),
                  },
                  '&.Mui-focused': {
                    backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.6 : 0.8),
                  }
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Propriétés géométriques
              </Typography>
            </Divider>
          </Grid>
          
          {/* Forme */}
          <Grid item xs={12}>
            <FormControl 
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backdropFilter: 'blur(4px)',
                  backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.4 : 0.6),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.5 : 0.7),
                  },
                  '&.Mui-focused': {
                    backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.6 : 0.8),
                  }
                }
              }}
            >
              <InputLabel id="shape-label">Forme</InputLabel>
              <Select
                labelId="shape-label"
                id="shape"
                name="shape"
                value={formValues.shape}
                onChange={handleChange}
                label="Forme"
              >
                <MenuItem value="rectangle">📐 Rectangle</MenuItem>
                <MenuItem value="circle">⭕ Rond</MenuItem>
                <MenuItem value="triangle">🔺 Triangle</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {/* Dimensions */}
          <Grid item xs={12}>
            <Typography 
              variant="subtitle2" 
              sx={{ mb: 1, color: theme.palette.text.secondary }}
            >
              Dimensions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  id="width"
                  name="width"
                  label={formValues.shape === 'circle' ? 'Diamètre' : 'Largeur'}
                  type="number"
                  value={formValues.width}
                  onChange={handleNumberChange('width')}
                  variant="outlined"
                  inputProps={{ min: 10, max: 500 }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">
                      {formValues.shape === 'circle' ? '⌀' : 'L'}
                    </InputAdornment>,
                    sx: {
                      backdropFilter: 'blur(4px)',
                      backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.4 : 0.6),
                    }
                  }}
                />
              </Grid>
              {formValues.shape !== 'circle' && (
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    id="height"
                    name="height"
                    label="Hauteur"
                    type="number"
                    value={formValues.height}
                    onChange={handleNumberChange('height')}
                    variant="outlined"
                    inputProps={{ min: 10, max: 500 }}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">H</InputAdornment>,
                      sx: {
                        backdropFilter: 'blur(4px)',
                        backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.4 : 0.6),
                      }
                    }}
                  />
                </Grid>
              )}
            </Grid>
          </Grid>
          
          {/* Position */}
          <Grid item xs={12}>
            <Typography 
              variant="subtitle2" 
              sx={{ mb: 1, color: theme.palette.text.secondary }}
            >
              Position (x, y)
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  id="x"
                  name="x"
                  label="Position X"
                  type="number"
                  value={formValues.x}
                  onChange={handleNumberChange('x')}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">X</InputAdornment>,
                    sx: {
                      backdropFilter: 'blur(4px)',
                      backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.4 : 0.6),
                    }
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  id="y"
                  name="y"
                  label="Position Y"
                  type="number"
                  value={formValues.y}
                  onChange={handleNumberChange('y')}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">Y</InputAdornment>,
                    sx: {
                      backdropFilter: 'blur(4px)',
                      backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.4 : 0.6),
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          
          {/* Rotation */}
          <Grid item xs={12}>
            <Typography 
              variant="subtitle2"
              gutterBottom
              sx={{ color: theme.palette.text.secondary }}
            >
              Rotation: {formValues.rotation}°
            </Typography>
            <Slider
              value={formValues.rotation}
              onChange={handleRotationChange}
              aria-labelledby="rotation-slider"
              min={0}
              max={359}
              step={5}
              marks={[
                { value: 0, label: '0°' },
                { value: 90, label: '90°' },
                { value: 180, label: '180°' },
                { value: 270, label: '270°' }
              ]}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value}°`}
              sx={{
                color: theme.palette.primary.main,
                '& .MuiSlider-thumb': {
                  backgroundColor: theme.palette.primary.main,
                  boxShadow: `0 0 0 8px ${alpha(theme.palette.primary.main, 0.1)}`,
                },
                '& .MuiSlider-rail': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.2),
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Apparence
              </Typography>
            </Divider>
          </Grid>
          
          {/* Couleur avec presets */}
          <Grid item xs={12}>
            <Typography 
              variant="subtitle2" 
              sx={{ mb: 1, color: theme.palette.text.secondary }}
            >
              Couleur
            </Typography>
            
            {/* Presets de couleurs */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              {Object.entries(colorPresets).map(([category, color]) => (
                <Tooltip key={category} title={getCategoryDisplayName(category)}>
                  <Chip
                    label={getCategoryDisplayName(category)}
                    clickable
                    size="small"
                    sx={{
                      backgroundColor: color,
                      color: 'white',
                      border: formValues.color === color ? '2px solid white' : 'none',
                      boxShadow: formValues.color === color ? `0 0 0 2px ${color}` : 'none',
                      '&:hover': {
                        backgroundColor: color,
                        opacity: 0.8,
                        transform: 'scale(1.05)',
                      },
                      transition: 'all 0.2s'
                    }}
                    onClick={() => setFormValues(prev => ({ ...prev, color }))}
                  />
                </Tooltip>
              ))}
            </Box>
            
            {/* Sélecteur de couleur principal */}
            <Box
              onClick={() => setShowColorPicker(!showColorPicker)}
              sx={{
                width: '100%',
                height: 40,
                backgroundColor: formValues.color,
                cursor: 'pointer',
                borderRadius: 1,
                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': {
                  boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                  transform: 'scale(1.02)',
                }
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'white', 
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                  fontWeight: 'medium'
                }}
              >
                Cliquer pour personnaliser la couleur
              </Typography>
            </Box>
            
            {showColorPicker && (
              <Box 
                sx={{ 
                  position: 'relative', 
                  zIndex: 10, 
                  mt: 2,
                  mb: 2 
                }}
              >
                <Box 
                  sx={{ 
                    position: 'fixed', 
                    top: 0, 
                    right: 0, 
                    bottom: 0, 
                    left: 0 
                  }} 
                  onClick={() => setShowColorPicker(false)} 
                />
                <ChromePicker 
                  color={formValues.color} 
                  onChange={handleColorChange} 
                  disableAlpha
                />
              </Box>
            )}
          </Grid>
        </Grid>
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ 
            mt: 3,
            py: 1.5,
            borderRadius: 2,
            boxShadow: isDark 
              ? `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`
              : `0 4px 14px ${alpha(theme.palette.primary.main, 0.3)}`,
            background: isDark
              ? `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.9)}, ${alpha(theme.palette.primary.light, 0.9)})`
              : `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
            '&:hover': {
              boxShadow: isDark 
                ? `0 6px 20px ${alpha(theme.palette.primary.main, 0.6)}`
                : `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease'
          }}
        >
          {isEdit ? 'Mettre à jour l\'obstacle' : 'Ajouter l\'obstacle'}
        </Button>
      </Box>
    </Paper>
  );
};

export default ObstacleForm;