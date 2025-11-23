//============================================================================
// COMPONENTE: FILTROS DE PRECIOS
//============================================================================
/**
 * @fileoverview Barra de filtros para seleccionar Plan y Tipo de Ingreso.
 *
 * @description
 * Componente presentacional que renderiza los controles de filtrado para la
 * gestión de precios. Permite al usuario seleccionar un plan y un tipo de ingreso.
 * También proporciona un espacio para botones de acción a través de `props.children`.
 */

import React from 'react';
import { Paper, FormControl, InputLabel, Select, MenuItem, Box, Typography } from '@mui/material';
import { TIPOS_INGRESO } from '../../utils/constants';

/**
 * @component PriceFilters
 * @description Renderiza los filtros de Plan y Tipo de Ingreso.
 * @param {object} props - Propiedades del componente.
 * @param {Array<object>} props.planes - Lista de planes disponibles para el selector.
 * @param {string|number} props.selectedPlan - El ID del plan actualmente seleccionado.
 * @param {string} props.selectedTipo - El tipo de ingreso actualmente seleccionado.
 * @param {function} props.onPlanChange - Callback que se ejecuta al cambiar el plan.
 * @param {function} props.onTipoChange - Callback que se ejecuta al cambiar el tipo de ingreso.
 * @param {boolean} props.loading - Si es `true`, deshabilita los controles.
 * @param {React.ReactNode} props.children - Nodos hijos, típicamente botones de acción.
 * @returns {JSX.Element}
 */
function PriceFilters({ 
  planes, 
  selectedPlan, 
  selectedTipo, 
  onPlanChange, 
  onTipoChange,
  loading,
  children
}) {
  return (
    <Paper sx={{ p: 1.5, mb: 2, borderRadius: 2, boxShadow: 1, bgcolor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        {/* Lado Izquierdo: Filtros */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
            Filtros:
          </Typography>
          <FormControl size="small" disabled={loading} sx={{ minWidth: 240 }}>
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

          <FormControl size="small" disabled={loading} sx={{ minWidth: 180 }}>
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
        </Box>

        {/* Lado Derecho: Botones de Acción */}
        <Box>
          {children}
        </Box>
      </Box>
    </Paper>
  );
}

export default PriceFilters;