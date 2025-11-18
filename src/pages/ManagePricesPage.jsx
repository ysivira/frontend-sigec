//============================================================================
// PÁGINA DE GESTIÓN DE LISTAS DE PRECIOS (ADMIN)
//============================================================================
/**
 * @fileoverview Página contenedora para administrar las Listas de Precios.
 *
 * @description
 * - Carga la lista de planes para el filtro inicial [GET /plans].
 * - Carga las entradas de precios según filtros [GET /pricelists/plan/:planId/:tipoIngreso].
 * - Maneja la lógica de Carga Masiva [POST /pricelists], Edición Individual [PUT /pricelists/:id],
 *   Eliminación Individual [DELETE /pricelists/:id] y Aumento Masivo [POST /pricelists/increase].
 * - Orquesta los micro-componentes PriceFilters, BulkLoadModal, PriceListTable,
 *   PriceEditModal, BulkIncreaseModal y ConfirmDialog.
 */     
//============================================================================

import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Paper, Button } from '@mui/material';
import { toast } from 'react-hot-toast';
import apiClient from '../api/axiosConfig';
import { TIPOS_INGRESO } from '../utils/constants'; 
import LoadingScreen from '../components/common/LoadingScreen';
import PriceFilters from '../components/admin/PriceFilters';
import BulkLoadModal from '../components/admin/BulkLoadModal';
import PriceListTable from '../components/admin/PriceListTable';
import PriceEditModal from '../components/admin/PriceEditModal';
import BulkIncreaseModal from '../components/admin/BulkIncreaseModal';
import ConfirmDialog from '../components/common/ConfirmDialog';

function ManagePricesPage() {
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
            console.error("Error fetching prices:", err);
            toast.error(`Error al cargar precios: ${err.response?.data?.message || err.message}`);
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
                    const defaultPlanId = plans[0].id;
                    setFilters(prev => ({ ...prev, planId: defaultPlanId }));
                } else {
                    setLoading(false); 
                }
            } catch (err) {
                const errorMsg = err.response?.data?.message || err.message;
                setError('Error loading initial data: ' + errorMsg);
                toast.error(errorMsg);
                setLoading(false);
            } 
        };
        fetchInitialData();
    }, []); 

    // useEffect 2: CARGA DE PRECIOS (Cada vez que cambia el filtro o el refresh)
    useEffect(() => {
        if (filters.planId) {
            setLoading(true); 
            fetchPriceEntries(filters.planId, filters.tipoIngreso)
                .finally(() => {
                    setLoading(false); 
                });
        }
    }, [filters.planId, filters.tipoIngreso, refreshTrigger]); 

    // HANDLERS 
    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveBulkLoad = async (newPriceEntries) => {
        setIsBulkLoadOpen(false);
        try {
            await apiClient.post('/pricelists', newPriceEntries);
            toast.success('Precios cargados masivamente con éxito.');
            setRefreshTrigger(prev => prev + 1);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message;
            toast.error(`Fallo en carga masiva: ${errorMsg}`);
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
            toast.success(`Precio actualizado.`);
            setRefreshTrigger(prev => prev + 1);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message;
            toast.error(`Error al actualizar: ${errorMsg}`);
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
            toast.success(`Precio eliminado correctamente.`);
            setRefreshTrigger(prev => prev + 1);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message;
            toast.error(`Error al eliminar: ${errorMsg}`);
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
            toast.success(`Aumento aplicado correctamente.`);
            setRefreshTrigger(prev => prev + 1);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message;
            toast.error(`Fallo en aumento masivo: ${errorMsg}`);
        }
    };

    // RENDERIZADO

    // Carga INICIAL (solo para planes, la primera vez)
    if (loading && allPlans.length === 0) {
        return <LoadingScreen message="CARGANDO PLANES..." />;
    }

    // Error de planes (si falló la carga inicial)
    if (error) return <Alert severity="error">{error}</Alert>;

    const currentPlanName = allPlans.find(p => p.id === filters.planId)?.nombre || 'Seleccione Plan';

    return (
        <Box>
            {/* TÍTULO Y BOTONES (Siempre visibles) */}
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.contrastText' }}>
                Gestión de Listas de Precios
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: 'secondary.main' }}>
                    Precios: {currentPlanName} ({filters.tipoIngreso})
                </Typography>
                <Box>
                    <Button variant="outlined" color="secondary" sx={{ mr: 1 }} onClick={() => setIsIncreaseModalOpen(true)}>
                        Aumento Masivo
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => setIsBulkLoadOpen(true)}>
                        Carga Masiva
                    </Button>
                </Box>
            </Box>

            {/* FILTROS (Siempre visibles, se deshabilitan con 'loading') */}
            <PriceFilters
                planes={allPlans}
                selectedPlan={filters.planId}
                selectedTipo={filters.tipoIngreso}
                onPlanChange={handleFilterChange}
                onTipoChange={handleFilterChange}
                loading={loading} 
            />

            {loading ? (
                <LoadingScreen message="CARGANDO PRECIOS..." />
            ) : (
                <Paper elevation={3} sx={{ p: 3, mt: 3, minHeight: '400px' }}>
                    {(!priceEntries || priceEntries.length === 0) ? (
                        <Alert severity="info">
                            No hay precios cargados para este plan.
                        </Alert>
                    ) : (
                        <PriceListTable
                            entries={priceEntries}
                            onEdit={handleEditPriceEntry}
                            onDelete={handleClickDelete}
                        />
                    )}
                </Paper>
            )}

            {/* MODALS (Siempre montados, pero ocultos) */}
            <BulkLoadModal open={isBulkLoadOpen} onClose={() => setIsBulkLoadOpen(false)} onSave={handleSaveBulkLoad} planes={allPlans} />
            <PriceEditModal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSave={handleSaveIndividualEdit} precioData={editingPriceEntry} />
            <BulkIncreaseModal open={isIncreaseModalOpen} onClose={() => setIsIncreaseModalOpen(false)} onSave={handleApplyBulkIncrease} />
            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Eliminar Precio"
                message="¿Está seguro de que desea eliminar este precio? Esta acción no se puede deshacer."
            />
        </Box>
    );
}

export default ManagePricesPage;