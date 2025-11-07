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
import { BrowserRouter } from 'react-router-dom'; 
import { AuthProvider } from './context/AuthContext'; 
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);