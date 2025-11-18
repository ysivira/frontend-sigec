//============================================================================
// MICRO-COMPONENTE: TABLA DE PLANES
//============================================================================
/**
 * @fileoverview Tabla presentacional para listar los planes de cobertura.
 *
 * @description
 * Recibe un array de planes y funciones de acción.
 * Muestra los campos del 'planModel.js' (nombre, detalles, activo).
 *
 * @param {object} props
 * @param {Array} props.plans - Lista de planes a mostrar.
 * @param {function} props.onEdit - Función al hacer click en editar.
 * @param {function} props.onDelete - Función al hacer click en eliminar (borrado lógico).
 */

import React from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Box, IconButton, Chip 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'; 

function PlansTable({ plans, onEdit, onDelete }) {

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2, boxShadow: 3 }}>
      <TableContainer sx={{ maxHeight: 600 }}> 
        <Table stickyHeader> 
          <TableHead>
            <TableRow sx={{ 
              '& .MuiTableCell-root': {
                fontWeight: 'bold', 
                backgroundColor: '#f5f5f5', 
                color: 'primary.main'
              }
            }}>
              <TableCell sx={{ width: '30%' }}>Nombre del Plan</TableCell>
              <TableCell sx={{ width: '50%' }}>Detalles</TableCell>
              <TableCell sx={{ width: '10%' }}>Estado</TableCell>
              <TableCell sx={{ width: '10%' }} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody sx={{ backgroundColor: '#FFFFFF' }}>
            {plans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                  No hay planes registrados.
                </TableCell>
              </TableRow>
            ) : (
              plans.map((plan) => (
                <TableRow hover key={plan.id}>
                  <TableCell sx={{ fontWeight: 'medium' }}>{plan.nombre}</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>
                    
                    {plan.detalles || 'Sin detalles'}
                  </TableCell>
                  <TableCell>
                    {plan.activo ? 
                      <Chip label="Activo" color="success" size="small" variant="outlined" /> :
                      <Chip label="Inactivo" color="default" size="small" variant="outlined" />
                    }
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <IconButton size="small" color="primary" onClick={() => onEdit(plan)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      {/* Solo mostramos el botón de borrar si el plan está ACTIVO */}
                      {plan.activo === 1 && (
                        <IconButton size="small" color="error" onClick={() => onDelete(plan)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
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

export default PlansTable;