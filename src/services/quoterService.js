//============================================================================
// SERVICIO DE API PARA COTIZACIONES 
//============================================================================
/**
 * @fileoverview Capa de servicio para las operaciones del módulo de cotizaciones.
 *
 * @description
 * Este módulo centraliza y exporta todas las funciones que interactúan con los
 * endpoints de la API relacionados con la creación, consulta y gestión de cotizaciones.
 */

import apiClient from '../api/axiosConfig';

/**
 * Verifica si un cliente existe por DNI
 * @param {string} dni - DNI del cliente a verificar
 * @returns {Promise<Object>} Datos del cliente o información de cotización existente
 */
export const verifyClientByDni = async (dni) => {
  const response = await apiClient.get(`/cotizaciones/verify-dni/${dni}`);
  return response.data;
};

/**
 * Obtiene todos los planes activos
 * @returns {Promise<Array>} Lista de planes activos
 */
export const getActivePlans = async () => {
  const response = await apiClient.get('/plans/active');
  return response.data;
};

/**
 * Obtiene la lista de precios para un plan y tipo de ingreso específico
 * @param {number} planId - ID del plan
 * @param {string} tipoIngreso - Tipo de ingreso (Obligatorio/Voluntario)
 * @returns {Promise<Array>} Lista de precios
 */
export const getPriceList = async (planId, tipoIngreso) => {
  const response = await apiClient.get(`/pricelists/plan/${planId}/${tipoIngreso}`);
  return response.data;
};

/**
 * Crea una nueva cotización
 * @param {object} cotizacionData - Datos completos de la cotización
 * @returns {Promise<Object>} Cotización creada
 */
export const createCotizacion = async (cotizacionData) => {
  const response = await apiClient.post('/cotizaciones', cotizacionData);
  return response.data;
};

/**
 * Envía los datos de una cotización para obtener un cálculo previo.
 * @param {object} payload - Los datos de la cotización a calcular.
 * @returns {Promise<object>} El resultado del cálculo de la cotización.
 */
export const calculateCotizacion = async (payload) => {
  try {
    const response = await apiClient.post('/cotizaciones/calculate', payload);
    return response.data;
  } catch (error) {
    console.error('Error en el servicio de cálculo de cotización:', error.response || error);
    throw error;
  }
};

/**
 * Obtiene todas las cotizaciones del asesor logueado
 * @returns {Promise<Array>} Lista de cotizaciones
 */
export const getMisCotizaciones = async () => {
  const response = await apiClient.get('/cotizaciones/asesor');
  return response.data;
};

/**
 * Obtiene una cotización por ID
 * @param {number} id - ID de la cotización
 * @returns {Promise<object>} Cotización completa
 */
export const getCotizacionById = async (id) => {
  const response = await apiClient.get(`/cotizaciones/${id}`);
  return response.data;
};

/**
 * Actualiza una cotización existente
 * @param {number} id - ID de la cotización
 * @param {object} cotizacionData - Datos actualizados
 * @returns {Promise<Object>} Cotización actualizada
 */
export const updateCotizacion = async (id, cotizacionData) => {
  const response = await apiClient.put(`/cotizaciones/${id}`, cotizacionData);
  return response.data;
};

/**
 * Anula una cotización
 * @param {number} id - ID de la cotización
 * @returns {Promise<object>} Confirmación de anulación
 */
export const anularCotizacion = async (id) => {
  const response = await apiClient.put(`/cotizaciones/anular/${id}`);
  return response.data;
};

/**
 * Descarga el PDF de una cotización
 * @param {number} id - ID de la cotización
 * @returns {Promise<Blob>} Blob del PDF
 */
export const downloadCotizacionPDF = async (id) => {
  const response = await apiClient.get(`/cotizaciones/${id}/pdf`, {
    responseType: 'blob'
  });
  return response.data;
};