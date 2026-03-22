/**
 * ToastContainer - Contenedor de notificaciones
 * Se posiciona fijo en la pantalla
 */

import { createPortal } from 'react-dom';
import { useNotification } from '../../../contexts/NotificationContext';
import Toast from './Toast';
import './Toast.css';

export const ToastContainer = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  const container = (
    <div className="toast-container">
      {notifications.map(notification => (
        <Toast
          key={notification.id}
          notification={notification}
          onClose={removeNotification}
        />
      ))}
    </div>
  );

  return createPortal(container, document.body);
};

export default ToastContainer;