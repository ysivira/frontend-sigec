//============================================================================
// LAYOUT PRINCIPAL DE LA APLICACIÓN
//============================================================================
/**
 * @fileoverview Componente "Contenedor" de Nivel 1 (Layout).
 *
 * @description
 * Define la estructura visual común de la aplicación:
 * 1. El `AppBar` (barra superior) con el título y botón de logout.
 * 2. El `Drawer` (menú lateral) con la navegación principal.
 * 3. El `Box` (contenido) donde se renderizan las páginas.
 *
 */

import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  AppBar, Toolbar, Typography, Box, Drawer, List, ListItem, 
  ListItemIcon, ListItemText, ListItemButton, CssBaseline, Button,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People'; 
import MenuIcon from '@mui/icons-material/Menu'; 
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo_azul.png'; 

const drawerWidth = 240; 

/**
 * @description Define la estructura visual principal de la aplicación, incluyendo la barra de navegación superior, el menú lateral y el área de contenido principal.
 * @returns {JSX.Element} El componente del layout principal.
 */
function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm')); 
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Inicio (Dashboard)', icon: <DashboardIcon />, path: '/dashboard', roles: ['administrador', 'asesor', 'supervisor'] },
    { text: 'Gestión Empleados', icon: <PeopleIcon />, path: '/empleados', roles: ['administrador'] },
    { text: 'Planes', icon: <MenuBookIcon />, path: '/planes', roles: ['administrador'] },
    { text: 'Gestión de Precios', icon: <AttachMoneyIcon />, path: '/precios', roles: ['administrador'] }
  ];

  const drawerContent = (
    <div>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
        <img 
          src={logo} 
          alt="Logo SIGEC" 
          style={{ width: 'auto', height: '80px' }} 
        />
      </Box>
      <List>
        {menuItems
          .filter(item => user && item.roles.includes(user.rol)) 
          .map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* APP BAR (BARRA SUPERIOR)*/}
      <AppBar 
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }} 
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Sistema de Gestión (SIGEC)
          </Typography>

          <Typography 
            variant="h6" 
            sx={{ display: { xs: 'none', sm: 'block' }, mr: 2 }} 
          >
            ¡Hola, {user ? user.nombre: ''}!
          </Typography>
          
          <Button color="inherit" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </Toolbar>
      </AppBar>
      
      {/* DRAWER (MENÚ LATERAL) */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* Menú en MÓVIL */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, 
          }}
          sx={{
            display: { xs: 'block', sm: 'none' }, 
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>
        
        {/* Menú en DESKTOP */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' }, 
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>
      
      {/* CONTENIDO PRINCIPAL (LA PÁGINA) */}
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginTop: '64px'
        }}
      >
        <Outlet /> 
      </Box>
    </Box>
  );
}

export default MainLayout;