//============================================================================
// MICRO-COMPONENTE: FORMULARIO PRINCIPAL DE COTIZACIÓN 
//============================================================================
/**
 * @fileoverview Formulario principal para la configuración de una cotización.
 *
 * @description
 * Este componente representa el tercer paso del asistente de cotización. Es un
 * formulario complejo y controlado que permite al usuario definir todos los
 * detalles de la cotización: seleccionar el plan, el tipo de ingreso (con
 * campos condicionales), configurar el grupo familiar (añadiendo o quitando
 * miembros) y aplicar descuentos adicionales.
 */

import React from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Typography,
  Paper,
  Grid,
  IconButton,
  FormControlLabel,
  Checkbox,
  Divider,
  Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { 
  TIPOS_INGRESO, 
  CATEGORIAS_MONOTRIBUTO,
  DESCUENTOS_COMERCIALES,
  DESCUENTOS_AFINIDAD,
  DESCUENTOS_TARJETA
} from '../../utils/constants';
import QuoterMemberInput from './QuoterMemberInput';

/**
 * @component QuoterMainForm
 * @description Renderiza el formulario principal para configurar los detalles de una cotización.
 * @param {object} props - Propiedades del componente.
 * @param {object} props.cotizacionData - Objeto con los datos de configuración de la cotización (plan, tipo, descuentos, etc.).
 * @param {Array<object>} props.miembros - Array de objetos que representan a los integrantes del grupo familiar.
 * @param {Array<object>} props.planes - Array con la lista de planes disponibles para el selector.
 * @param {function} props.onCotizacionChange - Callback que se ejecuta al cambiar un campo de `cotizacionData`.
 * @param {function} props.onMiembroChange - Callback que se ejecuta al cambiar un campo de un miembro específico.
 * @param {function} props.onAddMiembro - Callback para añadir un nuevo miembro al grupo familiar.
 * @param {function} props.onRemoveMiembro - Callback para eliminar el último miembro del grupo familiar.
 * @returns {JSX.Element}
 */
function QuoterMainForm({ 
  cotizacionData, 
  miembros, 
  planes,
  onCotizacionChange,
  onMiembroChange,
  onAddMiembro,
  onRemoveMiembro
}) {

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    onCotizacionChange(field, value);
  };

  const handleNumberChange = (field) => (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      onCotizacionChange(field, value);
    }
  };

  const isObligatorio = cotizacionData.tipo_ingreso === TIPOS_INGRESO.OBLIGATORIO;
  const isMonotributo = cotizacionData.tipo_ingreso === TIPOS_INGRESO.MONOTRIBUTO;
  const cantidadIntegrantes = miembros.length;

  return (
    <Paper elevation={2} sx={{ p: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ color: 'text.primary', fontWeight: 'bold' }}>
          Paso 3: Configuración
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Seleccione el plan, tipo de ingreso y configure el grupo familiar.
        </Typography>
      </Box>

      {/* PLAN Y TIPO */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'flex-start' }}>
        <TextField
          select
          required
          label="Tipo de Ingreso"
          value={cotizacionData.tipo_ingreso || ''}
          onChange={handleChange('tipo_ingreso')}
          size="small"
          sx={{ width: '220px' }}
        >
          <MenuItem value=""><em>Seleccione...</em></MenuItem>
          <MenuItem value={TIPOS_INGRESO.VOLUNTARIO}>Voluntario</MenuItem>
          <MenuItem value={TIPOS_INGRESO.OBLIGATORIO}>Obligatorio</MenuItem>
          <MenuItem value={TIPOS_INGRESO.MONOTRIBUTO}>Monotributo</MenuItem>
        </TextField>

        <TextField
          select
          required
          label="Seleccionar Plan"
          value={cotizacionData.plan_id || ''}
          onChange={handleChange('plan_id')}
          disabled={!planes || planes.length === 0}
          size="small"
          sx={{ width: '200px' }}
        >
          <MenuItem value=""><em>Seleccione...</em></MenuItem>
          {planes && planes.map((plan) => (
            <MenuItem key={plan.id} value={plan.id}>
              {plan.nombre}
            </MenuItem>
          ))}
        </TextField>

        {isObligatorio && (
          <TextField
            label="Aporte Obra Social ($)"
            value={cotizacionData.aporte_obra_social || ''}
            onChange={handleNumberChange('aporte_obra_social')}
            placeholder="Ej: 15000"
            size="small"
            sx={{ width: '200px' }}
          />
        )}

        {isMonotributo && (
          <TextField
            select
            required
            label="Categoría Monotributo"
            value={cotizacionData.monotributo_categoria || ''}
            onChange={handleChange('monotributo_categoria')}
            size="small"
            sx={{ width: '200px' }}
          >
            {CATEGORIAS_MONOTRIBUTO.map((cat) => (
              <MenuItem key={cat} value={cat}>Categoría {cat}</MenuItem>
            ))}
          </TextField>
        )}
      </Box>

      <Grid container spacing={3}>

        {/* CONTADOR DE INTEGRANTES (ANCHO COMPLETO) */}
        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#f8f9fa', width: 'fit-content', mx: 'auto' }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#333' }}>
              Cantidad de Integrantes: 
            </Typography>
            
            <Box display="flex" alignItems="center" gap={1}>
                <IconButton 
                    onClick={onRemoveMiembro}
                    disabled={cantidadIntegrantes <= 1}
                    sx={{ bgcolor: 'white', border: '1px solid #ccc', width: 32, height: 32 }}
                >
                    <RemoveIcon fontSize="small"/>
                </IconButton>
                
                <Typography variant="h6" sx={{ minWidth: 30, textAlign: 'center', fontWeight: 'bold', color: '#000' }}>
                    {cantidadIntegrantes}
                </Typography>
                
                <IconButton 
                    onClick={onAddMiembro}
                    sx={{ bgcolor: 'white', border: '1px solid #ccc', width: 32, height: 32 }}
                >
                    <AddIcon fontSize="small"/>
                </IconButton>
            </Box>
          </Paper>
        </Grid>

        {/* CAMPOS CONDICIONALES (MONOTRIBUTO / OBLIGATORIO) */}
        {isMonotributo && (
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
              <TextField
                type="number"
                label="Cant. Adherentes Monotributo"
                value={cotizacionData.monotributo_adherentes || ''}
                onChange={handleChange('monotributo_adherentes')}
                inputProps={{ min: 0 }}
              />
            </Grid>
        )}
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* SECCIÓN DE MIEMBROS */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
          Integrantes del Grupo Familiar
        </Typography>
      </Box>

      {miembros.map((miembro, index) => {
        let opciones = [];
        let disabledParentesco = false;

        if (index === 0) {
            opciones = ['Titular'];
            disabledParentesco = true;
        } else {
            const yaHayConyuge = miembros.some((m, i) => m.parentesco === 'Conyuge' && i !== index);
            opciones = yaHayConyuge ? ['Hijo'] : ['Conyuge', 'Hijo'];
        }

        return (
          <QuoterMemberInput
            key={index}
            member={miembro}
            index={index}
            onChange={onMiembroChange}
            onRemove={onRemoveMiembro}
            canRemove={index > 0}
            opcionesDisponibles={opciones}
            disabledParentesco={disabledParentesco}
          />
        );
      })}

      <Divider sx={{ my: 4 }} />

      {/* SECCIÓN DE DESCUENTOS */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
            Descuentos Adicionales
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            select
            label="Descuento Comercial"
            value={cotizacionData.descuento_comercial_pct || ''}
            onChange={handleChange('descuento_comercial_pct')}
            size="small"
            sx={{ width: '200px' }}
          >
            {DESCUENTOS_COMERCIALES.map((desc) => (
              <MenuItem key={desc} value={desc}>{desc}%</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Descuento Afinidad"
            value={cotizacionData.descuento_afinidad_pct || ''}
            onChange={handleChange('descuento_afinidad_pct')}
            size="small"
            sx={{ width: '200px' }}
          >
            {DESCUENTOS_AFINIDAD.map((desc) => (
              <MenuItem key={desc} value={desc}>{desc}%</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Descuento Tarjeta"
            value={cotizacionData.descuento_tarjeta_pct || ''}
            onChange={handleChange('descuento_tarjeta_pct')}
            size="small"
            sx={{ width: '200px' }}
          >
            {DESCUENTOS_TARJETA.map((desc) => (
              <MenuItem key={desc} value={desc}>{desc}%</MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>
    </Paper>
  );
}

export default QuoterMainForm;