//============================================================================
// PÁGINA DE COTIZACIÓN - FRONTEND
//============================================================================
/**
 * @fileoverview Página principal para la creación y edición de cotizaciones.
 *
 * @description
 * Este componente actúa como un asistente (wizard) de varios pasos que guía al
 * usuario a través del proceso de cotización. Orquesta el estado completo,
 * incluyendo los datos del cliente, la configuración del plan, los miembros del
 * grupo familiar y los cálculos. Se encarga de la validación de cada paso,
 * la comunicación con los servicios de la API y la gestión de la interfaz de
 * usuario (carga, errores, modales de éxito). Puede operar en modo de creación
 * o de edición, cargando datos existentes si es necesario.
 */

import React, { useState, useEffect } from 'react';
import { Box, Typography, Stepper, Step, StepLabel, Button, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Paper } from '@mui/material';
import { toast } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ListIcon from '@mui/icons-material/List';
import AddIcon from '@mui/icons-material/Add';
import LoadingScreen from '../../components/common/LoadingScreen';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import QuoterClientForm from '../../components/quoter/QuoterClientForm';
import QuoterMainForm from '../../components/quoter/QuoterMainForm';
import QuoterSummary from '../../components/quoter/QuoterSummary';
import { verifyClientByDni, getActivePlans, createCotizacion, updateCotizacion, getCotizacionById, calculateCotizacion, downloadCotizacionPDF } from '../../services/quoterService';

const steps = ['Datos del Cliente', 'Configurar Cotización', 'Resumen'];

/**
 * @component QuoterPage
 * @description Componente de página que funciona como un asistente multi-paso para crear o editar una cotización.
 * Gestiona el estado completo del formulario, la navegación entre pasos, la validación de datos
 * y las interacciones con la API.
 * @returns {JSX.Element}
 */
function QuoterPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // --- ESTADOS ---
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Cargando...");
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [verifyResult, setVerifyResult] = useState(null);
  const [canProceed, setCanProceed] = useState(false);
  const [isExistingClient, setIsExistingClient] = useState(false);
  const [calculatedSummary, setCalculatedSummary] = useState(null);
  const [successModal, setSuccessModal] = useState({ open: false, cotizacionId: null, message: '' });
  const [notification, setNotification] = useState({ isOpen: false, title: '', message: '', variant: 'info' });

  // --- DATOS ---
  const [clientData, setClientData] = useState({
    dni: '', nombres: '', apellidos: '', email: '', telefono: '', ciudad: '', direccion: '', edad: ''
  });
  const [clientErrors, setClientErrors] = useState({});
  const [cotizacionData, setCotizacionData] = useState({
    tipo_ingreso: '', plan_id: '', es_casado: false, aporte_obra_social: '',
    monotributo_categoria: '', monotributo_adherentes: 0,
    descuento_comercial_pct: 0, descuento_afinidad_pct: 0, descuento_tarjeta_pct: 0
  });
  const [miembros, setMiembros] = useState([{ parentesco: 'Titular', edad: '' }]);
  const [planes, setPlanes] = useState([]);

  // --- EFECTOS ---
  useEffect(() => {
    const fetchPlanes = async () => {
      try {
        const planesData = await getActivePlans();
        setPlanes(planesData);
      } catch (err) {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setNotification({ isOpen: true, variant: 'error', title: 'Sesión Expirada', message: 'Su sesión ha caducado. Será redirigido al login.', confirmText: 'Aceptar', onConfirm: () => navigate('/login') });
        } else {
          setNotification({ isOpen: true, variant: 'error', title: 'Error de Carga', message: 'No se pudieron cargar los planes. Intente recargar la página.', confirmText: 'Aceptar' });
        }
      }
    };
    fetchPlanes();
  }, []);

  useEffect(() => {
    if (location.state && location.state.editId) {
      const loadEdit = async () => {
        setLoading(true); setLoadingMessage("Cargando...");
        try {
          const data = await getCotizacionById(location.state.editId);
          loadDataForEditing(data);
        } catch (err) {
          if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            setNotification({ isOpen: true, variant: 'error', title: 'Sesión Expirada', message: 'Su sesión ha caducado. Será redirigido al login.', confirmText: 'Aceptar', onConfirm: () => navigate('/login') });
          } else {
            setNotification({ isOpen: true, variant: 'error', title: 'Error al Cargar', message: `No se pudo cargar la cotización para editar.`, confirmText: 'Aceptar', onConfirm: () => navigate('/mis-cotizaciones') });
          }
        } finally { setLoading(false); }
      };
      loadEdit();
    } else { resetWizard(); }
  }, [location.state]);

  // --- LÓGICA DE CARGA ---
  const loadDataForEditing = (data) => {
    setIsEditMode(true); setEditingId(data.id); fillForms(data); setCanProceed(true); setIsExistingClient(true); setActiveStep(0);
  };
  const loadDataForRecotizacion = (data) => {
    fillForms(data); setCanProceed(true); setIsExistingClient(true); setIsEditMode(false); setEditingId(null);
  };

  const fillForms = (data) => {
    const ciudadRecuperada = data.cliente.ciudad || data.cliente.direccion || '';
    setClientData({
      dni: data.cliente.dni,
      nombres: data.cliente.nombres,
      apellidos: data.cliente.apellidos,
      email: data.cliente.email,
      telefono: data.cliente.telefono,
      ciudad: ciudadRecuperada,
      direccion: ciudadRecuperada, 
      edad: data.miembros.find(m => m.parentesco === 'Titular')?.edad || ''
    });

    setCotizacionData(prev => {
      const { es_casado, ...restOfData } = data;
      return {
        ...prev,
        ...restOfData,
        descuento_comercial_pct: parseInt(data.descuento_comercial_pct, 10) || 0,
        descuento_afinidad_pct: parseInt(data.descuento_afinidad_pct, 10) || 0,
        descuento_tarjeta_pct: parseInt(data.descuento_tarjeta_pct, 10) || 0,
      };
    });
    setMiembros(data.miembros.map(m => ({ parentesco: m.parentesco, edad: m.edad })));
  };

  //  VALIDACIONES
  const validateClientData = () => {
    // Campos obligatorios básicos
    const required = ['nombres', 'apellidos', 'email', 'telefono', 'edad'];
    let valid = true;
    const errs = {};

    required.forEach(f => {
      if (!clientData[f] || clientData[f].toString().trim() === '') {
        errs[f] = 'Requerido';
        valid = false;
      }
    });
    // Validar que al menos uno de ciudad o dirección esté completo
    if ((!clientData.ciudad || clientData.ciudad.trim() === '') && (!clientData.direccion || clientData.direccion.trim() === '')) {
      errs.ciudad = 'Requerido'; 
      valid = false;
    }

    setClientErrors(errs);

    if (!valid) {
      setNotification({ isOpen: true, variant: 'warning', title: 'Datos Incompletos', message: 'Por favor, complete todos los campos requeridos del cliente.', confirmText: 'Entendido' });
    }
    return valid;
  };

  const validateCotizacionData = () => {
    if (!cotizacionData.plan_id || !cotizacionData.tipo_ingreso) {
      setNotification({ isOpen: true, variant: 'warning', title: 'Datos Incompletos', message: 'Debe seleccionar un Tipo de Ingreso y un Plan.', confirmText: 'Entendido' });
      return false;
    }
    for (let m of miembros) if (!m.parentesco || !m.edad) {
      setNotification({ isOpen: true, variant: 'warning', title: 'Datos Incompletos', message: 'Todos los integrantes del grupo familiar deben tener un parentesco y una edad.', confirmText: 'Entendido' });
      return false;
    }
    return true;
  };

  const handleSearchDni = async (dni) => {
    setLoading(true); setLoadingMessage("Verificando..."); setError(null);
    try {
      const result = await verifyClientByDni(dni);
      setVerifyResult(result);
      if (!result.existe || result.cotizado_por_mi) {
        setCanProceed(true);
        if (!result.datosParaRecotizar) {
          const ciudadOdire = result.cliente?.ciudad || result.cliente?.direccion || '';
          setClientData(prev => ({
            ...prev,
            dni,
            nombres: result.cliente?.nombres || '',
            apellidos: result.cliente?.apellidos || '',
            email: result.cliente?.email || '',
            telefono: result.cliente?.telefono || '',
            ciudad: ciudadOdire,
            direccion: ciudadOdire
          }));
          setIsExistingClient(result.existe);
        }
        if (!result.existe) setNotification({ isOpen: true, variant: 'success', title: 'Cliente Nuevo', message: 'Puede proceder.', confirmText: 'Continuar', onClose: () => setNotification({ ...notification, isOpen: false }), onConfirm: () => setNotification({ ...notification, isOpen: false }) });
        else setNotification({ isOpen: true, variant: 'info', title: 'Cliente Encontrado', message: `Se cargarán sus datos.`, confirmText: 'Cargar', onClose: () => setNotification({ ...notification, isOpen: false }), onConfirm: () => { setNotification({ ...notification, isOpen: false }); if (result.datosParaRecotizar) loadDataForRecotizacion(result.datosParaRecotizar); } });
      } else {
        setCanProceed(false);
        setNotification({ isOpen: true, variant: 'error', title: 'Cliente Ya Cotizado', message: result.message, confirmText: 'Aceptar', onClose: () => setNotification({ ...notification, isOpen: false }), onConfirm: () => setNotification({ ...notification, isOpen: false }) });
      }
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        setNotification({ isOpen: true, variant: 'error', title: 'Sesión Expirada', message: 'Su sesión ha caducado. Será redirigido al login.', confirmText: 'Aceptar', onConfirm: () => navigate('/login') });
      } else {
        setNotification({ isOpen: true, variant: 'error', title: 'Error de Búsqueda', message: err.response?.data?.message || err.message, confirmText: 'Aceptar' });
      }
    } finally { setLoading(false); }
  };

  const handleClientDataChange = (field, value) => {
    setClientData(prev => {
      const newData = { ...prev, [field]: value };
      
      if (field === 'ciudad') newData.direccion = value;
      
      if (field === 'direccion') newData.ciudad = value;
      return newData;
    });

    if (field === 'edad') setMiembros(prev => { const n = [...prev]; if (n[0]?.parentesco === 'Titular') n[0].edad = value; return n; });
    if (value) setClientErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  // BUILD PAYLOAD
  const buildPayload = () => {
    const ciudadFinal = clientData.ciudad || clientData.direccion || '';

    return {
      clienteData: {
        ...clientData,
        edad: parseInt(clientData.edad),
        direccion: ciudadFinal,
        ciudad: ciudadFinal
      },
      cotizacionData: {
        ...cotizacionData,
        plan_id: parseInt(cotizacionData.plan_id),
        monotributo_categoria: cotizacionData.tipo_ingreso === 'Monotributo' ? cotizacionData.monotributo_categoria : null,
        monotributo_adherentes: cotizacionData.tipo_ingreso === 'Monotributo' ? (parseInt(cotizacionData.monotributo_adherentes) || 0) : 0,
        aporte_obra_social: cotizacionData.tipo_ingreso === 'Obligatorio' ? (parseFloat(cotizacionData.aporte_obra_social) || 0) : 0,

        descuento_comercial_pct: parseFloat(cotizacionData.descuento_comercial_pct) || 0,
        descuento_afinidad_pct: parseFloat(cotizacionData.descuento_afinidad_pct) || 0,
        descuento_tarjeta_pct: parseFloat(cotizacionData.descuento_tarjeta_pct) || 0
      },
      miembrosData: miembros.map(m => ({ parentesco: m.parentesco, edad: parseInt(m.edad) }))
    };
  };

  const handleNext = async () => {
    if (activeStep === 0 && !validateClientData()) return;
    if (activeStep === 1) {
      if (!validateCotizacionData()) return;
      setLoading(true); setLoadingMessage("Procesando..."); setError(null);
      try {
        const payload = buildPayload();
        const calcData = await calculateCotizacion(payload);
        await new Promise(r => setTimeout(r, 1000));
        setCalculatedSummary(calcData);
        setActiveStep(prev => prev + 1);
      } catch (err) {
        console.error("Error cálculo:", err);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setNotification({ isOpen: true, variant: 'error', title: 'Sesión Expirada', message: 'Su sesión ha caducado. Será redirigido al login.', confirmText: 'Aceptar', onConfirm: () => navigate('/login') });
        } else {
          setNotification({ isOpen: true, variant: 'error', title: 'Error de Cálculo', message: err.response?.data?.message || err.message, confirmText: 'Aceptar' });
        }
      } finally { setLoading(false); }
    } else { setActiveStep(prev => prev + 1); }
  };

  const handleGenerateCotizacion = async () => {
    setLoading(true); setLoadingMessage("Guardando..."); setError(null);
    try {
      const basePayload = buildPayload();
      const payloadToSave = {
        clienteData: basePayload.clienteData,
        cotizacionData: { ...basePayload.cotizacionData, ...calculatedSummary.cotizacionCalculada },
        miembrosData: calculatedSummary.miembrosConPrecios,
      };

      const result = await createCotizacion(payloadToSave);

      setSuccessModal({ open: true, cotizacionId: result.id, message: 'Cotización generada con éxito.' });
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        setNotification({ isOpen: true, variant: 'error', title: 'Sesión Expirada', message: 'Su sesión ha caducado. Será redirigido al login.', confirmText: 'Aceptar', onConfirm: () => navigate('/login') });
      } else {
        const msg = err.response?.data?.message || err.message || "Error desconocido";
        setNotification({ isOpen: true, variant: 'error', title: 'Error al Guardar', message: msg, confirmText: 'Aceptar' });
      }
    } finally { setLoading(false); }
  };

  const handleDownloadFromSuccess = async () => {
    if (!successModal.cotizacionId) return;
    let toastId;
    try {
      toastId = toast.loading('Generando PDF...');
      const blob = await downloadCotizacionPDF(successModal.cotizacionId);
      toast.dismiss(toastId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = `Cotizacion_${successModal.cotizacionId}.pdf`;
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      if (toastId) toast.dismiss(toastId);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        setNotification({ isOpen: true, variant: 'error', title: 'Sesión Expirada', message: 'Su sesión ha caducado. Será redirigido al login.', confirmText: 'Aceptar', onConfirm: () => navigate('/login') });
      } else {
        const msg = error.response?.data?.message || "Error al descargar.";
        setNotification({ isOpen: true, variant: 'error', title: 'Error PDF', message: msg, confirmText: 'OK' });
      }
    }
  };

  const handleBack = () => setActiveStep(p => p - 1);
  const handleCotizacionChange = (f, v) => setCotizacionData(p => ({ ...p, [f]: v }));
  const handleMiembroChange = (i, f, v) => setMiembros(p => { const n = [...p]; n[i] = { ...n[i], [f]: v }; if (i === 0 && f === 'edad') setClientData(d => ({ ...d, edad: v })); return n; });
  const handleAddMiembro = () => setMiembros(p => [...p, { parentesco: '', edad: '' }]);
  const handleRemoveMiembro = (i) => { if (i > 0) setMiembros(p => p.filter((_, idx) => idx !== i)); };
  const handleCloseSuccess = () => {
    setSuccessModal({ open: false, cotizacionId: null, message: '' });
    
    if (location.state?.fromList) navigate('/mis-cotizaciones', { state: { updated: successModal.cotizacionId } });
    else resetWizard();
  };
  const handleGoToList = () => navigate('/mis-cotizaciones');

  const resetWizard = () => {
    setActiveStep(0); setCanProceed(false); setIsExistingClient(false); setVerifyResult(null); setIsEditMode(false); setEditingId(null); setCalculatedSummary(null);
    setClientData({ dni: '', nombres: '', apellidos: '', email: '', telefono: '', ciudad: '', direccion: '', edad: '' });
    setCotizacionData({ tipo_ingreso: '', plan_id: '', es_casado: false, aporte_obra_social: '', monotributo_categoria: '', monotributo_adherentes: 0, descuento_comercial_pct: 0, descuento_afinidad_pct: 0, descuento_tarjeta_pct: 0 });
    setMiembros([{ parentesco: 'Titular', edad: '' }]);
  };

  const selectedPlan = planes.find(p => p.id === parseInt(cotizacionData.plan_id));
  const planNombre = selectedPlan ? selectedPlan.nombre : '';

  if (loading) return <LoadingScreen message={loadingMessage} />;

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ color: 'primary.contrastText' }}>
        {isEditMode ? `Nueva Cotización (basada en #${editingId})` : 'Nueva Cotización'}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}><Stepper activeStep={activeStep} sx={{ width: '80%', '& .MuiStepLabel-label': { color: 'rgba(255,255,255,0.7)' }, '& .MuiStepLabel-label.Mui-active': { color: '#fff', fontWeight: 'bold' } }}>{steps.map((l) => <Step key={l}><StepLabel>{l}</StepLabel></Step>)}</Stepper></Box>
     
      <Box sx={{ mb: 4 }}>
        {activeStep === 0 && <QuoterClientForm clientData={clientData} errors={clientErrors} onChange={handleClientDataChange} isExistingClient={isExistingClient && !isEditMode} onSearchDni={handleSearchDni} isSearchMode={!canProceed && !isEditMode} />}
        {activeStep === 1 && <Box sx={{ maxWidth: '750px', mx: 'auto' }}><QuoterMainForm cotizacionData={cotizacionData} miembros={miembros} planes={planes} onCotizacionChange={handleCotizacionChange} onMiembroChange={handleMiembroChange} onAddMiembro={handleAddMiembro} onRemoveMiembro={handleRemoveMiembro} /></Box>}
        {activeStep === 2 && <Box sx={{ maxWidth: '900px', mx: 'auto' }}><QuoterSummary clientData={clientData} cotizacionData={calculatedSummary ? calculatedSummary.cotizacionCalculada : cotizacionData} miembros={calculatedSummary ? calculatedSummary.miembrosConPrecios : miembros} planNombre={planNombre} isFinalSummary={false} /></Box>}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
        {activeStep > 0 && <Button onClick={handleBack} startIcon={<ArrowBackIcon />} variant="contained" sx={{ bgcolor: 'grey.400', '&:hover': { bgcolor: 'grey.500' } }}>Atrás</Button>}
       
        {activeStep < steps.length - 1
          ? <Button variant="contained" color="primary" onClick={handleNext} endIcon={<ArrowForwardIcon />} disabled={!canProceed && !isEditMode}>Siguiente</Button>
          : <Button variant="contained" color="success" onClick={handleGenerateCotizacion} startIcon={<SaveIcon />}>Generar Cotización</Button>}
      </Box>

      <ConfirmDialog
        open={notification.isOpen}
        onClose={() => setNotification({ ...notification, isOpen: false })}
        onConfirm={notification.onConfirm || (() => setNotification({ ...notification, isOpen: false }))}
        title={notification.title} message={notification.message} variant={notification.variant} confirmText={notification.confirmText}
        showCancel={!!notification.onClose}
      />

      <Dialog open={successModal.open} onClose={handleCloseSuccess} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: 'success.main', color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}><CheckCircleIcon /> ¡Éxito!</DialogTitle>
        <DialogContent sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>{successModal.message}</Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>La cotización N° <strong>{successModal.cotizacionId}</strong> ha sido guardada.</Typography>
          <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button variant="outlined" color="primary" startIcon={<ListIcon />} onClick={handleGoToList}>Ver en Mis Cotizaciones</Button>
            <Button variant="outlined" color="secondary" startIcon={<PictureAsPdfIcon />} onClick={handleDownloadFromSuccess}>Descargar PDF</Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}><Button onClick={handleCloseSuccess} startIcon={<AddIcon />}>Nueva Cotización</Button></DialogActions>
      </Dialog>
    </Box>
  );
}

export default QuoterPage;