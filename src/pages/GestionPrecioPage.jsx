//============================================================================
// PÁGINA DE GESTIÓN DE LISTAS DE PRECIOS (CONTENEDOR)
//============================================================================
/**
 * @fileoverview Página principal ("Smart Component") para la administración de precios.
 *
 * @description
 * Este componente actúa como el orquestador principal. Sus responsabilidades incluyen:
 * 1. Gestionar estados de carga (Loading) y errores.
 * 2. Manejar los filtros (Plan y Tipo de Ingreso) y recargar datos de forma reactiva.
 * 3. Coordinar y ejecutar todas las operaciones CRUD (Carga Masiva, Edición, Borrado).
 * 4. Renderizar los micro-componentes presentacionales.
 */

import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert, Paper, Button } from '@mui/material';
import { toast } from 'react-hot-toast';
import apiClient from '../api/axiosConfig'; 
import { TIPOS_INGRESO } from '../utils/constants';
import PriceFilters from '../components/admin/PriceFilters';
import BulkLoadModal from '../components/admin/BulkLoadModal'; 
import PriceListTable from '../components/admin/PriceListTable'; 
import PriceEditModal from '../components/admin/PriceEditModal'; 
import BulkIncreaseModal from '../components/admin/BulkIncreaseModal'; 
import ConfirmDialog from '../components/common/ConfirmDialog'; 

/**
 * @description Componente contenedor principal para la gestión de Listas de Precios.
 * @returns {JSX.Element} Página completa de gestión de precios.
 */
function GestionPreciosPage() {
    // ESTADOS DE DATOS
    /** @type {[Array<Object>, Function]} Lista de todos los planes disponibles. */
    const [allPlans, setAllPlans] = useState([]); 
    /** @type {[Array<Object>, Function]} Entradas de precio para el filtro actual. */
    const [priceEntries, setPriceEntries] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ESTADOS DE FILTROS Y RECARGA
    const [filters, setFilters] = useState({
        planId: '', 
        tipoLista: TIPOS_INGRESO.OBLIGATORIO, 
    });

    /** @type {[number, Function]} Trigger para forzar la recarga de precios tras una acción CRUD. */
    const [refreshTrigger, setRefreshTrigger] = useState(0); 
    
    // ESTADOS DE MODALES Y CONFIRMACIÓN
    const [isCargaMasivaOpen, setIsCargaMasivaOpen] = useState(false);
    const [isIncreaseModalOpen, setIsIncreaseModalOpen] = useState(false); 
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); 
    const [editingPriceEntry, setEditingPriceEntry] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false); 
    const [idToDelete, setIdToDelete] = useState(null); 
    
    // LÓGICA DE CARGA Y RECARGA
    /**
     * Obtiene las entradas de precios filtradas por plan y tipo.
     * @param {string|number} planId - ID del plan.
     * @param {string} tipoLista - Tipo de ingreso (Obligatorio, Voluntario).
     */
    const fetchPriceEntries = async (planId, tipoLista) => {
        if (!planId) return;
        try {
            const response = await apiClient.get(`/pricelists/plan/${planId}/${tipoLista}`);
            setPriceEntries(response.data);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message;
            toast.error(`Error al cargar precios: ${errorMsg}`);
            setPriceEntries([]);
        } 
    };

    /**
     * @effect Carga inicial de planes y selección del plan por defecto.
     * Nota: Este effect corre solo una vez al montar, sin depender de refreshTrigger.
     */
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Cargar la lista de PLANES
                const plansResponse = await apiClient.get('/plans');
                const plans = plansResponse.data;
                setAllPlans(plans);

                if (plans.length > 0) {
                    const defaultPlanId = plans[0].id;
                    // Solo inicializamos el estado de filtros si hay planes
                    setFilters(prev => ({ ...prev, planId: defaultPlanId }));
                } else {
                    setLoading(false);
                }
            } catch (err) {
                const errorMsg = err.response?.data?.message || err.message;
                setError('Error al cargar datos iniciales: ' + errorMsg);
                toast.error(errorMsg);
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []); 

    /**
     * @effect Carga reactiva de precios al cambiar filtros o al refrescar.
     * Este effect gestiona el estado 'loading' para el bloqueo de la UI.
     */
    useEffect(() => {
        if (filters.planId) {
             setLoading(true);
             fetchPriceEntries(filters.planId, filters.tipoLista)
                .finally(() => {
                    setLoading(false); 
                });
        }
    }, [filters.planId, filters.tipoLista, refreshTrigger]);


    // HANDLERS DE ACCIÓN CRUD

    /** Maneja el cambio en los selectores de Plan y Tipo de Lista. */
    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    /**
     * Envía la carga masiva de precios al backend (POST /pricelists).
     * @param {Array} newPriceEntries - Array de objetos a cargar.
     */
    const handleSaveMassiveLoad = async (newPriceEntries) => {
        setIsCargaMasivaOpen(false);
        try {
            await apiClient.post('/pricelists', newPriceEntries);
            toast.success('Precios cargados masivamente con éxito.');
            setRefreshTrigger(prev => prev + 1); 
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message;
            toast.error(`Fallo en la carga masiva: ${errorMsg}`);
        }
    };
    
    /**
     * Abre el modal de edición de precio individual.
     * @param {object} entry - Entrada de precio a editar.
     */
    const handleEditPriceEntry = (entry) => {
        setEditingPriceEntry(entry);
        setIsEditModalOpen(true);
    };

    /**
     * Guarda la edición de un precio individual (PUT /pricelists/:id).
     * @param {object} updatedEntry - Entrada con los datos actualizados.
     */
    const handleSaveIndividualEdit = async (updatedEntry) => {
        setIsEditModalOpen(false);
        try {
            await apiClient.put(`/pricelists/${updatedEntry.id}`, {
                precio: updatedEntry.precio,
                rango_etario: updatedEntry.rango_etario,
            });
            toast.success(`Precio actualizado.`);
            setRefreshTrigger(prev => prev + 1); 
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message;
            toast.error(`Error al actualizar precio: ${errorMsg}`);
        }
        setEditingPriceEntry(null);
    };

    /** Inicia el flujo de confirmación para eliminar un precio. */
    const handleClickDelete = (id) => {
        setIdToDelete(id);
        setConfirmOpen(true);
    };

    /** Ejecuta la eliminación tras la confirmación (DELETE /pricelists/:id). */
    const handleConfirmDelete = async () => {
        setConfirmOpen(false); 
        if (!idToDelete) return;
        
        try {
            await apiClient.delete(`/pricelists/${idToDelete}`);
            toast.success(`Entrada de precio #${idToDelete} eliminada.`);
            setRefreshTrigger(prev => prev + 1); 
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message;
            toast.error(`Error al eliminar precio: ${errorMsg}`);
        }
        setIdToDelete(null); 
    };


    /**
     * Aplica un aumento masivo porcentual (POST /pricelists/increase).
     * @param {number} porcentaje - Porcentaje a aplicar.
     * @param {string} tipoLista - Tipo de lista a afectar.
     */
    const handleApplyMassiveIncrease = async (porcentaje, tipoLista) => {
        setIsIncreaseModalOpen(false);
        try {
            const response = await apiClient.post('/pricelists/increase', {
                porcentaje: porcentaje,
                tipo_lista: tipoLista,
            });
            toast.success(`Aumento aplicado a ${response.data.registros_afectados || 0} registros.`);
            setRefreshTrigger(prev => prev + 1); 
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message;
            toast.error(`Fallo en el aumento masivo: ${errorMsg}`);
        }
    };
    
    // RENDERIZADO
    
    // Muestra pantalla de carga al inicio si aún no tiene planes
    if (loading && allPlans.length === 0) {
        return <CircularProgress color="secondary" sx={{ display: 'block', margin: 'auto', mt: 10 }} />;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    // Nombre del plan seleccionado para el subtítulo
    const currentPlanName = allPlans.find(p => p.id === filters.planId)?.nombre || 'Seleccione Plan';

    return (
        <Box>
            {/* Título y Botones */}
            <Typography variant="h4" gutterBottom color="primary.main">
                Gestión de Listas de Precios
            </Typography>

            {/* Subtítulo y Acciones Masivas */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" color="text.secondary">
                    Precios: {currentPlanName} ({filters.tipoLista})
                </Typography>
                
                <Box>
                    <Button 
                        variant="outlined" 
                        color="secondary" 
                        sx={{ mr: 1 }}
                        onClick={() => setIsIncreaseModalOpen(true)}
                    >
                        Aumento Masivo
                    </Button>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => setIsCargaMasivaOpen(true)}
                    >
                        Carga Masiva
                    </Button>
                </Box>
            </Box>

            {/* Filtros */}
            <PriceFilters 
                planes={allPlans}
                selectedPlan={filters.planId}
                selectedTipo={filters.tipoLista}
                onPlanChange={handleFilterChange}
                onTipoChange={handleFilterChange}
                loading={loading} 
            />

            {/* Tabla de Precios o Loading */}
            <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                        <CircularProgress color="secondary" />
                    </Box>
                ) : priceEntries.length === 0 ? (
                    <Alert severity="info">No hay entradas de precios para este plan ({currentPlanName}). Use "Carga Masiva" para comenzar.</Alert>
                ) : (
                    <PriceListTable 
                        entries={priceEntries} 
                        onEdit={handleEditPriceEntry}
                        onDelete={handleClickDelete} 
                    />
                )}
            </Paper>

            {/* Modales */}
            <BulkLoadModal 
                open={isCargaMasivaOpen}
                onClose={() => setIsCargaMasivaOpen(false)}
                onSave={handleSaveMassiveLoad}
                planes={allPlans}
            />
            
            <PriceEditModal
                open={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveIndividualEdit}
                precioData={editingPriceEntry}
            />

            <BulkIncreaseModal 
                open={isIncreaseModalOpen} 
                onClose={() => setIsIncreaseModalOpen(false)}
                onSave={handleApplyMassiveIncrease}
            />

            {/* Diálogo de Confirmación */}
            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirmar Eliminación"
                message="¿Estás seguro de que deseas eliminar este precio? Esta acción no se puede deshacer."
            />
        </Box>
    );
}

export default GestionPreciosPage;