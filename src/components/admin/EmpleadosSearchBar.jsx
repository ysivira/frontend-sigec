//============================================================================
// COMPONENTE: BARRA DE BÚSQUEDA DE EMPLEADOS 
//============================================================================
/**
 * @fileoverview Componente (presentacional) que renderiza
 * la barra de búsqueda para la tabla de empleados.
 *
 * @description
 * Es responsivo: Ocupa 100% en 'xs' y 20% (el tuyo) en 'sm'.
 */

import React from 'react';
import { Box, TextField, InputAdornment, useTheme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

/**
 * @description Renderiza una barra de búsqueda para filtrar empleados.
 * @param {object} props - Propiedades del componente.
 * @param {string} props.filter - El valor actual del filtro de búsqueda.
 * @param {function} props.onFilterChange - Función para manejar el cambio en el filtro.
 * @returns {JSX.Element} El componente de la barra de búsqueda.
 */
function EmpleadosSearchBar({ filter, onFilterChange }) {
  const theme = useTheme();

  return (
    <Box sx={{ 
      mb: 2, 
      display: 'flex', 
      justifyContent: { xs: 'center', sm: 'flex-end' } 
    }}>
      <TextField
        
        sx={{ width: { xs: '100%', sm: '20%' } }} 
        variant="outlined"
        placeholder="Buscar empleado..."
        value={filter}
        onChange={onFilterChange}
        InputProps={{
          style: { 
            color: theme.palette.text.primary, 
            backgroundColor: '#FFFFFF', 
            borderRadius: theme.shape.borderRadius 
          },
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: theme.palette.text.secondary }} />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}

export default EmpleadosSearchBar;