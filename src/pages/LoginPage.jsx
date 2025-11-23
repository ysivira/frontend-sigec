//============================================================================
// PÁGINA DE INICIO DE SESIÓN (LOGIN) 
//============================================================================
/**
 * @fileoverview Página de inicio de sesión para SIGEC.
 *
 * @description
 * Componente de página que renderiza el formulario de inicio de sesión. Se encarga
 * de capturar las credenciales del usuario (legajo y contraseña), interactuar
 * con el `AuthContext` para realizar la autenticación y manejar los diferentes
 * estados de la UI (carga, errores). Incluye una lógica específica para notificar
 * al usuario si su cuenta está pendiente de activación por un administrador.
 */
import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Checkbox, FormControlLabel, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import logo from '../assets/sigec_logo.png'; 
import ConfirmDialog from '../components/common/ConfirmDialog';

/**
 * @component LoginPage
 * @description Renderiza el formulario de inicio de sesión, maneja la entrada del usuario, la visibilidad de la contraseña y la lógica de envío.
 * Utiliza el `useAuth` hook para la autenticación y muestra un diálogo específico si la cuenta del usuario está inactiva o pendiente de activación.
 * @returns {JSX.Element}
 */
function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();  
  const [formData, setFormData] = useState({ legajo: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Estado para controlar el Modal de "Cuenta Inactiva"
  const [showInactiveDialog, setShowInactiveDialog] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.legajo, formData.password, rememberMe);
      // Si el login es exitoso, el AuthContext redirige, así que no hacemos nada más aquí.
    } catch (error) {
      // Extraemos el mensaje y el código de estado del error
      const status = error.response?.status;
      const errorMessage = error.response?.data?.message || error.message || 'Error desconocido';

      // LÓGICA DE INTERCEPCIÓN:
      // Si es error 401 Y el mensaje dice "inactiva" o "pendiente" (según tu controller)
      if (status === 401 && (errorMessage.includes('inactiva') || errorMessage.includes('pendiente'))) {
        setShowInactiveDialog(true);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

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
      {/* LOGO */}
      <Box sx={{ mb: 2 }}>
        <img src={logo} alt="SIGEC Logo" style={{ width: '150px', height: 'auto' }} />
      </Box>

      {/* TARJETA */}
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
          Iniciar Sesión
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Legajo"
            name="legajo"
            value={formData.legajo}
            onChange={handleChange}
            fullWidth
            required
            autoFocus
            disabled={loading}
            size="small" 
            margin="dense"
          />

          <TextField
            label="Clave"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            fullWidth
            required
            disabled={loading}
            size="small" 
            margin="dense"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="small" 
            sx={{ mt: 2, mb: 1, borderRadius: 2 }}
            disabled={loading}
          >
            {loading ? '...' : 'INGRESAR'}
          </Button>

          <Box display="flex" justifyContent="space-between" alignItems="center">
             <FormControlLabel
                control={<Checkbox value="remember" color="primary" size="small" />}
                label={<Typography variant="caption" color="textSecondary">Recuérdame</Typography>}
             />
             <Link 
                component="button" 
                variant="caption" 
                onClick={() => navigate('/forgot-password')}
                underline="hover"
                type='button'
              >
                ¿Olvidó su contraseña?
              </Link>
          </Box>
          
          <Box mt={1} textAlign="center">
             <Link 
                component="button" 
                variant="caption" 
                onClick={() => navigate('/register')}
                underline="none"
                sx={{ fontWeight: 'medium' }}
                type='button'
              >
                ¿No tienes cuenta? Regístrate
              </Link>
          </Box>

        </Box>
      </Paper>

      {/* MODAL DE CUENTA PENDIENTE DE ACTIVACIÓN */}
      <ConfirmDialog
        open={showInactiveDialog}
        title="Cuenta Pendiente de Activación"
        content="Su correo electrónico ha sido confirmado exitosamente, pero un administrador aún debe activar su cuenta para que pueda ingresar al sistema. Por favor, espere a recibir el correo de bienvenida."
        onClose={() => setShowInactiveDialog(false)}
        onConfirm={() => setShowInactiveDialog(false)}
        confirmText="Entendido"
      />
      
    </Box>
  );
}
export default LoginPage;