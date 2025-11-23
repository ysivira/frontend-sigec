//============================================================================
// COMPONENTE: BARRA DE FILTROS PARA COTIZACIONES
//============================================================================
/**
 * @fileoverview Componente presentacional que renderiza una barra de búsqueda.
 *
 * @description
 * Proporciona un campo de texto para que el usuario pueda filtrar una lista de
 * cotizaciones por DNI, nombre o apellido. Incluye un botón para limpiar
 * la búsqueda rápidamente.
 */

import React from 'react';
import { TextField, Paper, Grid, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

/**
 * @component QuoterFilters
 * @description Renderiza una barra de búsqueda para filtrar cotizaciones.
 * @param {object} props - Propiedades del componente.
 * @param {string} props.searchTerm - El término de búsqueda actual.
 * @param {function} props.onSearchChange - Callback que se ejecuta cuando el valor de búsqueda cambia.
 * @param {function} props.onClearSearch - Callback que se ejecuta al hacer clic en el botón de limpiar.
 * @returns {JSX.Element}
 */
function QuoterFilters({ 
  searchTerm, 
  onSearchChange, 
  onClearSearch, 
}) {
  return (
    <Paper elevation={1} sx={{ py: 0.8, px: 1, mb: 2 }}>
      <Grid container alignItems="center">
        <Grid item>
          <TextField
            sx={{ 
              width: '350px',
              '& .MuiInputBase-root': {
                height: '30px', 
              },
              '& .MuiInputBase-input': {
                padding: '4px 8px !important',
              },
            }}
            variant="outlined"
            placeholder="Buscar por DNI, Nombre o Apellido..."
            value={searchTerm}
            onChange={onSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: searchTerm && ( 
                <InputAdornment position="end">
                  <IconButton
                    aria-label="limpiar búsqueda"
                    onClick={onClearSearch}
                    edge="end"
                    size="small"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Grid>

      </Grid>
    </Paper>
  );
}

export default QuoterFilters;