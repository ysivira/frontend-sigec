//============================================================================
// MICRO-COMPONENTE: TABLA DE PRECIOS (SOLO LECTURA)
//============================================================================
/**
 * @fileoverview Tabla para visualizar listas de precios (sin edición).
 */

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box
} from '@mui/material';

/**
 * @description Tabla de precios en modo lectura
 * @param {Object} props
 * @param {Array} props.prices - Lista de precios
 */
function PriceListViewTable({ prices, size = 'medium' }) { 
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(value);
  };

  if (!prices || prices.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No hay precios disponibles para esta selección
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} elevation={2}>
      <Table size={size}>
        <TableHead>
          <TableRow sx={{ bgcolor: 'primary.main' }}>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
              Rango Etario
            </TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">
              Precio
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {prices.map((price, index) => (
            <TableRow
              key={price.id}
              sx={{
                '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
                '&:hover': { bgcolor: 'action.selected' }
              }}
            >
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {price.rango_etario}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" fontWeight="bold" color="primary">
                  {formatCurrency(price.precio)}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default PriceListViewTable;