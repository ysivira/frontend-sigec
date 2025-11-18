//============================================================================
// PÁGINA "PLACEHOLDER" DEL DASHBOARD
//============================================================================
/**
 * @fileoverview Página "tonta" (placeholder) para el Dashboard.
 *
 * @description
 * Esta es una página temporal que sirve como destino de redirección
 * después de un inicio de sesión exitoso 
 *
 * Demuestra que el flujo de autenticación (Login -> Context -> Router -> Dashboard)
 * está funcionando correctamente.
 *
 * Será reemplazada por el Layout principal de la aplicación.
 */

import React from 'react';
import { Typography, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import SigecLogo from '../assets/sigec_logo.png'; 

/**
 * @description Muestra una página de bienvenida al usuario después de iniciar sesión.
 * @returns {JSX.Element} El componente de la página del dashboard.
 */
function DashboardPage() {
  const { user } = useAuth();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '75vh',
        color: '#FFFFFF',
        textAlign: 'center',
        py: 4,
      }}
    >

      <Box
        component="img"
        src={SigecLogo}
        alt="Logo SIGEC"
        sx={{
          maxWidth: '300px', 
          width: '100%',
          height: 'auto',
          mb: 4, 
        }}
      />
      
      <Typography variant="h3" component="h1" gutterBottom>
        ¡Bienvenido, {user ? user.nombre : 'Usuario'}!
      </Typography>
      
      <Typography variant="h6">
        (Rol: {user ? user.rol : 'desconocido'})
      </Typography>
    </Box>
  );
}

export default DashboardPage;