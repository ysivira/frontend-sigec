//============================================================================
// MICRO-COMPONENTE: TABLA DE PRECIOS
//============================================================================
/**
 * @fileoverview Tabla presentacional para listar los precios filtrados.
 *
 * @description
 * Muestra las columnas: ID, Rango Etario, Precio y Acciones.
 * Formatea el precio como moneda (ARS) sin decimales.
 * Estilo unificado (encabezados azules).
 *
 * @param {object} props
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

function BulkLoadModal({ open, onClose, onSave, planes }) {
  
  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    planId: '',
    tipoIngreso: TIPOS_INGRESO.OBLIGATORIO,
  });

  // Estado para los precios 
  const [preciosInput, setPreciosInput] = useState({});

  // Reset al abrir
  useEffect(() => {
    if (open) {
      setFormData({
        planId: planes.length > 0 ? planes[0].id : '',
        tipoIngreso: TIPOS_INGRESO.OBLIGATORIO,
      });
      // Inicializamos los precios vacíos
      setPreciosInput({});
    }
  }, [open, planes]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Maneja el cambio de precio de un rango específico
  const handlePriceChange = (rangoLabel, valor) => {
    setPreciosInput(prev => ({
      ...prev,
      [rangoLabel]: valor 
    }));
  };

  const handleSubmit = () => {
    // Validaciones básicas
    if (!formData.planId) {
      toast.error("Seleccione un Plan.");
      return;
    }

    const pricesToLoad = [];

    RANGOS_ETARIOS.forEach(rango => {
      const precioStr = preciosInput[rango.label];
      
      if (precioStr && !isNaN(parseFloat(precioStr))) {
        
        pricesToLoad.push({
          plan_id: formData.planId,
          tipo_ingreso: formData.tipoIngreso,
          lista_nombre: formData.tipoIngreso, 
          
          // Datos del rango (vienen de constants.js)
          rango_etario: rango.label, 
          precio: parseFloat(precioStr),
        });
      }
    });

    if (pricesToLoad.length === 0) {
      toast.error("Ingrese al menos un precio para cargar.");
      return;
    }

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
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 2 }}>
          {RANGOS_ETARIOS.map((rango) => (
            <Paper key={rango.label} variant="outlined" sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                {rango.label}
              </Typography>
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
            </Paper>
          ))}
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