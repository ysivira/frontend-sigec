//============================================================================
// CONFIGURACIÓN CENTRALIZADA DE AXIOS 
//============================================================================
/**
 * @fileoverview Configuración centralizada de Axios.
 * @description
 * Este módulo exporta una instancia de Axios pre-configurada para interactuar
 * con el backend de la aplicación. La configuración incluye la URL base de la API
 * y un interceptor de peticiones para adjuntar automáticamente el token de
 * autenticación en las cabeceras de cada solicitud.
 */

import axios from 'axios';

/**
 * Instancia de Axios configurada para las llamadas a la API.
 * @type {import('axios').AxiosInstance}
 */
const apiClient = axios.create({
  /**
   * La URL base del backend. Todas las peticiones hechas con esta instancia
   * serán prefijadas con esta URL.
   */
  baseURL: 'http://localhost:5000/api', 
});

// Interceptor para adjuntar el token en cada petición
apiClient.interceptors.request.use(
  (config) => {
    // Intenta obtener el token de autenticación desde localStorage o sessionStorage.
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    
    if (token) {
      // Si se encuentra un token, se añade a la cabecera 'Authorization'
      // de la petición con el esquema 'Bearer'.
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // En caso de un error en la configuración de la petición, se rechaza la promesa.
    return Promise.reject(error);
  }
);

export default apiClient;