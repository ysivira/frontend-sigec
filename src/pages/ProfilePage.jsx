//============================================================================
// PÁGINA DE PERFIL DEL USUARIO 
//============================================================================
/**
 * @fileoverview Página para que el usuario edite su perfil.
 *
 * @description
 * Este componente de página actúa como un controlador para la edición del perfil
 * del usuario. Obtiene los datos del usuario autenticado a través del `AuthContext`,
 * los pasa al componente de formulario `ProfileForm` y maneja la lógica de guardado
 * al comunicarse con la API. También gestiona los estados de carga y muestra un
 * modal de éxito al finalizar la actualización.
 */


import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography 
} from '@mui/material'; 
import { toast } from 'react-hot-toast';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axiosConfig';
import ProfileForm from '../components/asesor/ProfileForm';
import LoadingScreen from '../components/common/LoadingScreen';

/**
 * @component ProfilePage
 * @description Componente de página que orquesta la visualización y edición del perfil del usuario.
 * Maneja la comunicación con la API para guardar los cambios y muestra la retroalimentación
 * correspondiente al usuario (carga, éxito).
 * @returns {JSX.Element}
 */
function ProfilePage() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [successOpen, setSuccessOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1500); 

    return () => clearTimeout(timer);
  }, []);

  // Loading inicial (carga de datos del usuario)
  if (initialLoading || !user) {
    return <LoadingScreen message="Cargando datos del perfil..." />;
  }

  const handleSave = async (dataToSend) => {
    setLoading(true); 
    
    try {
        await Promise.all([
            apiClient.put('/employees/myprofile', dataToSend),
            new Promise(resolve => setTimeout(resolve, 2000))
        ]);

        setSuccessOpen(true); 
    } catch (err) {
        if (err.response && err.response.status === 401) {
            logout();
            return;
        }
        const errorMsg = err.response?.data?.message || err.message;
        toast.error('Error al actualizar perfil: ' + errorMsg);
    } finally {
        setLoading(false); 
    }
  };

  const handleCloseModal = () => {
    setSuccessOpen(false);
  };

  if (loading) {
    return <LoadingScreen message="Actualizando datos..." />;
  }

  return (
    <Box sx={{ py: 2 }}> 
      <ProfileForm
        userData={user}
        onSave={handleSave}
        loading={loading} 
      />

      {/* MODAL VERDE DE ÉXITO */}
      <Dialog 
        open={successOpen} 
        onClose={handleCloseModal} 
        PaperProps={{ sx: { maxWidth: '320px', borderRadius: 2, m: 2 } }}
      >
        <DialogTitle sx={{ 
            bgcolor: '#43A047', color: '#FFFFFF', 
            py: 1.5, px: 2, display: 'flex', alignItems: 'center', gap: 1,
            fontSize: '1rem' 
        }}>
            <CheckCircleIcon sx={{ color: '#fff' }} fontSize="small" />
            <Typography variant="subtitle1" fontWeight="bold">Perfil Actualizado</Typography>
        </DialogTitle>
        
        <DialogContent sx={{ mt: 2, px: 2, pb: 1 }}>
            <Typography variant="body2" sx={{ color: '#333' }}>
                Tus datos han sido guardados correctamente en el sistema.
            </Typography>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button onClick={handleCloseModal} variant="contained" color="success" size="small" fullWidth>
                Aceptar
            </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ProfilePage;