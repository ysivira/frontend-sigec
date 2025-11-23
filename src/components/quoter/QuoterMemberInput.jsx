//============================================================================
// MICRO-COMPONENTE: INPUT PARA MIEMBROS DEL GRUPO FAMILIAR
//============================================================================
/**
 * @fileoverview Componente para la entrada de datos de un miembro del grupo familiar.
 *
 * @description
 * Este es un sub-componente reutilizable utilizado por `QuoterMainForm` para
 * renderizar los campos de "Parentesco" y "Edad" para cada integrante de una
 * cotización. Recibe del padre las opciones de parentesco válidas para evitar
 * inconsistencias lógicas (ej. más de un cónyuge).
 */

import React from 'react';
import {
  Box,
  TextField,
  MenuItem,
  IconButton,
  Grid,
  Typography,
  Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

/**
 * @component QuoterMemberInput
 * @description Renderiza los campos de entrada para un único miembro del grupo familiar.
 * @param {object} props - Propiedades del componente.
 * @param {object} props.member - Objeto con los datos del miembro (parentesco, edad).
 * @param {number} props.index - El índice del miembro en el array, usado para identificarlo.
 * @param {function} props.onChange - Callback que se ejecuta al cambiar un campo, recibe (index, field, value).
 * @param {function} props.onRemove - Callback que se ejecuta para eliminar este miembro.
 * @param {boolean} props.canRemove - Si es `true`, muestra el botón para eliminar.
 * @param {Array<string>} props.opcionesDisponibles - Array de strings con las opciones de parentesco válidas para este miembro.
 * @param {boolean} props.disabledParentesco - Si es `true`, deshabilita el selector de parentesco.
 * @returns {JSX.Element}
 */
function QuoterMemberInput({ 
    member, 
    index, 
    onChange, 
    onRemove, 
    canRemove, 
    opcionesDisponibles, 
    disabledParentesco  
}) {

  const handleChange = (field) => (e) => {
    onChange(index, field, e.target.value);
  };

  const handleAgeChange = (e) => {
    const value = e.target.value;
    // Solo números entre 0 y 99
    if (/^\d*$/.test(value) && (value === '' || parseInt(value) <= 99)) {
      onChange(index, 'edad', value);
    }
  };

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2, borderLeft: '4px solid #1976d2' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle2" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          {index === 0 ? 'Titular (Solicitante)' : `Integrante Adicional #${index}`}
        </Typography>
        {canRemove && (
          <IconButton size="small" color="error" onClick={() => onRemove(index)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      <Grid container spacing={2}>
        {/* Parentesco */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Parentesco"
            value={member.parentesco || ''}
            onChange={handleChange('parentesco')}
            size="small"
            sx={{ minWidth: '160px' }} 
            disabled={disabledParentesco} 
          >

            {opcionesDisponibles && opcionesDisponibles.map((opcion) => (
              <MenuItem key={opcion} value={opcion}>
                {opcion}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Edad */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Edad"
            value={member.edad || ''}
            onChange={handleAgeChange}
            size="small"
            helperText={index === 0 ? "Edad calculada (Editable)" : "0-99 años"}
            inputProps={{ maxLength: 2, inputMode: 'numeric', pattern: '[0-9]*' }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}

export default QuoterMemberInput;