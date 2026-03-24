/**
 * Servicios del Vault (Gestor de Contraseñas)
 * Maneja categorías y entradas de contraseñas
 */

import { apiClient } from './client';

// ==================== CATEGORÍAS ====================

export const categoryService = {
  /**
   * Obtener todas las categorías
   * @returns {Promise<Array<{id: number, name: string, description: string}>>}
   */
  async getAll() {
    return apiClient.get('/v1/vault/categories');
  },

  /**
   * Obtener una categoría por ID
   * Nota: Requiere endpoint GET /categories/{id} en backend
   * @param {number} id 
   * @returns {Promise<Object>}
   */
  async getById(id) {
    // Si existe endpoint específico:
    // return apiClient.get(`/v1/vault/categories/${id}`);
    
    // Alternativa: filtrar de la lista completa
    const categories = await this.getAll();
    const category = categories.find(c => c.id === id);
    if (!category) throw new Error('Categoría no encontrada');
    return category;
  },

  /**
   * Crear nueva categoría
   * @param {Object} categoryData 
   * @param {string} categoryData.name - Nombre de la categoría
   * @param {string} categoryData.description - Descripción opcional
   * @returns {Promise<Object>} - Categoría creada
   */
  async create(categoryData) {
    return apiClient.post('/v1/vault/categories', {
      name: categoryData.name,
      description: categoryData.description || '',
    });
  },

  /**
   * Actualizar categoría
   * Nota: Requiere endpoint PUT en backend
   * @param {number} id 
   * @param {Object} updates 
   * @returns {Promise<Object>}
   */
  async update(id, updates) {
    // Si existe endpoint:
    // return apiClient.put(`/v1/vault/categories/${id}`, updates);
    throw new Error('Función no implementada en el backend');
  },

  /**
   * Eliminar categoría
   * Nota: Requiere endpoint DELETE en backend
   * @param {number} id 
   * @returns {Promise<void>}
   */
  async delete(id) {
    // Si existe endpoint:
    // return apiClient.delete(`/v1/vault/categories/${id}`);
    throw new Error('Función no implementada en el backend');
  },
};

// ==================== ENTRADAS DE CONTRASEÑAS ====================

export const passwordService = {
  /**
   * Obtener todas las contraseñas del usuario (ya descifradas)
   * @returns {Promise<Array<Object>>} - Lista de contraseñas
   */
  async getAll() {
    return apiClient.get('/v1/vault/entries');
  },

  /**
   * Obtener una contraseña específica por ID
   * Nota: Requiere endpoint GET /entries/{id} en backend
   * @param {number} id 
   * @returns {Promise<Object>}
   */
  async getById(id) {
    // Si existe endpoint específico:
    // return apiClient.get(`/v1/vault/entries/${id}`);
    
    // Alternativa temporal:
    const passwords = await this.getAll();
    const password = passwords.find(p => p.id === id);
    if (!password) throw new Error('Contraseña no encontrada');
    return password;
  },

  /**
   * Crear nueva entrada de contraseña
   * @param {Object} entryData 
   * @param {string} entryData.site_name - Nombre del sitio
   * @param {string} entryData.url - URL del sitio
   * @param {string} entryData.username_attr - Nombre de usuario
   * @param {string} entryData.password_plain - Contraseña en texto plano (se cifra en backend)
   * @param {number} entryData.category_id - ID de la categoría
   * @returns {Promise<Object>} - Entrada creada con contraseña descifrada
   */
  async create(entryData) {
    return apiClient.post('/v1/vault/entries', {
      site_name: entryData.site_name,
      url: entryData.url,
      username_attr: entryData.username_attr,
      password_plain: entryData.password_plain,
      description: entryData.description,
      category_id: entryData.category_id,
    });
  },

  /**
   * Actualizar entrada de contraseña
   * Nota: Requiere endpoint PUT en backend
   * @param {number} id 
   * @param {Object} updates 
   * @returns {Promise<Object>}
   */
  async update(id, updates) {
    // Si existe endpoint:
    // return apiClient.put(`/v1/vault/entries/${id}`, updates);
    throw new Error('Función no implementada en el backend');
  },

  /**
   * Eliminar entrada de contraseña
   * Nota: Requiere endpoint DELETE en backend
   * @param {number} id 
   * @returns {Promise<void>}
   */
  async delete(id) {
    // Si existe endpoint:
    // return apiClient.delete(`/v1/vault/entries/${id}`);
    throw new Error('Función no implementada en el backend');
  },

  /**
   * Buscar contraseñas por término
   * Client-side filtering (hasta que haya endpoint de búsqueda)
   * @param {string} query - Término de búsqueda
   * @returns {Promise<Array<Object>>}
   */
  async search(query) {
    const allPasswords = await this.getAll();
    const lowerQuery = query.toLowerCase();
    
    return allPasswords.filter(p => 
      p.site_name.toLowerCase().includes(lowerQuery) ||
      p.username_attr.toLowerCase().includes(lowerQuery) ||
      p.url.toLowerCase().includes(lowerQuery)
    );
  },

  /**
   * Filtrar por categoría
   * @param {number} categoryId 
   * @returns {Promise<Array<Object>>}
   */
  async getByCategory(categoryId) {
    const allPasswords = await this.getAll();
    return allPasswords.filter(p => p.category_id === categoryId);
  },
};

// ==================== EXPORTACIÓN COMBINADA ====================

export const vaultService = {
  categories: categoryService,
  passwords: passwordService,
  
  // Helpers útiles
  async getDashboardData() {
    const [passwords, categories] = await Promise.all([
      passwordService.getAll(),
      categoryService.getAll(),
    ]);
    
    return {
      passwords,
      categories,
      totalPasswords: passwords.length,
      totalCategories: categories.length,
      expiringSoon: passwords.filter(p => {
        if (!p.expires_at) return false;
        const daysUntilExpiry = Math.ceil(
          (new Date(p.expires_at) - new Date()) / (1000 * 60 * 60 * 24)
        );
        return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
      }),
    };
  },
};

// Exportación por defecto
export default vaultService;