/**
 * NotificationContext - Sistema de notificaciones/toasts
 * Permite mostrar mensajes de éxito, error, advertencia e info
 */

import { createContext, useContext, useState, useCallback, useRef } from 'react';

const NotificationContext = createContext(null);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification debe usarse dentro de NotificationProvider');
  }
  return context;
};

/**
 * Tipos de notificación disponibles
 */
const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

/**
 * Duración por defecto en milisegundos
 */
const DEFAULT_DURATION = 5000;

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const idCounter = useRef(0);

  /**
   * Añadir nueva notificación
   * @param {Object} notification
   * @param {string} notification.message - Mensaje a mostrar
   * @param {string} notification.type - Tipo de notificación
   * @param {number} notification.duration - Duración en ms
   */
  const addNotification = useCallback((notification) => {
    const id = ++idCounter.current;
    const newNotification = {
      id,
      message: notification.message,
      type: notification.type || NOTIFICATION_TYPES.INFO,
      duration: notification.duration || DEFAULT_DURATION,
      createdAt: Date.now(),
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-eliminar después de la duración
    setTimeout(() => {
      removeNotification(id);
    }, newNotification.duration);

    return id;
  }, []);

  /**
   * Eliminar notificación por ID
   */
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  /**
   * Limpiar todas las notificaciones
   */
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Helpers convenience
  const success = useCallback((message, duration) => {
    return addNotification({ message, type: NOTIFICATION_TYPES.SUCCESS, duration });
  }, [addNotification]);

  const error = useCallback((message, duration) => {
    return addNotification({ message, type: NOTIFICATION_TYPES.ERROR, duration });
  }, [addNotification]);

  const warning = useCallback((message, duration) => {
    return addNotification({ message, type: NOTIFICATION_TYPES.WARNING, duration });
  }, [addNotification]);

  const info = useCallback((message, duration) => {
    return addNotification({ message, type: NOTIFICATION_TYPES.INFO, duration });
  }, [addNotification]);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;