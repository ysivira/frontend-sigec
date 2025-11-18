//============================================================================
// PÁGINA DE INICIO DE SESIÓN (LOGIN)
//============================================================================
/**
 * @fileoverview Página de inicio de sesión para SIGEC.
 * Se conecta con Register y ForgotPassword.
 */

import React, { useState } from 'react';
import axios from 'axios';
import {
  Container, Box, Typography, TextField, Button, Grid, Link,
  IconButton, InputAdornment,
  Checkbox, FormControlLabel
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link as RouterLink } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext.jsx';
import SigecLogo from '../assets/sigec_logo.png';

function LoginPage() {
  const [legajo, setLegajo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useAuth();
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMsg('');
    const API_URL = 'http://localhost:5000/api/employees/login';
    const payload = { legajo: legajo, password: password };

    try {
      const response = await axios.post(API_URL, payload);
      login(response.data, rememberMe);
    } catch (error) {
      console.error("¡ERROR EN EL LOGIN!", error);

      if (error.response) {
        if (error.response.status === 429) {
          setErrorMsg(error.response.data.message || 'Demasiados intentos. Por favor, espere 10 minutos.');
        } else if (error.response.status === 401) {
          setErrorMsg(error.response.data.message || 'Credenciales incorrectas');
        } else if (error.response.status === 400) {
          setErrorMsg(error.response.data.message || 'Datos de ingreso inválidos.');
        } else {
          setErrorMsg('Error interno del servidor. Intente más tarde.');
        }
      } else if (error.code === 'ERR_NETWORK') {
        setErrorMsg('Error de conexión. El servidor no responde.');
      } else {
        setErrorMsg('Error desconocido al iniciar sesión.');
      }
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
        py: 4,
      }}
    >
      {/* LOGO */}
      <Box sx={{ mb: 4, maxWidth: '250px' }}>
        <img src={SigecLogo} alt="Logo SIGEC" style={{ width: '100%', height: 'auto' }} />
      </Box>

      {/* FORMULARIO */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'background.paper',
          padding: 4,
          borderRadius: 2,
          boxShadow: 8,
          maxWidth: '450px',
          width: '100%',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Iniciar Sesión
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>

         {/* LEGAJO */}
          <TextField
            variant='outlined'
            margin="normal"
            required
            fullWidth
            id="legajo"
            label="Legajo"
            name="legajo"
            autoFocus
            value={legajo}
            onChange={(e) => {
              setLegajo(e.target.value)
              setErrorMsg('')
            }}
          />

          {/* CLAVE */} 
          <TextField
            variant='outlined'
            margin="normal"
            required
            fullWidth
            name="password"
            label="Clave"
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setErrorMsg('')
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

           {/* MENSAJE DE ERROR*/}
          {errorMsg && (
            <Typography
              color="error"
              variant="body2"
              sx={{ mt: 2, textAlign: 'center' }}
            >
              {errorMsg}
            </Typography>
          )}

           {/* BTN INGRESAR*/}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Ingresar
          </Button>

          <Grid container justifyContent="space-between" alignItems="center">

            {/* Checkbox */}
            <Grid item>
              <FormControlLabel
                control={
                  <Checkbox
                    value="remember"
                    color="primary"
                    checked={rememberMe}
                    onChange={handleRememberMeChange}
                  />
                }
                label="Recuérdame"
                sx={{ '& .MuiTypography-root': { fontSize: '0.875rem' } }}
              />
            </Grid>

            {/* 2. ENLACE: OLVIDÉ MI CONTRASEÑA */}
            <Grid item>
              <Link 
                component={RouterLink} 
                to="/forgot-password" 
                variant="body2" 
                color="primary"
              >
                ¿Olvidó su contraseña?
              </Link>
            </Grid>
          </Grid>

          {/* 3. ENLACE: REGISTRO */}
          <Grid container justifyContent="center" sx={{ mt: 2 }}>
            <Grid item>
              <Link 
                component={RouterLink} 
                to="/register" 
                variant="body2" 
                color="primary"
              >
                ¿No tienes cuenta? Regístrate
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;