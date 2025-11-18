//============================================================================
// PÁGINA DE RECUPERACIÓN DE CONTRASEÑA
//============================================================================
/**
 * @fileoverview Página para solicitar la recuperación de contraseña por email.
 *
 * @description
 * Permite a cualquier empleado (asesor, admin, supervisor) solicitar un token
 * de restablecimiento de contraseña. El sistema envía un enlace al email
 * asociado para iniciar el flujo de cambio de clave.
 */

import React, { useState } from 'react';
import axios from 'axios';
import {
  Container, Box, Typography, TextField, Button, Grid, Link as MuiLink,
  CircularProgress
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import SigecLogo from '../assets/sigec_logo.png';
import { toast } from 'react-hot-toast';

/**
 * @description Componente de la página de "Olvidé mi Contraseña".
 * @returns {JSX.Element} La página de solicitud de recuperación.
 */
function ForgotPasswordPage() {
  // --- ESTADOS LOCALES ---
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  // --- HANDLERS ---
  
  /**
   * Maneja el envío del formulario para solicitar el token de restablecimiento.
   * @param {object} event - Evento del formulario.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMsg('');
    setLoading(true);
    
    // URL del endpoint de recuperación 
    const API_URL = 'http://localhost:5000/api/employees/forgot-password';

    try {
      await axios.post(API_URL, { email });
      
      // Feedback exitoso (no revela si el email existe por seguridad)
      toast.success('Si el email existe, recibirás un enlace para resetear tu clave.');
      navigate('/login');
    } catch (error) {
      console.error("Error al solicitar recuperación:", error);
      if (error.response) {
        setErrorMsg(error.response.data.message || 'Error al procesar la solicitud.');
      } else {
        setErrorMsg('Error de conexión. Intente más tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container 
      component="main" 
      maxWidth="100%" 
      sx={{ 
        minHeight: '100vh', 
        backgroundColor: 'background.default', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        py: 4 
      }}
    >
      {/* Logo */}
      <Box sx={{ mb: 4, maxWidth: '250px' }}>
        <img src={SigecLogo} alt="Logo SIGEC" style={{ width: '100%', height: 'auto' }} />
      </Box>

      {/* Formulario de Recuperación */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        backgroundColor: 'background.paper', 
        padding: 4, 
        borderRadius: 2, 
        boxShadow: 8, 
        maxWidth: '450px', 
        width: '100%' 
      }}>
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Recuperar Contraseña
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
          Ingresa tu email y te enviaremos un enlace para reestablecer tu contraseña.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal" 
            required 
            fullWidth 
            id="email" 
            label="Email"
            name="email" 
            type="email" 
            autoFocus 
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrorMsg(''); 
            }}
          />

          {/* Mensaje de Error */}
          {errorMsg && (
            <Typography color="error" variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
              {errorMsg}
            </Typography>
          )}

          {/* Botón de Envío */}
          <Button
            type="submit" 
            fullWidth 
            variant="contained"
            sx={{ mt: 3, mb: 2 }} 
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Enviar Enlace'}
          </Button>

          {/* Enlace de Retorno */}
          <Grid container justifyContent="center">
            <Grid item>
              <MuiLink component={Link} to="/login" variant="body2" color="primary">
                Volver a Iniciar Sesión
              </MuiLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default ForgotPasswordPage;