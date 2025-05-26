import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Alert, 
  InputAdornment,
  Link as MuiLink
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { Email as EmailIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../api/auth';
import { useColorMode } from '../../context/ThemeContext';

const ForgotPasswordForm = () => {
  const theme = useTheme();
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Gestion du changement de l'email
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  // Fonction appelée à la soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await forgotPassword(email);
      setSuccess(true);
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
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
        Mot de passe oublié
      </Typography>
      
      {/* Message de succès */}
      {success && (
        <Alert
          severity="success"
          sx={{ 
            mb: 3,
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.success.main, 0.1),
            color: theme.palette.success.main,
            '& .MuiAlert-icon': {
              color: theme.palette.success.main
            }
          }}
        >
          Si un compte existe avec cet email, vous recevrez un lien pour réinitialiser votre mot de passe.
        </Alert>
      )}
      
      {/* Message d'erreur */}
      {error && (
        <Alert
          severity="error"
          sx={{ 
            mb: 3,
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.error.main, 0.1),
            color: theme.palette.error.main,
            '& .MuiAlert-icon': {
              color: theme.palette.error.main
            }
          }}
        >
          {error}
        </Alert>
      )}
      
      <Box 
        component="form" 
        onSubmit={handleSubmit} 
        noValidate
      >
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
          value={email}
          onChange={handleEmailChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{ 
            mb: 3,
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
          {loading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
        </Button>

        {/* Lien vers la page de connexion */}
        <Box sx={{ textAlign: 'center' }}>
          <MuiLink 
            component={Link} 
            to="/login" 
            variant="body2"
            underline="hover"
            sx={{ 
              color: theme.palette.primary.main,
              transition: 'color 0.3s',
              '&:hover': {
                color: theme.palette.primary.dark,
              }
            }}
          >
            Retour à la connexion
          </MuiLink>
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPasswordForm;