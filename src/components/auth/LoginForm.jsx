import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
  Link as MuiLink
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useColorMode } from '../../context/ThemeContext';

const LoginForm = () => {
  const theme = useTheme();
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  
  // Utilisation du hook d'authentification
  const { login, loading } = useAuth();
  
  // États du formulaire
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  
  // Fonction pour gérer les changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'remember' ? checked : value,
    });
  };
  
  // Fonction pour basculer la visibilité du mot de passe
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Fonction appelée à la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      // La redirection est gérée par le composant parent (page Login)
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography 
        variant="h5" 
        component="h2" 
        align="center" 
        gutterBottom 
        sx={{ 
          mb: 3,
          fontWeight: 600,
          color: theme.palette.text.primary
        }}
      >
        Connexion
      </Typography>

      <Box 
        component="form" 
        onSubmit={handleSubmit} 
        noValidate
      >
        {/* Champ Email */}
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Adresse email"
          name="email"
          autoComplete="email"
          autoFocus
          value={formData.email}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{ 
            mb: 2,
            '& .MuiOutlinedInput-root': {
              backdropFilter: 'blur(4px)',
              backgroundColor: isDark 
                ? alpha(theme.palette.background.paper, 0.4)
                : alpha(theme.palette.background.paper, 0.6),
              '&:hover': {
                backgroundColor: isDark 
                  ? alpha(theme.palette.background.paper, 0.5)
                  : alpha(theme.palette.background.paper, 0.7),
              },
              '&.Mui-focused': {
                backgroundColor: isDark 
                  ? alpha(theme.palette.background.paper, 0.6)
                  : alpha(theme.palette.background.paper, 0.8),
              }
            }
          }}
        />

        {/* Champ Mot de passe */}
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Mot de passe"
          type={showPassword ? 'text' : 'password'}
          id="password"
          autoComplete="current-password"
          value={formData.password}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon color="primary" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleTogglePasswordVisibility}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ 
            mb: 2,
            '& .MuiOutlinedInput-root': {
              backdropFilter: 'blur(4px)',
              backgroundColor: isDark 
                ? alpha(theme.palette.background.paper, 0.4)
                : alpha(theme.palette.background.paper, 0.6),
              '&:hover': {
                backgroundColor: isDark 
                  ? alpha(theme.palette.background.paper, 0.5)
                  : alpha(theme.palette.background.paper, 0.7),
              },
              '&.Mui-focused': {
                backgroundColor: isDark 
                  ? alpha(theme.palette.background.paper, 0.6)
                  : alpha(theme.palette.background.paper, 0.8),
              }
            }
          }}
        />

        {/* Option pour "se souvenir de moi" et "Mot de passe oublié" */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3
        }}>
          <FormControlLabel
            control={
              <Checkbox 
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
                color="primary"
              />
            }
            label="Se souvenir de moi"
          />
          
          <MuiLink 
            component={Link} 
            to="/forgot-password" 
            variant="body2"
            underline="hover"
            sx={{ 
              color: theme.palette.primary.main
            }}
          >
            Mot de passe oublié?
          </MuiLink>
        </Box>

        {/* Bouton de soumission */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ 
            py: 1.5,
            mb: 3,
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
          {loading ? 'Connexion...' : 'Connexion'}
        </Button>

        {/* Lien vers la page d'inscription */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            Pas encore de compte?{' '}
            <MuiLink 
              component={Link} 
              to="/register" 
              variant="body2" 
              underline="hover"
              sx={{ 
                fontWeight: 'medium',
                color: theme.palette.primary.main
              }}
            >
              S'inscrire
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginForm;