//============================================================================
// MICRO-COMPONENTE: MODAL DE CARGA MASIVA DE PRECIOS
//============================================================================
/**
 * @fileoverview Modal para la carga masiva y estructurada de una lista de precios completa.
 *
 * @description
 * Este componente presenta un formulario dentro de un modal que permite al usuario
 * seleccionar un plan y un tipo de ingreso, y luego ingresar el precio para cada
 * uno de los rangos etarios predefinidos en el sistema.
 *
 * @param {boolean} props.open - Visibilidad.
 * @param {function} props.onClose - Cerrar modal.
 * @param {function} props.onSave - Guardar (recibe el array de precios).
 * @param {Array} props.planes - Lista de planes para el selector.
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Box, FormControl, InputLabel, Select, MenuItem, Typography, 
  TextField, Grid, InputAdornment, Paper
} from '@mui/material';
import { toast } from 'react-hot-toast';
import { TIPOS_INGRESO, RANGOS_ETARIOS } from '../../utils/constants'; 

/**
 * Obtiene un color específico basado en el nombre de un plan.
 * Esto simula una extensión del tema de Material-UI para colores de planes.
 * @param {string} planName - El nombre del plan (ej: "Rubi").
 * @returns {string} El color CSS correspondiente o el color primario por defecto.
 */
const getPlanColor = (planName) => {
  if (!planName) return 'primary.main';

  const normalizedPlanName = planName
    .trim()
    .normalize("NFD") // Separa los caracteres de sus acentos
    .replace(/[\u0300-\u036f]/g, "") // Elimina los acentos
    .toLowerCase();

  const colorMap = { 
    'rubi': '#E91E63', 
    'esmeralda': '#4CAF50', 
    'zafiro': '#2196F3', 
    'diamante': '#90A4AE' 
  };
  return colorMap[normalizedPlanName] || 'primary.main';
};

/**
 * @component BulkLoadModal
 * @description Modal con un formulario para la carga masiva de precios por rangos etarios.
 * @param {object} props - Propiedades del componente.
 * @param {boolean} props.open - Controla si el modal está visible.
 * @param {function} props.onClose - Función para cerrar el modal.
 * @param {function} props.onSave - Función que se ejecuta al guardar, recibe un array de objetos de precio.
 * @param {Array<object>} props.planes - Lista de planes disponibles para el selector.
 * @returns {JSX.Element}
 */
function BulkLoadModal({ open, onClose, onSave, planes }) {
  
  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    planId: '',
    tipoIngreso: TIPOS_INGRESO.OBLIGATORIO,
  });

  // Estado para los precios 
  const [preciosInput, setPreciosInput] = useState({});

  // Efecto para resetear el estado del formulario cada vez que el modal se abre.
  useEffect(() => {
    if (open) {
      setFormData({
        planId: '',
        tipoIngreso: TIPOS_INGRESO.OBLIGATORIO,
      });
      setPreciosInput({});
    }
  }, [open, planes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'planId' ? (value ? parseInt(value, 10) : '') : value 
    }));
  };

  // Maneja el cambio de precio de un rango específico
  const handlePriceChange = (rangoLabel, valor) => {
    setPreciosInput(prev => ({
      ...prev,
      [rangoLabel]: valor 
    }));
  };

  const handleSubmit = () => {
    const pricesToLoad = [];

    RANGOS_ETARIOS.forEach(rango => {
      const precioStr = preciosInput[rango.label];
      
      if (precioStr && !isNaN(parseFloat(precioStr))) {
        
        pricesToLoad.push({
          plan_id: formData.planId,
          tipo_ingreso: formData.tipoIngreso,
          lista_nombre: formData.tipoIngreso, 
          rango_etario: rango.label, 
          precio: parseFloat(precioStr),
        });
      }
    });

    onSave(pricesToLoad);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        Carga Masiva Estructurada
      </DialogTitle>
      
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mb: 3 }}>
            {/* Select de Plan */}
            <Grid item xs={12} sm={6}> 
                <FormControl fullWidth margin="normal">
                    <InputLabel>Plan</InputLabel>
                    <Select
                        name="planId"
                        value={formData.planId}
                        label="Plan"
                        onChange={handleChange}
                    >
                        <MenuItem value=""><em>Seleccione un Plan</em></MenuItem>
                        {planes.map(p => (
                            <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>

            {/* Select de Tipo */}
            <Grid item xs={12} sm={6}> 
                <FormControl fullWidth margin="normal">
                    <InputLabel>Tipo de Ingreso</InputLabel>
                    <Select
                        name="tipoIngreso"
                        value={formData.tipoIngreso}
                        label="Tipo de Ingreso"
                        onChange={handleChange}
                    >
                        {Object.values(TIPOS_INGRESO).map(tipo => (
                            <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
        </Grid>

        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold', color: 'text.secondary' }}>
          Ingrese los precios por rango etario:
        </Typography>

        {/* GENERACIÓN DINÁMICA DE INPUTS */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 1.5 }}>
          {RANGOS_ETARIOS.map((rango) => ( 
            <Paper key={rango.label} elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              {/* Encabezado de la tarjeta con color dinámico según el plan seleccionado */}
              <Box sx={{ bgcolor: getPlanColor(planes.find(p => p.id === formData.planId)?.nombre), p: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>
                  {rango.label}
                </Typography>
              </Box>
              {/* Cuerpo de la tarjeta con el input */}
              <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
                <TextField
                fullWidth
                size="small"
                placeholder="0.00"
                type="number"
                value={preciosInput[rango.label] || ''}
                onChange={(e) => handlePriceChange(rango.label, e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
              </Box>
            </Paper>))}
        </Box>

      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Guardar Precios
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default BulkLoadModal;