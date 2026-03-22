/**
 * VaultContext - Gestión global del vault de contraseñas
 * Maneja contraseñas, categorías, filtros y operaciones CRUD
 */

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { vaultService } from '../api/vaultService';
import { useAuth } from './AuthContext';

const VaultContext = createContext(null);

export const useVault = () => {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error('useVault debe usarse dentro de VaultProvider');
  }
  return context;
};

export const VaultProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  const [passwords, setPasswords] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [passwordsData, categoriesData] = await Promise.all([
        vaultService.passwords.getAll(),
        vaultService.categories.getAll(),
      ]);
      
      setPasswords(passwordsData);
      setCategories(categoriesData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || 'Error al cargar el vault');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    } else {
      setPasswords([]);
      setCategories([]);
      setSelectedCategory(null);
      setSearchQuery('');
    }
  }, [isAuthenticated, loadData]);

  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  /**
   * Filtrar contraseñas según búsqueda y categoría
   */
  const filteredPasswords = useMemo(() => {
    let result = passwords;

    // Filtrar por categoría
    if (selectedCategory) {
      result = result.filter(p => p.category_id === selectedCategory);
    }

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.site_name.toLowerCase().includes(query) ||
        p.username_attr.toLowerCase().includes(query) ||
        (p.url && p.url.toLowerCase().includes(query))
      );
    }

    return result;
  }, [passwords, selectedCategory, searchQuery]);

  /**
   * Estadísticas del vault
   */
  const stats = useMemo(() => {
    const now = new Date();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    
    return {
      total: passwords.length,
      totalCategories: categories.length,
      expiringSoon: passwords.filter(p => {
        if (!p.expires_at) return false;
        const expiry = new Date(p.expires_at);
        return expiry > now && (expiry - now) < sevenDays;
      }).length,
      expired: passwords.filter(p => {
        if (!p.expires_at) return false;
        return new Date(p.expires_at) < now;
      }).length,
      withoutCategory: passwords.filter(p => !p.category_id).length,
    };
  }, [passwords, categories]);

  /**
   * Crear nueva categoría
   */
  const createCategory = useCallback(async (categoryData) => {
    setLoading(true);
    try {
      const newCategory = await vaultService.categories.create(categoryData);
      setCategories(prev => [...prev, newCategory]);
      return { success: true, data: newCategory };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Crear nueva contraseña
   */
  const createPassword = useCallback(async (passwordData) => {
    setLoading(true);
    try {
      const newPassword = await vaultService.passwords.create(passwordData);
      setPasswords(prev => [...prev, newPassword]);
      return { success: true, data: newPassword };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Actualizar contraseña existente
   * Nota: Requiere endpoint PUT en backend
   */
  const updatePassword = useCallback(async (id, updates) => {
    setLoading(true);
    try {
      // Cuando el backend tenga el endpoint:
      // const updated = await vaultService.passwords.update(id, updates);
      
      // Por ahora, simulamos actualización local
      setPasswords(prev => prev.map(p => 
        p.id === id ? { ...p, ...updates } : p
      ));
      
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Eliminar contraseña
   * Nota: Requiere endpoint DELETE en backend
   */
  const deletePassword = useCallback(async (id) => {
    setLoading(true);
    try {
      // Cuando el backend tenga el endpoint:
      // await vaultService.passwords.delete(id);
      
      setPasswords(prev => prev.filter(p => p.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtener contraseñas por categoría específica
   */
  const getPasswordsByCategory = useCallback((categoryId) => {
    return passwords.filter(p => p.category_id === categoryId);
  }, [passwords]);

  /**
   * Obtener nombre de categoría por ID
   */
  const getCategoryName = useCallback((categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Sin categoría';
  }, [categories]);

  /**
   * Limpiar filtros
   */
  const clearFilters = useCallback(() => {
    setSelectedCategory(null);
    setSearchQuery('');
  }, []);

  const value = {
    // Datos
    passwords,
    categories,
    filteredPasswords,
    stats,
    
    // Estados de UI
    loading,
    error,
    selectedCategory,
    searchQuery,
    lastUpdated,
    
    // Setters
    setSelectedCategory,
    setSearchQuery,
    
    // Acciones
    refreshData,
    createCategory,
    createPassword,
    updatePassword,
    deletePassword,
    getPasswordsByCategory,
    getCategoryName,
    clearFilters,
  };

  return (
    <VaultContext.Provider value={value}>
      {children}
    </VaultContext.Provider>
  );
};

export default VaultContext;