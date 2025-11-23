//============================================================================
// MICRO-COMPONENTE: FORMULARIO DE PERFIL DEL ASESOR
//============================================================================
/**
 * @fileoverview Formulario para editar datos del perfil del asesor.
 */
import React, { useState } from 'react';
import {
  Box, TextField, Button, Paper, Grid, Typography, Divider, InputAdornment, IconButton, Avatar
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

function ProfileForm({ userData, onSave, loading = false }) {
  const [formData, setFormData] = useState({
    email: userData.email || '',
    telefono: userData.telefono || '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Requerido.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
    
    if (!formData.telefono) {
        newErrors.telefono = 'El teléfono es obligatorio.';
    } else {
        const digitsOnly = formData.telefono.replace(/\D/g, '');
        if (digitsOnly.length < 8) {
            newErrors.telefono = 'El número debe tener al menos 8 dígitos.';
        }
        if (!/^[0-9\s\-+]+$/.test(formData.telefono)) {
             newErrors.telefono = 'Solo se permiten números.';
        }
    }

    if (formData.password) {
      if (formData.password.length < 6) newErrors.password = 'Mín 6 car.';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'No coinciden';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const dataToSend = { email: formData.email, telefono: formData.telefono };
      if (formData.password) dataToSend.password = formData.password;
      onSave(dataToSend);
    }
  };

  return (
    <Box sx={{ maxWidth: '590px', mx: 'auto', width: '100%' }}>
      
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', bgcolor: '#FFFFFF' }}>
        
        {/* HEADER */}
        <Box sx={{ p: 1.5, bgcolor: '#ECEFF1', borderBottom: '1px solid #CFD8DC', display: 'flex', alignItems: 'center', gap: 2, px: 3 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
            <AccountCircleIcon sx={{ color: '#FFFFFF', fontSize: 24 }} />
          </Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#0D47A1', fontSize: '1rem' }}>
              Mi Perfil
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>
              Información de cuenta.
            </Typography>
          </Box>
        </Box>

        {/* FORMULARIO */}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ py: 2, px: 4, display: 'flex', flexDirection: 'column', alignItems: '' }}>
          
          {/* SECCIÓN 1 */}
          <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#546E7A', mb: 0.5, display: 'block' }}>
            IDENTIFICACIÓN
          </Typography>
          
          <Box sx={{ maxWidth: '90%', mx: 'auto' }}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField
                fullWidth size="small" label="Legajo" value={userData.legajo || ''} disabled 
                variant="standard" margin="none"
                InputProps={{ startAdornment: <InputAdornment position="start"><BadgeIcon color="disabled" fontSize="small" /></InputAdornment> }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth size="small" label="Rol" value={userData.rol || ''} disabled 
                variant="standard" margin="none"
                InputProps={{ startAdornment: <InputAdornment position="start"><AssignmentIndIcon color="disabled" fontSize="small" /></InputAdornment> }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth size="small" label="Nombre" value={userData.nombre || ''} disabled 
                variant="standard" margin="none"
                InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon color="disabled" fontSize="small" /></InputAdornment> }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth size="small" label="Apellido" value={userData.apellido || ''} disabled 
                variant="standard" margin="none"
                InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon color="disabled" fontSize="small" /></InputAdornment> }}
              />
            </Grid>
          </Grid>
          </Box>
          <Divider sx={{ my: 1 }} />

          {/* SECCIÓN 2 */}
          <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#546E7A', mb: 0.5, display: 'block' }}>
            CONTACTO
          </Typography>

          <Box sx={{ maxWidth: '90%', mx: 'auto' }}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth required size="small" label="Email" 
                type="text" 
                value={formData.email} onChange={handleChange('email')}
                error={!!errors.email} 
                helperText={errors.email} 
                disabled={loading} margin="none"
                InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon fontSize="small" color="action" /></InputAdornment> }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth required size="small" label="Teléfono"
                value={formData.telefono} onChange={handleChange('telefono')}
                error={!!errors.telefono} 
                helperText={errors.telefono} 
                disabled={loading} margin="none"
                InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon fontSize="small" color="action" /></InputAdornment> }}
              />
            </Grid>
          </Grid>
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* SECCIÓN 3 */}
          <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#546E7A', mb: 0.5, display: 'block' }}>
            SEGURIDAD
          </Typography>

          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth size="small" label="Nueva Contraseña"
                type={showPassword ? 'text' : 'password'}
                value={formData.password} onChange={handleChange('password')}
                error={!!errors.password} helperText={errors.password} disabled={loading} margin="none"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><LockIcon fontSize="small" color="action" /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                        {showPassword ? <VisibilityOffIcon fontSize="small"/> : <VisibilityIcon fontSize="small"/>}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth size="small" label="Confirmar"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword} onChange={handleChange('confirmPassword')}
                error={!!errors.confirmPassword} helperText={errors.confirmPassword} disabled={loading} margin="none"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><LockIcon fontSize="small" color="action" /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" size="small">
                        {showConfirmPassword ? <VisibilityOffIcon fontSize="small"/> : <VisibilityIcon fontSize="small"/>}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
          </Grid>

          {/* BOTÓN */}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              size="small"
              sx={{ px: 3, borderRadius: 2, height: 32 }}
            >
              {loading ? '...' : 'Guardar Cambios'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default ProfileForm;