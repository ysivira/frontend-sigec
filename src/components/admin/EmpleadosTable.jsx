//============================================================================
// COMPONENTE: TABLA DE EMPLEADOS (Presentacional)
//============================================================================
/**
 * @fileoverview Componente "tonto" (presentacional) que renderiza
 * la tabla de empleados con paginación y botones de acción.
 *
 * @description
 * Recibe toda la data y los 'handlers' (manejadores) como props
 * desde el componente padre (la página).
 */

import React from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Box, IconButton, TablePagination
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';

function EmpleadosTable({ 
  empleados, 
  page, 
  rowsPerPage, 
  onPageChange, 
  onRowsPerPageChange, 
  onEdit, 
  onToggleEstado 
}) {

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 600 }}> 
        <Table stickyHeader sx={{ tableLayout: 'fixed' }}> 
          
          <TableHead>
            <TableRow sx={{ 
              borderBottom: '2px solid', 
              borderColor: 'primary.main',
              '& .MuiTableCell-root': {
                color: 'text.primary', 
                fontWeight: 'bold', 
                fontSize: '0.95rem', 
                backgroundColor: 'background.paper'
              }
            }}>
              <TableCell sx={{ width: '10%' }}>Legajo</TableCell>
              <TableCell sx={{ width: '15%' }}>Nombre</TableCell>
              <TableCell sx={{ width: '15%' }}>Apellido</TableCell>
              <TableCell sx={{ width: '25%' }}>Email</TableCell>
              <TableCell sx={{ width: '10%' }}>Rol</TableCell>
              <TableCell sx={{ width: '10%' }}>Estado</TableCell>
              <TableCell sx={{ width: '15%' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody sx={{ 
            backgroundColor: '#FFFFFF',
            '& .MuiTableCell-root': {
              color: 'text.primary',
              fontSize: '0.9rem'
            }
          }}>
            {empleados 
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((emp) => (
                <TableRow 
                  key={emp.legajo} 
                  sx={{ 
                    outline: '1px solid transparent',
                    '&:hover': { 
                      backgroundColor: 'action.hover', 
                      outlineColor: 'primary.main', 
                    } 
                  }}
                >
                  <TableCell>{emp.legajo}</TableCell>
                  <TableCell>{emp.nombre}</TableCell>
                  <TableCell>{emp.apellido}</TableCell>
                  <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {emp.email}
                  </TableCell>
                  <TableCell>{emp.rol}</TableCell>
                  <TableCell>{emp.estado}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.1 }}>
                      <IconButton color="primary" onClick={() => onEdit(emp.legajo)}>
                        <EditIcon />
                      </IconButton>
                      {emp.estado === 'activo' ? (
                        <IconButton color="success" onClick={() => onToggleEstado(emp.legajo, 'inactivo')}>
                          <ToggleOnIcon />
                        </IconButton>
                      ) : (
                        <IconButton color="error" onClick={() => onToggleEstado(emp.legajo, 'activo')}>
                          <ToggleOffIcon />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]} 
        component="div"
        count={empleados.length} 
        rowsPerPage={rowsPerPage} 
        page={page} 
        onPageChange={onPageChange} 
        onRowsPerPageChange={onRowsPerPageChange} 
        labelRowsPerPage="Filas por página:"
        sx={{ 
          backgroundColor: 'background.paper',
          color: 'text.primary'
        }}
      />
    </Paper>
  );
}

export default EmpleadosTable;