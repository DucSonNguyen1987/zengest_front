import React, { useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Grid, 
  Paper, 
  Typography
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { useColorMode } from '../../context/ThemeContext';

const FloorPlanForm = ({ onSubmit, initialValues, isEdit = false }) => {
  const theme = useTheme();
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  
  // État du formulaire
  const [formValues, setFormValues] = React.useState({
    name: '',
    description: '',
    ...initialValues
  });
  
  // Mettre à jour les valeurs du formulaire quand initialValues change
  useEffect(() => {
    if (initialValues) {
      setFormValues(initialValues);
    } else {
      setFormValues({
        name: '',
        description: '',
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
  
  // Gérer la soumission du formulaire
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...formValues,
      id: initialValues?.id || `floor-plan-${Date.now()}`,
      tables: initialValues?.tables || [],
    });
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
        {isEdit ? 'Modifier le plan de salle' : 'Nouveau plan de salle'}
      </Typography>
      
      <Box 
        component="form" 
        onSubmit={handleSubmit} 
        noValidate
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="name"
              name="name"
              label="Nom du plan"
              placeholder="Ex: Salle principale"
              value={formValues.name}
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
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="description"
              name="description"
              label="Description"
              placeholder="Description du plan de salle"
              value={formValues.description}
              onChange={handleChange}
              variant="outlined"
              multiline
              rows={4}
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
          {isEdit ? 'Mettre à jour le plan' : 'Créer le plan'}
        </Button>
      </Box>
    </Paper>
  );
};

export default FloorPlanForm;