import { createTheme, alpha } from '@mui/material/styles';

// zen Color Palette
const zenColors = {
  white: '#F0F0F2',       // Light background
  indigoPrimary: '#3B52D9', // Primary blue/indigo
  darkNavy: '#031240',    // Very dark blue
  skyBlue: '#4A6DD9',     // Medium blue
  navyBlue: '#233559'     // Dark blue
};

// Palette sombre
const darkColors = {
  background: '#0A101F',  // Fond sombre avec une teinte bleue
  paper: '#111827',       // Surface des éléments 
  primary: '#4A6DD9',     // Plus claire que la version light
  secondary: '#5D7DF2',   // Encore plus claire
  text: '#E2E8F0',        // Texte clair
  divider: 'rgba(242, 242, 247, 0.12)' // Séparateurs subtils
};

// Fonction pour créer un thème zen (mode clair ou sombre)
const createZenTheme = (mode = 'light') => {
  const isDark = mode === 'dark';
  
  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? darkColors.primary : zenColors.indigoPrimary,
        light: isDark ? darkColors.secondary : zenColors.skyBlue,
        dark: zenColors.darkNavy,
        contrastText: zenColors.white,
      },
      secondary: {
        main: isDark ? darkColors.secondary : zenColors.navyBlue,
        light: zenColors.skyBlue,
        dark: zenColors.darkNavy,
        contrastText: zenColors.white,
      },
      background: {
        default: isDark ? darkColors.background : zenColors.white,
        paper: isDark ? alpha(darkColors.paper, 0.8) : alpha(zenColors.white, 0.8),
      },
      text: {
        primary: isDark ? darkColors.text : zenColors.darkNavy,
        secondary: isDark ? alpha(darkColors.text, 0.7) : zenColors.navyBlue,
      },
      divider: isDark ? darkColors.divider : alpha(zenColors.navyBlue, 0.12),
    },
    typography: {
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      h1: {
        fontWeight: 600,
        color: isDark ? darkColors.text : zenColors.darkNavy,
      },
      h2: {
        fontWeight: 600,
        color: isDark ? darkColors.text : zenColors.darkNavy,
      },
      h3: {
        fontWeight: 600,
        color: isDark ? darkColors.text : zenColors.darkNavy,
      },
      h4: {
        fontWeight: 500,
        color: isDark ? darkColors.text : zenColors.navyBlue,
      },
      h5: {
        fontWeight: 500,
        color: isDark ? darkColors.text : zenColors.navyBlue,
      },
      h6: {
        fontWeight: 500,
        color: isDark ? darkColors.text : zenColors.navyBlue,
      },
      subtitle1: {
        color: isDark ? alpha(darkColors.text, 0.9) : zenColors.navyBlue,
      },
      subtitle2: {
        color: isDark ? alpha(darkColors.text, 0.9) : zenColors.navyBlue,
      },
    },
    shape: {
      borderRadius: 16,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundImage: isDark 
              ? `linear-gradient(135deg, ${alpha(darkColors.primary, 0.2)} 0%, ${alpha(darkColors.background, 0.95)} 100%)`
              : `linear-gradient(135deg, ${alpha(zenColors.skyBlue, 0.1)} 0%, ${alpha(zenColors.indigoPrimary, 0.05)} 100%)`,
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: isDark 
              ? alpha(darkColors.paper, 0.6)
              : alpha(zenColors.white, 0.7),
            backdropFilter: 'blur(10px)',
            borderRadius: 16,
            border: isDark 
              ? `1px solid ${alpha(darkColors.text, 0.1)}`
              : `1px solid ${alpha(zenColors.white, 0.5)}`,
            boxShadow: isDark 
              ? `0 8px 32px 0 ${alpha('#000', 0.2)}`
              : `0 8px 32px 0 ${alpha(zenColors.darkNavy, 0.1)}`,
            '&.MuiPopover-paper, &.MuiMenu-paper': {
              backgroundColor: isDark 
                ? alpha(darkColors.paper, 0.9)
                : alpha(zenColors.white, 0.9),
              backdropFilter: 'blur(10px)',
            },
          },
          elevation1: {
            boxShadow: isDark 
              ? `0 8px 32px 0 ${alpha('#000', 0.2)}`
              : `0 8px 32px 0 ${alpha(zenColors.darkNavy, 0.1)}`,
          },
          elevation2: {
            boxShadow: isDark 
              ? `0 8px 32px 0 ${alpha('#000', 0.25)}`
              : `0 8px 32px 0 ${alpha(zenColors.darkNavy, 0.15)}`,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDark 
              ? alpha(darkColors.paper, 0.7)
              : alpha(zenColors.white, 0.8),
            backdropFilter: 'blur(10px)',
            borderBottom: isDark 
              ? `1px solid ${alpha(darkColors.text, 0.1)}`
              : `1px solid ${alpha(zenColors.white, 0.5)}`,
            color: isDark ? darkColors.text : zenColors.darkNavy,
            boxShadow: isDark 
              ? `0 4px 30px ${alpha('#000', 0.2)}`
              : `0 4px 30px ${alpha(zenColors.darkNavy, 0.1)}`,
          },
          colorPrimary: {
            backgroundColor: isDark 
              ? alpha(darkColors.primary, 0.85)
              : alpha(zenColors.indigoPrimary, 0.85),
            backdropFilter: 'blur(10px)',
            color: zenColors.white,
          },
          colorSecondary: {
            backgroundColor: isDark 
              ? alpha(darkColors.secondary, 0.85)
              : alpha(zenColors.navyBlue, 0.85),
            backdropFilter: 'blur(10px)',
            color: zenColors.white,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: isDark 
              ? alpha(darkColors.paper, 0.7)
              : alpha(zenColors.white, 0.8),
            backdropFilter: 'blur(10px)',
            border: 'none',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            boxShadow: 'none',
            fontWeight: 500,
          },
          contained: {
            boxShadow: isDark 
              ? `0 4px 14px ${alpha(darkColors.primary, 0.4)}`
              : `0 4px 14px ${alpha(zenColors.darkNavy, 0.2)}`,
            '&:hover': {
              boxShadow: isDark 
                ? `0 6px 20px ${alpha(darkColors.primary, 0.5)}`
                : `0 6px 20px ${alpha(zenColors.darkNavy, 0.3)}`,
            },
          },
          containedPrimary: {
            background: isDark 
              ? `linear-gradient(135deg, ${darkColors.primary} 0%, ${darkColors.secondary} 100%)`
              : `linear-gradient(135deg, ${zenColors.indigoPrimary} 0%, ${zenColors.skyBlue} 100%)`,
            '&:hover': {
              background: isDark 
                ? `linear-gradient(135deg, ${darkColors.primary} 20%, ${darkColors.secondary} 100%)`
                : `linear-gradient(135deg, ${zenColors.indigoPrimary} 20%, ${zenColors.skyBlue} 100%)`,
            },
          },
          outlined: {
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
            },
          },
          outlinedPrimary: {
            borderColor: isDark ? darkColors.primary : zenColors.indigoPrimary,
            '&:hover': {
              backgroundColor: isDark 
                ? alpha(darkColors.primary, 0.1)
                : alpha(zenColors.indigoPrimary, 0.04),
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: isDark 
              ? alpha(darkColors.paper, 0.6)
              : alpha(zenColors.white, 0.7),
            backdropFilter: 'blur(10px)',
            borderRadius: 16,
            border: isDark 
              ? `1px solid ${alpha(darkColors.text, 0.1)}`
              : `1px solid ${alpha(zenColors.white, 0.5)}`,
            boxShadow: isDark 
              ? `0 8px 32px 0 ${alpha('#000', 0.2)}`
              : `0 8px 32px 0 ${alpha(zenColors.darkNavy, 0.1)}`,
            overflow: 'hidden',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiInputBase-root': {
              backgroundColor: isDark 
                ? alpha(darkColors.paper, 0.7)
                : alpha(zenColors.white, 0.7),
              backdropFilter: 'blur(4px)',
            },
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
          input: {
            padding: '12px 16px',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? darkColors.secondary : zenColors.skyBlue,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? darkColors.primary : zenColors.indigoPrimary,
              borderWidth: 2,
            },
          },
          notchedOutline: {
            borderColor: isDark 
              ? alpha(darkColors.text, 0.2)
              : alpha(zenColors.navyBlue, 0.2),
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            '&.Mui-selected': {
              backgroundColor: isDark 
                ? alpha(darkColors.primary, 0.25)
                : alpha(zenColors.skyBlue, 0.15),
              color: isDark ? darkColors.text : zenColors.darkNavy,
              '&:hover': {
                backgroundColor: isDark 
                  ? alpha(darkColors.primary, 0.35)
                  : alpha(zenColors.skyBlue, 0.25),
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            backdropFilter: 'blur(4px)',
            borderRadius: 16,
          },
          colorPrimary: {
            backgroundColor: isDark 
              ? alpha(darkColors.primary, 0.25)
              : alpha(zenColors.indigoPrimary, 0.15),
            color: isDark ? darkColors.text : zenColors.indigoPrimary,
            '&.MuiChip-outlined': {
              borderColor: isDark ? darkColors.primary : zenColors.indigoPrimary,
              backgroundColor: 'transparent',
            },
          },
          colorSecondary: {
            backgroundColor: isDark 
              ? alpha(darkColors.secondary, 0.25)
              : alpha(zenColors.navyBlue, 0.15),
            color: isDark ? darkColors.text : zenColors.navyBlue,
            '&.MuiChip-outlined': {
              borderColor: isDark ? darkColors.secondary : zenColors.navyBlue,
              backgroundColor: 'transparent',
            },
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: {
            '& .MuiSwitch-switchBase.Mui-checked': {
              color: isDark ? darkColors.primary : zenColors.indigoPrimary,
              '&:hover': {
                backgroundColor: isDark 
                  ? alpha(darkColors.primary, 0.15)
                  : alpha(zenColors.indigoPrimary, 0.08),
              },
            },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
              backgroundColor: isDark ? darkColors.primary : zenColors.indigoPrimary,
            },
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: isDark ? alpha(darkColors.text, 0.7) : zenColors.navyBlue,
            '&.Mui-checked': {
              color: isDark ? darkColors.primary : zenColors.indigoPrimary,
            },
          },
        },
      },
      MuiRadio: {
        styleOverrides: {
          root: {
            color: isDark ? alpha(darkColors.text, 0.7) : zenColors.navyBlue,
            '&.Mui-checked': {
              color: isDark ? darkColors.primary : zenColors.indigoPrimary,
            },
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: isDark 
              ? alpha(darkColors.paper, 0.95)
              : alpha(zenColors.darkNavy, 0.85),
            backdropFilter: 'blur(4px)',
            borderRadius: 8,
            padding: '8px 12px',
            fontSize: '0.75rem',
            border: isDark 
              ? `1px solid ${alpha(darkColors.text, 0.1)}`
              : 'none',
          },
          arrow: {
            color: isDark 
              ? alpha(darkColors.paper, 0.95)
              : alpha(zenColors.darkNavy, 0.85),
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: isDark 
              ? alpha(darkColors.paper, 0.8)
              : alpha(zenColors.white, 0.9),
            backdropFilter: 'blur(15px)',
            borderRadius: 20,
            boxShadow: isDark 
              ? `0 25px 50px -12px ${alpha('#000', 0.5)}`
              : `0 25px 50px -12px ${alpha(zenColors.darkNavy, 0.25)}`,
            border: isDark 
              ? `1px solid ${alpha(darkColors.text, 0.1)}`
              : `1px solid ${alpha(zenColors.white, 0.2)}`,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            '&.Mui-selected': {
              color: isDark ? darkColors.primary : zenColors.indigoPrimary,
            },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            backgroundColor: isDark ? darkColors.primary : zenColors.indigoPrimary,
            height: 3,
            borderRadius: '3px 3px 0 0',
          },
        },
      },
      MuiBadge: {
        styleOverrides: {
          colorPrimary: {
            backgroundColor: isDark ? darkColors.primary : zenColors.indigoPrimary,
          },
          colorSecondary: {
            backgroundColor: isDark ? darkColors.secondary : zenColors.navyBlue,
          },
        },
      },
      MuiFab: {
        styleOverrides: {
          root: {
            boxShadow: isDark 
              ? `0 8px 20px ${alpha(darkColors.primary, 0.4)}`
              : `0 8px 20px ${alpha(zenColors.darkNavy, 0.3)}`,
          },
          primary: {
            background: isDark 
              ? `linear-gradient(135deg, ${darkColors.primary} 0%, ${darkColors.secondary} 100%)`
              : `linear-gradient(135deg, ${zenColors.indigoPrimary} 0%, ${zenColors.skyBlue} 100%)`,
            '&:hover': {
              background: isDark 
                ? `linear-gradient(135deg, ${darkColors.primary} 20%, ${darkColors.secondary} 100%)`
                : `linear-gradient(135deg, ${zenColors.indigoPrimary} 20%, ${zenColors.skyBlue} 100%)`,
            },
          },
        },
      },
    },
  });
};

// Thème clair par défaut
const zenTheme = createZenTheme('light');

// Exporter les deux versions du thème
export { createZenTheme };
export default zenTheme;