//============================================================================
// MICRO-COMPONENTE: MODAL EDICIÓN DE PRECIO INDIVIDUAL
//============================================================================
/**
 * Este componente representa un modal para editar el precio de un rango etario específico.
 * Permite al usuario ingresar un nuevo precio y guardar los cambios.
 * 
 * @component
 * 
 * @param {Object} props - Propiedades del componente.
 * @param {boolean} props.open - Indica si el modal está abierto o cerrado.
 * @param {Function} props.onClose - Función que se ejecuta al cerrar el modal.
 * @param {Function} props.onSave - Función que se ejecuta al guardar los cambios, recibe un objeto con los datos actualizados.
 * @param {Object} props.precioData - Datos del precio actual, incluyendo el rango etario y el precio.
 * @param {string} props.precioData.rango_etario - Rango etario asociado al precio (solo lectura).
 * @param {number} props.precioData.precio - Precio actual que se puede editar.
 * 
 * @returns {JSX.Element} Modal de edición de precio.
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Box
} from '@mui/material';
import FormInput from '../common/FormInput'; 

function PrecioEditModal({ open, onClose, onSave, precioData }) {
  const [precio, setPrecio] = useState('');

  useEffect(() => {
    if (precioData) {
      setPrecio(precioData.precio);
    }
  }, [precioData]);

  const handleSubmit = () => {
    // Validación básica
    if (!precio || isNaN(precio)) return;
    
    onSave({
      ...precioData,
      precio: parseFloat(precio)
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        Editar Precio
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
           {/* Mostramos el rango como solo lectura para contexto */}
           <FormInput
            name="rango"
            label="Rango Etario"
            value={precioData?.rango_etario || ''}
            disabled
          />
          
          <FormInput
            name="precio"
            label="Nuevo Precio"
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            autoFocus
            required
          />
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PrecioEditModal;