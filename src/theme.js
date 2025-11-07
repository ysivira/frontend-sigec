//============================================================================
// CONFIGURACIÓN DEL TEMA (STYLES)
//============================================================================
/**
 * @fileoverview Configuración central del tema de Material-UI (MUI) para SIGEC.
 *
 * @description
 * Este archivo define la identidad visual de toda la aplicación.
 * Centraliza la paleta de colores (primario, secundario, fondos),
 * la tipografía y otros aspectos de diseño para asegurar una
 * apariencia coherente en todos los componentes.
 *
 * Este tema se provee a toda la aplicación a través del
 * <ThemeProvider> en `App.jsx`.
 */

import { createTheme } from '@mui/material/styles';

// --- DEFINICIÓN DE LOS COLORES ---
const sigecColors = {
  primary: '#0D47A1',  
  secondary: '#D4AF37', 
  background: '#37474F',
  paper: '#d7d7d7ff',     
};

/**
 * @description Tema de Material-UI para la aplicación SIGEC.
 * @type {import('@mui/material/styles').Theme}
 */
const sigecTheme = createTheme({
  palette: {
    mode: 'light', 
    primary: {
      main: sigecColors.primary,
    },

    secondary: {
      main: sigecColors.secondary,
    },

    background: {
      paper: sigecColors.paper,       
      default: sigecColors.background, 
    },
  },

  typography: {
    fontFamily: [
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
  },
});

export default sigecTheme;