//============================================================================
// MICRO-COMPONENTE: MODAL DE AUMENTO MASIVO DE PRECIOS
//============================================================================
/**
 * @fileoverview Modal para aplicar un incremento porcentual a las listas de precios.
 *
 * @description
 * Permite al Administrador aplicar un aumento masivo de precios (ej: "Aumentar 10%")
 * a una categoría completa de precios (Obligatorio, Voluntario, Monotributo o Ambas).
 * Realiza validaciones básicas antes de enviar la solicitud.
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Box, FormControl, InputLabel, Select, MenuItem, Typography, TextField
} from '@mui/material';
import { toast } from 'react-hot-toast';
import { TIPOS_INGRESO } from '../../utils/constants.js';

const TIPOS_INGRESO_EXT = {
    ...TIPOS_INGRESO,
    AMBAS: 'Ambas (Todas)'
};

/**
 * @description Muestra un modal para configurar y confirmar un aumento masivo.
 * @param {object} props - Propiedades del componente.
 * @param {boolean} props.open - Controla si el modal está visible.
 * @param {function} props.onClose - Función para cerrar el modal sin aplicar cambios.
 * @param {function} props.onSave - Función que ejecuta el aumento (recibe porcentaje y tipoIngreso).
 * @returns {JSX.Element} El componente del modal.
 */
function BulkIncreaseModal({ open, onClose, onSave }) {
  // ESTADOS LOCALES 
  const [porcentaje, setPorcentaje] = useState('');
  const [tipoIngreso, setTipoIngreso] = useState(TIPOS_INGRESO.OBLIGATORIO);

  // EFECTO: Reset al abrir 
  useEffect(() => {
    if (open) {
      setPorcentaje('');
      setTipoIngreso(TIPOS_INGRESO.OBLIGATORIO);
    }
  }, [open]);

  // HANDLERS 

  /**
   * Valida los datos y ejecuta la acción de guardar del padre.
   * @param {object} event - Evento del formulario.
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const percentValue = parseFloat(porcentaje);

    // Validación: El porcentaje debe ser un número positivo
    if (isNaN(percentValue) || percentValue <= 0) {
      toast.error("Por favor, ingrese un porcentaje válido mayor a 0.");
      return;
    }

    onSave(percentValue, tipoIngreso);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
        Aplicar Aumento Masivo
      </DialogTitle>
      
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Este proceso actualizará permanentemente los precios de todas las entradas seleccionadas.
          </Typography>

          {/* Input de Porcentaje */}
          <TextField
            label="Porcentaje de Aumento (%)"
            type="number"
            value={porcentaje}
            onChange={(e) => setPorcentaje(e.target.value)}
            fullWidth
            required
            sx={{ mb: 3 }}
            inputProps={{ min: 0.01, step: "0.01" }}
            placeholder="Ej: 15.5"
          />

          {/* Selector de Tipo de Lista */}
          <FormControl fullWidth required>
            <InputLabel>Aplicar a</InputLabel>
            <Select
              value={tipoIngreso}
              label="Aplicar a"
              onChange={(e) => setTipoIngreso(e.target.value)}
            >
              <MenuItem value={TIPOS_INGRESO_EXT.OBLIGATORIO}>
                {TIPOS_INGRESO_EXT.OBLIGATORIO}
              </MenuItem>
              <MenuItem value={TIPOS_INGRESO_EXT.VOLUNTARIO}>
                {TIPOS_INGRESO_EXT.VOLUNTARIO}
              </MenuItem>
              <MenuItem value={TIPOS_INGRESO_EXT.MONOTRIBUTO}>
                {TIPOS_INGRESO_EXT.MONOTRIBUTO}
              </MenuItem>
              <MenuItem value={TIPOS_INGRESO_EXT.AMBAS}>
                {TIPOS_INGRESO_EXT.AMBAS}
              </MenuItem>
            </Select>
          </FormControl>

        </DialogContent>
        
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit">Cancelar</Button>
          <Button type="submit" variant="contained" color="secondary">
            Aplicar Aumento
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default BulkIncreaseModal;