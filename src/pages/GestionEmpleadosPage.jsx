//============================================================================
// PÁGINA DE GESTIÓN DE EMPLEADOS (CRUD)
//============================================================================
/**
 * @fileoverview Página para la Gestión de Empleados (CRUD).
 *
 * @description
 * Esta página es la "Oficina del Administrador" 
 * Implementa la parte de LEER (Read) y prepara los botones
 * para ACTUALIZAR (Update) y BORRAR (Delete) 
 */

import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig'; 
import { 
  Typography, 
  Box, 
  CircularProgress, 
  Alert, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  IconButton,
  TablePagination,
  TextField,
  InputAdornment 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import SearchIcon from '@mui/icons-material/Search';

/**
 * Componente de la página de gestión de empleados.
 * Muestra una tabla con la lista de empleados, permitiendo la búsqueda,
 * paginación y acciones como editar y cambiar el estado del empleado.
 * @returns {JSX.Element} El componente de la página de gestión de empleados.
 */
function GestionEmpleadosPage() {
  const [allEmployees, setAllEmployees] = useState([]); 
  const [loading, setLoading] = useState(true);   
  const [error, setError] = useState(null);      

  const [page, setPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(5); 

  const [filter, setFilter] = useState('');

  const theme = useTheme();

  useEffect(() => {
    /**
     * Obtiene la lista de empleados desde la API.
     */
    const fetchEmployees = async () => {
      try {
        setLoading(true); 
        setError(null);   
        
        const response = await apiClient.get('/employees');
        
        await new Promise(resolve => setTimeout(resolve, 2000)); 
        
        setAllEmployees(response.data); 
        
      } catch (err) {
        setError('Error al cargar los empleados. ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false); 
      }
    };

    fetchEmployees(); 
  }, []); 

  /**
   * Maneja el cambio de página en la tabla.
   * @param {React.MouseEvent<HTMLButtonElement> | null} event 
   * @param {number} newPage 
   */
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  /**
   * Maneja el cambio en el número de filas por página.
   * @param {React.ChangeEvent<HTMLInputElement>} event 
   */
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };

  /**
   * Maneja el cambio en el campo de filtro de búsqueda.
   * @param {React.ChangeEvent<HTMLInputElement>} event 
   */
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setPage(0); 
  };

  /**
   * Filtra los empleados basándose en el término de búsqueda.
   * @type {Array<Object>}
   */
  const filteredEmployees = allEmployees.filter((emp) => {
    const searchTerm = filter.toLowerCase();
    
    return (
      emp.legajo.toString().toLowerCase().includes(searchTerm) ||
      emp.nombre.toLowerCase().includes(searchTerm) ||
      emp.apellido.toLowerCase().includes(searchTerm) ||
      emp.email.toLowerCase().includes(searchTerm) ||
      emp.rol.toLowerCase().includes(searchTerm) ||
      emp.estado.toLowerCase().includes(searchTerm)
    );
  });

  /**
   * Maneja la acción de editar un empleado.
   * @param {number} legajo 
   */
  const handleEdit = (legajo) => {
    console.log(`(FUTURO) Abrir MODAL DE EDICIÓN para legajo: ${legajo}`);
  };

  /**
   * Maneja la acción de cambiar el estado de un empleado.
   * @param {number} legajo - El legajo del empleado.
   * @param {string} nuevoEstado - El nuevo estado ('activo' or 'inactivo').
   */
  const handleToggleEstado = (legajo, nuevoEstado) => {
    console.log(`(FUTURO) Llamar API para cambiar estado de ${legajo} a ${nuevoEstado}`);
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '60vh',
          borderRadius: 2, 
          p: 3, 
        }}
      >
        <CircularProgress color="secondary" size={60} /> 
        <Typography variant="h6" sx={{ mt: 2 }} color="secondary">
          Cargando empleados...
        </Typography>
      </Box>
    );
  }
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom color="primary.contrastText">
        Gestión de Empleados
      </Typography>
      
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <TextField
          sx={{ width: '20%' }} 
          variant="outlined"
          placeholder="Buscar empleado..."
          value={filter}
          onChange={handleFilterChange}
          InputProps={{
            style: { 
              color: theme.palette.text.primary, 
              backgroundColor: '#FFFFFF', 
              borderRadius: theme.shape.borderRadius 
            },
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: theme.palette.text.secondary }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

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
              {filteredEmployees
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
                        <IconButton color="primary" onClick={() => handleEdit(emp.legajo)}>
                          <EditIcon />
                        </IconButton>
                        {emp.estado === 'activo' ? (
                          <IconButton color="success" onClick={() => handleToggleEstado(emp.legajo, 'inactivo')}>
                            <ToggleOnIcon />
                          </IconButton>
                        ) : (
                          <IconButton color="error" onClick={() => handleToggleEstado(emp.legajo, 'activo')}>
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
          count={filteredEmployees.length} 
          rowsPerPage={rowsPerPage} 
          page={page} 
          onPageChange={handleChangePage} 
          onRowsPerPageChange={handleChangeRowsPerPage} 
          labelRowsPerPage="Filas por página:"
          sx={{ 
            backgroundColor: 'background.paper',
            color: 'text.primary'
          }}
        />
      </Paper>
    </Box>
  );
}

export default GestionEmpleadosPage;