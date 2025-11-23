//============================================================================
// PÁGINA DE RESETEO DE CONTRASEÑA
//============================================================================
/**
 * @fileoverview Página para el restablecimiento de contraseña.
 *
 * @description
 * Este componente de página es el destino del enlace de restablecimiento de
 * contraseña enviado por correo electrónico. Renderiza un formulario donde el
 * usuario puede establecer una nueva contraseña, utilizando un token de la URL
 * para la autorización. Incluye validación del lado del cliente y muestra
 * retroalimentación al usuario sobre el resultado del proceso.
 */

import React, { useState } from 'react';
import { 
    Box, Button, TextField, Typography, Paper, 
    Dialog, DialogTitle, DialogContent, DialogActions,
    InputAdornment, IconButton
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import apiClient from '../api/axiosConfig';
import logo from '../assets/sigec_logo.png'; 
import LoadingScreen from '../components/common/LoadingScreen';

/**
 * @component ResetPasswordPage
 * @description Componente de página que gestiona el proceso de restablecimiento de contraseña.
 * Extrae el token de la URL, valida la nueva contraseña y se comunica con la API para
 * actualizarla, mostrando un modal de éxito o error.
 * @returns {JSX.Element}
 */
function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const [modalState, setModalState] = useState({
    open: false,
    type: 'success', 
    title: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
        setModalState({ open: true, type: 'error', title: 'Error', message: 'Las contraseñas no coinciden.' });
        return;
    }
    if (password.length < 6) {
        setModalState({ open: true, type: 'error', title: 'Error', message: 'Mínimo 6 caracteres.' });
        return;
    }

    setLoading(true);
    try {
      await apiClient.post(`/employees/reset-password/${token}`, { newPassword: password });
      setModalState({
        open: true,
        type: 'success',
        title: 'Actualizada',
        message: 'Tu contraseña ha sido restablecida.'
      });
    } catch (error) {
      const msg = error.response?.data?.message || 'Enlace expirado o inválido.';
      setModalState({
        open: true,
        type: 'error',
        title: 'Error',
        message: msg
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalState(prev => ({ ...prev, open: false }));
    if (modalState.type === 'success') {
        navigate('/login');
    }
  };

  if (loading) return <LoadingScreen message="Guardando..." />;

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ mb: 2 }}>
        <img src={logo} alt="SIGEC Logo" style={{ width: '150px', height: 'auto' }} />
      </Box>

      <Paper elevation={4} sx={{ p: 3, width: '100%', maxWidth: 320, borderRadius: 3, bgcolor: '#F8F9FA' }}>
        <Typography variant="h6" align="center" sx={{ mb: 1, fontWeight: 'bold', color: '#0D47A1' }}>
          Nueva Contraseña
        </Typography>
        <Typography variant="caption" display="block" align="center" color="textSecondary" sx={{ mb: 3 }}>
          Ingresa tu nueva contraseña.
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Nueva Contraseña *" type={showPass ? 'text' : 'password'} value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth required autoFocus size="small" margin="dense"
            InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPass(!showPass)} edge="end" size="small">
                      {showPass ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
            }}
          />
          <TextField
            label="Confirmar *" type={showConfirmPass ? 'text' : 'password'} value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth required size="small" margin="dense"
            InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPass(!showConfirmPass)} edge="end" size="small">
                      {showConfirmPass ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
            }}
          />
          <Button type="submit" fullWidth variant="contained" size="medium" sx={{ mt: 3, mb: 1, borderRadius: 2 }}>
            GUARDAR
          </Button>
        </Box>
      </Paper>

      {/* MODAL */}
      <Dialog 
        open={modalState.open} 
        onClose={handleCloseModal} 
        PaperProps={{ sx: { maxWidth: '320px', borderRadius: 2, m: 2 } }}
      >
        <DialogTitle sx={{ 
            bgcolor: modalState.type === 'success' ? '#A5D6A7' : '#EF9A9A', 
            color: modalState.type === 'success' ? '#1b5e20' : '#b71c1c',   
            py: 1, px: 2, display: 'flex', alignItems: 'center', gap: 1,
            fontSize: '1rem' 
        }}>
            {modalState.type === 'success' ? <CheckCircleIcon fontSize="small" /> : <ErrorIcon fontSize="small" />}
            <Typography variant="subtitle1" fontWeight="bold">{modalState.title}</Typography>
        </DialogTitle>
        
        <DialogContent sx={{ mt: 2, px: 2, pb: 1 }}>
            <Typography variant="body2" sx={{ color: '#333', fontSize: '0.9rem' }}>
                {modalState.message}
            </Typography>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button 
                onClick={handleCloseModal} 
                variant="contained" 
                color={modalState.type === 'success' ? "success" : "error"}
                size="small" 
                fullWidth
            >
                {modalState.type === 'success' ? "Ir al Login" : "Cerrar"}
            </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}

export default ResetPasswordPage;