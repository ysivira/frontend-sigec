//============================================================================
// MICRO-COMPONENTE: BARRA DE BÚSQUEDA POR DNI (PASO 1) (NO USADO ACTUALMENTE)
//============================================================================
/**
 * @fileoverview Componente presentacional para la búsqueda de cliente por DNI.
 *
 * @description
 * Este componente representa el primer paso del asistente de cotización. Renderiza
 * un formulario con un campo para ingresar un DNI y un botón de búsqueda.
 * Incluye validación interna para asegurar que el DNI tenga un formato válido.
 */

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BadgeIcon from '@mui/icons-material/Badge';

/**
 * @component QuoterSearchBar
 * @description Renderiza el formulario inicial para buscar un cliente por DNI.
 * @param {object} props - Propiedades del componente.
 * @param {function} props.onSearch - Callback que se ejecuta con el DNI validado cuando el usuario hace clic en buscar.
 * @param {boolean} [props.disabled=false] - Si es `true`, deshabilita el formulario para prevenir interacciones durante la búsqueda.
 * @returns {JSX.Element}
 */
function QuoterSearchBar({ onSearch, disabled = false }) {
  const [dni, setDni] = useState('');
  const [error, setError] = useState('');

  const validateDni = () => {
    const dniTrimmed = dni.trim();
    if (!dniTrimmed) {
      setError('El DNI es obligatorio');
      return false;
    }
    if (!/^\d{7,8}$/.test(dniTrimmed)) {
      setError('El DNI debe tener 7 u 8 dígitos');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateDni()) {
      onSearch(dni.trim());
    }
  };

  const handleDniChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setDni(value);
      setError('');
    }
  };

  return (
    <Box sx={{ maxWidth: '800px', mx: 'auto', width: '100%' }}>
        <Paper elevation={2} sx={{ p: 4 }}>
        <Box sx={{ mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Paso 1: Verificar Cliente
            </Typography>
            <Typography variant="body2" color="text.secondary">
            Ingrese el DNI del cliente para verificar si ya existe en el sistema
            </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
            <TextField
            fullWidth
            label="DNI del Cliente"
            placeholder="Ingrese 7 u 8 dígitos"
            value={dni}
            onChange={handleDniChange}
            disabled={disabled}
            error={!!error}
            helperText={error || 'Solo números, sin puntos ni espacios'}
            inputProps={{
                maxLength: 8,
                inputMode: 'numeric',
                pattern: '[0-9]*'
            }}
            InputProps={{
                startAdornment: (
                <InputAdornment position="start">
                    <BadgeIcon color="action" />
                </InputAdornment>
                ),
            }}
            sx={{ mb: 3 }}
            autoFocus
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={disabled || !dni.trim()}
                startIcon={<SearchIcon />}
                sx={{ minWidth: 180 }}
            >
                {disabled ? 'Buscando...' : 'Buscar Cliente'}
            </Button>
            </Box>
        </Box>
        </Paper>
    </Box>
  );
}

export default QuoterSearchBar;