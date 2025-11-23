//============================================================================
// MICRO-COMPONENTE: MODAL DE RESULTADO DE BÚSQUEDA POR DNI (NO USADO ACTUALMENTE)
//============================================================================
/**
 * @fileoverview Modal que muestra el resultado de la verificación de cliente por DNI.
 *
 * @description
 * Este componente es crucial en el flujo de cotización. Recibe un objeto `result`
 * y renderiza una de tres interfaces diferentes según el escenario:
 * 1. **Cliente Nuevo**: Si el cliente no existe en la base de datos (UI verde).
 * 2. **Cliente Propio**: Si el cliente ya fue cotizado por el usuario actual (UI azul).
 * 3. **Cliente Bloqueado**: Si el cliente ya fue captado por otro asesor (UI roja).
 */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  Paper
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';

/**
 * @component QuoterResultModal
 * @description Muestra un modal con el resultado de la búsqueda de un cliente por DNI, manejando diferentes escenarios.
 * @param {object} props - Propiedades del componente.
 * @param {boolean} props.open - Controla si el modal está visible.
 * @param {function} props.onClose - Función para cerrar el modal.
 * @param {function} props.onContinue - Función que se ejecuta cuando el usuario decide proceder (en casos permitidos).
 * @param {object} props.result - El objeto con el resultado de la búsqueda desde el backend.
 * @param {boolean} props.result.existe - Indica si el cliente existe.
 * @param {boolean} props.result.cotizado_por_mi - Indica si el cliente fue cotizado por el usuario actual.
 * @returns {JSX.Element|null}
 */
function QuoterResultModal({ open, onClose, onContinue, result }) {
  if (!result) return null;

  const { existe, cotizado_por_mi, message, cliente, asesor_cotizador, fecha_cotizacion } = result;

  // Helpers
  const formatDate = (dateString) => {
     if (!dateString) return '';
     return new Date(dateString).toLocaleDateString('es-AR');
  };

  // CASO 1: Cliente NO existe -> CREAR (VERDE)
  if (!existe) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#A5D6A7', color: '#1b5e20', display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleIcon sx={{ color: '#1b5e20' }} />
            <Typography variant="h6" fontWeight="bold">Cliente Nuevo</Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {/* Forzamos color negro aquí también por si acaso */}
          <Typography variant="body1" sx={{ mb: 2, color: '#000' }}>
            El cliente no existe en la base de datos.
          </Typography>
          <Alert severity="success" variant="outlined" sx={{ bgcolor: '#e8f5e9' }}>
            Puede proceder a crear una nueva cotización.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit">Cancelar</Button>
          <Button onClick={onContinue} variant="contained" color="success">
            Crear Cotización
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  // CASO 2: Cliente existe y ES MÍO -> RE-COTIZAR (AZUL)
  if (existe && cotizado_por_mi) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#90CAF9', color: '#0d47a1', display: 'flex', alignItems: 'center', gap: 1 }}>
            <InfoIcon sx={{ color: '#0d47a1' }} />
            <Typography variant="h6" fontWeight="bold">Cliente Encontrado (Tuyo)</Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Alert severity="info" variant="standard" sx={{ mb: 2 }}>
            Este cliente ya fue cotizado por ti anteriormente. Se cargarán sus datos para una nueva cotización.
          </Alert>
          
          <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f5f5f5', border: '1px solid #bbdefb' }}>
            <Typography variant="subtitle2" sx={{ color: '#0d47a1', mb: 1 }}>Datos del Cliente:</Typography>
            <Typography variant="h6" sx={{ color: '#000000' }}>
                {cliente?.nombres} {cliente?.apellidos}
            </Typography>
            <Box display="flex" gap={4} mt={1}>
                <Typography variant="body2" sx={{ color: '#000000' }}><strong>DNI:</strong> {cliente?.dni || 'N/A'}</Typography>
                <Typography variant="body2" sx={{ color: '#000000' }}><strong>Última cotización:</strong> {formatDate(fecha_cotizacion)}</Typography>
            </Box>
          </Paper>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit">Cancelar</Button>
          <Button onClick={onContinue} variant="contained" color="primary">
            Nueva Cotización
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  // CASO 3: Cliente de OTRO ASESOR -> BLOQUEADO (ROJO)
  if (existe && !cotizado_por_mi) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#EF9A9A', color: '#b71c1c', display: 'flex', alignItems: 'center', gap: 1 }}>
            <ErrorIcon sx={{ color: '#b71c1c' }} />
            <Typography variant="h6" fontWeight="bold">Cliente Ya Cotizado</Typography>
        </DialogTitle>
        
        <DialogContent sx={{ mt: 2 }}>
          <Alert severity="error" variant="filled" sx={{ mb: 3 }}>
            {message}
          </Alert>

          <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fafafa', mb: 2 }}>
            <Typography variant="subtitle2" sx={{ color: '#666' }}>Cliente Solicitado:</Typography>
            
            <Typography variant="h6" sx={{ color: '#000000', fontWeight: 'bold' }}>
                {cliente?.nombres} {cliente?.apellidos}
            </Typography>
            
            <Typography variant="body2" sx={{ color: '#000000' }}>
                <strong>DNI:</strong> {cliente?.dni}
            </Typography>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2, bgcolor: '#ffebee', borderColor: '#ef5350' }}>
             <Typography variant="subtitle2" sx={{ color: '#b71c1c', fontWeight: 'bold', mb: 1 }}>
                ⚠️ Detalle del Asesor Captador:
             </Typography>
             <Typography variant="body1" sx={{ color: '#000000' }}>
                <strong>Asesor:</strong> {asesor_cotizador?.nombre} {asesor_cotizador?.apellido}
             </Typography>
             <Typography variant="body2" sx={{ color: '#000000' }}>
                <strong>Fecha de Cotización:</strong> {formatDate(fecha_cotizacion)}
             </Typography>
          </Paper>

        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} variant="contained" color="error">
            Entendido
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return null;
}

export default QuoterResultModal;