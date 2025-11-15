//============================================================================
// COMPONENTE: TABLA DE EMPLEADOS
//============================================================================
/**
 * @fileoverview Componente (presentacional) que renderiza
 * la tabla de empleados.
 *
 * @description
 * La columna 'Estado' muestra 3 estados:
 * 1. Pendiente (Chip Naranja)
 * 2. Activo (Toggle Verde)
 * 3. Inactivo/Suspendido (Toggle Rojo)
 */

import React from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Box, IconButton, TablePagination,
  Chip 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';

/**
 * @description Renderiza una tabla con la lista de empleados y permite la paginación y acciones sobre ellos.
 * @param {object} props - Propiedades del componente.
 * @param {Array<object>} props.empleados - La lista de empleados a mostrar.
 * @param {number} props.page - La página actual de la tabla.
 * @param {number} props.rowsPerPage - El número de filas por página.
 * @param {function} props.onPageChange - Función para manejar el cambio de página.
 * @param {function} props.onRowsPerPageChange - Función para manejar el cambio de filas por página.
 * @param {function} props.onEdit - Función para manejar la edición de un empleado.
 * @param {function} props.onToggleEstado - Función para manejar el cambio de estado de un empleado.
 * @returns {JSX.Element} El componente de la tabla de empleados.
 */
function EmpleadosTable({ 
  empleados, 
  page, 
  rowsPerPage, 
  onPageChange, 
  onRowsPerPageChange, 
  onEdit, 
  onToggleEstado 
}) {

  const renderEstado = (emp) => {
    
    // Pendiente (Recién creado, email no confirmado)
    if (emp.estado === 'inactivo' && emp.email_confirmado === 0) {
      return (
        <Chip 
          label="Pendiente" 
          color="warning" // Color naranja
          size="small" 
          sx={{ fontWeight: 'bold' }}
        />
      );
    }

    // Activo
    if (emp.estado === 'activo') {
      return (
        <IconButton color="success" onClick={() => onToggleEstado(emp.legajo, 'inactivo')}>
          <ToggleOnIcon />
        </IconButton>
      );
    }

    // Inactivo (Suspendido, pero ya confirmado)
    return (
      <IconButton color="error" onClick={() => onToggleEstado(emp.legajo, 'activo')}>
        <ToggleOffIcon />
      </IconButton>
    );
  };


  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 600, overflowX: 'auto'}}> 
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
                >
                  <TableCell>{emp.legajo}</TableCell>
                  <TableCell>{emp.nombre}</TableCell>
                  <TableCell>{emp.apellido}</TableCell>
                  <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {emp.email}
                  </TableCell>
                  <TableCell>{emp.rol}</TableCell>
                  
                  <TableCell>
                    {renderEstado(emp)}
                  </TableCell>
                  
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.1 }}>
                      <IconButton color="primary" onClick={() => onEdit(emp.legajo)}>
                        <EditIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[6, 12, 18, 24]} 
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