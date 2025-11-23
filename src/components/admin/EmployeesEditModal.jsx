//============================================================================
// COMPONENTE: MODAL DE EDICIÓN DE EMPLEADOS 
//============================================================================
/**
 * @fileoverview Modal para editar los detalles de un empleado.
 *
 * @description
 * Incluye un formulario interno con 'useState'
 * para manejar los cambios de 'rol' y 'supervisor_id'.
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { ROLES } from '../../utils/constants'; 

/**
 * @description Muestra un modal para editar el rol y supervisor de un empleado.
 * @param {object} props - Propiedades del componente.
 * @param {boolean} props.open - Controla si el modal está abierto.
 * @param {function} props.onClose - Función para cerrar el modal.
 * @param {function} props.onSave - Función para guardar los cambios.
 * @param {object} props.employee - El objeto del empleado a editar.
 * @param {Array<object>} props.allEmployees - La lista de todos los empleados (para encontrar supervisores).
 * @returns {JSX.Element|null} El componente del modal de edición o null si no hay empleado.
 */
function EmployeesEditModal({ open, onClose, onSave, employee, allEmployees }) {
  /**
   * Estado local para manejar los datos del formulario de edición.
   * @type {[object, React.Dispatch<React.SetStateAction<object>>]}
   */
  const [formData, setFormData] = useState({
    rol: '',
    supervisor_id: null,
  });

  // Sincroniza el estado del formulario con los datos del empleado cuando este cambia.
  useEffect(() => {
    if (employee) {
      setFormData({
        rol: employee.rol || '',
        supervisor_id: employee.supervisor_id || null,
      });
    }
  }, [employee]);

  /**
   * Filtra la lista de todos los empleados para obtener solo aquellos que pueden ser supervisores.
   * @type {Array<object>}
   */
  const supervisors = allEmployees.filter(
    emp => emp.rol === ROLES.SUPERVISOR || emp.rol === ROLES.ADMINISTRADOR
  );

  /**
   * Maneja los cambios en los campos del formulario y actualiza el estado `formData`.
   * @param {React.ChangeEvent<HTMLInputElement>} event - El evento de cambio.
   */
  const handleChange = (event) => {
    const { name, value } = event.target;

    const newFormData = { ...formData };

    if (name === 'rol') {
      newFormData.rol = value;
      // Si el rol deja de ser 'Asesor', se elimina la asignación de supervisor.
      if (value !== ROLES.ASESOR) {
        newFormData.supervisor_id = null;
      }
    }

    if (name === 'supervisor_id') {
      newFormData.supervisor_id = (value === 'null' ? null : value);
    }
    
    setFormData(newFormData);
  };

  const handleSave = () => {
    const updatedData = { 
      ...employee, 
      ...formData,
    };
    
    onSave(updatedData); 
  };

  if (!employee) {
    return null; 
  }

  const isAdvisor = formData.rol === ROLES.ASESOR;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        Editar Empleado: 
        <Typography component="span" variant="h6" color="primary.main" sx={{ ml: 1 }}>
          {employee.nombre} {employee.apellido}
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box component="form" sx={{ mt: 1 }}>
          
          {/* Legajo y Email (no editables) */}
          <TextField
            size="small"
            label="Legajo"
            value={employee.legajo}
            disabled
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            size="small"
            label="Email"
            value={employee.email}
            disabled
            fullWidth
            sx={{ mb: 2 }}
          />

          {/* Selector de ROL */}
          <FormControl fullWidth sx={{ mb: 2 }} size="small">
            <InputLabel id="rol-select-label">Rol</InputLabel>
            <Select
              labelId="rol-select-label"
              name="rol"
              value={formData.rol}
              label="Rol"
              onChange={handleChange}
            >
              <MenuItem value={ROLES.ASESOR}>Asesor</MenuItem>
              <MenuItem value={ROLES.SUPERVISOR}>Supervisor</MenuItem>
              <MenuItem value={ROLES.ADMINISTRADOR}>Administrador</MenuItem>
            </Select>
          </FormControl>

          {/* Selector de SUPERVISOR */}
          {isAdvisor && (
            <FormControl fullWidth sx={{ mb: 2 }} size="small">
              <InputLabel id="supervisor-select-label">Supervisor Asignado</InputLabel>
              <Select
                labelId="supervisor-select-label"
                name="supervisor_id"
                value={formData.supervisor_id === null ? 'null' : formData.supervisor_id}
                label="Supervisor Asignado"
                onChange={handleChange} 
              >
                <MenuItem value={'null'}>
                  <em>(Ninguno)</em>
                </MenuItem>
                
                {supervisors.map(sup => (
                  <MenuItem key={sup.legajo} value={sup.legajo}>
                    {sup.nombre} {sup.apellido} ({sup.legajo})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={onClose} color="inherit" size="small">
          Cancelar
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary" size="small">
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EmployeesEditModal;