//============================================================================
// COMPONENTE: MODAL DE CONFIRMACIÓN REUTILIZABLE
//============================================================================
/**
 * @fileoverview Dialog genérico de confirmación 
 *
 * @description
 * Reemplaza el "window.confirm()" 
 */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material';

/**
 * @description Muestra un diálogo de confirmación genérico.
 * @param {object} props - Propiedades del componente.
 * @param {boolean} props.open - Controla si el diálogo está abierto.
 * @param {function} props.onClose - Función para cerrar el diálogo.
 * @param {function} props.onConfirm - Función que se ejecuta al confirmar.
 * @param {string} props.title - El título del diálogo.
 * @param {string} props.message - El mensaje a mostrar en el cuerpo del diálogo.
 * @returns {JSX.Element} El componente del diálogo de confirmación.
 */
function ConfirmDialog({ open, onClose, onConfirm, title, message }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs">
      <DialogTitle>{title}</DialogTitle>
      
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;