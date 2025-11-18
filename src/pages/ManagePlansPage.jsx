//============================================================================
// PÁGINA DE GESTIÓN DE PLANES (ADMIN)
//============================================================================
/**
 * @fileoverview Página contenedora para administrar los Planes de Cobertura.
 *
 * @description
 * - Carga la lista completa de planes (Activos e Inactivos) [GET /plans].
 * - Maneja la lógica de Crear [POST /plans], Editar [PUT /plans/:id] y
 * Desactivar [DELETE /plans/:id].
 * - Orquesta los micro-componentes PlansTable y PlanEditModal.
 */

import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import {
  Typography, Box, CircularProgress, Alert, Button
} from '@mui/material';
import { toast } from 'react-hot-toast';
import AddIcon from '@mui/icons-material/Add';
import LoadingScreen from '../components/common/LoadingScreen';
import PlansTable from '../components/admin/PlansTable';
import PlanEditModal from '../components/admin/PlanEditModal';
import ConfirmDialog from '../components/common/ConfirmDialog';

function ManagePlansPage() {
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

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError(null);

        // Petición a la API
        const apiPromise = apiClient.get('/plans');
        
        // Temporizador de la animación (2000ms)
        const timerPromise = new Promise(resolve => setTimeout(resolve, 2000));

        // Esperamos a que ambas terminen
        const [response] = await Promise.all([apiPromise, timerPromise]);
        
        setPlans(response.data);
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Error de conexión';
        setError('Error al cargar los planes: ' + errorMsg);
        toast.error('No se pudieron cargar los planes');
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
    // Limpiamos el plan seleccionado después de cerrar
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
        toast.success('Plan creado exitosamente.');
      } else {

        // ACTUALIZAR 
        setPlans(prev => prev.map(p => p.id === formData.id ? { ...p, ...formData } : p));
        
        await apiClient.put(`/plans/${formData.id}`, formData);
        toast.success('Plan actualizado.');
      }
    } catch (err) {
      // Revertimos si falla
      setPlans(originalPlans);
      const errorMsg = err.response?.data?.message || err.message;
      toast.error(`Error al guardar: ${errorMsg}`);
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
        toast.success('Plan desactivado exitosamente.');
      } catch (err) {
        setPlans(originalPlans); // Revertir
        toast.error('Error al desactivar el plan.');
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
    <Box>
      {/* Encabezado */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" color="primary.contrastText">
          Planes de Cobertura
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
        >
          Nuevo Plan
        </Button>
      </Box>

      {/* Tabla (Micro-componente) */}
      <PlansTable
        plans={plans}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modal de Edición (Micro-componente) */}
      <PlanEditModal
        open={isEditModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveModal}
        plan={editingPlan}
      />

      {/* Diálogo de Confirmación (Componente común) */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmAction}
        title="Confirmar Desactivación"
        message={confirmMessage}
      />
    </Box>
  );
}

export default ManagePlansPage;