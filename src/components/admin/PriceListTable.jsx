//============================================================================
// COMPONENTE: TABLA DE LISTA DE PRECIOS
//============================================================================
/**
 * @fileoverview Componente presentacional que renderiza la tabla de precios.
 *
 * @description
 * Muestra una lista de rangos etarios y sus precios asociados en formato tabular.
 * Incluye lógica interna para el formateo de moneda (ARS) y botones de acción
 * para editar o eliminar cada entrada. Maneja visualmente el caso de lista vacía.
 */

import React from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Box, IconButton, Typography 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

/**
 * @description Renderiza la tabla de precios con acciones.
 * @param {object} props - Propiedades del componente.
 * @param {Array<object>} props.entries - Lista de objetos de precios a mostrar.
 * @param {function} props.onEdit - Función a ejecutar al hacer click en editar.
 * @param {function} props.onDelete - Función a ejecutar al hacer click en eliminar.
 * @returns {JSX.Element} El componente de la tabla.
 */
function PriceListTable({ entries, onEdit, onDelete }) {

  // Seguridad: Garantiza que entries sea un array para evitar errores de renderizado
  const safeEntries = Array.isArray(entries) ? entries : [];

  /**
   * Formatea un valor numérico como moneda ARS.
   * @param {number} amount - Valor a formatear.
   * @returns {string} Valor formateado (ej: "$ 1.234,56").
   */
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '$ 0,00';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency', 
      currency: 'ARS', 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    }).format(amount);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2, boxShadow: 3 }}>
      <TableContainer > 
        <Table stickyHeader size="small"> 
          
          {/* CABECERA */}
          <TableHead>
            <TableRow sx={{ 
              borderBottom: '2px solid', 
              borderColor: 'primary.main',
              '& .MuiTableCell-root': { 
                py: 1, 
                px: 2, 
                color: 'primary.main', 
                fontWeight: 'bold', 
                backgroundColor: '#f5f5f5',
                fontSize: '0.8rem'
              }
            }}>
              <TableCell sx={{ width: '40%' }}>Rango Etario</TableCell>
              <TableCell sx={{ width: '30%' }} align="right">Precio</TableCell>
              <TableCell className="no-print" sx={{ width: '30%' }} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          
          {/* CUERPO */}
          <TableBody sx={{ backgroundColor: '#FFFFFF', '& .MuiTableCell-root': { py: 0.5, px: 2, fontSize: '0.8rem' } }}>
            
            {/* CASO: LISTA VACÍA */}
            {safeEntries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 4 }}> 
                  <Typography variant="body1" color="text.secondary">
                    No hay precios cargados para este filtro.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              /* CASO: LISTA CON DATOS */
              safeEntries.map((precio) => (
                <TableRow hover key={precio.id || Math.random()}>
                  
                  {/* Columna: Rango Etario */}
                  <TableCell>
                    {/* Muestra el rango formateado o construye uno básico si falta */}
                    {precio.rango_etario || `${precio.edad_min || '?'} - ${precio.edad_max || '?'}`}
                  </TableCell>

                  {/* Columna: Precio */}
                  <TableCell align="right" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {formatCurrency(precio.precio)}
                  </TableCell>
                  
                  {/* Columna: Acciones */}
                  <TableCell className="no-print" align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <IconButton size="small" color="primary" onClick={() => onEdit(precio)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => onDelete(precio.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default PriceListTable;