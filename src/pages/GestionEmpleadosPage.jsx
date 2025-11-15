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
 * 4. Delega TODO el renderizado (la UI) a componentes "tontos" (presentacionales).
 */

import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import {
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { toast } from 'react-hot-toast';
import EmpleadosSearchBar from '../components/admin/EmpleadosSearchBar';
import EmpleadosTable from '../components/admin/EmpleadosTable';
import EmpleadosEditModal from '../components/admin/EmpleadosEditModal';
import ConfirmDialog from '../components/common/ConfirmDialog';

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
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [filter, setFilter] = useState('');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');

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
        const errorMsg = err.response?.data?.message || err.message;
        setError('Error al cargar los empleados. ' + errorMsg);
        toast.error('Error al cargar empleados: ' + errorMsg);
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
    const employeeToEdit = allEmployees.find(emp => emp.legajo === legajo);
    
    if (employeeToEdit) {
      setEditingEmployee(employeeToEdit);
      setIsEditModalOpen(true);
    } else {
      toast.error('Error: No se pudo encontrar al empleado.');
    }
  };

  // Handler para CERRAR el modal
  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    // Limpiamos el estado del empleado seleccionado
    setTimeout(() => setEditingEmployee(null), 300); 
  };

  /**
   * Maneja la acción de "Guardar" desde el modal.
   * Llama a la API [PUT /api/employees/:legajo]
   * @param {object} updatedData - Los nuevos datos del empleado.
   */
  const handleSaveModal = async (updatedData) => {
    const originalEmployees = [...allEmployees];
    const legajoToUpdate = updatedData.legajo;
    setAllEmployees(prevEmployees =>
      prevEmployees.map(emp =>
        emp.legajo === legajoToUpdate ? updatedData : emp
      )
    );
    handleCloseModal();
    try {
      await apiClient.put(`/employees/${legajoToUpdate}`, {
        rol: updatedData.rol,
        supervisor_id: updatedData.supervisor_id,
      });
      toast.success(`Empleado #${legajoToUpdate} actualizado exitosamente.`);
    } catch (err) {
      setAllEmployees(originalEmployees);
      const errorMsg = err.response?.data?.message || err.message;
      console.error("Error al actualizar empleado:", errorMsg);
      toast.error(`Error al actualizar #${legajoToUpdate}: ${errorMsg}`);
    }
  };

  /**
   * Maneja la acción de cambiar el estado de un empleado.
   * Llama a la API [PUT /api/employees/:legajo]
   * y actualiza el estado local de forma "optimista".
   * @param {number} legajo - El legajo del empleado.
   * @param {string} nuevoEstado - El nuevo estado ('activo' or 'inactivo').
   */
  const handleToggleEstado = (legajo, nuevoEstado) => {
    const title = nuevoEstado === 'activo' ? 'Reactivar Empleado' : 'Desactivar Empleado';
    const message = `¿Estás seguro de que deseas ${nuevoEstado} al empleado #${legajo}?`;

    const action = () => async () => {
      const originalEmployees = [...allEmployees];
      setAllEmployees(prevEmployees =>
        prevEmployees.map(emp =>
          emp.legajo === legajo ? { ...emp, estado: nuevoEstado } : emp
        )
      );
      try {
        await apiClient.put(`/employees/${legajo}`, { estado: nuevoEstado });
        toast.success(`Empleado #${legajo} actualizado a "${nuevoEstado}".`);
      } catch (err) {
        setAllEmployees(originalEmployees);
        const errorMsg = err.response?.data?.message || err.message;
        console.error("Error al actualizar estado:", errorMsg);
        toast.error(`Error al actualizar #${legajo}: ${errorMsg}`);
      }
    };

    setConfirmTitle(title);
    setConfirmMessage(message);
    setConfirmAction(action); 
    setConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setConfirmOpen(false);
    setTimeout(() => {
      setConfirmAction(null);
      setConfirmTitle('');
      setConfirmMessage('');
    }, 300);
  };

  const handleDoConfirm = () => {
    if (confirmAction) {
      confirmAction(); 
    }
    handleCloseConfirm();
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

  if (error && allEmployees.length === 0) {
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

      <EmpleadosEditModal
        open={isEditModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveModal}
        employee={editingEmployee}
        allEmployees={allEmployees}
      />

      <ConfirmDialog
        open={confirmOpen}
        onClose={handleCloseConfirm}
        onConfirm={handleDoConfirm}
        title={confirmTitle}
        message={confirmMessage}
      />
    </Box>
  );
}

export default GestionEmpleadosPage;