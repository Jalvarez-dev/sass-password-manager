/**
 * Cliente HTTP base para la API
 * Maneja autenticación, errores y configuración global
 */
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:8000'

class ApiClient{
  constructor(){
    this.baseURL=API_BASE_URL
  }

  /**
   * Realiza una petición HTTP
   * @param {string} endpoint - Ruta del endpoint (ej: /api/v1/users/)
   * @param {Object} options - Opciones de fetch
   * @returns {Promise<any>} - Respuesta parseada
   */
  async request(endpoint, options={}){
    const url=`${this.baseURL}${endpoint}`
    const token=localStorage.getItem('access_token')

    const config={
      headers:{
        'Content-Type': 'application/json',
        ...(token && {
          'Authorization':`Bearer ${token}`
        }),
        ...options.headers
      },
      ...options
    }

    //convertimos body a JSON si es un objeto
    if (config.body && typeof config.body === 'object'){
      config.body=JSON.stringify(config.body)
    }

    const response=await fetch(url,config)

    if (response.status === 401){
      localStorage.removeItem('access_token')
      localStorage.removeItem('token_type')
      // Usar window.dispatchEvent para notificar al router
      window.dispatchEvent(new CustomEvent('unauthorized'))
      throw new Error('Sesion expirada')
    }
    if (!response.ok){
      const error = await response.json().catch(()=>({}))
      throw new Error(error.detail?.[0]?.msg || 'Error en la peticion');
    }

    return response.status !== 204 ? await response.json() : null
  }

  // Métodos HTTP convenience

  /**
   * GET request
   * @param {string} endpoint 
   * @returns {Promise<any>}
   */
  get(endpoint){
    return this.request(endpoint, {method: 'GET'})
  }

  /**
   * POST request
   * @param {string} endpoint 
   * @param {Object} body 
   * @returns {Promise<any>}
   */
  post(endpoint, body){
    return this.request(endpoint, {method:'POST',body})
  }

  /**
   * PUT request
   * @param {string} endpoint 
   * @param {Object} body 
   * @returns {Promise<any>}
   */
  put(endpoint, body){
    //idenpotente actualiza todo el recurso solo una vez
    return this.request(endpoint,{method:'PUT',body})
  }

  /**
   * PATCH request
   * @param {string} endpoint 
   * @param {Object} body 
   * @returns {Promise<any>}
   */
  patch(endpoint, body) {
    //actualizacion parcial
    return this.request(endpoint, { 
      method: 'PATCH', 
      body 
    });
  }

  /**
   * DELETE request
   * @param {string} endpoint 
   * @returns {Promise<any>}
   */
  delete(endpoint){
    return this.request(endpoint, {method:'DELETE'})
  }
}
export const apiClient=new ApiClient()
