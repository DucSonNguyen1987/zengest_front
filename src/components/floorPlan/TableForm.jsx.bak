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
  InputAdornment
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { ChromePicker } from 'react-color';
import { useColorMode } from '../../context/ThemeContext';

const TableForm = ({ onSubmit, initialValues, isEdit = false }) => {
  const theme = useTheme();
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  
  // État pour le sélecteur de couleur
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  
  // État du formulaire
  const [formValues, setFormValues] = React.useState({
    label: '',
    capacity: 4,
    shape: 'rectangle',
    width: 80,
    height: 80,
    color: '#f0f0f0',
    x: 100,
    y: 100,
    rotation: 0,
    ...initialValues
  });
  
  // Mettre à jour les valeurs du formulaire quand initialValues change
  useEffect(() => {
    if (initialValues) {
      setFormValues(initialValues);
    } else {
      setFormValues({
        label: '',
        capacity: 4,
        shape: 'rectangle',
        width: 80,
        height: 80,
        color: '#f0f0f0',
        x: 100,
        y: 100,
        rotation: 0,
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
  
  // Gérer la soumission du formulaire
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...formValues,
      id: initialValues?.id || `table-${Date.now()}`,
    });
    
    if (!isEdit) {
      setFormValues({
        label: '',
        capacity: 4,
        shape: 'rectangle',
        width: 80,
        height: 80,
        color: '#f0f0f0',
        x: 100,
        y: 100,
        rotation: 0,
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
        {isEdit ? 'Modifier la table' : 'Ajouter une table'}
      </Typography>
      
      <Box 
        component="form" 
        onSubmit={handleSubmit} 
        noValidate
      >
        <Grid container spacing={2}>
          {/* Numéro/Nom de la table */}
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="label"
              name="label"
              label="Numéro/Nom de la table"
              placeholder="Ex: Table 1"
              value={formValues.label}
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
          
          {/* Capacité */}
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="capacity"
              name="capacity"
              label="Capacité (personnes)"
              type="number"
              value={formValues.capacity}
              onChange={handleNumberChange('capacity')}
              variant="outlined"
              inputProps={{ min: 1, max: 20 }}
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
                <MenuItem value="rectangle">Rectangle</MenuItem>
                <MenuItem value="circle">Rond</MenuItem>
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
                  label="Largeur"
                  type="number"
                  value={formValues.width}
                  onChange={handleNumberChange('width')}
                  variant="outlined"
                  inputProps={{ min: 30, max: 200 }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">L</InputAdornment>,
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
                  id="height"
                  name="height"
                  label="Hauteur"
                  type="number"
                  value={formValues.height}
                  onChange={handleNumberChange('height')}
                  variant="outlined"
                  inputProps={{ min: 30, max: 200 }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">H</InputAdornment>,
                    sx: {
                      backdropFilter: 'blur(4px)',
                      backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.4 : 0.6),
                    }
                  }}
                />
              </Grid>
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
          
          {/* Couleur */}
          <Grid item xs={12}>
            <Typography 
              variant="subtitle2" 
              sx={{ mb: 1, color: theme.palette.text.secondary }}
            >
              Couleur
            </Typography>
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
                '&:hover': {
                  boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                }
              }}
            />
            
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
            }
          }}
        >
          {isEdit ? 'Mettre à jour la table' : 'Ajouter la table'}
        </Button>
      </Box>
    </Paper>
  );
};

export default TableForm;