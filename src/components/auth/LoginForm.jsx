import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Login as LoginIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useTheme, alpha } from '@mui/material/styles';
import { useColorMode } from '../../context/ThemeContext';

const LoginForm = () => {
  const theme = useTheme();
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  const navigate = useNavigate();
  const { login } = useAuth();

  // ✅ États locaux définis
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false); // ✅ setLoading défini
  const [error, setError] = useState(''); // ✅ setError défini
  const [showPassword, setShowPassword] = useState(false);

  // Gestion des changements dans les inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur quand l'utilisateur tape
    if (error) {
      setError('');
    }
  };

  // Basculer la visibilité du mot de passe
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // ✅ Gestionnaire de soumission corrigé avec toutes les variables définies
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation basique
    if (!formData.email || !formData.password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    try {
      setLoading(true); // ✅ setLoading disponible
      setError(''); // ✅ setError disponible
      
      await login(formData);
      
      // Navigation après connexion réussie
      navigate('/dashboard'); // ✅ navigate disponible
      
    } catch (err) { // ✅ CORRECTION: Utiliser 'err' et non 'error'
      console.error('Erreur de connexion:', err); // ✅ CORRECTION: Utiliser 'err'
      setError(err.message || 'Erreur de connexion'); // ✅ setError disponible
    } finally {
      setLoading(false); // ✅ setLoading disponible
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isDark
          ? `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${alpha(theme.palette.primary.dark, 0.1)} 100%)`
          : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${theme.palette.background.default} 100%)`,
        padding: 2
      }}
    >
      <Paper
        elevation={isDark ? 8 : 4}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.9 : 0.95),
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`
        }}
      >
        {/* En-tête */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              color: theme.palette.primary.main,
              mb: 1
            }}
          >
            Connexion
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Connectez-vous à votre compte
          </Typography>
        </Box>

        {/* Affichage de l'erreur */}
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        {/* Formulaire */}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          {/* Champ email */}
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
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          {/* Champ mot de passe */}
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
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                    disabled={loading}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          {/* Bouton de connexion */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              py: 1.5,
              mb: 2,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: 2,
              position: 'relative'
            }}
          >
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} color="inherit" />
                <span>Connexion...</span>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LoginIcon />
                <span>Se connecter</span>
              </Box>
            )}
          </Button>

          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              ou
            </Typography>
          </Divider>

          {/* Lien vers l'inscription */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Pas encore de compte ?{' '}
              <Link
                to="/register"
                style={{
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                  fontWeight: 500
                }}
              >
                S'inscrire
              </Link>
            </Typography>
          </Box>
        </Box>

        {/* Comptes de test */}
        <Box sx={{ mt: 3, p: 2, backgroundColor: alpha(theme.palette.info.main, 0.1), borderRadius: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Comptes de test :
          </Typography>
          <Typography variant="caption" sx={{ display: 'block' }}>
            • Admin: admin@restaurant.com / password123
          </Typography>
          <Typography variant="caption" sx={{ display: 'block' }}>
            • Manager: marie@restaurant.com / password123
          </Typography>
          <Typography variant="caption" sx={{ display: 'block' }}>
            • Staff: jean@restaurant.com / password123
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginForm;