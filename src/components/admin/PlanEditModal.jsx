//============================================================================
// MICRO-COMPONENTE: MODAL DE EDICIÓN DE PLANES
//============================================================================
/**
 * @fileoverview Modal reutilizable para Crear o Editar un Plan.
 * @description Usa el micro-componente 'FormInput' para los campos de texto.
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  FormControlLabel, Switch, Box
} from '@mui/material';
import FormInput from '../common/FormInput'; 

const initialState = {
  nombre: '',
  detalles: '',
  condiciones_generales: '',
  activo: true,
};

function PlanEditModal({ open, onClose, onSave, plan }) {
  const [formData, setFormData] = useState(initialState);
  
  const isEditing = !!plan; 
  
  useEffect(() => {
    if (open) {
      if (plan) {
        setFormData({
          id: plan.id,
          nombre: plan.nombre || '',
          detalles: plan.detalles || '',
          condiciones_generales: plan.condiciones_generales || '',
          activo: plan.activo !== undefined ? Boolean(plan.activo) : true,
        });
      } else {
        setFormData(initialState);
      }
    }
  }, [plan, open]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.nombre.trim()) return; 
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        {isEditing ? `Editar Plan: ${plan.nombre}` : 'Registrar Nuevo Plan'}
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          
          <FormInput
            name="nombre"
            label="Nombre del Plan"
            value={formData.nombre}
            onChange={handleChange}
            autoFocus
            required
          />
          
          <FormInput
            name="detalles"
            label="Detalles de la Cobertura"
            value={formData.detalles}
            onChange={handleChange}
            multiline
            rows={3}
          />
          
          <FormInput
            name="condiciones_generales"
            label="Condiciones Generales"
            value={formData.condiciones_generales}
            onChange={handleChange}
            multiline
            rows={3}
          />
          
          <Box sx={{ mt: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.activo}
                  onChange={handleChange}
                  name="activo"
                  color="success"
                />
              }
              label={formData.activo ? "Plan Activo" : "Plan Inactivo"}
            />
          </Box>

        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit" size="small">Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" size="small">
          {isEditing ? 'Guardar Cambios' : 'Crear Plan'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PlanEditModal;