//============================================================================
// PÁGINA DE REESTABLECIMIENTO DE CONTRASEÑA
//============================================================================
/**
 * @fileoverview Página para establecer una nueva contraseña.
 *
 * @description
 * 1. Captura el token de la URL usando `useParams`.
 * 2. Permite al usuario ingresar una nueva clave.
 * 3. Envía POST /api/employees/reset-password/:token con { newPassword }.
 */

import React, { useState } from 'react';
import axios from 'axios';
import {
  Container, Box, Typography, TextField, Button, CircularProgress
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import SigecLogo from '../assets/sigec_logo.png'; 
import { toast } from 'react-hot-toast';

function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const { token } = useParams(); 

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMsg('');
    setLoading(true);
    
    const API_URL = `http://localhost:5000/api/employees/reset-password/${token}`;

    try {
      await axios.post(API_URL, { newPassword: password });
      toast.success('¡Contraseña actualizada exitosamente! Ya puedes iniciar sesión.');
      navigate('/login');
      
    } catch (error) {
      console.error("¡ERROR EN RESET PASSWORD!", error);
      if (error.response) {
        setErrorMsg(error.response.data.message || 'Error. El enlace puede haber expirado.');
      } else {
        setErrorMsg('Error de conexión. Intente más tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="100%" sx={{ minHeight: '100vh', backgroundColor: 'background.default', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 4 }}>
      
      {/* LOGO */}
      <Box sx={{ mb: 4, maxWidth: '250px' }}>
        <img src={SigecLogo} alt="Logo SIGEC" style={{ width: '100%', height: 'auto' }} />
      </Box>

      {/* FORMULARIO */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'background.paper', padding: 4, borderRadius: 2, boxShadow: 8, maxWidth: '450px', width: '100%' }}>
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Nueva Contraseña
        </Typography>
        
        <Typography variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
          Ingresa tu nueva contraseña para reestablecer el acceso.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Nueva Contraseña"
            type="password"
            id="password"
            autoFocus
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrorMsg('');
            }}
          />

          {errorMsg && (
            <Typography color="error" variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
              {errorMsg}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Guardar Contraseña'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default ResetPasswordPage;