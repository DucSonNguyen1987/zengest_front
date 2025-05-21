import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  InputAdornment,
  MenuItem,
  IconButton,
  Divider,
  Link as MuiLink
} from '@mui/material';
import { 
  Person as PersonIcon,
  Lock as LockIcon,
  Email as EmailIcon,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../utils/permissions';
import { useColorMode } from '../../context/ThemeContext';

const RegisterForm = () => {
  const theme = useTheme();
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  
  // États du formulaire
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    staffType: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Gestion des changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Réinitialiser le staffType si le rôle change et n'est pas 'staff'
    if (name === 'role' && value !== 'staff') {
      setFormData(prev => ({
        ...prev,
        staffType: ''
      }));
    }
    
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // Fonctions pour basculer la visibilité des mots de passe
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName) newErrors.firstName = 'Veuillez saisir votre prénom';
    if (!formData.lastName) newErrors.lastName = 'Veuillez saisir votre nom';
    
    if (!formData.email) {
      newErrors.email = 'Veuillez saisir votre email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    
    if (!formData.password) {
      newErrors.password = 'Veuillez saisir votre mot de passe';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Veuillez confirmer votre mot de passe';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    if (!formData.role) newErrors.role = 'Veuillez sélectionner un rôle';
    
    if (formData.role === 'staff' && !formData.staffType) {
      newErrors.staffType = 'Veuillez sélectionner un type de staff';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fonction appelée à la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await register(formData);
        // Redirection vers la page de connexion après inscription réussie
        navigate('/login');
      } catch (error) {
        console.error('Register error:', error);
      }
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
        Créer un compte
      </Typography>
      
      <Box 
        component="form" 
        onSubmit={handleSubmit} 
        noValidate
      >
        {/* Champ prénom */}
        <TextField
          margin="normal"
          required
          fullWidth
          id="firstName"
          label="Prénom"
          name="firstName"
          autoComplete="given-name"
          autoFocus
          value={formData.firstName}
          onChange={handleChange}
          error={!!errors.firstName}
          helperText={errors.firstName}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{ 
            mb: 2,
            '& .MuiOutlinedInput-root': {
              backdropFilter: 'blur(4px)',
              backgroundColor: alpha(theme.palette.background.paper, 0.6),
            }
          }}
        />

        {/* Champ nom */}
        <TextField
          margin="normal"
          required
          fullWidth
          id="lastName"
          label="Nom"
          name="lastName"
          autoComplete="family-name"
          value={formData.lastName}
          onChange={handleChange}
          error={!!errors.lastName}
          helperText={errors.lastName}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{ 
            mb: 2,
            '& .MuiOutlinedInput-root': {
              backdropFilter: 'blur(4px)',
              backgroundColor: alpha(theme.palette.background.paper, 0.6),
            }
          }}
        />

        {/* Champ email */}
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Adresse email"
          name="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
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
              backgroundColor: alpha(theme.palette.background.paper, 0.6),
            }
          }}
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
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
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
              backgroundColor: alpha(theme.palette.background.paper, 0.6),
            }
          }}
        />

        {/* Champ confirmation mot de passe */}
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirmer mot de passe"
          type={showConfirmPassword ? 'text' : 'password'}
          id="confirmPassword"
          autoComplete="new-password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon color="primary" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle confirm password visibility"
                  onClick={handleToggleConfirmPasswordVisibility}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ 
            mb: 2,
            '& .MuiOutlinedInput-root': {
              backdropFilter: 'blur(4px)',
              backgroundColor: alpha(theme.palette.background.paper, 0.6),
            }
          }}
        />

        {/* Sélection du rôle */}
        <TextField
          select
          margin="normal"
          required
          fullWidth
          id="role"
          label="Rôle"
          name="role"
          value={formData.role}
          onChange={handleChange}
          error={!!errors.role}
          helperText={errors.role}
          sx={{ 
            mb: 2,
            '& .MuiOutlinedInput-root': {
              backdropFilter: 'blur(4px)',
              backgroundColor: alpha(theme.palette.background.paper, 0.6),
            }
          }}
        >
          <MenuItem value={ROLES.GUEST}>Guest</MenuItem>
          <MenuItem value="staff">Staff</MenuItem>
        </TextField>

        {/* Sélection du type de staff (si staff est sélectionné) */}
        {formData.role === 'staff' && (
          <TextField
            select
            margin="normal"
            required
            fullWidth
            id="staffType"
            label="Type de staff"
            name="staffType"
            value={formData.staffType}
            onChange={handleChange}
            error={!!errors.staffType}
            helperText={errors.staffType}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                backdropFilter: 'blur(4px)',
                backgroundColor: alpha(theme.palette.background.paper, 0.6),
              }
            }}
          >
            <MenuItem value={ROLES.STAFF_BAR}>Bar</MenuItem>
            <MenuItem value={ROLES.STAFF_FLOOR}>Salle</MenuItem>
            <MenuItem value={ROLES.STAFF_KITCHEN}>Cuisine</MenuItem>
          </TextField>
        )}

        {/* Bouton de soumission */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ 
            py: 1.5,
            mt: 2,
            mb: 3,
            borderRadius: 2,
            boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.3)}`,
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
          }}
        >
          {loading ? 'Inscription en cours...' : 'S\'inscrire'}
        </Button>

        {/* Lien vers la page de connexion */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            Déjà un compte?{' '}
            <MuiLink 
              component={Link} 
              to="/login" 
              variant="body2" 
              underline="hover"
              sx={{ 
                fontWeight: 'medium',
                color: theme.palette.primary.main
              }}
            >
              Se connecter
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default RegisterForm;