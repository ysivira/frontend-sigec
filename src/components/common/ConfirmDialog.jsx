//============================================================================
// COMPONENTE: MODAL DE CONFIRMACIÓN REUTILIZABLE
//============================================================================
/**
 * @fileoverview Dialog genérico de confirmación y notificación.
 *
 * @description
 * Reemplaza "window.confirm()" y puede usarse para notificaciones simples.
 * Es configurable en color y acciones.
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
 * @description Muestra un diálogo de confirmación o notificación genérico.
 * @param {object} props - Propiedades del componente.
 * @param {boolean} props.open - Controla si el diálogo está abierto.
 * @param {function} props.onClose - Función para cerrar el diálogo.
 * @param {function} props.onConfirm - Función que se ejecuta al confirmar/aceptar.
 * @param {string} props.title - El título del diálogo.
 * @param {string} props.message - El mensaje a mostrar en el cuerpo del diálogo.
 * @param {string} [props.variant='info'] - Variante de color ('info', 'success', 'error', 'warning').
 * @param {string} [props.confirmText='Confirmar'] - Texto del botón de confirmación/aceptar.
 * @param {boolean} [props.showCancel=true] - Muestra u oculta el botón de cancelar.
 * @returns {JSX.Element} El componente del diálogo.
 */
function ConfirmDialog({ 
  open, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  variant = 'info', 
  confirmText = 'Confirmar',
  showCancel = true
}) {
  
  const colorMap = {
    info: 'primary',
    success: 'success',
    error: 'error',
    warning: 'warning',
  };

  const buttonColor = colorMap[variant] || 'primary';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" aria-labelledby="confirm-dialog-title">
      <DialogTitle id="confirm-dialog-title" sx={{ color: `${buttonColor}.main` }}>
        {title}
      </DialogTitle>

      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      
      <DialogActions sx={{ p: '16px 24px' }}>
        {showCancel && (
          <Button onClick={onClose} color="inherit">
            Cancelar
          </Button>
        )}
        <Button onClick={onConfirm} variant="contained" color={buttonColor} autoFocus>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
