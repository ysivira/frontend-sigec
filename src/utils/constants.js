//============================================================================
// CONSTANTES DEL FRONTEND
//============================================================================
/**
 * @file constants.js
 * @description Constantes de negocio utilizadas en el frontend para roles, estados,
 * tipos de ingreso y la estructura de rangos etarios para la carga de precios.
 *
 */

/**
 * @const {Object} ROLES
 * @description Roles de los empleados en el sistema.
 */
export const ROLES = {
  ADMINISTRADOR: 'administrador',
  SUPERVISOR: 'supervisor',
  ASESOR: 'asesor',
};

/**
 * @const {Object} ESTADOS_EMPLEADO
 * @description Estados internos de los empleados.
 */
export const ESTADOS_EMPLEADO = {
  ACTIVO: 'activo',
  INACTIVO: 'inactivo',
};

/**
 * @const {Object} TIPOS_INGRESO
 * @description Tipos de ingreso que definen el tipo de lista de precios a utilizar.
 */
export const TIPOS_INGRESO = {
  OBLIGATORIO: 'Obligatorio',
  VOLUNTARIO: 'Voluntario',
  MONOTRIBUTO: 'Monotributo'
};

/**
 * @const {Object} TIPOS_LISTA
 * @description Tipos de listas (más general, para planes).
 */
export const TIPOS_LISTA = {
  OBLIGATORIA: 'Obligatoria',
  VOLUNTARIA: 'Voluntaria',
};

// ESTRUCTURA DE RANGOS ETARIOS (PARA UI Y CÁLCULO)

/**
 * @function parseRange
 * @description Función helper para convertir la etiqueta de rango (string) en límites numéricos (min/max).
 * @param {string} label - La etiqueta original del rango (ej: 'MAT 0-25').
 * @param {string} str - La parte numérica del string (ej: '0-25').
 * @returns {Object} Un objeto con { label, min, max }.
 */
const parseRange = (label, str) => {
    // Caso especial para "FAMILIAR A CARGO" o rangos sin formato min-max
    if (!str || !str.includes('-')) {
      const num = parseInt(str) || 0;
      if (label.includes('FAMILIAR')) return { label, min: 0, max: 99 };
      if (num > 0) return { label, min: num, max: num };
      return { label, min: 0, max: 99 };
    }

    const parts = str.split(' ');
    const rangeStr = parts[parts.length - 1];
    const [minStr, maxStr] = rangeStr.split('-');
    
    const min = parseInt(minStr) || 0;
    // Maneja "00" como 99 (edad máxima o infinito)
    const max = (maxStr === '00') ? 99 : (parseInt(maxStr) || 0);

    return { label, min, max };
};

/**
 * @const {Array<string>} rangosStrings
 * @description Lista maestra de etiquetas de rangos etarios utilizadas en el negocio.
 */
const rangosStrings = [
    // Titulares
    '0-25', '26-35', '36-40', '41-50', '51-60', '61-65', '66-00', 
    // Matrimonios
    'MAT 0-25', 'MAT 26-35', 'MAT 36-40', 'MAT 41-50', 'MAT 51-60', 'MAT 61-65', 'MAT 66-00', 
    // Hijos
    'HIJO 0-1', 'HIJO 2-20', 'HIJO 21-29', 'HIJO 30-39', 'HIJO 40-49', 
    // Otros
    'FAMILIAR A CARGO' 
];

/**
 * @const {Array<Object>} RANGOS_ETARIOS
 * @description Estructura de rangos etarios generada a partir de `rangosStrings`.
 * Es utilizada por `BulkLoadModal.jsx` y el cotizador para iterar y validar rangos.
 * Estructura: [{ label: '0-25', min: 0, max: 25 }, ...]
 */
export const RANGOS_ETARIOS = rangosStrings.map(label => {
    // Intenta encontrar la parte numérica del rango
    const match = label.match(/(\d+-\d+)$/);
    const rangePart = match ? match[1] : null;
    
    // Caso especial para rangos no numéricos
    if (label === 'FAMILIAR A CARGO') {
        return { label: 'FAMILIAR A CARGO', min: 0, max: 99 };
    }

    if (!rangePart) {
        console.warn(`[CONSTANTS] No se pudo parsear el rango para: "${label}". Asignando 0-99.`);
        return { label, min: 0, max: 99 };
    }

    const [minStr, maxStr] = rangePart.split('-');
    const min = parseInt(minStr);
    const max = (maxStr === '00') ? 99 : parseInt(maxStr);

    // Reemplazamos 66-00 por 66+ para mejor visualización
    const finalLabel = label.includes('66-00') ? label.replace('66-00', '66+') : label;

    return { label: finalLabel, min, max };
});