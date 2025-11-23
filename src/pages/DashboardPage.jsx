//============================================================================
// PÁGINA DE INICIO (DASHBOARD)
//============================================================================
/**
 * @fileoverview Página de bienvenida o "Dashboard" principal.
 *
 * @description
 * Esta página actúa como la pantalla de inicio después de que un usuario
 * inicia sesión correctamente. Su propósito es dar la bienvenida al usuario,
 * mostrando su nombre y rol, confirmando que el proceso de autenticación
 * ha sido exitoso.
 */

import React from 'react';
import { Typography, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import SigecLogo from '../assets/sigec_logo.png'; 

/**
 * @component DashboardPage
 * @description Muestra una página de bienvenida personalizada para el usuario autenticado.
 * Utiliza el `useAuth` hook para obtener y mostrar el nombre y rol del usuario.
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
        minHeight: '80vh',
        color: '#FFFFFF',
        textAlign: 'center',
      }}
    >

      <Box
        component="img"
        src={SigecLogo}
        alt="Logo SIGEC"
        sx={{
          maxWidth: '180px', 
          width: '100%',
          height: 'auto',
          mb: 3, 
          filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.3))' 
        }}
      />
      
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
        ¡Bienvenido, {user ? user.nombre : 'Usuario'}!
      </Typography>
      
      <Typography variant="subtitle1" sx={{ color: '#B0BEC5', textTransform: 'uppercase', letterSpacing: 2, fontSize: '0.9rem' }}>
        (Rol: {user ? user.rol : 'desconocido'})
      </Typography>
    </Box>
  );
}

export default DashboardPage;