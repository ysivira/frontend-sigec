//============================================================================
// MICRO-COMPONENTE: INPUT DE FORMULARIO REUTILIZABLE
//============================================================================
/**
 * @fileoverview Wrapper reutilizable para TextField de Material UI.
 *
 * @description
 * Centraliza la configuración visual de los inputs (variant, margin, fullWidth).
 * Reduce la repetición de código en los formularios.
 *
 * @param {object} props
 * @param {string} props.name - Nombre del campo (id y name).
 * @param {string} props.label - Etiqueta visible.
 * @param {string} props.value - Valor del estado.
 * @param {function} props.onChange - Manejador de cambios.
 * @param {string} [props.type='text'] - Tipo de input (text, password, email, etc).
 * @param {boolean} [props.required=true] - Si es obligatorio.
 * @param {boolean} [props.autoFocus=false] - Foco automático al cargar.
 */

import React from 'react';
import { TextField } from '@mui/material';

function FormInput({ 
  name, 
  label, 
  value, 
  onChange, 
  type = 'text', 
  required = true, 
  autoFocus = false,
  ...props 
}) {
  return (
    <TextField
      variant="outlined"
      margin="normal"
      required={required}
      fullWidth
      id={name}
      label={label}
      name={name}
      type={type}
      autoFocus={autoFocus}
      value={value}
      onChange={onChange}
      {...props} 
    />
  );
}

export default FormInput;