//============================================================================
// PÁGINA DE REGISTRO DE ASESOR 
//============================================================================
/**
 * @fileoverview Página de registro público para nuevos asesores.
 *
 * @description
 * Utiliza el micro-componente 'FormInput' para mantener un diseño limpio y uniforme.
 * Todos los campos ocupan el 100% del ancho y tienen la misma altura visual.
 */

import React, { useState } from 'react';
import axios from 'axios';
import {
  Container, Box, Typography, Button, Grid, Link as MuiLink,
  CircularProgress
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import SigecLogo from '../assets/sigec_logo.png';
import { toast } from 'react-hot-toast';
import FormInput from '../components/common/FormInput'; 

function RegisterPage() {
  const [formData, setFormData] = useState({
    legajo: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    password: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  // Handler genérico para actualizar el estado
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorMsg('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMsg('');
    setLoading(true);
    
    const API_URL = 'http://localhost:5000/api/employees/register';

    try {
      await axios.post(API_URL, formData);
      toast.success('¡Registro exitoso! Tu cuenta está inactiva y pendiente de activación.');
      navigate('/login');
    } catch (error) {
      console.error("¡ERROR EN EL REGISTRO!", error);
      const message = error.response?.data?.message || 'Error desconocido al registrarse.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="100%" sx={{ minHeight: '100vh', backgroundColor: 'background.default', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 4 }}>
      
      <Box sx={{ mb: 4, maxWidth: '250px' }}>
        <img src={SigecLogo} alt="Logo SIGEC" style={{ width: '100%', height: 'auto' }} />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'background.paper', padding: 4, borderRadius: 2, boxShadow: 8, maxWidth: '450px', width: '100%' }}>
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Registro de Asesor
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          
          {/* Micro-Componente FormInput */}
          
          <FormInput 
            name="legajo" 
            label="Legajo" 
            value={formData.legajo} 
            onChange={handleChange} 
            autoFocus 
          />
          
          <FormInput 
            name="nombre" 
            label="Nombre" 
            value={formData.nombre} 
            onChange={handleChange} 
          />

          <FormInput 
            name="apellido" 
            label="Apellido" 
            value={formData.apellido} 
            onChange={handleChange} 
          />

          <FormInput 
            name="email" 
            label="Email" 
            type="email"
            value={formData.email} 
            onChange={handleChange} 
          />

          <FormInput 
            name="telefono" 
            label="Teléfono" 
            value={formData.telefono} 
            onChange={handleChange} 
          />

          <FormInput 
            name="direccion" 
            label="Dirección" 
            value={formData.direccion} 
            onChange={handleChange} 
          />
          
          <FormInput 
            name="password" 
            label="Contraseña" 
            type="password"
            value={formData.password} 
            onChange={handleChange} 
          />

          {errorMsg && (
            <Typography color="error" variant="body2" sx={{ mt: 2, textAlign: 'center' }}>{errorMsg}</Typography>
          )}

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Registrarme'}
          </Button>

          <Grid container justifyContent="center">
            <Grid item>
              <MuiLink component={Link} to="/login" variant="body2" color="primary">
                ¿Ya tienes cuenta? Inicia sesión
              </MuiLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default RegisterPage;