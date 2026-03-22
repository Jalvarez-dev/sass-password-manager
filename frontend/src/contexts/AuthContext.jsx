/**
 * AuthContext - Gestión global de autenticación
 * Maneja el estado del usuario, login, logout y protección de rutas
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../api/authService';
import { userService } from '../api/userService';

// Crear el contexto
const AuthContext = createContext(null);

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

/**
 * Provider de autenticación
 * Envuelve la aplicación para proporcionar estado de auth global
 */
export const AuthProvider = ({ children }) => {
  // Estados
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Verificar sesión al cargar la aplicación
   */
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await userService.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (err) {
        // Token inválido o expirado
        localStorage.removeItem('access_token');
        localStorage.removeItem('token_type');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Iniciar sesión
   * @param {string} email 
   * @param {string} password 
   */
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      await authService.login(email, password);
      const userData = await userService.getCurrentUser();
      
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Error al iniciar sesión';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Registrar nuevo usuario
   * @param {Object} userData 
   */
  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      await userService.register(userData);
      // Auto-login después del registro
      return await login(userData.email, userData.password);
    } catch (err) {
      const errorMessage = err.message || 'Error al registrar usuario';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [login]);

  /**
   * Cerrar sesión
   */
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  /**
   * Limpiar errores
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Actualizar datos del usuario en memoria
   * @param {Object} updates 
   */
  const updateUser = useCallback((updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  }, []);

  // Valor del contexto
  const value = {
    // Estado
    user,
    isAuthenticated,
    loading,
    error,
    
    // Acciones
    login,
    register,
    logout,
    clearError,
    updateUser,
    
    // Helpers
    isLoading: loading,
    hasError: !!error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;