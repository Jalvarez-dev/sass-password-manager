/**
 * Toast - Notificación individual
 */

import './Toast.css';

const ICONS = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

const Toast = ({ notification, onClose }) => {
  const { id, message, type } = notification;

  return (
    <div className={`toast toast--${type}`} role="alert">
      <span className="toast__icon">{ICONS[type]}</span>
      <span className="toast__message">{message}</span>
      <button 
        className="toast__close" 
        onClick={() => onClose(id)}
        aria-label="Cerrar notificación"
      >
        ✕
      </button>
      <div className="toast__progress" />
    </div>
  );
};

export default Toast;