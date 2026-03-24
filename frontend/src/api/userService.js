/**
 * Servicios de gestión de usuarios
 * Registro, perfil y gestión de cuenta
 */

import { apiClient } from './client';

export const userService = {
  /**
   * Registrar un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @param {string} userData.email - Email del usuario
   * @param {string} userData.password - Contraseña
   * @param {string} userData.full_name - Nombre completo
   * @returns {Promise<Object>} - Usuario creado
   */
  async register(userData) {
    return apiClient.post('/v1/users', {
      email: userData.email,
      password: userData.password,
      full_name: userData.full_name,
    });
  },

  /**
   * Obtener información del usuario actual
   * @returns {Promise<Object>} - Datos del usuario
   */
  async getCurrentUser() {
    return apiClient.get('/v1/users/me');
  },

  /**
   * Actualizar información del usuario
   * Nota: Requiere endpoint PUT/PATCH en el backend
   * @param {Object} updates - Campos a actualizar
   * @returns {Promise<Object>}
   */
  async updateProfile(updates) {
    // Si tu backend tiene endpoint de update, descomenta:
    // return apiClient.put('/v1/users/me', updates);
    throw new Error('Función no implementada en el backend');
  },

  /**
   * Cambiar contraseña del usuario
   * Nota: Requiere endpoint en el backend
   * @param {string} currentPassword 
   * @param {string} newPassword 
   * @returns {Promise<Object>}
   */
  async changePassword(currentPassword, newPassword) {
    // Si tu backend tiene endpoint de cambio de contraseña, descomenta:
    // return apiClient.post('/v1/users/me/password', {
    //   current_password: currentPassword,
    //   new_password: newPassword,
    // });
    throw new Error('Función no implementada en el backend');
  },

  /**
   * Desactivar cuenta de usuario
   * Nota: Requiere endpoint DELETE en el backend
   * @returns {Promise<void>}
   */
  async deleteAccount() {
    // Si tu backend tiene endpoint de eliminación, descomenta:
    // return apiClient.delete('/v1/users/me');
    throw new Error('Función no implementada en el backend');
  },
};

export default userService;