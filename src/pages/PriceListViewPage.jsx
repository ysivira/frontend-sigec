//============================================================================
// PÁGINA DE CONSULTA DE LISTAS DE PRECIOS (PARA ASESOR)
//============================================================================
/**
 * @fileoverview Página para que los asesores consulten listas de precios (solo lectura).
 *
 * @description
 * Este componente de página actúa como un controlador para la consulta de precios.
 * Se encarga de obtener los planes activos y, en función de la selección del
 * usuario en los filtros, obtiene y muestra la lista de precios correspondiente
 * en modo de solo lectura. También incluye una funcionalidad para imprimir la
 * lista de precios actual.
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Paper,
  Alert,
  IconButton,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import InfoIcon from '@mui/icons-material/Info';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axiosConfig';
import ConfirmDialog from '../components/common/ConfirmDialog';
import LoadingScreen from '../components/common/LoadingScreen';
import PriceListViewTable from '../components/asesor/PriceListViewTable';
import logo from '../assets/logo_azul.png';
import { TIPOS_INGRESO } from '../utils/constants';

/**
 * @component PriceListViewPage
 * @description Componente de página que orquesta la consulta de listas de precios.
 * Maneja el estado de los filtros, la comunicación con la API para obtener los
 * datos y la interacción con los componentes de tabla y notificación.
 * @returns {JSX.Element}
 */
function PriceListViewPage() {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Datos
  const [planes, setPlanes] = useState([]);
  const [prices, setPrices] = useState([]);
  
  // Filtros
  const [selectedPlan, setSelectedPlan] = useState('');
  const [selectedTipo, setSelectedTipo] = useState(TIPOS_INGRESO.OBLIGATORIO);

  // Estado para el diálogo de notificación
  const [notification, setNotification] = useState({
    isOpen: false,
    title: '',
    message: '',
    variant: 'info',
  });

  // Cargar planes al montar
  useEffect(() => {
    const fetchPlanes = async () => {
      try {
        const response = await apiClient.get('/plans/active');
        setPlanes(response.data);
        
      } catch (err) {
        if (err.response && err.response.status === 401) {
          logout();
          return;
        }
        const errorMsg = err.response?.data?.message || err.message;
        setNotification({
          isOpen: true,
          title: 'Error de Carga',
          message: 'No se pudieron cargar los planes disponibles: ' + errorMsg,
          variant: 'error',
        });
      }
    };
    fetchPlanes();
  }, [logout]);

  // Cargar precios cuando cambien los filtros
  useEffect(() => {
    if (selectedPlan && selectedTipo) {
      fetchPrices();
    }
  }, [selectedPlan, selectedTipo, logout]);

  /**
   * Obtiene los precios según plan y tipo seleccionado
   */
  const fetchPrices = async () => {
    setLoading(true);
    setError(null);
    
    
    // Promesa de retraso para asegurar que el loading se vea
    const delayPromise = new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const [response] = await Promise.all([
        apiClient.get(`/pricelists/plan/${selectedPlan}/${selectedTipo}`),
        delayPromise
      ]);

      setPrices(response.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        logout();
        return;
      }
      const errorMsg = err.response?.data?.message || err.message;
      setNotification({
        isOpen: true,
        title: 'Error de Carga',
        message: 'No se pudieron cargar los precios para esta selección: ' + errorMsg,
        variant: 'error',
      });
      setPrices([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanChange = (e) => {
    setSelectedPlan(e.target.value);
  };

  const handleTipoChange = (e) => {
    setSelectedTipo(e.target.value);
  };

  const handlePrint = () => {
    window.print();
  };

  // Obtener nombre del plan seleccionado
  const selectedPlanData = planes.find(p => p.id === parseInt(selectedPlan));
  const planNombre = selectedPlanData ? selectedPlanData.nombre : '';

  return (
    <Box>
      <style>
        {`
          @media print { body * { visibility: hidden; } #printableArea, #printableArea * { visibility: visible; } #printableArea { position: absolute; left: 0; top: 0; width: 100%; padding: 20px; } .no-print { display: none !important; } }
        `}
      </style>

      {/* Encabezado con Título y Filtros */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Box>
            <Typography variant="h5" sx={{ color: 'primary.contrastText' }}>
              Consultar Listas de Precios
            </Typography>
            </Box>

          <Paper elevation={1} sx={{ p: 0.8 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              select
              size="small"
              label="Seleccionar Plan"
              value={selectedPlan}
              onChange={handlePlanChange}
              disabled={planes.length === 0}
              sx={{ width: '150px' }} 
            >
              <MenuItem value="">
                <em>Seleccione un Plan</em>
              </MenuItem>
              {planes.map((plan) => (
                <MenuItem key={plan.id} value={plan.id}>
                  {plan.nombre}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              size="small"
              label="Tipo de Ingreso"
              value={selectedTipo}
              onChange={handleTipoChange}
              sx={{ width: '150px' }} 
            >
              <MenuItem value={TIPOS_INGRESO.OBLIGATORIO}>{TIPOS_INGRESO.OBLIGATORIO}</MenuItem>
              <MenuItem value={TIPOS_INGRESO.VOLUNTARIO}>{TIPOS_INGRESO.VOLUNTARIO}</MenuItem>
            </TextField>
          </Box>
        </Paper>
        </Box>
      </Box>

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Área de Contenido Principal (Tabla o Mensajes) */}
      {selectedPlan ? (
        <div id="printableArea">
          {/* ENCABEZADO PARA IMPRESIÓN */}
          <Box className="print-only" sx={{ display: 'none', '@media print': { display: 'block', padding: '16px', borderBottom: '2px solid #ddd', mb: 2 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>SIGEC - Gestión de Coberturas</Typography>
                <Typography variant="subtitle1" color="text.secondary">Lista de Precios</Typography>
              </Box>
              <img src={logo} alt="Logo" style={{ width: '100px', height: 'auto' }} />
            </Box>
            <Box sx={{ mt: 2, borderTop: '1px solid #eee', pt: 1 }}>
              <Typography variant="body1"><strong>Plan:</strong> {planNombre}</Typography>
              <Typography variant="body1"><strong>Tipo de Ingreso:</strong> {selectedTipo}</Typography>
            </Box>
          </Box>

          {/* Título de la tabla y botón de imprimir */}
          <Box className="no-print" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1, position: 'relative' }}>
            <Typography variant="h6" sx={{ color: 'secondary.main', lineHeight: 1.2 }}>
              Plan {planNombre} ({selectedTipo})
            </Typography>
            {prices.length > 0 && (
              <IconButton sx={{ color: 'primary.contrastText', position: 'absolute', right: 0 }} onClick={handlePrint} title="Imprimir Lista">
                <PrintIcon />
              </IconButton>
            )}
          </Box>

          {/* Tabla */}
          {loading ? <LoadingScreen message="Cargando precios..." /> : (
            <Box sx={{ maxWidth: '60%', mx: 'auto', minWidth: '500px' }}>
              <PriceListViewTable prices={prices} size="small" />
            </Box>
          )}
        </div>
      ) : (
        <Paper sx={{ p: 4, mt: 4, textAlign: 'center', maxWidth: '60%', mx: 'auto', bgcolor: 'background.paper' }}>
          <InfoIcon color="primary" sx={{ fontSize: 48, mb:2 }} />
          <Typography variant="h6" gutterBottom>
            Consulta de Precios
          </Typography>
          <Typography color="text.secondary">
            Por favor, seleccione un plan y un tipo de ingreso en los filtros superiores para visualizar la lista de precios correspondiente.
          </Typography>
        </Paper>
      )}

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

export default PriceListViewPage;