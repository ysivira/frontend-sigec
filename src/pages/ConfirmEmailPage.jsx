//============================================================================
// PÁGINA DE CONFIRMACIÓN DE EMAIL PARA ASESOR NUEVO
//============================================================================
/**
 * @fileoverview Página para la confirmación de la dirección de correo electrónico.
 *
 * @description
 * Esta página es el destino del enlace de confirmación que se envía al correo
 * de un nuevo usuario. Extrae el token de la URL, lo envía al backend para
 * validar la cuenta y muestra un mensaje de éxito o error al usuario.
 */
import React, { useState, useEffect, useRef } from 'react'; 
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { Box, Typography, CircularProgress, Button, Container, Paper } from '@mui/material';

/**
 * @component ConfirmEmailPage
 * @description Componente de página que maneja el proceso de confirmación de email.
 * Extrae el token de la URL, se comunica con la API para validar la cuenta y muestra el resultado.
 * @returns {JSX.Element} Página de confirmación de email.
 */
const ConfirmEmailPage = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('Confirmando tu correo electrónico...');
  const [error, setError] = useState(false);
  const dataFetchedRef = useRef(false);

  useEffect(() => {
    if (dataFetchedRef.current) return;
    
    dataFetchedRef.current = true;

    const confirmEmail = async () => {
      if (!token) {
        setMessage('URL de confirmación inválida.');
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const response = await apiClient.get(`/employees/confirm-email/${token}`);
        setMessage(response.data.message);
        setError(false);
      } catch (err) {
        
        const errorMsg = err.response?.data?.message || 'Ocurrió un error.';
      
        setMessage(errorMsg);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    confirmEmail();
  }, [token]);

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Confirmación de Cuenta
        </Typography>
        <Box sx={{ my: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {loading ? (
            <CircularProgress />
          ) : (
            <Typography color={error ? 'error' : 'primary'} textAlign="center">
              {message}
            </Typography>
          )}
        </Box>
       
        {!loading && (
          <Button component={Link} to="/login" variant="contained" sx={{ mt: 2 }}>
            Ir a Iniciar Sesión
          </Button>
        )}
      </Paper>
    </Container>
  );
};

export default ConfirmEmailPage;