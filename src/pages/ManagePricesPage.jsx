//============================================================================
// PÁGINA DE GESTIÓN DE LISTAS DE PRECIOS (ADMIN)
//============================================================================
/**
 * @fileoverview Página principal ("Smart Component") para la administración de precios.
 *
 * @description
 * Este componente actúa como el orquestador principal para la gestión de listas
 * de precios. Sus responsabilidades incluyen la gestión de estados de carga y
 * errores, el manejo de filtros (Plan y Tipo de Ingreso) para recargar datos
 * de forma reactiva, y la coordinación y ejecución de todas las operaciones CRUD
 * (Carga Masiva, Edición, Borrado, Aumento Masivo) a través de los componentes
 * presentacionales correspondientes.
 */

import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Paper, Button, IconButton, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axiosConfig';
import { TIPOS_INGRESO } from '../utils/constants'; 
import PrintIcon from '@mui/icons-material/Print';
import logo from '../assets/logo_azul.png'; // Importamos el logo
import LoadingScreen from '../components/common/LoadingScreen';
import PriceFilters from '../components/admin/PriceFilters';
import BulkLoadModal from '../components/admin/BulkLoadModal';
import PriceListTable from '../components/admin/PriceListTable';
import PriceEditModal from '../components/admin/PriceEditModal';
import BulkIncreaseModal from '../components/admin/BulkIncreaseModal';
import ConfirmDialog from '../components/common/ConfirmDialog';

/**
 * @component ManagePricesPage
 * @description Componente de página que orquesta la visualización, filtrado y gestión de las listas de precios.
 * Maneja el estado de los datos, la comunicación con la API para las operaciones CRUD y la
 * interacción con los componentes de tabla y modales.
 * @returns {JSX.Element}
 */
function ManagePricesPage() {
    const { logout } = useAuth();
    // ESTADOS 
    const [allPlans, setAllPlans] = useState([]);
    const [priceEntries, setPriceEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        planId: '',
        tipoIngreso: TIPOS_INGRESO.OBLIGATORIO, 
    });
    const [isBulkLoadOpen, setIsBulkLoadOpen] = useState(false);
    const [isIncreaseModalOpen, setIsIncreaseModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingPriceEntry, setEditingPriceEntry] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);
    const [notification, setNotification] = useState({
        isOpen: false,
        title: '',
        message: '',
        variant: 'info',
    });

    // LÓGICA DE CARGA (Funciones) 
    const fetchPriceEntries = async (planId, tipoIngresoSelected) => {
        if (!planId) {
            setPriceEntries([]); 
            return;
        }
        let tipoParaApi = tipoIngresoSelected;
        if (tipoIngresoSelected === TIPOS_INGRESO.MONOTRIBUTO) {
            tipoParaApi = TIPOS_INGRESO.OBLIGATORIO;
        }
        try {
            const response = await apiClient.get(`/pricelists/plan/${planId}/${tipoParaApi}`);
            if (Array.isArray(response.data)) {
                setPriceEntries(response.data);
            } else {
                setPriceEntries([]);
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                logout();
                return;
            }
            console.error("Error fetching prices:", err);
            setNotification({
                isOpen: true,
                title: 'Error de Carga',
                message: `Error al cargar precios: ${err.response?.data?.message || err.message}`,
                variant: 'error' });
            setPriceEntries([]);
        } 
    };

    // useEffect 1: CARGA INICIAL DE PLANES (Solo 1 vez) 
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                setError(null);
                const plansResponse = await apiClient.get('/plans');
                const plans = plansResponse.data;
                setAllPlans(plans);

                if (plans.length > 0) {
                    // No seleccionamos un plan por defecto para que el usuario elija.
                    setLoading(false); 
                } else { // Si no hay planes, sí terminamos la carga.
                    setLoading(false); 
                }
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    logout();
                    return;
                }
                const errorMsg = err.response?.data?.message || err.message;
                setError('Error loading initial data: ' + errorMsg);
                setNotification({
                    isOpen: true,
                    title: 'Error de Datos',
                    message: errorMsg,
                    variant: 'error' });
                setLoading(false);
            } 
        };
        fetchInitialData();
    }, [logout]); 

    // useEffect 2: CARGA DE PRECIOS (Cada vez que cambia el filtro o el refresh)
    useEffect(() => {
        // Solo carga precios si AMBOS filtros, plan y tipo de ingreso, están seleccionados.
        if (filters.planId && filters.planId !== '' && filters.tipoIngreso && filters.tipoIngreso !== '') {
            setLoading(true); 
            fetchPriceEntries(filters.planId, filters.tipoIngreso)
                .finally(() => {
                    setLoading(false); 
                });
        } else {
            setPriceEntries([]); 
        }
    }, [filters.planId, filters.tipoIngreso, refreshTrigger, logout]); 

    // HANDLERS 
    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveBulkLoad = async (newPriceEntries) => {
        setIsBulkLoadOpen(false);

        if (!newPriceEntries) { 
            return;
        }
        if (newPriceEntries.length === 0) {
            setNotification({
                isOpen: true,
                title: 'Validación Fallida',
                message: 'Debe ingresar al menos un precio para poder realizar la carga masiva.',
                variant: 'warning'
            });
            return;
        }
        
        try {
            await apiClient.post('/pricelists', newPriceEntries);
            setNotification({
                isOpen: true,
                title: 'Éxito',
                message: 'Precios cargados masivamente con éxito.',
                variant: 'success' });
            setRefreshTrigger(prev => prev + 1);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                logout();
                return;
            }
            const errorMsg = err.response?.data?.message || err.message;
            setNotification({
                isOpen: true,
                title: 'Error en Carga Masiva',
                message: errorMsg,
                variant: 'error' });
        }
    };

    const handleEditPriceEntry = (entry) => {
        setEditingPriceEntry(entry);
        setIsEditModalOpen(true);
    };

    const handleSaveIndividualEdit = async (updatedEntry) => {
        setIsEditModalOpen(false);
        try {
            await apiClient.put(`/pricelists/${updatedEntry.id}`, {
                precio: updatedEntry.precio,
                rango_etario: updatedEntry.rango_etario 
            });
            // Actualizamos el estado localmente sin recargar toda la página
            setPriceEntries(prev => prev.map(p => p.id === updatedEntry.id ? updatedEntry : p));
            setNotification({
                isOpen: true,
                title: 'Éxito',
                message: 'Precio actualizado correctamente.',
                variant: 'success' });
        } catch (err) {
            if (err.response && err.response.status === 401) {
                logout();
                return;
            }
            const errorMsg = err.response?.data?.message || err.message;
            setNotification({
                isOpen: true,
                title: 'Error al Actualizar',
                message: errorMsg,
                variant: 'error' });
        }
        setEditingPriceEntry(null);
    };

    const handleClickDelete = (id) => {
        setIdToDelete(id);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        setConfirmOpen(false); 
        if (!idToDelete) return;
        try {
            await apiClient.delete(`/pricelists/${idToDelete}`);
            // Eliminamos el precio del estado local sin recargar toda la página
            setPriceEntries(prev => prev.filter(p => p.id !== idToDelete));
            setNotification({
                isOpen: true,
                title: 'Éxito',
                message: 'Precio eliminado correctamente.',
                variant: 'success' });
        } catch (err) {
            if (err.response && err.response.status === 401) {
                logout();
                return;
            }
            const errorMsg = err.response?.data?.message || err.message;
            setNotification({
                isOpen: true,
                title: 'Error al Eliminar',
                message: errorMsg,
                variant: 'error' });
        }
        setIdToDelete(null); 
    };

    const handleApplyBulkIncrease = async (porcentaje, tipoIngreso) => {
        setIsIncreaseModalOpen(false);
        try {
            await apiClient.post('/pricelists/increase', {
                porcentaje: porcentaje,
                tipo_ingreso: tipoIngreso, 
            });
            setNotification({
                isOpen: true,
                title: 'Éxito',
                message: 'Aumento masivo aplicado correctamente.',
                variant: 'success' });
            setRefreshTrigger(prev => prev + 1);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                logout();
                return;
            }
            const errorMsg = err.response?.data?.message || err.message;
            setNotification({
                isOpen: true,
                title: 'Error en Aumento Masivo',
                message: errorMsg,
                variant: 'error' });
        }
    };

    // Imprimir la lista de precios
    const handlePrint = () => {
        window.print();
    };

    // RENDERIZADO

    // Carga INICIAL (solo para planes, la primera vez)
    if (loading && allPlans.length === 0) {
        return <LoadingScreen message="CARGANDO PLANES..." />;
    }

    // Error de planes (si falló la carga inicial)
    if (error) return <Alert severity="error">{error}</Alert>;

    const getInfoMessage = () => {
        if (!filters.planId) {
            return 'Seleccione un plan para ver los precios.';
        }
        if (!filters.tipoIngreso) {
            return 'Seleccione un tipo de ingreso para continuar.';
        }
        return 'No hay precios cargados para esta combinación.';
    };

    const currentPlanName = allPlans.find(p => p.id === filters.planId)?.nombre || 'Seleccione Plan';

    // Filtramos los planes para mostrar solo los activos en los selectores.
    const activePlans = allPlans.filter(plan => plan.activo === 1);

    return (
        <Box>
            {/* Estilos para la impresión */}
            <style>
                {`
                    @media print {
                        body * { visibility: hidden; }
                        #printableArea, #printableArea * { visibility: visible; }
                        #printableArea { position: absolute; left: 0; top: 0; width: 100%; }
                        .no-print { display: none !important; }
                    }
                `}
            </style>

            {/* TÍTULO Y BOTONES (Siempre visibles) */}
            <Typography variant="h5" gutterBottom sx={{ color: 'primary.contrastText' }}>
                Gestión de Listas de Precios
            </Typography>

            {/* FILTROS (Siempre visibles, se deshabilitan con 'loading') */}
            <PriceFilters
              planes={activePlans}
              selectedPlan={filters.planId}
              selectedTipo={filters.tipoIngreso}
              onPlanChange={handleFilterChange}
              onTipoChange={handleFilterChange}
              loading={loading}
              currentPlanName={currentPlanName}
            >
              {/* Botones de Acción que se pasarán a la barra de filtros */}
              <Box>
                  {priceEntries.length > 0 && (
                      <IconButton color="primary" onClick={handlePrint} title="Imprimir Lista">
                          <PrintIcon />
                      </IconButton>
                  )}
                  <Button variant="contained" color="secondary" size="small" sx={{ mr: 1, fontSize: '0.75rem', padding: '2px 8px' }} onClick={() => setIsIncreaseModalOpen(true)}>
                      Aumento Masivo
                  </Button>
                  <Button variant="contained" color="primary" size="small" sx={{ fontSize: '0.75rem', padding: '2px 8px' }} onClick={() => setIsBulkLoadOpen(true)}>
                      Carga Masiva
                  </Button>
              </Box>
            </PriceFilters>

            {/* Contenedor de la tabla y acciones */}
            <Paper 
              elevation={loading ? 0 : 3} 
              sx={{ 
                p: 2, mt: 2, minHeight: '400px', 
                bgcolor: loading ? 'transparent' : 'background.paper' 
              }}>
                <Box id="printableArea">
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
                            <Typography variant="body1"><strong>Plan:</strong> {currentPlanName}</Typography>
                            <Typography variant="body1"><strong>Tipo de Ingreso:</strong> {filters.tipoIngreso}</Typography>
                        </Box>
                    </Box>

                    {/* Contenido principal (Tabla o mensajes) */}
                    {loading ? (
                        <LoadingScreen message="CARGANDO PRECIOS..." />
                    ) : (!priceEntries || priceEntries.length === 0) ? (
                        <Alert severity="info">
                            {getInfoMessage()}
                        </Alert>
                    ) : (
                        <PriceListTable
                          entries={priceEntries}
                          onEdit={handleEditPriceEntry}
                          onDelete={handleClickDelete}
                          planName={currentPlanName}
                          tipoIngreso={filters.tipoIngreso}
                        />
                    )}
                </Box>
            </Paper>

            {/* MODALS  */}
            <BulkLoadModal open={isBulkLoadOpen} onClose={() => setIsBulkLoadOpen(false)} onSave={handleSaveBulkLoad} planes={activePlans} />
            <PriceEditModal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSave={handleSaveIndividualEdit} precioData={editingPriceEntry} />
            <BulkIncreaseModal open={isIncreaseModalOpen} onClose={() => setIsIncreaseModalOpen(false)} onSave={handleApplyBulkIncrease} />
            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Eliminar Precio"
                message="¿Está seguro de que desea eliminar este precio? Esta acción no se puede deshacer."
            />
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

export default ManagePricesPage;