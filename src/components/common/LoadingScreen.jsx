//============================================================================
// MICRO-COMPONENTE: PANTALLA DE CARGA
//============================================================================

import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { keyframes } from '@emotion/react';
import SigecLogo from '../../assets/sigec_logo.png'; 

/**
 * @component
 * @description Muestra una pantalla de carga animada con el logo de SIGEC y un mensaje personalizable.
 * La animación consiste en un efecto de barrido que revela el logo y el texto en color.
 * @param {object} props - Propiedades del componente.
 * @param {string} [props.message="CARGANDO..."] - El mensaje que se mostrará debajo del logo.
 * @returns {JSX.Element} El componente de la pantalla de carga.
 */
function LoadingScreen({ message = "CARGANDO..." }) {
  const theme = useTheme();

  // ANIMACIÓN WIPE (Barrido): De Izquierda a Derecha
  const wipeAnimation = keyframes`
    0% {
      clip-path: inset(0 100% 0 0); /* Oculto (cortado desde la derecha) */
      filter: grayscale(100%);
    }
    100% {
      clip-path: inset(0 0 0 0); /* Visible (sin recortes) */
      filter: grayscale(0%);
    }
  `;

  // ANIMACIÓN TEXTO: Simple aparición (Fade In)
  const textFade = keyframes`
    0% { opacity: 0.3; }
    100% { opacity: 1; }
  `;

  // Estilos texto
  const textStyles = {
    variant: "h5",
    fontWeight: 'bold',
    letterSpacing: '4px',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  };

  const ANIMATION_DURATION = '2s';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh', 
        width: '100%',
        p: 3,
      }}
    >
      {/* LOGO */}
      <Box sx={{ position: 'relative', width: '150px', height: 'auto', mb: 4 }}>
        
        {/* FONDO (Gris) */}
        <Box
          component="img"
          src={SigecLogo}
          alt="Logo Fondo"
          sx={{ 
            width: '100%', 
            height: 'auto',
            filter: 'grayscale(100%)', 
            opacity: 0.2, 
            display: 'block' 
          }} 
        />

        {/* RELLENO (Color) */}
        <Box
          component="img"
          src={SigecLogo}
          alt="Logo Relleno"
          sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0,
            width: '100%', 
            height: 'auto',
            animation: `${wipeAnimation} ${ANIMATION_DURATION} cubic-bezier(0.4, 0, 0.2, 1) forwards`,
            filter: `drop-shadow(0 0 15px ${theme.palette.secondary.main})` 
          }} 
        />
      </Box>
      
      {/* TEXTO */}
      <Box sx={{ position: 'relative' }}>
        {/* Texto Base */}
        <Typography 
          variant={textStyles.variant}
          sx={{ ...textStyles, color: 'text.disabled', opacity: 0.2 }} 
        >
          {message}
        </Typography>

        {/* Texto Relleno */}
        <Typography 
          variant={textStyles.variant}
          sx={{ 
            ...textStyles,
            position: 'absolute',
            top: 0,
            left: 0,
            color: 'secondary.main',
            animation: `${wipeAnimation} ${ANIMATION_DURATION} cubic-bezier(0.4, 0, 0.2, 1) forwards`,
            textShadow: '0 0 10px rgba(212, 175, 55, 0.5)'
          }} 
        >
          {message}
        </Typography>
      </Box>
    </Box>
  );
}

export default LoadingScreen;