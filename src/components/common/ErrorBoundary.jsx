import React from 'react';
import { Alert, Box, Button, Typography } from '@mui/material';
import { ErrorOutline as ErrorIcon, Refresh as RefreshIcon } from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Met à jour le state pour afficher l'UI de fallback au prochain rendu
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Enregistre les détails de l'erreur
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log l'erreur pour le développement
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ 
          p: 3, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: 2,
          minHeight: '300px',
          justifyContent: 'center'
        }}>
          <Alert 
            severity="error" 
            icon={<ErrorIcon />}
            sx={{ 
              width: '100%',
              maxWidth: '600px'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Une erreur s'est produite
            </Typography>
            <Typography variant="body2" paragraph>
              Le composant a rencontré une erreur inattendue. Veuillez réessayer ou contacter le support si le problème persiste.
            </Typography>
            
            {/* Affichage des détails de l'erreur en mode développement */}
            {import.meta.env.NODE_ENV === 'development' && this.state.error && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Détails de l'erreur (mode développement) :
                </Typography>
                <Box 
                  component="pre" 
                  sx={{ 
                    fontSize: '0.75rem',
                    backgroundColor: 'rgba(0,0,0,0.04)',
                    p: 1,
                    borderRadius: 1,
                    overflow: 'auto',
                    maxHeight: '200px',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {this.state.error.toString()}
                  {this.state.errorInfo && (
                    <div style={{ marginTop: '8px' }}>
                      {this.state.errorInfo.componentStack}
                    </div>
                  )}
                </Box>
              </Box>
            )}
          </Alert>
          
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={this.handleReset}
            color="primary"
          >
            Réessayer
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;