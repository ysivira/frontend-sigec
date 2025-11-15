//============================================================================
// PÁGINA DE GESTIÓN DE EMPLEADOS (Contenedor)
//============================================================================
/**
 * @fileoverview Página "Contenedor" para la Gestión de Empleados.
 *
 * @description
 * Esta página es un "Componente Contenedor" (inteligente).
 * 1. Maneja TODA la lógica de estado (useState).
 * 2. Maneja TODA la carga de datos (useEffect, apiClient).
 * 3. Maneja TODOS los 'handlers' (filtros, paginación, acciones).
 * 4. Delega TODO el renderizado (la UI) a componentes "tontos".
 */

import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig'; 
import { 
  Typography, 
  Box, 
  CircularProgress, 
  Alert,
} from '@mui/material';

import EmpleadosSearchBar from '../components/admin/EmpleadosSearchBar';
import EmpleadosTable from '../components/admin/EmpleadosTable';


/**
 * Componente de la página de gestión de empleados.
 * Muestra una tabla con la lista de empleados, permitiendo la búsqueda,
 * paginación y acciones como editar y cambiar el estado del empleado.
 * @returns {JSX.Element} El componente de la página de gestión de empleados.
 */
function GestionEmpleadosPage() {
  // ESTADO 
  const [allEmployees, setAllEmployees] = useState([]); 
  const [loading, setLoading] = useState(true);   
  const [error, setError] = useState(null);      
  const [page, setPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(5); 
  const [filter, setFilter] = useState('');

  // CARGA DE DATOS
  useEffect(() => {
    /**
     * Obtiene la lista de empleados desde la API.
     */
    const fetchEmployees = async () => {
      try {
        setLoading(true); 
        setError(null);   
        
        const response = await apiClient.get('/employees');
        
        // Simulación de carga 
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        
        setAllEmployees(response.data); 
        
      } catch (err) {
        setError('Error al cargar los empleados. ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false); 
      }
    };

    fetchEmployees(); 
  }, []); 

  // MANEJADORES (Handlers) 

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

  // LÓGICA DE FILTRADO 

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

  // RENDERIZADO

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
      
      {/* Componente de Búsqueda */}
      <EmpleadosSearchBar 
        filter={filter}
        onFilterChange={handleFilterChange}
      />

      {/*Componente de Tabla */}
      <EmpleadosTable
        empleados={filteredEmployees}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        onEdit={handleEdit}
        onToggleEstado={handleToggleEstado}
      />
    </Box>
  );
}

export default GestionEmpleadosPage;