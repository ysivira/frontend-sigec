//============================================================================
// PÁGINA DE GESTIÓN DE PLANES (ADMIN)
//============================================================================
/**
 * @fileoverview Página contenedora para administrar los Planes de Cobertura.
 *
 * @description
 * Esta página actúa como el controlador principal para la gestión de planes.
 * Se encarga de obtener la lista completa de planes desde la API, manejar la
 * lógica para crear, editar y desactivar planes, y orquestar los componentes
 * de la interfaz de usuario como la tabla de planes y los modales de edición
 * y confirmación.
 */

import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import {
  Typography, Box, Alert, Button, Paper
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LoadingScreen from '../components/common/LoadingScreen';
import PlansTable from '../components/admin/PlansTable';
import PlanEditModal from '../components/admin/PlanEditModal';
import ConfirmDialog from '../components/common/ConfirmDialog';

/**
 * @component ManagePlansPage
 * @description Componente de página que orquesta la visualización y gestión de los planes de cobertura.
 * Maneja el estado de los datos, la comunicación con la API y la interacción con los modales
 * de creación, edición y confirmación.
 * @returns {JSX.Element}
 */
function ManagePlansPage() {
  const { logout } = useAuth();
  // --- ESTADO ---
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para Modales
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null); 
  
  // Estado para Confirmación
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');

  // Estado para el diálogo de notificación 
  const [notification, setNotification] = useState({
    isOpen: false,
    title: '',
    message: '',
    variant: 'info',
  });

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiPromise = apiClient.get('/plans');
        const timerPromise = new Promise(resolve => setTimeout(resolve, 1500));

        const [response] = await Promise.all([apiPromise, timerPromise]);
        
        setPlans(response.data);
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Error de conexión';
        setError('Error al cargar los planes: ' + errorMsg);
        setNotification({
          isOpen: true,
          title: 'Error de Carga',
          message: 'No se pudieron cargar los planes. ' + errorMsg,
          variant: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // HANDLERS DE MODALES 

  const handleOpenCreate = () => {
    setEditingPlan(null); 
    setIsEditModalOpen(true);
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan); 
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setTimeout(() => setEditingPlan(null), 300); 
  };

  // GUARDAR (POST / PUT) 
  const handleSaveModal = async (formData) => {
    const isCreating = !formData.id;
    const originalPlans = [...plans];
    
    handleCloseModal(); 
    try {
      if (isCreating) {
        const response = await apiClient.post('/plans', formData);
        
        const newPlan = {
          id: response.data.planId,
          ...formData,
          activo: 1 
        };
        setPlans([newPlan, ...plans]);
        setNotification({
          isOpen: true,
          title: 'Éxito',
          message: 'Plan creado exitosamente.',
          variant: 'success'
        });
      } else {
        setPlans(prev => prev.map(p => p.id === formData.id ? { ...p, ...formData } : p));
        await apiClient.put(`/plans/${formData.id}`, formData);
        setNotification({
          isOpen: true,
          title: 'Éxito',
          message: 'Plan actualizado correctamente.',
          variant: 'success'
        });
      }
    } catch (err) {
      setPlans(originalPlans);
      // Si el error es de autenticación (token expirado), cerramos sesión.
      if (err.response && err.response.status === 401) {
        logout();
        return; 
      }

      const errorMsg = err.response?.data?.message || err.message;
      setNotification({
        isOpen: true, title: 'Error', message: `Error al guardar: ${errorMsg}`, variant: 'error'
      });
    }
  };

  // ELIMINAR (DELETE - Lógico)
  const handleDelete = (plan) => {
    setConfirmMessage(`¿Desea desactivar el plan "${plan.nombre}"? Ya no será visible para nuevas cotizaciones.`);
    setConfirmAction(() => async () => {
      const originalPlans = [...plans];
      
      setPlans(prev => prev.map(p => p.id === plan.id ? { ...p, activo: 0 } : p));
      
      try {
        await apiClient.delete(`/plans/${plan.id}`);
        setNotification({
          isOpen: true,
          title: 'Plan Desactivado',
          message: `El plan "${plan.nombre}" ha sido desactivado.`,
          variant: 'success'
        });
      } catch (err) {
        setPlans(originalPlans);
        // Si el error es de autenticación (token expirado), cerramos sesión.
        if (err.response && err.response.status === 401) {
          logout();
          return; 
        }

        const errorMsg = err.response?.data?.message || 'Error desconocido.';
        setNotification({
          isOpen: true,
          title: 'Error',
          message: `No se pudo desactivar el plan. ${errorMsg}`,
          variant: 'error'
        });
      }
      setConfirmOpen(false);
    });
    
    setConfirmOpen(true);
  };

  // --- RENDERIZADO ---

  if (loading) {
   return <LoadingScreen message="CARGANDO PLANES..." />;
  }

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
      <Paper sx={{ p: 3, borderRadius: 2, width: '100%', maxWidth: '1200px' }}>
        {/* Encabezado */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" color="primary">
            Planes de Cobertura
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
            size="small"
          >
            Nuevo Plan
          </Button>
        </Box>

        {/* Tabla */}
        <PlansTable
          plans={plans}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Paper>

      {/* Modal de Edición  */}
      <PlanEditModal
        open={isEditModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveModal}
        plan={editingPlan}
      />

      {/* Diálogo de Confirmación  */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmAction}
        title="Confirmar Desactivación"
        message={confirmMessage}
      />

      {/* Diálogo de Notificación */}
      <ConfirmDialog
        open={notification.isOpen}
        onClose={() => setNotification({ ...notification, isOpen: false })}
        onConfirm={() => setNotification({ ...notification, isOpen: false })}
        title={notification.title}
        message={notification.message}
        variant={notification.variant}
        showCancel={false}
        confirmText="Aceptar"
      />
    </Box>
  );
}

export default ManagePlansPage;
