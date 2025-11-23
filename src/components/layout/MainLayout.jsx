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
import DescriptionIcon from '@mui/icons-material/Description';
import AddIcon from '@mui/icons-material/Add';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo_azul.png';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 185; 

/**
 * @component MainLayout
 * @description Define la estructura visual principal de la aplicación para usuarios autenticados.
 * Incluye una barra de navegación superior, un menú lateral responsive y el área de contenido principal.
 * @returns {JSX.Element}
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
    { text: 'Inicio', icon: <DashboardIcon />, path: '/dashboard', roles: ['administrador', 'asesor', 'supervisor'] },
    { text: 'Gestión Empleados', icon: <PeopleIcon />, path: '/empleados', roles: ['administrador'] },
    { text: 'Planes', icon: <MenuBookIcon />, path: '/planes', roles: ['administrador'] },
    { text: 'Gestión de Precios', icon: <AttachMoneyIcon />, path: '/precios', roles: ['administrador'] },
    { text: 'Nueva Cotización', icon: <AddIcon />, path: '/cotizador', roles: ['asesor'] },
    { text: 'Mis Cotizaciones', icon: <DescriptionIcon />, path: '/mis-cotizaciones', roles: ['asesor'] },
    { text: 'Consultar Precios', icon: <AttachMoneyIcon />, path: '/precios-consulta', roles: ['asesor'] },
    { text: 'Mi Perfil', icon: <AccountCircleIcon />, path: '/perfil', roles: ['asesor', 'administrador'] },
  ];

  const drawerContent = (
    <div>
      <Box sx={{ py: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src={logo} alt="logo" style={{ width: 120, height: 'auto' }} />
      </Box>
      
      {/* La lista de navegación se filtra según el rol del usuario actual */}
      <List dense>
        {menuItems
          .filter(item => user && item.roles.includes(user.rol))
          .map((item) => (
            <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                sx={{ minHeight: 30, justifyContent: 'initial', px: 2.5 }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: 2,
                    justifyContent: 'center',
                    color: location.pathname === item.path ? 'primary.main' : 'inherit'
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                    primary={item.text}
                    primaryTypographyProps={{ fontSize: '0.7rem' }}
                />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <Toolbar variant="dense">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="subtitle1" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Sistema de Gestión (SIGEC)
          </Typography>

          <Typography
            variant="body2"
            sx={{ display: { xs: 'none', sm: 'block' }, mr: 2, fontSize: '0.85rem' }}
          >
            ¡Hola, {user?.nombre}!
          </Typography>

          <Button
            variant="outlined"
            color="inherit"
            size="small"
            onClick={handleLogout}
            startIcon={<LogoutIcon sx={{ fontSize: 18 }} />}
            sx={{
                textTransform: 'none',
                borderRadius: '20px',
                padding: '2px 12px',
                fontSize: '0.75rem',
                borderColor: 'rgba(255,255,255,0.4)',
                '&:hover': {
                    borderColor: '#FFF',
                    backgroundColor: 'rgba(255,255,255,0.1)' // Fondo al pasar mouse
                }
            }}
          >
            Salir
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* MÓVIL */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* DESKTOP */}
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

      {/* CONTENIDO PRINCIPAL */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginTop: '48px' 
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default MainLayout;