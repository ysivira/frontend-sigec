//============================================================================
// PÁGINA DE GESTIÓN DE EMPLEADOS (CONTENEDOR)
//============================================================================
/**
 * @fileoverview Página principal ("Smart Component") para la administración de empleados.
 *
 * @description
 * Este componente actúa como el controlador de la vista de empleados. Sus responsabilidades son:
 * 1. Obtener la lista completa de empleados desde la API.
 * 2. Gestionar el estado local de la UI (carga, paginación, filtros).
 * 3. Implementar la lógica de filtrado de negocio (texto + estado, incluyendo "pendiente").
 * 4. Orquestar y ejecutar las operaciones CRUD (Edición, Activación/Inactivación) mediante modales.
 * 
 */

import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import {
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { toast } from 'react-hot-toast';

// IMPORTACIÓN DE MICRO-COMPONENTES (PRESENTACIONALES) 
import LoadingScreen from '../components/common/LoadingScreen';
import EmployeesSearchBar from '../components/admin/EmployeesSearchBar';
import EmployeesTable from '../components/admin/EmployeesTable';
import EmployeesEditModal from '../components/admin/EmployeesEditModal';
import ConfirmDialog from '../components/common/ConfirmDialog';

/**
 * @description Componente contenedor para la gestión de empleados.
 * @returns {JSX.Element} Página completa de gestión de empleados.
 */
function ManageEmployeesPage() {
  // ESTADOS DE DATOS Y CARGA

  /** @type {[Array<Object>, Function]} Lista completa de empleados traída de la API. */
  const [allEmployees, setAllEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // PAGINACIÓN 
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  
  // FILTROS 
  /** @type {[string, Function]} Texto ingresado en el buscador. */
  const [filter, setFilter] = useState('');
  /** @type {[string, Function]} Estado seleccionado en el dropdown ('todos', 'activo', 'pendiente', 'inactivo'). */
  const [statusFilter, setStatusFilter] = useState('todos'); 

  // MODALES Y CONFIRMACIÓN
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  /** @type {[Object|null, Function]} Objeto del empleado siendo editado. */
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  /** @type {[Function|null, Function]} La acción asíncrona a ejecutar tras la confirmación. */
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');

  // EFECTOS

  /**
   * @effect Carga inicial de empleados.
   * Se ejecuta una sola vez al montar el componente.
   */
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.get('/employees');
        // Simulación de carga (mantenida para ver el LoadingScreen)
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        setAllEmployees(response.data);
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message;
        setError('Error al cargar empleados: ' + errorMsg);
        toast.error('Error al cargar empleados: ' + errorMsg);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // LÓGICA DE NEGOCIO (FILTROS)
    
  /**
   * Determina el estado lógico/visual del empleado para el frontend.
   * Mapea (inactivo + no confirmado) a "pendiente".
   * @param {Object} emp - Objeto empleado.
   * @returns {string} 'pendiente' | 'inactivo' | 'activo'
   */
  const getEmployeeDisplayStatus = (emp) => {
    if (emp.estado === 'inactivo' && emp.email_confirmado === 0) return 'pendiente';
    if (emp.estado === 'inactivo' && emp.email_confirmado === 1) return 'inactivo';
    return emp.estado; 
  };

  /**
   * Lista filtrada de empleados, aplicando lógica de búsqueda de texto y filtro de estado.
   */
  const filteredEmployees = allEmployees.filter((emp) => {
    
    const displayStatus = getEmployeeDisplayStatus(emp);
    
    // Filtro de Estado (Dropdown)
    if (statusFilter !== 'todos' && displayStatus !== statusFilter) {
      return false;
    }

    // Filtro de Texto (Búsqueda)
    const searchTerm = filter.toLowerCase();
    if (searchTerm === '') return true;

    return (
      emp.legajo.toString().toLowerCase().includes(searchTerm) ||
      emp.nombre.toLowerCase().includes(searchTerm) ||
      emp.apellido.toLowerCase().includes(searchTerm) ||
      emp.email.toLowerCase().includes(searchTerm) ||
      emp.rol.toLowerCase().includes(searchTerm) ||
      displayStatus.toLowerCase().includes(searchTerm) 
    );
  });

  // HANDLERS (PAGINACIÓN, FILTROS, MODALES)

  /** @handler Maneja el cambio de página en la tabla. */
  const handleChangePage = (event, newPage) => setPage(newPage);
  
  /** @handler Maneja el cambio de filas por página. */
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  /** @handler Actualiza el filtro de texto y reinicia la paginación. */
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setPage(0);
  };

  /** @handler Actualiza el filtro de estado (dropdown) y reinicia la paginación. */
  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  /**
   * @handler Abre el modal de edición.
   * @param {number} legajo - ID del empleado.
   */
  const handleEdit = (legajo) => {
    const employeeToEdit = allEmployees.find(emp => emp.legajo === legajo);
    if (employeeToEdit) {
      setEditingEmployee(employeeToEdit);
      setIsEditModalOpen(true);
    } else {
      toast.error('Error: Empleado no encontrado.');
    }
  };
  
  /** @handler Cierra el modal de edición. */
  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setTimeout(() => setEditingEmployee(null), 300); 
  };

  /**
   * @handler Envía la actualización del empleado (rol/supervisor) al backend (PUT).
   * @param {Object} updatedData - Datos actualizados.
   */
  const handleSaveModal = async (updatedData) => {
    const originalEmployees = [...allEmployees];
    const legajoToUpdate = updatedData.legajo;

    // Actualización Optimista
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
      toast.success(`Empleado #${legajoToUpdate} actualizado.`);
    } catch (err) {
      setAllEmployees(originalEmployees); // Rollback si falla
      const errorMsg = err.response?.data?.message || err.message;
      toast.error(`Error al actualizar: ${errorMsg}`);
    }
  };

  /**
   * @handler Inicia el flujo de confirmación para cambiar el estado (Activar/Inactivar).
   * @param {number} legajo - ID del empleado.
   * @param {string} newStatus - Nuevo estado ('activo' | 'inactivo').
   */
  const handleToggleStatus = (legajo, newStatus) => {
    const title = newStatus === 'activo' ? 'Reactivar Empleado' : 'Desactivar Empleado';
    const message = `¿Estás seguro de que deseas poner al empleado #${legajo} como ${newStatus}?`;

    // Acción diferida (se ejecuta al confirmar)
    const action = async () => {
      const originalEmployees = [...allEmployees];
      
      // Actualización Optimista
      setAllEmployees(prevEmployees =>
        prevEmployees.map(emp =>
          emp.legajo === legajo ? { ...emp, estado: newStatus, email_confirmado: 1 } : emp 
        )
      );
      
      try {
        await apiClient.put(`/employees/${legajo}`, { estado: newStatus });
        toast.success(`Empleado #${legajo} actualizado a "${newStatus}".`);
      } catch (err) {
        setAllEmployees(originalEmployees); // Rollback
        const errorMsg = err.response?.data?.message || err.message;
        toast.error(`Error actualizando #${legajo}.`);
      }
      setConfirmOpen(false);
    };

    setConfirmTitle(title);
    setConfirmMessage(message);
    setConfirmAction(() => action); 
    setConfirmOpen(true);
  };
  
  /** @handler Cierra el modal de confirmación y limpia los estados. */
  const handleCloseConfirm = () => {
    setConfirmOpen(false);
    setTimeout(() => {
      setConfirmAction(null);
      setConfirmTitle('');
      setConfirmMessage('');
    }, 300);
  };
  
  /** @handler Ejecuta la acción guardada en el estado 'confirmAction'. */
  const handleDoConfirm = () => {
    if (confirmAction) {
      confirmAction(); 
    }
    handleCloseConfirm();
  };

  // RENDERIZADO 

  if (loading) return <LoadingScreen message="Cargando empleados..." />;
  if (error && allEmployees.length === 0) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gestión de Empleados
      </Typography>

      {/* Barra de Filtros */}
      <EmployeesSearchBar
        filter={filter}
        onFilterChange={handleFilterChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
      />

      {/* Tabla */}
      <EmployeesTable
        employees={filteredEmployees}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
      />

      {/* Modales */}
      <EmployeesEditModal
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

export default ManageEmployeesPage;