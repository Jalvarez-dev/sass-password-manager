/**
 * Servicios de autenticación
 * Maneja login, logout y refresh de tokens
 */

import { apiClient } from './client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const authService = {
  /**
   * Iniciar sesión con OAuth2 Password flow
   * @param {string} username - Email del usuario
   * @param {string} password - Contraseña
   * @returns {Promise<{access_token: string, token_type: string}>}
   */
  async login(username, password) {
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Credenciales inválidas. Verifica tu email y contraseña.');
      }
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Error al iniciar sesión');
    }

    const data = await response.json();
    
    // Guardar token en localStorage
    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('token_type', data.token_type || 'bearer');
    }

    return data;
  },

  /**
   * Cerrar sesión - limpia el almacenamiento local
   */
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('user');
  },

  /**
   * Verificar si hay una sesión activa
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  },

  /**
   * Obtener el token actual
   * @returns {string|null}
   */
  getToken() {
    return localStorage.getItem('access_token');
  },

  /**
   * Obtener el tipo de token
   * @returns {string}
   */
  getTokenType() {
    return localStorage.getItem('token_type') || 'bearer';
  },

  /**
   * Configurar el token manualmente (útil para testing o OAuth externo)
   * @param {string} token 
   * @param {string} type 
   */
  setToken(token, type = 'bearer') {
    localStorage.setItem('access_token', token);
    localStorage.setItem('token_type', type);
  },
};

export default authService;