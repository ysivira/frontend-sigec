//============================================================================
// CONFIGURACIÓN DEL TEMA (STYLES)
//============================================================================
/**
 * @fileoverview Configuración central del tema de Material-UI (MUI) para SIGEC.
 *
 * @description
 * Este archivo define la identidad visual de la aplicación mediante `createTheme`
 * de Material-UI. Centraliza la paleta de colores, la tipografía y los estilos
 * por defecto para componentes comunes (como `TextField` y `Paper`), asegurando
 * una apariencia coherente en toda la interfaz. Este tema se provee a la
 * aplicación a través del `<ThemeProvider>` en `main.jsx`.
 */

import { createTheme } from '@mui/material/styles';

/**
 * @const {object} sigecColors - Paleta de colores personalizada para la marca SIGEC.
 */
const sigecColors = {
  primary: '#0D47A1', 
  secondary: '#D4AF37',
  background: '#37474F', 
  paper: '#F8F9FA',     
  textPrimary: '#1A2027',
  textSecondary: '#546E7A',
};

/**
 * @const {import('@mui/material/styles').Theme} sigecTheme - Instancia del tema de Material-UI para la aplicación.
 * Contiene la configuración de la paleta, tipografía y overrides de componentes.
 */
const sigecTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: sigecColors.primary },
    secondary: { main: sigecColors.secondary },
    background: {
      paper: sigecColors.paper,
      default: sigecColors.background,
    },
    text: {
      primary: sigecColors.textPrimary,
      secondary: sigecColors.textSecondary,
    },
  },

  typography: {
    fontFamily: ['Roboto', 'Inter', 'sans-serif'].join(','),
    h4: { color: '#FFFFFF', fontWeight: 600 }, 
    h5: { color: sigecColors.primary, fontWeight: 700 }, 
  },

  components: {
    // ESTILO DE LÍNEA EN TODOS LOS INPUTS
    MuiTextField: {
      defaultProps: {
        variant: 'standard', 
        fullWidth: true,
      },
    },
    MuiFormControl: {
      defaultProps: {
        variant: 'standard',
        fullWidth: true,
      },
    },

    // ESTILIZAR LA LÍNEA DE LOS INPUTS 
    MuiInput: {
      styleOverrides: {
        root: {
          marginTop: 16,
          '&:before': { borderBottom: `1px solid ${sigecColors.textSecondary}40` },
          '&:hover:not(.Mui-disabled):before': { borderBottom: `2px solid ${sigecColors.primary}80` },
          '&.Mui-focused:after': { borderBottom: `2px solid ${sigecColors.primary}` },
        },
        input: {
            padding: '4px 0 5px', 
        }
      },
    },

    // ESTILO DE LAS TARJETAS (PAPER)
    MuiPaper: {
        styleOverrides: {
            root: {
                backgroundColor: sigecColors.paper, 
                backgroundImage: 'none',
            }
        }
    },

    // LABELS
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: sigecColors.textSecondary,
          '&.Mui-focused': { color: sigecColors.primary },
        },
      },
    },
  },
});

export default sigecTheme;