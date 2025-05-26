import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Link,
  Alert,
  CircularProgress,
  Divider,
  Paper
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Email as EmailIcon,
  Lock as LockIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { useColorMode } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const theme = useTheme();
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  // États du formulaire
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  // Gestionnaire de changement des champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Effacer l'erreur quand l'utilisateur tape
    if (error) setError('');
  };

  // Gestionnaire de soumission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation côté client
    if (!formData.email || !formData.password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }

    try {
      await login(formData);
      // La redirection sera gérée par le contexte d'authentification
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Échec de la connexion');
    }
  };

  // Toggle du mot de passe
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '480px', // ✅ Largeur augmentée
        mx: 'auto',
        p: 0,
      }}
    >
      {/* Header du formulaire */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{
            fontWeight: 700,
            mb: 1,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Connexion
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ fontSize: '1.1rem' }}
        >
          Accédez à votre espace ZENGEST
        </Typography>
      </Box>

      {/* Suggestions de comptes de test */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          backgroundColor: alpha(theme.palette.info.main, 0.1),
          border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
          borderRadius: 2,
        }}
      >
        <Typography variant="subtitle2" color="info.main" gutterBottom>
          💡 Comptes de test disponibles :
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
          <strong>Admin :</strong> admin@restaurant.com<br />
          <strong>Manager :</strong> marie@restaurant.com<br />
          <strong>Staff :</strong> jean@restaurant.com<br />
          <em>Mot de passe : password123</em>
        </Typography>
      </Paper>

      {/* Formulaire */}
      <Box component="form" onSubmit={handleSubmit} noValidate>
        {/* Champ Email */}
        <TextField
          fullWidth
          id="email"
          name="email"
          label="Adresse email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          disabled={loading}
          autoComplete="email"
          autoFocus
          variant="outlined"
          size="large" // ✅ Taille plus grande
          sx={{ 
            mb: 3, // ✅ Plus d'espacement
            '& .MuiOutlinedInput-root': {
              height: '56px', // ✅ Hauteur augmentée
              backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.6 : 0.8),
              backdropFilter: 'blur(4px)',
              '& fieldset': {
                borderColor: alpha(theme.palette.primary.main, 0.3),
              },
              '&:hover fieldset': {
                borderColor: alpha(theme.palette.primary.main, 0.5),
              },
              '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main,
                borderWidth: '2px',
              },
            },
            '& .MuiInputLabel-root': {
              fontSize: '1rem', // ✅ Label plus grand
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="exemple@restaurant.com"
        />

        {/* Champ Mot de passe */}
        <TextField
          fullWidth
          id="password"
          name="password"
          label="Mot de passe"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleChange}
          disabled={loading}
          autoComplete="current-password"
          variant="outlined"
          size="large" // ✅ Taille plus grande
          sx={{ 
            mb: 3, // ✅ Plus d'espacement
            '& .MuiOutlinedInput-root': {
              height: '56px', // ✅ Hauteur augmentée
              backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.6 : 0.8),
              backdropFilter: 'blur(4px)',
              '& fieldset': {
                borderColor: alpha(theme.palette.primary.main, 0.3),
              },
              '&:hover fieldset': {
                borderColor: alpha(theme.palette.primary.main, 0.5),
              },
              '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main,
                borderWidth: '2px',
              },
            },
            '& .MuiInputLabel-root': {
              fontSize: '1rem', // ✅ Label plus grand
            }
          }}
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
                  onClick={handleTogglePassword}
                  edge="end"
                  disabled={loading}
                  sx={{
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.action.hover, 0.1),
                    }
                  }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          placeholder="Votre mot de passe"
        />

        {/* Options */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3 
        }}>
          <FormControlLabel
            control={
              <Checkbox 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
                color="primary"
                size="medium" // ✅ Checkbox plus grande
              />
            }
            label={
              <Typography variant="body2" sx={{ fontSize: '0.95rem' }}>
                Se souvenir de moi
              </Typography>
            }
          />
          <Link 
            href="#" 
            variant="body2" 
            color="primary"
            sx={{ 
              textDecoration: 'none',
              fontSize: '0.95rem',
              '&:hover': {
                textDecoration: 'underline',
              }
            }}
          >
            Mot de passe oublié ?
          </Link>
        </Box>

        {/* Message d'erreur */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              '& .MuiAlert-message': {
                fontSize: '0.95rem', // ✅ Texte plus grand
              }
            }}
          >
            {error}
          </Alert>
        )}

        {/* Bouton de connexion */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          size="large" // ✅ Bouton plus grand
          sx={{
            height: '56px', // ✅ Hauteur augmentée
            fontSize: '1.1rem', // ✅ Texte plus grand
            fontWeight: 600,
            borderRadius: 2,
            textTransform: 'none',
            mb: 3,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
            boxShadow: isDark 
              ? `0 4px 20px ${alpha(theme.palette.primary.main, 0.4)}`
              : `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
            '&:hover': {
              background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
              transform: 'translateY(-2px)',
              boxShadow: isDark 
                ? `0 6px 24px ${alpha(theme.palette.primary.main, 0.5)}`
                : `0 6px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
            },
            '&:disabled': {
              background: theme.palette.action.disabledBackground,
              transform: 'none',
            },
            transition: 'all 0.3s ease-in-out',
          }}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
        >
          {loading ? 'Connexion en cours...' : 'Se connecter'}
        </Button>

        {/* Divider */}
        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            ou
          </Typography>
        </Divider>

        {/* Lien vers l'inscription */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.95rem' }}>
            Vous n'avez pas encore de compte ?
          </Typography>
          <Button
            variant="outlined"
            fullWidth
            size="large" // ✅ Bouton plus grand
            startIcon={<PersonAddIcon />}
            onClick={() => navigate('/register')}
            sx={{
              height: '48px', // ✅ Hauteur augmentée
              fontSize: '1rem', // ✅ Texte plus grand
              fontWeight: 500,
              borderRadius: 2,
              textTransform: 'none',
              borderColor: alpha(theme.palette.primary.main, 0.5),
              color: theme.palette.primary.main,
              '&:hover': {
                borderColor: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            Créer un compte
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginForm;