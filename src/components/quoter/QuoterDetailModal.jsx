//============================================================================
// COMPONENTE: MODAL DE DETALLE DE COTIZACIÓN
//============================================================================
/**
 * @fileoverview Modal para visualizar el detalle completo de una cotización guardada.
 *
 * @description
 * Este componente de solo lectura recibe un objeto de cotización completo y lo presenta
 * de forma estructurada en un modal. Incluye secciones para los datos del cliente,
 * la configuración del plan, el desglose económico y la lista de integrantes del grupo familiar.
 * Contiene lógica interna para manejar posibles inconsistencias en los datos de origen.
 */
import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Divider, Box,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Grid
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';

/**
 * @component QuoterDetailModal
 * @description Muestra un modal con el resumen detallado de una cotización.
 * @param {object} props - Propiedades del componente.
 * @param {boolean} props.open - Controla si el modal está visible.
 * @param {function} props.onClose - Función para cerrar el modal.
 * @param {object} props.cotizacion - El objeto completo de la cotización a mostrar. Si es nulo, el componente no renderiza nada.
 * @returns {JSX.Element|null}
 */
const QuoterDetailModal = ({ open, onClose, cotizacion }) => {
  if (!cotizacion) return null;

  const formatCurrency = (value) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value || 0);
  const formatPct = (val) => (parseFloat(val) || 0) + '%';
  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('es-AR') : 'N/A';
  const cObj = cotizacion.cliente || {};
  
  /**
   * Busca y devuelve el primer valor no nulo o no vacío de una lista de argumentos.
   * Es útil para manejar datos que pueden provenir de diferentes campos en el objeto de cotización.
   * @param  {...any} values - Una lista de valores a comprobar.
   * @returns {any|null} El primer valor válido encontrado o `null`.
   */
  const findValidValue = (...values) => {
    return values.find(val => val && val.toString().trim() !== '') || null;
  };

  const direccionReal = findValidValue(
      cObj.direccion,
      cObj.domicilio,
      cObj.calle,
      cObj.ciudad,       
      cObj.localidad,
      cotizacion.cliente_direccion,
      cotizacion.cliente_domicilio,
      cotizacion.cliente_ciudad,
      cotizacion.ciudad,
      'No informada' 
  );

  const cliente = {
      nombres: cObj.nombres || cotizacion.cliente_nombre || '',
      apellidos: cObj.apellidos || cotizacion.cliente_apellido || '',
      dni: cObj.dni || cotizacion.cliente_dni || '',
      email: cObj.email || cotizacion.cliente_email || '',
      direccion: direccionReal
  };

  const planNombre = cotizacion.plan?.nombre || cotizacion.plan_nombre;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="paper">
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', py: 1.5, display: 'flex', justifyContent: 'center' }}>
        <Typography variant="h6">Detalle de Cotización N° {cotizacion.id}</Typography>
      </DialogTitle>
      
      <DialogContent dividers sx={{ p: 3, bgcolor: '#f8f9fa' }}>
        {/* Contenedor principal centrado */}
        <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
            <Grid container spacing={3} justifyContent="center">
            
            {/* COLUMNA IZQUIERDA: CLIENTE Y PLAN */}
            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                
                {/* TARJETA: Datos del Cliente */}
                <Paper elevation={3} sx={{ p: 3, borderRadius: 2, flex: 1 }}>
                    <Box display="flex" alignItems="center" gap={1} mb={2} justifyContent="center">
                    <PersonIcon color="primary" />
                    <Typography variant="h6" color="text.primary">Datos del Cliente</Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />

                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>NOMBRE COMPLETO</Typography>
                        <Typography variant="h6" fontWeight="bold" color="primary.main">
                            {cliente.nombres} {cliente.apellidos}
                        </Typography>
                    </Box>
                    
                    <Grid container spacing={3} justifyContent="center">
                        <Grid item xs={6} sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary" fontWeight="bold">DNI</Typography>
                            <Typography variant="body1">{cliente.dni}</Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary" fontWeight="bold">CIUDAD / DIRECCIÓN</Typography>
                            <Typography variant="body1" sx={{ lineHeight: 1.2, fontWeight: 'medium' }}>{cliente.direccion}</Typography>
                        </Grid>
                        <Grid item xs={12} sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary" fontWeight="bold">EMAIL</Typography>
                            <Typography variant="body1" noWrap title={cliente.email}>{cliente.email}</Typography>
                        </Grid>
                    </Grid>
                </Paper>

                {/* TARJETA: Configuración del Plan */}
                <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h6" align="center" gutterBottom>Configuración</Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={6} sx={{ textAlign: 'right' }}>
                            <Typography variant="body2" color="text.secondary">Plan:</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Chip label={planNombre} color="primary" sx={{ fontWeight: 'bold' }} />
                        </Grid>

                        <Grid item xs={6} sx={{ textAlign: 'right' }}>
                            <Typography variant="body2" color="text.secondary">Tipo Ingreso:</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Chip label={cotizacion.tipo_ingreso} color="secondary" size="small" />
                        </Grid>

                        <Grid item xs={12}><Divider sx={{ my: 1 }} /></Grid>
                        
                        <Grid item xs={4} sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary" display="block">F. Creación</Typography>
                            <Typography variant="body2" fontWeight="medium">{formatDate(cotizacion.fecha_creacion)}</Typography>
                        </Grid>
                        <Grid item xs={4} sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary" display="block">F. Vencimiento</Typography>
                            <Typography variant="body2" fontWeight="medium">{formatDate(cotizacion.fecha_vencimiento)}</Typography>
                        </Grid>
                        <Grid item xs={4} sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary" display="block">F. Ingreso Estimado</Typography>
                            <Typography variant="body2" fontWeight="medium">
                                {formatDate(cotizacion.fecha_ingreso_estimado)}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        {cotizacion.tipo_ingreso === 'Obligatorio' && (
                            <Typography variant="caption" display="block" sx={{ color: 'text.secondary', bgcolor: 'grey.100', p: 1, borderRadius: 1 }}>
                                Aporte OS: <strong>{formatCurrency(cotizacion.aporte_obra_social)}</strong>
                            </Typography>
                        )}
                        {cotizacion.tipo_ingreso === 'Monotributo' && (
                            <Typography variant="caption" display="block" sx={{ color: 'text.secondary', bgcolor: 'grey.100', p: 1, borderRadius: 1 }}>
                                Cat: <strong>{cotizacion.monotributo_categoria}</strong> | Adherentes: <strong>{cotizacion.monotributo_adherentes}</strong>
                            </Typography>
                        )}
                    </Box>
                </Paper>
            </Grid>

            {/* COLUMNA DERECHA: DETALLE ECONÓMICO */}
            <Grid item xs={12} md={5} sx={{ display: 'flex' }}>
                <Paper elevation={3} sx={{ p: 3, width: '100%', bgcolor: '#e8f5e9', borderRadius: 2, border: '1px solid #c8e6c9', display: 'flex', flexDirection: 'column' }}>
                <Box display="flex" alignItems="center" gap={1} mb={2} justifyContent="center">
                    <MonetizationOnIcon color="success" fontSize="large"/>
                    <Typography variant="h6" color="success.dark">Detalle Económico</Typography>
                </Box>
                <Divider sx={{ mb: 3, borderColor: '#a5d6a7' }} />

                <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography variant="body1">Valor Base Plan:</Typography>
                    <Typography variant="body1" fontWeight="medium">{formatCurrency(cotizacion.valor_base_plan)}</Typography>
                </Box>

                <Box sx={{ flexGrow: 1 }}>
                    {/* Desgloses */}
                    {parseFloat(cotizacion.valor_descuento_comercial) > 0 && (
                        <Box display="flex" justifyContent="space-between" mb={1} color="success.dark">
                        <Typography variant="body2">Desc. Comercial ({formatPct(cotizacion.descuento_comercial_pct)}):</Typography>
                        <Typography variant="body2">-{formatCurrency(cotizacion.valor_descuento_comercial)}</Typography>
                        </Box>
                    )}
                    {parseFloat(cotizacion.valor_descuento_afinidad) > 0 && (
                        <Box display="flex" justifyContent="space-between" mb={1} color="success.dark">
                        <Typography variant="body2">Desc. Afinidad ({formatPct(cotizacion.descuento_afinidad_pct)}):</Typography>
                        <Typography variant="body2">-{formatCurrency(cotizacion.valor_descuento_afinidad)}</Typography>
                        </Box>
                    )}
                    {parseFloat(cotizacion.valor_descuento_tarjeta) > 0 && (
                        <Box display="flex" justifyContent="space-between" mb={1} color="success.dark">
                        <Typography variant="body2">Desc. Tarjeta ({formatPct(cotizacion.descuento_tarjeta_pct)}):</Typography>
                        <Typography variant="body2">-{formatCurrency(cotizacion.valor_descuento_tarjeta)}</Typography>
                        </Box>
                    )}
                    {parseFloat(cotizacion.valor_descuento_joven) > 0 && (
                        <Box display="flex" justifyContent="space-between" mb={1} color="success.dark">
                        <Typography variant="body2">Desc. Joven ({formatPct(cotizacion.descuento_joven_pct)}):</Typography>
                        <Typography variant="body2">-{formatCurrency(cotizacion.valor_descuento_joven)}</Typography>
                        </Box>
                    )}

                    {/* Separador Aportes */}
                    {(parseFloat(cotizacion.valor_aportes_estimados) > 0 || parseFloat(cotizacion.valor_aporte_monotributo) > 0) && (
                        <Divider sx={{ my: 2, borderStyle: 'dashed', borderColor: '#81c784' }} />
                    )}
                    
                    {/* Aportes */}
                    {parseFloat(cotizacion.valor_aportes_estimados) > 0 && (
                        <Box display="flex" justifyContent="space-between" mb={1} color="#0277bd">
                        <Typography variant="body2">Aportes Obra Social:</Typography>
                        <Typography variant="body2">-{formatCurrency(cotizacion.valor_aportes_estimados)}</Typography>
                        </Box>
                    )}
                        {parseFloat(cotizacion.valor_aporte_monotributo) > 0 && (
                        <Box display="flex" justifyContent="space-between" mb={1} color="#0277bd">
                        <Typography variant="body2">Aporte Monotributo:</Typography>
                        <Typography variant="body2">-{formatCurrency(cotizacion.valor_aporte_monotributo)}</Typography>
                        </Box>
                    )}
                    {cotizacion.tipo_ingreso === 'Voluntario' && parseFloat(cotizacion.valor_iva) > 0 && (
                        <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">IVA (10.5%):</Typography>
                        <Typography variant="body2">+{formatCurrency(cotizacion.valor_iva)}</Typography>
                        </Box>
                    )}
                </Box>

                <Divider sx={{ my: 3, borderColor: '#66bb6a', borderWidth: 2 }} />

                <Box sx={{ textAlign: 'center', bgcolor: 'rgba(255,255,255,0.6)', p: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle1" color="success.dark">TOTAL FINAL</Typography>
                    <Typography variant="h3" fontWeight="bold" color="success.dark">
                        {formatCurrency(cotizacion.valor_total)}
                    </Typography>
                </Box>
                </Paper>
            </Grid>
            
            {/* TIRA INFERIOR: INTEGRANTES */}            
            <Grid item xs={12} md={7} sx={{ display: 'flex' }}>
                <Paper elevation={3} sx={{ p: 3, borderRadius: 2, width: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={2}>
                    <FamilyRestroomIcon color="primary" fontSize="large"/>
                    <Typography variant="h6" color="text.primary">
                        Grupo Familiar ({cotizacion.miembros?.length || 0} integrantes)
                    </Typography>
                    </Box>
                    <Divider sx={{ mb: 0 }} />
                    
                    <TableContainer>
                    <Table size="medium">
                        <TableHead>
                        <TableRow>
                            <TableCell align="center" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>PARENTESCO</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>EDAD</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>VALOR INDIVIDUAL</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {cotizacion.miembros && cotizacion.miembros.map((miembro, index) => (
                            <TableRow key={index} hover>
                            <TableCell align="center">
                                <Typography variant="body1" fontWeight={miembro.parentesco === 'Titular' ? 'bold' : 'regular'}>
                                    {miembro.parentesco}
                                </Typography>
                            </TableCell>
                            <TableCell align="center">{miembro.edad} años</TableCell>
                            <TableCell align="center" sx={{ fontFamily: 'monospace', fontSize: '1rem', fontWeight: 'medium' }}>
                                {formatCurrency(miembro.valor_individual)}
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    </TableContainer>
                </Paper>
            </Grid>

            </Grid>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, justifyContent: 'center', bgcolor: 'grey.50', borderTop: '1px solid #e0e0e0' }}>
        <Button onClick={onClose} variant="contained" size="large" sx={{ minWidth: 150 }}>
            Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuoterDetailModal;