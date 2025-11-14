//============================================================================
// LAYOUT PRINCIPAL (REUTILIZABLE)
//============================================================================
/**
 * @fileoverview Componente "Layout" reutilizable para las páginas
 * privadas de la aplicación.
 *
 * @description
 * Este es un componente "Contenedor" de Nivel 3 (reutilizable) [35-1245].
 * Su propósito es definir la estructura visual común (el "marco")
 * que todas las páginas interiores (Dashboard, Empleados, etc.) compartirán.
 *
 * Renderiza:
 * 1. El `AppBar` (barra superior) con el título y (futuro) botón de logout.
 * 2. El `Drawer` (menú lateral) con la navegación principal.
 * 3. Un `<Outlet />` de React-Router-Dom, que es el "espacio" donde
 * se inyectará el contenido de la página actual (ej. DashboardPage).
 */

import React from 'react';
import { AppBar, Toolbar, Typography, Box, Drawer, List, ListItem, 
    ListItemText, CssBaseline, Button 
} from '@mui/material';
import { Outlet } from 'react-router-dom'; 
import SigecLogoAzul from '../../assets/logo_azul.png';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 240;


function MainLayout() {
    const { user, logout } = useAuth();
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* APPBAR (Barra Superior) */}
      <AppBar 
        position="fixed" 
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          {/* Título a la izquierda */}
          <Typography variant="h6" noWrap component="div">
            Sistema de Gestión (SIGEC)
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          {/* Saludamos al usuario */}
          <Typography variant="h6" component="div" sx={{ mr: 2 }}>
            ¡Hola, {user ? user.nombre : 'Usuario'}!
          </Typography>

          {/* Botón de Cerrar Sesión */}
          <Button 
            color="inherit" 
            onClick={logout}
          >
            Cerrar Sesión
          </Button>

        </Toolbar>
      </AppBar>

      {/* DRAWER (Menú Lateral) */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#FFFFFF', 
          },
        }}
        variant="permanent" 
        anchor="left"
      >
        <Toolbar /> 
        
        {/* Logo Azul  */}
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <img 
            src={SigecLogoAzul} 
            alt="Logo SIGEC" 
            style={{ 
              width: '70%', 
              height: 'auto',
            }} 
          />
        </Box>

        <List>
          <ListItem>
            <ListItemText primary="Inicio (Dashboard)" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Gestión Empleados" />
          </ListItem>
        </List>
      </Drawer>

      {/* CONTENIDO PRINCIPAL (La Página) */}
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          bgcolor: 'background.default', 
          p: 3, 
          minHeight: '100vh' 
        }}
      >
        <Toolbar /> 
        <Outlet /> 
      </Box>
    </Box>
  );
}

export default MainLayout;