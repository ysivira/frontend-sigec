//============================================================================
// PUNTO DE ENTRADA (ENTRY POINT) DE LA APLICACIÓN
//============================================================================
/**
 * @fileoverview Punto de entrada principal de la aplicación React (Frontend).
 *
 * @description
 * Este archivo es el "motor de arranque". Utiliza `ReactDOM.createRoot`
 * para localizar el elemento <div id="root"> en `index.html` y
 * renderizar (inyectar) el componente raíz `<App />` dentro de él.
 *
 * También es el lugar donde se envuelve la aplicación completa con
 * los Proveedores de Contexto (Context Providers) de más alto nivel,
 * como `BrowserRouter` (para el enrutamiento) y `AuthProvider`
 * (para el estado de autenticación).
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