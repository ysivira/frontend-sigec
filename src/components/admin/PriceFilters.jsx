//============================================================================
// MICRO-COMPONENTE: FILTROS DE PRECIOS
//============================================================================
/**
 * @fileoverview Barra de filtros para seleccionar Plan y Tipo de Ingreso.
 *
 * @description
 * Muestra dos selectores (Dropdowns).
 * Notifica al padre cuando cambian los valores.
 */

import React from 'react';
import { Paper, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import { TIPOS_INGRESO } from '../../utils/constants';

function PriceFilters({ 
  planes, 
  selectedPlan, 
  selectedTipo, 
  onPlanChange, 
  onTipoChange,
  loading 
}) {
  return (
    <Paper sx={{ p: 2, mb: 3, borderRadius: 2, boxShadow: 1 }}>
      {/* Container principal */}
      <Grid container spacing={2} alignItems="center">
        
        {/* PLAN SELECTOR */}
        <Grid xs={12} sm={6}>
          <FormControl fullWidth size="small" disabled={loading}>
            <InputLabel id="plan-select-label">Seleccionar Plan</InputLabel>
            <Select
              labelId="plan-select-label"
              name="planId"
              value={selectedPlan}
              label="Seleccionar Plan"
              onChange={onPlanChange}
            >
              <MenuItem value=""><em>Seleccione...</em></MenuItem>
              {planes.map((plan) => (
                <MenuItem key={plan.id} value={plan.id}>{plan.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* TIPO SELECTOR */}
        <Grid xs={12} sm={6}>
          <FormControl fullWidth size="small" disabled={loading}>
            <InputLabel id="tipo-select-label">Tipo de Ingreso</InputLabel>
            <Select
              labelId="tipo-select-label"
              name="tipoIngreso" 
              value={selectedTipo}
              label="Tipo de Ingreso"
              onChange={onTipoChange}
            >
              <MenuItem value=""><em>Seleccione...</em></MenuItem>
              {Object.values(TIPOS_INGRESO).map((tipo) => (
                <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default PriceFilters;