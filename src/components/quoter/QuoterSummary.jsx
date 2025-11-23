//============================================================================
// COMPONENTE: RESUMEN DE COTIZACIÓN
//============================================================================
/**
 * @fileoverview Componente para la pre-visualización y resumen de una cotización.
 *
 * @description
 * Este componente actúa como el paso final del asistente de cotización. Recibe
 * todos los datos del cliente, la configuración del plan y los resultados del
 * cálculo para mostrarlos en un formato de resumen claro y estructurado antes
 * de que el usuario confirme la generación de la cotización.
 */
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';

/**
 * @component QuoterSummary
 * @description Renderiza un resumen detallado de todos los datos de la cotización.
 * @param {object} props - Propiedades del componente.
 * @param {object} props.clientData - Objeto con los datos del cliente.
 * @param {object} props.cotizacionData - Objeto con los datos de configuración y los resultados del cálculo.
 * @param {Array<object>} props.miembros - Array con los integrantes del grupo familiar.
 * @param {string} props.planNombre - El nombre del plan seleccionado.
 * @param {boolean} [props.isFinalSummary=false] - Si es `true`, ajusta la UI para un resumen final (ej. en un PDF), ocultando el título de "Pre-visualización".
 * @returns {JSX.Element}
 */
function QuoterSummary({ clientData, cotizacionData, miembros, planNombre, isFinalSummary = false }) {

  const formatValue = (value) => value || 'N/A';

  const formatCurrency = (value) => {
    const numVal = parseFloat(value) || 0;
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(numVal);
  };

  const formatPct = (val) => (parseFloat(val) || '') + '%';

  const hasCalculatedData = cotizacionData && cotizacionData.valor_total !== undefined;

  // --- CÁLCULO DEL SUBTOTAL VISUAL ---
  const subtotalCalculado = 
      (parseFloat(cotizacionData.valor_total) || '') + 
      (parseFloat(cotizacionData.valor_aportes_estimados) || '') +
      (parseFloat(cotizacionData.valor_aporte_monotributo) || '') -
      (parseFloat(cotizacionData.valor_iva) || '');

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
      {!isFinalSummary && (
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <CheckCircleOutlineIcon color="primary" sx={{ fontSize: 40, mr: 1 }} />
                <Typography variant="h4" color="primary.main" fontWeight="bold">
                    Pre-visualización
                </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary">
                 Revise los detalles antes de generar la solicitud final.
            </Typography>
          </Box>
      )}

      {/* SECCIÓN 1: DATOS DEL CLIENTE  */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3, bgcolor: 'grey.50', width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
            <PersonIcon color="action" />
            <Typography variant="h6" color="text.primary">
              Datos del Cliente
            </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={3}>
           {/* DNI */}
           <Grid item xs={6} md={3}>
              <Typography variant="caption" display="block" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'left' }}>
                DNI
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.1rem', textAlign: 'left' }}>
                {formatValue(clientData.dni)}
              </Typography>
           </Grid>
           
           {/* NOMBRE COMPLETO */}
           <Grid item xs={12} md={3}>
              <Typography variant="caption" display="block" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'left' }}>
                Nombre Completo
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.1rem', fontWeight: 'medium', textAlign: 'left' }}>
                {formatValue(clientData.nombres)} {formatValue(clientData.apellidos)}
              </Typography>
           </Grid>

           {/* CIUDAD */}
           <Grid item xs={6} md={3}>
              <Typography variant="caption" display="block" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'left' }}>
                Ciudad / Localidad
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.1rem', textAlign: 'left' }}>
                {formatValue(clientData.direccion)}
              </Typography>
           </Grid>

           {/* EDAD */}
           <Grid item xs={6} md={3}>
              <Typography variant="caption" display="block" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'left' }}>
                Edad Titular
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.1rem', textAlign: 'left' }}>
                {formatValue(clientData.edad)} años
              </Typography>
           </Grid>
        </Grid>
      </Paper>

      {/* SECCIÓN 2: CONFIGURACIÓN DEL PLAN  */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3, bgcolor: 'grey.50', width: '100%' }}>
         <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
            <SettingsIcon color="action" />
            <Typography variant="h6" color="text.primary">
              Configuración del Plan
            </Typography>
         </Box>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={3}>
          {/* PLAN */}
          <Grid item xs={12} md={4}>
            <Typography variant="caption" display="block" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'left' }}>
              Plan Seleccionado
            </Typography>
            <Typography variant="h6" color="primary.main" fontWeight="bold" sx={{ textAlign: 'left' }}>
              {planNombre || 'N/A'}
            </Typography>
          </Grid>

          {/* TIPO DE INGRESO */}
          <Grid item xs={6} md={4}>
            <Typography variant="caption" display="block" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase', mb: 0.5, textAlign: 'left' }}>
              Tipo de Ingreso
            </Typography>
            <Box display="flex" justifyContent="flex-start">
                <Chip label={cotizacionData.tipo_ingreso || 'N/A'} color="secondary" sx={{ fontWeight: 'bold', minWidth: 100 }} />
            </Box>
          </Grid>

          {/* GRUPO FAMILIAR */}
          <Grid item xs={6} md={4}>
             <Typography variant="caption" display="block" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'left' }}>
               Grupo Familiar
             </Typography>
             <Typography variant="h6" sx={{ textAlign: 'left' }}>
               {miembros.length} integrante(s)
             </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* SECCIÓN 3: DETALLE ECONÓMICO */}
      {hasCalculatedData && (
        <Box sx={{ mb: 4, p: 3, bgcolor: '#e8f5e9', borderRadius: 2, border: '1px solid #c8e6c9' }}>
           <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#2e7d32' }}>
             <MonetizationOnIcon /> Detalle Económico
           </Typography>
           <Divider sx={{ mb: 2, borderColor: '#a5d6a7' }} />
           
           <Box display="flex" justifyContent="space-between" mb={1}>
             <Typography>Valor Base del Plan (Suma integrantes):</Typography>
             <Typography fontWeight="bold">{formatCurrency(cotizacionData.valor_base_plan)}</Typography>
           </Box>

           {parseFloat(cotizacionData.valor_descuento_comercial) > 0 && (
             <Box display="flex" justifyContent="space-between" mb={1} sx={{ color: 'success.dark' }}>
               <Typography variant="body2">Desc. Comercial ({formatPct(cotizacionData.descuento_comercial_pct)}):</Typography>
               <Typography variant="body2">-{formatCurrency(cotizacionData.valor_descuento_comercial)}</Typography>
             </Box>
           )}
            {parseFloat(cotizacionData.valor_descuento_afinidad) > 0 && (
             <Box display="flex" justifyContent="space-between" mb={1} sx={{ color: 'success.dark' }}>
               <Typography variant="body2">Desc. Afinidad ({formatPct(cotizacionData.descuento_afinidad_pct)}):</Typography>
               <Typography variant="body2">-{formatCurrency(cotizacionData.valor_descuento_afinidad)}</Typography>
             </Box>
           )}
            {parseFloat(cotizacionData.valor_descuento_tarjeta) > 0 && (
             <Box display="flex" justifyContent="space-between" mb={1} sx={{ color: 'success.dark' }}>
               <Typography variant="body2">Desc. Tarjeta ({formatPct(cotizacionData.descuento_tarjeta_pct)}):</Typography>
               <Typography variant="body2">-{formatCurrency(cotizacionData.valor_descuento_tarjeta)}</Typography>
             </Box>
           )}
            {parseFloat(cotizacionData.valor_descuento_joven) > 0 && (
             <Box display="flex" justifyContent="space-between" mb={1} sx={{ color: 'success.dark' }}>
               <Typography variant="body2">Desc. Joven ({formatPct(cotizacionData.descuento_joven_pct)}):</Typography>
               <Typography variant="body2">-{formatCurrency(cotizacionData.valor_descuento_joven)}</Typography>
             </Box>
           )}

           <Divider sx={{ my: 1, borderStyle: 'dashed', borderColor: '#81c784' }} />
           <Box display="flex" justifyContent="space-between" mb={2}>
             <Typography variant="subtitle2" color="text.secondary">Subtotal (con descuentos):</Typography>
             <Typography variant="subtitle2" color="text.secondary">
                {formatCurrency(subtotalCalculado)}
             </Typography>
           </Box>

           {cotizacionData.tipo_ingreso === 'Obligatorio' && parseFloat(cotizacionData.valor_aportes_estimados) > 0 && (
              <Box display="flex" justifyContent="space-between" mb={1} sx={{ color: '#0277bd' }}>
               <Typography variant="body2">Aportes Estimados (OS):</Typography>
               <Typography variant="body2">-{formatCurrency(cotizacionData.valor_aportes_estimados)}</Typography>
             </Box>
           )}
            {cotizacionData.tipo_ingreso === 'Monotributo' && parseFloat(cotizacionData.valor_aporte_monotributo) > 0 && (
              <Box display="flex" justifyContent="space-between" mb={1} sx={{ color: '#0277bd' }}>
               <Typography variant="body2">Aporte Monotributo (Cat. {cotizacionData.monotributo_categoria}):</Typography>
               <Typography variant="body2">-{formatCurrency(cotizacionData.valor_aporte_monotributo)}</Typography>
             </Box>
           )}
            {cotizacionData.tipo_ingreso === 'Voluntario' && parseFloat(cotizacionData.valor_iva) > 0 && (
              <Box display="flex" justifyContent="space-between" mb={1}>
               <Typography variant="body2">IVA (10.5%):</Typography>
               <Typography variant="body2">+{formatCurrency(cotizacionData.valor_iva)}</Typography>
             </Box>
           )}

           <Divider sx={{ my: 1.5, borderColor: '#66bb6a' }} />
           <Box display="flex" justifyContent="space-between" alignItems="center">
             <Typography variant="h5" fontWeight="bold" color="success.dark">Valor Total Final:</Typography>
             <Typography variant="h4" fontWeight="bold" color="success.dark">{formatCurrency(cotizacionData.valor_total)}</Typography>
           </Box>
        </Box>
      )}

      {/* SECCIÓN 4: INTEGRANTES */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', textAlign: 'center', mb: 2 }}>
          Detalle por Integrante
        </Typography>
        <TableContainer component={Paper} variant="outlined" sx={{ maxWidth: 800, mx: 'auto' }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: 'grey.100' }}>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Parentesco</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Edad</TableCell>
                {hasCalculatedData && <TableCell align="right" sx={{ fontWeight: 'bold' }}>Valor Individual</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {miembros.map((miembro, index) => (
                <TableRow key={index} hover>
                  <TableCell align="center">{miembro.parentesco}</TableCell>
                  <TableCell align="center">{miembro.edad} años</TableCell>
                   {hasCalculatedData && (
                    <TableCell align="right" sx={{ fontWeight: miembro.parentesco === 'Titular' ? 'bold' : 'normal' }}>
                        {formatCurrency(miembro.valor_individual)}
                    </TableCell>
                   )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Paper>
  );
}

export default QuoterSummary;
