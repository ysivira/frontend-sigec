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
function EmpleadosEditModal({ open, onClose, onSave, employee, allEmployees }) {
  const [formData, setFormData] = useState({
    rol: '',
    supervisor_id: null,
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        rol: employee.rol || '',
        supervisor_id: employee.supervisor_id || null, 
      });
    }
  }, [employee]); 

  const supervisores = allEmployees.filter(
    emp => emp.rol === ROLES.SUPERVISOR || emp.rol === ROLES.ADMINISTRADOR
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    
    // Hacemos una copia de los datos actuales del formulario
    const newFormData = { ...formData };
    
    // Si estamos cambiando el 'rol'
    if (name === 'rol') {
      newFormData.rol = value;
      // Si el nuevo rol NO es 'asesor', no puede tener supervisor.
      if (value !== ROLES.ASESOR) {
        newFormData.supervisor_id = null; 
      }
    }

    // Si estamos cambiando el 'supervisor_id'
    if (name === 'supervisor_id') {
      // El valor 'null' del MenuItem viene como string 'null'
      newFormData.supervisor_id = (value === 'null' ? null : value);
    }
    
    setFormData(newFormData);
  };

  const handleSave = () => {
    // Combinamos los datos originales del empleado con los
    // nuevos datos del formulario (rol y supervisor_id)
    const updatedData = { 
      ...employee, 
      ...formData,
    };
    
    onSave(updatedData); 
  };

  if (!employee) {
    return null; 
  }

  const esAsesor = formData.rol === ROLES.ASESOR;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Editar Empleado: 
        <Typography component="span" variant="h6" color="primary.main" sx={{ ml: 1 }}>
          {employee.nombre} {employee.apellido}
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          
          {/* Legajo y Email (no editables) */}
          <TextField
            label="Legajo"
            value={employee.legajo}
            disabled
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            value={employee.email}
            disabled
            fullWidth
            sx={{ mb: 2 }}
          />

          {/* Selector de ROL  */}
          <FormControl fullWidth sx={{ mb: 2 }}>
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

          {/* Selector de SUPERVISOR (Condicional) */}
          {/* Solo se muestra si el ROL seleccionado es "Asesor" */}
          {esAsesor && (
            <FormControl fullWidth sx={{ mb: 2 }}>
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
                
                {/* Mapeamos la lista de supervisores que filtramos */}
                {supervisores.map(sup => (
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
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EmpleadosEditModal;