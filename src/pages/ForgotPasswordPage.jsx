//============================================================================
// PÁGINA DE SOLICITUD DE RESTABLECIMIENTO DE CONTRASEÑA
//============================================================================
/**
 * @fileoverview Página para la solicitud de restablecimiento de contraseña.
 *
 * @description
 * Esta página presenta un formulario simple donde el usuario puede ingresar su
 * dirección de correo electrónico para solicitar un enlace de restablecimiento
 * de contraseña. Se comunica con el backend y muestra un modal de confirmación
 * al usuario, informándole que si el correo existe, recibirá el enlace.
 */
import React, { useState } from 'react';
import { 
  Box, Button, TextField, Typography, Paper, Link, 
  Dialog, DialogContent, DialogActions, DialogTitle 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import apiClient from '../api/axiosConfig';
import logo from '../assets/sigec_logo.png'; 
import LoadingScreen from '../components/common/LoadingScreen';

/**
 * @component ForgotPasswordPage
 * @description Componente de página que renderiza el formulario para solicitar el restablecimiento de contraseña.
 * Maneja el estado del formulario, la comunicación con la API y la visualización de un
 * modal de confirmación tras el envío.
 * @returns {JSX.Element}
 */
function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post('/employees/forgot-password', { email });
      setOpenModal(true);
    } catch (error) {
      const msg = error.response?.data?.message || 'Error al procesar solicitud';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    navigate('/login');
  };

  if (loading) return <LoadingScreen message="Enviando solicitud..." />;

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

      <Paper
        elevation={4}
        sx={{
          p: 3,
          width: '100%',
          maxWidth: 320,
          borderRadius: 3,
          bgcolor: '#F8F9FA',
        }}
      >
        <Typography variant="h6" align="center" sx={{ mb: 1, fontWeight: 'bold', color: '#0D47A1' }}>
          Recuperar Contraseña
        </Typography>
        
        <Typography variant="caption" display="block" align="center" color="textSecondary" sx={{ mb: 3, lineHeight: 1.4 }}>
          Ingresa tu email y te enviaremos un enlace para restablecer tu clave.
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            autoFocus
            size="small"
            margin="dense"
            placeholder="ejemplo@email.com"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="medium"
            sx={{ mt: 3, mb: 2, borderRadius: 2 }}
          >
            ENVIAR ENLACE
          </Button>

          <Box textAlign="center">
             <Link 
                component="button" 
                variant="caption" 
                onClick={() => navigate('/login')} 
                underline="hover"
                color="primary"
                type="button"
             >
                Volver a Iniciar Sesión
             </Link>
          </Box>
        </Box>
      </Paper>

      <Dialog 
        open={openModal} 
        onClose={handleCloseModal} 
        PaperProps={{ sx: { maxWidth: '320px', borderRadius: 2, m: 2 } }}
      >
        <DialogTitle sx={{ 
            bgcolor: '#A5D6A7', color: '#1b5e20', 
            py: 1, px: 2, display: 'flex', alignItems: 'center', gap: 1,
            fontSize: '1rem' 
        }}>
            <CheckCircleIcon fontSize="small" />
            <Typography variant="subtitle1" fontWeight="bold">Solicitud Enviada</Typography>
        </DialogTitle>
        
        <DialogContent sx={{ mt: 2, px: 2, pb: 1 }}>
            <Typography variant="body2" sx={{ color: '#333', mb: 1 }}>
                Hemos procesado tu solicitud.
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4, display: 'block' }}>
                Si el correo <strong>{email}</strong> existe, recibirás un enlace en breve.
            </Typography>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button onClick={handleCloseModal} variant="contained" color="success" size="small" fullWidth>
                Volver al Login
            </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}

export default ForgotPasswordPage;