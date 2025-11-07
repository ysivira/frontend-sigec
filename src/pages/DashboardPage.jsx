//============================================================================
// PÁGINA "PLACEHOLDER" DEL DASHBOARD
//============================================================================
/**
 * @fileoverview Página "tonta" (placeholder) para el Dashboard.
 *
 * @description
 * Esta es una página temporal que sirve como destino de redirección
 * después de un inicio de sesión exitoso [35-1204].
 *
 * Demuestra que el flujo de autenticación (Login -> Context -> Router -> Dashboard)
 * está funcionando correctamente.
 *
 * Será reemplazada por el Layout principal de la aplicación.
 */

import React from 'react';
import { Typography, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';

function DashboardPage() {
  const { user } = useAuth();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        color: '#FFFFFF',
      }}
    >
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