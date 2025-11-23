//============================================================================
// PÁGINA DE LISTA DE COTIZACIONES 
//============================================================================
/**
 * @fileoverview Página para visualizar el historial de cotizaciones del asesor.
 *
 * @description
 * Esta página actúa como el centro de control para las cotizaciones de un asesor.
 * Se encarga de obtener la lista de cotizaciones, mostrarlas en una tabla paginada,
 * permitir la búsqueda y el filtrado, y orquestar las acciones del usuario como
 * ver el detalle, editar, descargar un PDF o anular una cotización, utilizando
 * diversos componentes modales y de UI.
 */


import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import LoadingScreen from '../../components/common/LoadingScreen';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import QuoterFilters from '../../components/quoter/QuoterFilters';
import QuoterTable from '../../components/quoter/QuoterTable';
import QuoterDetailModal from '../../components/quoter/QuoterDetailModal';
import {
  getMisCotizaciones,
  anularCotizacion,
  downloadCotizacionPDF,
  getCotizacionById 
} from '../../services/quoterService';

/**
 * @component QuoterListPage
 * @description Componente de página que gestiona y muestra la lista de cotizaciones del asesor.
 * Orquesta la obtención de datos, la paginación, el filtrado y las interacciones del usuario
 * (ver, editar, anular, descargar PDF).
 * @returns {JSX.Element}
 */
function QuoterListPage() {
  const navigate = useNavigate();

  // Estados de datos
  const [cotizaciones, setCotizaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false); 
  const [error, setError] = useState(null);

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');

  // Estados de paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Estados de confirmación (Anular)
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  // Estados de modal de detalle (Ojito)
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedCotizacion, setSelectedCotizacion] = useState(null);

  // Estado para notificaciones con modal
  const [notification, setNotification] = useState({
    isOpen: false,
    title: '',
    message: '',
    variant: 'info',
  });

  // Cargar cotizaciones al montar
  useEffect(() => {
    fetchCotizaciones();
    // Limpiamos el state para que no recargue indefinidamente si el usuario refresca la página.
    navigate(location.pathname, { replace: true });
  }, [location.state]);

  /**
   * Obtiene las cotizaciones del asesor desde la API
   */
  const fetchCotizaciones = async () => {
    try {
      setLoading(true);
      setError(null);

      // Creamos una promesa de retraso de 1.5 segundos
      const delayPromise = new Promise(resolve => setTimeout(resolve, 1500));

      // Ejecutamos la llamada a la API y el retraso en paralelo
      const [data] = await Promise.all([
        getMisCotizaciones(),
        delayPromise
      ]);

      setCotizaciones(data);
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        setNotification({ isOpen: true, variant: 'error', title: 'Sesión Expirada', message: 'Su sesión ha caducado. Será redirigido al login.', confirmText: 'Aceptar', onConfirm: () => navigate('/login') });
      } else {
        const errorMsg = err.response?.data?.message || err.message;
        // Usamos setNotification en lugar de setError
        setNotification({ isOpen: true, variant: 'error', title: 'Error de Carga', message: 'No se pudieron cargar las cotizaciones: ' + errorMsg, confirmText: 'Aceptar' });
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filtra las cotizaciones según búsqueda (DNI, Apellido, Nombre, ID)
   */
  const filteredCotizaciones = cotizaciones.filter((cot) => {
      const search = searchTerm.toLowerCase();
      if (search === '') return true;

      return (
        cot.cliente_apellido?.toLowerCase().includes(search) ||
        cot.cliente_nombre?.toLowerCase().includes(search) ||
        cot.cliente_dni?.toString().includes(search) ||
        cot.id?.toString().includes(search) ||
        cot.estado?.toLowerCase().includes(search) 
      );
    });

  // Handlers de filtros
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(0); 
  };

  // Handler para limpiar búsqueda
  const handleClearSearch = () => {
    setSearchTerm('');
    setPage(0);
  };

  // Handlers de paginación
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // HANDLERS DE ACCIONES
  
  /**
   * Ver detalle de una cotización (Modal)
   */
  const handleView = async (id) => {
    try {
      // Pedimos los datos completos al backend
      const data = await getCotizacionById(id);
      
      // Guardamos los datos y abrimos el modal
      setSelectedCotizacion(data);
      setDetailModalOpen(true);
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        setNotification({ isOpen: true, variant: 'error', title: 'Sesión Expirada', message: 'Su sesión ha caducado. Será redirigido al login.', confirmText: 'Aceptar', onConfirm: () => navigate('/login') });
      } else {
        setNotification({ isOpen: true, title: 'Error', message: 'No se pudo cargar el detalle de la cotización.', variant: 'error', confirmText: 'Aceptar' });
      }
    }
  };

  /**
   * Editar una cotización (Navegar al Wizard con datos)
   */
  const handleEdit = (id) => {
    setIsNavigating(true); // 
    setTimeout(() => {
      navigate('/cotizador', { state: { editId: id, fromList: true } });
    }, 1500);
  };

  /**
   * Navegar a la página de nueva cotización mostrando un loading
   */
  const handleNewQuotation = () => {
    setIsNavigating(true);
    setTimeout(() => {
      navigate('/cotizador');
    }, 1500);
  };

  /**
   * Descargar PDF de una cotización
   */
  const handleDownloadPDF = async (id) => {
    try {      
      const blob = await downloadCotizacionPDF(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Cotizacion_${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        setNotification({ isOpen: true, variant: 'error', title: 'Sesión Expirada', message: 'Su sesión ha caducado. Será redirigido al login.', confirmText: 'Aceptar', onConfirm: () => navigate('/login') });
      } else {
        const errorMsg = err.response?.data?.message || err.message;
        setNotification({ isOpen: true, title: 'Error de Descarga', message: `No se pudo generar el PDF: ${errorMsg}`, variant: 'error', confirmText: 'Aceptar' });
      }
    }
  };

  /**
   * Anular una cotización (Soft Delete)
   */
  const handleAnular = (id) => {
    const action = async () => {
      const originalCotizaciones = [...cotizaciones];
      
      setCotizaciones(prev =>
        prev.map(cot =>
          cot.id === id ? { ...cot, estado: 'cancelado', activo: 0 } : cot
        )
      );
      setConfirmOpen(false);
      
      try {
        await anularCotizacion(id);
        setNotification({
          isOpen: true,
          title: 'Éxito',
          message: `La cotización #${id} ha sido anulada correctamente.`,
          variant: 'success'
        });
      } catch (err) {
        // Rollback si falla el backend
        setCotizaciones(originalCotizaciones);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setNotification({ isOpen: true, variant: 'error', title: 'Sesión Expirada', message: 'Su sesión ha caducado. Será redirigido al login.', confirmText: 'Aceptar', onConfirm: () => navigate('/login') });
        } else {
          const errorMsg = err.response?.data?.message || err.message;
          setNotification({
            isOpen: true,
            title: 'Error al Anular',
            message: `No se pudo anular la cotización: ${errorMsg}`,
            variant: 'error'
          });
        }
      }
    };

    setConfirmAction(() => action);
    setConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setConfirmOpen(false);
    setTimeout(() => setConfirmAction(null), 300);
  };

  const handleDoConfirm = () => {
    if (confirmAction) {
      confirmAction();
    }
  };

  const handleCloseDetail = () => {
    setDetailModalOpen(false);
    setSelectedCotizacion(null); 
  };

  // Renderizado
  
  if (loading || isNavigating) return <LoadingScreen message={isNavigating ? "Preparando cotizador..." : "Cargando cotizaciones..."} />;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ color: 'primary.contrastText' }}>
          Mis Cotizaciones
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon fontSize="small" />}
          onClick={handleNewQuotation}
          sx={{
            fontSize: '0.75rem', 
            padding: '2px 10px' 
          }}
        >
          Nueva Cotización
        </Button>
      </Box>

      {/* Filtros (Solo búsqueda) */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <QuoterFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onClearSearch={handleClearSearch}
        />
      </Box>

      {/* Tabla */}
      <QuoterTable
        cotizaciones={filteredCotizaciones}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onView={handleView}
        onEdit={handleEdit}
        onDownloadPDF={handleDownloadPDF}
        onAnular={handleAnular}
      />

      {/* Modal de Confirmación (Anular) */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={handleCloseConfirm}
        onConfirm={handleDoConfirm}
        title="Anular Cotización"
        message="¿Está seguro de que desea anular esta cotización? Esta acción no se puede deshacer."
      />

      {/* NUEVO: Modal para notificaciones de éxito/error */}
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

      {/* Modal de Detalle (Ojito) */}
      <QuoterDetailModal 
          open={detailModalOpen}
          onClose={handleCloseDetail}
          cotizacion={selectedCotizacion}
       />
    </Box>
  );
}

export default QuoterListPage;