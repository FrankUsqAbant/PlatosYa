// ==========================================================================
// PlatoYa - Helper para llamadas a la API del backend
// Centraliza fetch con manejo de tokens y errores
// ==========================================================================

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Función helper para hacer fetch al backend
 * @param {string} endpoint - Ruta de la API (ej: '/platos')
 * @param {object} options - Opciones de fetch + token opcional
 * @returns {Promise<any>} - Datos de la respuesta
 */
export async function apiFetch(endpoint, options = {}) {
  const { token, ...fetchOptions } = options;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Agrega el token de autorización si está disponible
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Error en la petición');
  }

  return data;
}
