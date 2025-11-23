//============================================================================
// PUNTO DE ENTRADA (ENTRY POINT) DE LA APLICACIÓN
//============================================================================
/**
 * @fileoverview Punto de entrada principal de la aplicación React (Frontend).
 *
 * @description
 * Este archivo es el "motor de arranque" de la aplicación. Utiliza `ReactDOM.createRoot`
 * para renderizar el componente raíz `<App />` en el DOM. Es el lugar donde se
 * envuelve toda la aplicación con los proveedores de contexto globales:
 * - `BrowserRouter`: Habilita el enrutamiento en toda la aplicación.
 * - `AuthProvider`: Proporciona el estado de autenticación global.
 * - `ThemeProvider`: Aplica el tema de diseño de Material-UI.
 * - `Toaster`: Configura el sistema de notificaciones.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme.js';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Toaster 
            position="top-right" 
            toastOptions={{
              duration: 5000, 
            }}
          />
          <App />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);