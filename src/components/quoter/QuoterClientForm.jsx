//============================================================================
// COMPONENTE: FORMULARIO DE DATOS DEL CLIENTE
//============================================================================
/**
 * @fileoverview Formulario para la captura o visualización de datos del cliente.
 *
 * @description
 * Este componente es el segundo paso del asistente de cotización. Opera en tres
 * modos distintos: 1) Búsqueda inicial por DNI, 2) Creación de un nuevo prospecto
 * si el DNI no se encuentra, y 3) Visualización/edición de un cliente existente
 * si se encuentra. Su comportamiento se controla mediante las props `isSearchMode`
 * y `isExistingClient`.
 */

import React from 'react';
import { toast } from 'react-hot-toast';
import {
  Box,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  Avatar,
  IconButton,
  Divider
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CakeIcon from '@mui/icons-material/Cake';
import BadgeIcon from '@mui/icons-material/Badge';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';

/**
 * @component QuoterClientForm
 * @description Formulario para capturar o mostrar los datos de un cliente. Actúa como el segundo paso en el asistente de cotización y tiene varios modos de operación.
 * @param {object} props - Propiedades del componente.
 * @param {object} props.clientData - Objeto con los datos del cliente (dni, nombres, etc.).
 * @param {object} props.errors - Objeto con los mensajes de error de validación para cada campo.
 * @param {function} props.onChange - Callback que se ejecuta cuando cambia un campo, recibe el nombre del campo y su nuevo valor.
 * @param {boolean} [props.isExistingClient=false] - Si es `true`, indica que el cliente fue encontrado y algunos campos se deshabilitan.
 * @param {function} props.onSearchDni - Callback que se ejecuta para buscar un cliente por DNI.
 * @param {boolean} [props.isSearchMode=true] - Si es `true`, el formulario está en modo de búsqueda inicial, con solo el DNI habilitado.
 * @returns {JSX.Element}
 */
function QuoterClientForm({ clientData, errors, onChange, isExistingClient = false, onSearchDni, isSearchMode = true }) {
  
  const handleChange = (field) => (e) => {
    onChange(field, e.target.value);
  };

  const handleAgeChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && (value === '' || parseInt(value) <= 99)) {
      onChange('edad', value);
    }
  };

  const handleDniChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      onChange('dni', value);
    }
  };

  const handleSearchClick = () => {
    if (!/^\d{7,8}$/.test(clientData.dni)) {
      toast.error('El DNI debe tener 7 u 8 dígitos.');
      return;
    }
    onSearchDni(clientData.dni);
  };

  return (
    <Box sx={{ maxWidth: '750px', mx: 'auto', width: '100%' }}>
      
      {/* CARD PRINCIPAL */}
      <Paper 
        elevation={2} 
        sx={{ borderRadius: 2, overflow: 'hidden' }}
      >
        
        {/* HEADER */}
        <Box sx={{ p: 2, bgcolor: 'grey.100', borderBottom: '1px solid #E0E0E0', display: 'flex', alignItems: 'center', gap: 2 }}>

          <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
            <AccountCircleIcon sx={{ color: 'white', fontSize: 24 }} />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
              Datos del Cliente
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isExistingClient 
                ? 'Verifique la información registrada.' 
                : isSearchMode 
                  ? 'Ingrese un DNI para comenzar.'
                  : 'Complete los datos del nuevo prospecto.'}
            </Typography>
          </Box>
        </Box>
        
        {/* BODY */}
        <Box sx={{ p: 2.5 }}>
          
          {/* TÍTULO SECCIÓN */}
          <Typography variant="overline" display="block" gutterBottom sx={{ mb: 1.5 }}>
            IDENTIFICACIÓN PERSONAL
          </Typography>
          
          {/* GRILA 2 COLUMNAS */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            
            {/* DNI */}
            <TextField
              required
              label="Documento (DNI)"
              value={clientData.dni || ''}
              onChange={handleDniChange}
              placeholder="Buscar por DNI..."
              InputProps={{
                startAdornment: <InputAdornment position="start"><BadgeIcon /></InputAdornment>,
                endAdornment: isSearchMode && (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearchClick} edge="end" color="primary">
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              disabled={!isSearchMode}
              inputProps={{ maxLength: 8, inputMode: 'numeric' }}
              error={!!errors.dni}
              helperText={errors.dni}
            />

            {/* EDAD */}
            <TextField
              required
              label="Edad"
              value={clientData.edad || ''}
              onChange={handleAgeChange}
              placeholder="0-99" 
              InputProps={{
                startAdornment: <InputAdornment position="start"><CakeIcon /></InputAdornment>,
              }}
              inputProps={{ maxLength: 2, inputMode: 'numeric' }}
              disabled={isSearchMode}
              error={!!errors.edad}
              helperText={errors.edad}
            />

            {/* NOMBRES */}
            <TextField
              required
              label="Nombres"
              value={clientData.nombres || ''}
              onChange={handleChange('nombres')}
              InputProps={{
                startAdornment: <InputAdornment position="start"><PersonIcon /></InputAdornment>
              }}
              disabled={isSearchMode || isExistingClient}
              error={!!errors.nombres}
              helperText={errors.nombres}
            />

            {/* APELLIDOS */}
            <TextField
              required
              label="Apellidos"
              value={clientData.apellidos || ''}
              onChange={handleChange('apellidos')}
              InputProps={{
                startAdornment: <InputAdornment position="start"><PersonIcon /></InputAdornment>
              }}
              disabled={isSearchMode || isExistingClient}
              error={!!errors.apellidos}
              helperText={errors.apellidos}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* TÍTULO SECCIÓN */}
          <Typography variant="overline" display="block" gutterBottom sx={{ mb: 1.5 }}>
            CONTACTO Y UBICACIÓN
          </Typography>

          {/* GRILA 2 COLUMNAS */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            
            {/* EMAIL */}
            <Box sx={{ gridColumn: '1 / -1' }}>
              <TextField
                required
                type="email"
                label="Correo Electrónico"
                value={clientData.email || ''}
                onChange={handleChange('email')}
                placeholder="ejemplo@email.com"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><EmailIcon /></InputAdornment>
                }}
                disabled={isSearchMode || isExistingClient}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Box>

            {/* TELÉFONO */}
            <TextField
              required
              label="Teléfono / Celular"
              value={clientData.telefono || ''}
              onChange={handleChange('telefono')}
              placeholder="Ej: 3814445555 (sin 0 ni 15)"
              InputProps={{
                startAdornment: <InputAdornment position="start"><PhoneIcon /></InputAdornment>
              }}
              disabled={isSearchMode}
              inputProps={{ maxLength: 10 }}
              error={!!errors.telefono}
              helperText={errors.telefono}
            />

            {/* CIUDAD */}
            <TextField
              required
              label="Ciudad / Localidad"
              value={clientData.direccion || ''}
              onChange={handleChange('direccion')}
              InputProps={{
                startAdornment: <InputAdornment position="start"><LocationOnIcon /></InputAdornment>
              }}
              disabled={isSearchMode}
              error={!!errors.direccion}
              helperText={errors.direccion}
            />
          </Box>

        </Box>
      </Paper>
    </Box>
  );
}

export default QuoterClientForm;