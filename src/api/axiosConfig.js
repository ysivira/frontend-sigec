//============================================================================
// CONFIGURACIÓN CENTRALIZADA DE AXIOS (EL "MENSAJERO")
//============================================================================
/**
 * @fileoverview Configuración centralizada de Axios.
 *
 * @description
 * Crea una "instancia" de Axios (nuestro "mensajero") que ya sabe:
 * 1. La URL base de nuestro backend.
 * 2. Cómo interceptar CADA petición para adjuntar automáticamente
 * el 'authToken' que está guardado en el localStorage/sessionStorage.
 *
 * Esto nos ahorra tener que escribir la URL completa y la lógica del
 * token en cada componente que quiera hacer una llamada a la API.
 */

import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', 
});

// Interceptor para adjuntar el token en cada petición
apiClient.interceptors.request.use(
  (config) => {
    // Buscamos el token en ambos almacenamientos 
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    
    if (token) {
      // Si hay token, lo adjuntamos a la cabecera 'Authorization'
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Si hay un error al configurar la petición, lo rechazamos
    return Promise.reject(error);
  }
);

export default apiClient;