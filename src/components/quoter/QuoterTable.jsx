//============================================================================
// COMPONENTE: TABLA DE COTIZACIONES
//============================================================================
/**
 * @fileoverview Tabla presentacional para listar cotizaciones del asesor.
 *
 * @description
 * Renderiza una tabla con la lista de cotizaciones de un asesor, incluyendo
 * paginación y una serie de acciones por cada fila: ver detalle, editar,
 * descargar PDF y anular. El color y las acciones disponibles cambian según
 * el estado de la cotización.
 */

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  Chip,
  Typography,
  Tooltip
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

/**
 * @component QuoterTable
 * @description Renderiza una tabla paginada con la lista de cotizaciones y sus acciones.
 * @param {object} props - Propiedades del componente.
 * @param {Array<object>} props.cotizaciones - La lista de cotizaciones a mostrar.
 * @param {number} props.page - El índice de la página actual para la paginación.
 * @param {number} props.rowsPerPage - El número de filas por página.
 * @param {function} props.onPageChange - Callback que se ejecuta al cambiar de página.
 * @param {function} props.onRowsPerPageChange - Callback que se ejecuta al cambiar el número de filas por página.
 * @param {function} props.onView - Callback para ver el detalle de una cotización.
 * @param {function} props.onDownloadPDF - Callback para descargar el PDF de una cotización.
 * @param {function} props.onAnular - Callback para anular una cotización.
 * @param {function} props.onEdit - Callback para editar una cotización.
 * @returns {JSX.Element}
 */
function QuoterTable({
  cotizaciones,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onView,
  onDownloadPDF,
  onAnular,
  onEdit
}) {

  // Formatear fecha a formato local
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Formatear moneda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(value);
  };

  // Obtener color del chip según estado
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'cotizado':
        return 'primary';
      case 'aceptado':
        return 'success';
      case 'cancelado':
        return 'error';
      default:
        return 'default';
    }
  };

  // Datos paginados
  const paginatedData = cotizaciones.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (cotizaciones.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No hay cotizaciones para mostrar
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={2}>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main', '& .MuiTableCell-root': { color: 'white', fontWeight: 'bold', fontSize: '0.75rem', textAlign: 'center' } }}>
              <TableCell align="center">ID</TableCell>
              <TableCell align="center">Fecha</TableCell>
              <TableCell align="center">Cliente</TableCell>
              <TableCell align="center">Plan</TableCell>
              <TableCell align="center">Valor Total</TableCell>
              <TableCell align="center">Estado</TableCell>
              <TableCell align="center">
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((cotizacion, index) => (
              <TableRow
                key={cotizacion.id}
                sx={{
                  '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
                  '&:hover': { bgcolor: 'action.selected' }
                }}
              >
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {cotizacion.id}
                  </Typography>
                </TableCell>
                <TableCell>{formatDate(cotizacion.fecha_creacion)}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {cotizacion.cliente_nombre} {cotizacion.cliente_apellido}
                  </Typography>
                  <Typography variant="caption" display="block" color="text.secondary">
                    DNI: {cotizacion.cliente_dni || 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2">{cotizacion.plan_nombre}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {formatCurrency(cotizacion.valor_total)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={cotizacion.estado}
                    color={getEstadoColor(cotizacion.estado)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Ver detalle">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => onView(cotizacion.id)}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Editar cotización">
                    <IconButton
                      size="small"
                      color="success"
                      onClick={() => onEdit(cotizacion.id)}
                      disabled={cotizacion.estado === 'cancelado'}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Descargar PDF">
                    <IconButton
                      size="small"
                      color="secondary"
                      onClick={() => onDownloadPDF(cotizacion.id)}
                    >
                      <PictureAsPdfIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Anular cotización">
                    <span>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onAnular(cotizacion.id)}
                        disabled={cotizacion.estado === 'cancelado'}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={cotizaciones.length}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count}`
        }
      />
    </Paper>
  );
}

export default QuoterTable;