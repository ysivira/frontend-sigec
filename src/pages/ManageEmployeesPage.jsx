//============================================================================
// PÁGINA DE GESTIÓN DE EMPLEADOS (CONTENEDOR)
//============================================================================
/**
 * @fileoverview Página principal ("Smart Component") para la administración de empleados.
 *
 * @description
 * Este componente actúa como el controlador de la vista de gestión de empleados.
 * Sus responsabilidades incluyen obtener la lista completa de empleados desde la API,
 * gestionar el estado local de la UI (carga, paginación, filtros), implementar la
 * lógica de filtrado de negocio (incluyendo un estado "pendiente" para cuentas
 * no confirmadas) y orquestar las operaciones de edición y cambio de estado
 * a través de componentes modales.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axiosConfig';
import {
  Typography,
  Box,
  Alert,
  Container, 
  Paper
} from '@mui/material';
import LoadingScreen from '../components/common/LoadingScreen';
import EmployeesSearchBar from '../components/admin/EmployeesSearchBar';
import EmployeesTable from '../components/admin/EmployeesTable';
import EmployeesEditModal from '../components/admin/EmployeesEditModal';
import ConfirmDialog from '../components/common/ConfirmDialog';

const initialDialogState = {
  open: false,
  title: '',
  message: '',
  variant: 'info',
  confirmText: 'Aceptar',
  showCancel: false,
  onConfirm: () => {},
};

/**
 * @component ManageEmployeesPage
 * @description Componente de página que orquesta la visualización, filtrado y gestión de empleados.
 * Maneja el estado de los datos, la paginación y la interacción con los modales de edición
 * y confirmación.
 * @returns {JSX.Element} Página completa de gestión de empleados.
 */
function ManageEmployeesPage() {
  const { logout } = useAuth();
  // ESTADOS DE DATOS Y CARGA
  const [allEmployees, setAllEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); 
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [dialogState, setDialogState] = useState(initialDialogState);

  // MANEJO DEL DIÁLOGO
  
  const closeDialog = useCallback(() => {
    setDialogState(prev => ({ ...prev, open: false }));
  }, []);

  const showDialog = useCallback((config) => {
    setDialogState({
      ...initialDialogState,
      ...config,
      open: true,
      onConfirm: config.onConfirm ? () => { config.onConfirm(); closeDialog(); } : closeDialog,
    });
  }, [closeDialog]);

  // EFECTOS

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.get('/employees');
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        setAllEmployees(response.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          logout();
          return;
        }
        const errorMsg = err.response?.data?.message || err.message;
        setError('Error al cargar empleados: ' + errorMsg);
        showDialog({
          title: 'Error de Carga',
          message: `No se pudieron obtener los empleados. ${errorMsg}`,
          variant: 'error',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, [showDialog, logout]);

  // LÓGICA DE NEGOCIO (FILTROS)
    
  const getEmployeeDisplayStatus = (emp) => {
    if (emp.estado === 'inactivo' && emp.email_confirmado === 0) return 'pendiente';
    if (emp.estado === 'inactivo' && emp.email_confirmado === 1) return 'inactivo';
    return emp.estado; 
  };

  const filteredEmployees = allEmployees.filter((emp) => {
    const displayStatus = getEmployeeDisplayStatus(emp);
    if (statusFilter !== 'todos' && displayStatus !== statusFilter) return false;
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

  const handleChangePage = (event, newPage) => setPage(newPage);
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setPage(0);
  };

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const handleEdit = (legajo) => {
    const employeeToEdit = allEmployees.find(emp => emp.legajo === legajo);
    if (employeeToEdit) {
      setEditingEmployee(employeeToEdit);
      setIsEditModalOpen(true);
    } else {
      showDialog({
        title: 'Error',
        message: 'No se encontró el empleado para editar.',
        variant: 'error',
      });
    }
  };
  
  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setTimeout(() => setEditingEmployee(null), 300); 
  };

  const handleSaveModal = async (updatedData) => {
    const originalEmployees = [...allEmployees];
    const legajoToUpdate = updatedData.legajo;

    setAllEmployees(prev => prev.map(emp => emp.legajo === legajoToUpdate ? updatedData : emp));
    handleCloseModal();

    try {
      await apiClient.put(`/employees/${legajoToUpdate}`, {
        rol: updatedData.rol,
        supervisor_id: updatedData.supervisor_id,
      });
      showDialog({
        title: 'Éxito',
        message: `Empleado #${legajoToUpdate} actualizado correctamente.`,
        variant: 'success',
        confirmText: 'Entendido'
      });
    } catch (err) {
      if (err.response && err.response.status === 401) {
        logout();
        return;
      }
      setAllEmployees(originalEmployees);
      const errorMsg = err.response?.data?.message || err.message;
      showDialog({
        title: 'Error de Actualización',
        message: `No se pudo actualizar el empleado. ${errorMsg}`,
        variant: 'error',
      });
    }
  };

  const handleToggleStatus = (legajo, newStatus) => {
    const title = newStatus === 'activo' ? 'Reactivar Empleado' : 'Desactivar Empleado';
    const message = `¿Estás seguro de que deseas poner al empleado #${legajo} como ${newStatus}?`;

    const action = async () => {
      const originalEmployees = [...allEmployees];
      setAllEmployees(prev =>
        prev.map(emp =>
          emp.legajo === legajo ? { ...emp, estado: newStatus, email_confirmado: 1 } : emp 
        )
      );
      
      try {
        await apiClient.put(`/employees/${legajo}`, { estado: newStatus });
        showDialog({
          title: 'Estado Actualizado',
          message: `Empleado #${legajo} se ha marcado como ${newStatus}.`,
          variant: 'success',
          confirmText: 'Entendido'
        });
      } catch (err) {
        if (err.response && err.response.status === 401) {
          logout();
          return;
        }
        setAllEmployees(originalEmployees);
        const errorMsg = err.response?.data?.message || err.message;
        showDialog({
          title: 'Error al Actualizar Estado',
          message: `No se pudo cambiar el estado del empleado #${legajo}. ${errorMsg}`,
          variant: 'error',
        });
      }
    };

    showDialog({
      title,
      message,
      variant: newStatus === 'activo' ? 'info' : 'warning',
      confirmText: 'Confirmar',
      showCancel: true,
      onConfirm: action,
    });
  };
  
  // RENDERIZADO 

  if (loading) return <LoadingScreen message="Cargando empleados..." />;
  if (error && allEmployees.length === 0) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.contrastText' }}>
        Gestión de Empleados
      </Typography>

      <EmployeesSearchBar
        filter={filter}
        onFilterChange={handleFilterChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
      />

      <EmployeesTable
        employees={filteredEmployees}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
      />

      <EmployeesEditModal
        open={isEditModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveModal}
        employee={editingEmployee}
        allEmployees={allEmployees}
      />

      <ConfirmDialog
        open={dialogState.open}
        onClose={closeDialog}
        onConfirm={dialogState.onConfirm}
        title={dialogState.title}
        message={dialogState.message}
        variant={dialogState.variant}
        confirmText={dialogState.confirmText}
        showCancel={dialogState.showCancel}
      />
    </Box>
  );
}

export default ManageEmployeesPage;
