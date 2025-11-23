//============================================================================
// PÁGINA DE REGISTRO DE NUEVO USUARIO
//============================================================================
/**
 * @fileoverview Página de auto-registro para nuevos usuarios (asesores).
 *
 * @description
 * Este componente de página renderiza un formulario de registro completo. Se encarga
 * de la validación de datos en tiempo real del lado del cliente, gestiona el estado
 * de carga y, tras un envío exitoso, se comunica con la API para registrar al
 * nuevo usuario. Finalmente, informa al usuario del resultado a través de un
 * modal y lo redirige a la página de inicio de sesión.
 */
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Link, 
  Grid, 
  Avatar,
  IconButton,
  InputAdornment,
  Stack 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import logo from '../assets/sigec_logo.png'; 
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ConfirmDialog from '../components/common/ConfirmDialog';

/**
 * @component RegisterPage
 * @description Componente de página que gestiona el proceso de auto-registro de un nuevo usuario.
 * Incluye el formulario, la validación de campos, la comunicación con la API y la
 * retroalimentación al usuario.
 * @returns {JSX.Element}
 */
function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    legajo: '', nombre: '', apellido: '', email: '', telefono: '', direccion: '', password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [dialog, setDialog] = useState({ open: false, title: '', message: '' });
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  useEffect(() => {
    // Redirigir solo si el registro fue exitoso y el diálogo se ha cerrado
    if (registrationSuccess && !dialog.open) {
      navigate('/login');
    }
  }, [registrationSuccess, dialog.open, navigate]);

  // LÓGICA DE VALIDACIÓN
  
  const validateField = (name, value) => {
    if (!value || value.trim() === '') return 'Este campo es requerido.';

    switch (name) {
      case 'legajo':
        if (!/^\d{7,8}$/.test(value)) return 'Debe tener 7 u 8 dígitos numéricos.';
        return null;
      case 'nombre':
        if (value.trim().length < 3) return 'Debe tener al menos 3 caracteres.';
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) return 'Solo debe contener letras y espacios.';
        return null;
      case 'apellido':
        if (value.trim().length < 3) return 'Debe tener al menos 3 caracteres.';
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) return 'Solo debe contener letras y espacios.';
        return null;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'El formato del email no es válido.';
        return null;
      case 'telefono':
        if (!/^\d{10}$/.test(value)) return 'Debe tener exactamente 10 dígitos numéricos.';
        return null;
      case 'direccion':
        if (value.trim().length < 4) return 'Debe tener al menos 4 caracteres.';
        return null;
      case 'password':
        if (value.length < 6) return 'Debe tener al menos 6 caracteres.';
        return null;
      default:
        return null;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Validar en tiempo real
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación final antes de enviar
    const newErrors = {};
    let isValid = true;
    for (const key in formData) {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    }
    setErrors(newErrors);

    // Si el formulario NO es válido, detenemos la ejecución aquí.
    if (!isValid) {
      return;
    }

    // Si es válido, procedemos con el envío.
    setLoading(true);

    // Envia los datos al backend.
    try {
      await apiClient.post('/employees/register', formData);
      setRegistrationSuccess(true);
      setDialog({
        open: true,
        title: 'Registro Exitoso',
        message: 'Hemos enviado un correo de confirmación a tu email. Por favor, revisa tu bandeja de entrada y la de spam.'
      });
    } catch (error) {
      const msg = error.response?.data?.message || 'Error en el registro';
      setRegistrationSuccess(false);
      setDialog({
        open: true,
        title: 'Error en el Registro',
        message: msg
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setDialog({ ...dialog, open: false });
  };

  return (
    <>
      <ConfirmDialog
        open={dialog.open}
        title={dialog.title}
        message={dialog.message}
        onConfirm={handleDialogClose}
        confirmText="Aceptar"
        showCancel={false}
      />

      {/* CONTENEDOR PRINCIPAL (Pantalla Dividida) */}
      <Grid container component="main" sx={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        
        {/* IZQUIERDA: LOGO (40%) */}
        <Grid
        item
    xs={12}
    md={5}
    sx={{
      bgcolor: "#2F3B40",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      p: 4,
      textAlign: "center",
      minHeight: "100vh"
    }}
        >
          <Box sx={{ textAlign: 'center' }}>
              <img 
                  src={logo} 
                  alt="SIGEC Logo" 
                  style={{ width: '220px', height: 'auto', marginBottom: '20px' }} 
              />
              <Typography variant="h4" sx={{ color: '#FFF', fontWeight: 'bold', mb: 1 }}>
                  Bienvenido a SIGEC
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#B0BEC5' }}>
                  Sistema Integral de Gestión
              </Typography>
          </Box>
        </Grid>

        {/* DERECHA: FONDO GRIS SUAVE PARA QUE RESALTE LA TARJETA */}
        <Grid
         item
    xs={12}
    md={7}
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      bgcolor: "#F0F2F5",
      p: 1,
      overflowY: "auto",
      minHeight: "100vh"
    
      }}
        >
          <Paper
            elevation={4}
            sx={{
              width: '100%',
              maxWidth: 600,
              borderRadius: 3,
              bgcolor: '#FFFFFF', 
              overflow: 'hidden',
              borderTop: '6px solid #0D47A1', 
              mx: 'auto'
            }}
          >
            
            {/* HEADER DE LA TARJETA */}
            <Box sx={{ p: 3, bgcolor: '#e6e8ebff', borderBottom: '1px solid #E0E0E0', display: 'flex', alignItems: 'center', gap: 2 }}>
               <Avatar sx={{ bgcolor: '#0D47A1', width: 48, height: 48 }}>
                  <PersonAddIcon sx={{ color: '#fffcfcff' }} />
               </Avatar>
               <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#0D47A1' }}>
                    Crear Cuenta
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Complete sus datos personales.
                  </Typography>
               </Box>
            </Box>

            {/* FORMULARIO */}
            <Box component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
              
              <Stack spacing={2.5}>
                 
                 {/* FILA 1: DNI */}
                 <TextField 
                    label="DNI / Legajo *" name="legajo" 
                    value={formData.legajo} onChange={handleChange} 
                    fullWidth autoFocus size="small"
                    error={!!errors.legajo}
                    helperText={errors.legajo}
                    placeholder="Ingrese su DNI"
                 />

                 {/* FILA 2: NOMBRE | APELLIDO  */}
                 <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField 
                        label="Nombre *" name="nombre" 
                        value={formData.nombre} onChange={handleChange} 
                        fullWidth size="small" placeholder="Ej: Juan"
                        error={!!errors.nombre}
                        helperText={errors.nombre}
                        sx={{ flex: 1 }} // Ocupa el 50%
                    />
                    <TextField 
                        label="Apellido *" name="apellido" 
                        value={formData.apellido} onChange={handleChange} 
                        fullWidth size="small" placeholder="Ej: Pérez"
                        error={!!errors.apellido}
                        helperText={errors.apellido}
                        sx={{ flex: 1 }} // Ocupa el 50%
                    />
                 </Box>

                 {/* FILA 3: EMAIL | TELÉFONO */}
                 <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField 
                        label="Email *" name="email" type="email" 
                        value={formData.email} onChange={handleChange} 
                        fullWidth size="small" placeholder="juan@email.com"
                        error={!!errors.email}
                        helperText={errors.email}
                        sx={{ flex: 1 }}
                    />
                    <TextField 
                        label="Teléfono *" name="telefono" 
                        value={formData.telefono} onChange={handleChange} 
                        fullWidth size="small" placeholder="381..."
                        error={!!errors.telefono}
                        helperText={errors.telefono}
                        sx={{ flex: 1 }}
                    />
                 </Box>

                 {/* FILA 4: DIRECCIÓN | CONTRASEÑA */}
                 <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField 
                        label="Dirección *" name="direccion" 
                        value={formData.direccion} onChange={handleChange} 
                        fullWidth size="small" placeholder="Calle 123"
                        error={!!errors.direccion}
                        helperText={errors.direccion}
                        sx={{ flex: 1 }}
                    />
                    <TextField 
                        label="Contraseña *" name="password" 
                        type={showPassword ? 'text' : 'password'} 
                        value={formData.password} onChange={handleChange} 
                        fullWidth size="small" placeholder="******"
                        error={!!errors.password}
                        helperText={errors.password}
                        sx={{ flex: 1 }}
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
                 </Box>

              </Stack>

              {/* BOTÓN */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{ borderRadius: 2, height: 40, minWidth: '200px' }}
                    disabled={loading}
                >
                  {loading ? 'REGISTRANDO...' : 'REGISTRARME'}
                </Button>
              </Box>

              <Box mt={2} textAlign="center">
                 <Link component="button" variant="body2" onClick={() => navigate('/login')} underline="hover">
                    ¿Ya tienes cuenta? Inicia Sesión
                 </Link>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

export default RegisterPage;