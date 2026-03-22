/**
 * PasswordCard - Tarjeta de visualización de una contraseña
 * Muestra sitio, usuario, contraseña (con toggle), y acciones
 */

import { useState } from 'react';
import { useCopyToClipboard } from '../../../hooks/useCopyToClipboard';
import { Button } from '../../common/Button/Button';
import './PasswordCard.css';

export const PasswordCard = ({ data, onEdit, onDelete }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { copied: copiedUser, copy: copyUser } = useCopyToClipboard(2000);
  const { copied: copiedPass, copy: copyPass } = useCopyToClipboard(2000);

  // Calcular días hasta expiración
  const getExpiryStatus = () => {
    if (!data.expires_at) return null;
    const days = Math.ceil((new Date(data.expires_at) - new Date()) / (1000 * 60 * 60 * 24));
    if (days < 0) return { text: 'Expirada', class: 'expired' };
    if (days <= 7) return { text: `${days}d`, class: 'warning' };
    return null;
  };

  const expiry = getExpiryStatus();

  // Obtener dominio para favicon
  const getDomain = (url) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  const domain = getDomain(data.url);
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

  return (
    <div className={`password-card ${expiry?.class || ''}`}>
      {/* Header con icono e info */}
      <div className="password-card__header">
        <div className="password-card__icon">
          <img 
            src={faviconUrl} 
            alt="" 
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <span className="password-card__icon-fallback">
            {(data.site_name?.[0] || '?').toUpperCase()}
          </span>
        </div>
        
        <div className="password-card__info">
          <h3 className="password-card__site">{data.site_name}</h3>
          <a 
            href={data.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="password-card__url"
          >
            {domain}
          </a>
        </div>

        {expiry && (
          <span className={`password-card__expiry password-card__expiry--${expiry.class}`}>
            {expiry.text}
          </span>
        )}
      </div>

      {/* Credenciales */}
      <div className="password-card__credentials">
        {/* Usuario */}
        <div className="password-card__field">
          <label className="password-card__label">Usuario</label>
          <div className="password-card__value-row">
            <span className="password-card__value">{data.username_attr}</span>
            <button
              className={`password-card__copy ${copiedUser ? 'copied' : ''}`}
              onClick={() => copyUser(data.username_attr)}
              title="Copiar usuario"
            >
              {copiedUser ? '✓' : '📋'}
            </button>
          </div>
        </div>

        {/* Contraseña */}
        <div className="password-card__field">
          <label className="password-card__label">Contraseña</label>
          <div className="password-card__value-row">
            <span className={`password-card__value ${!showPassword ? 'masked' : ''}`}>
              {showPassword ? data.password_decrypted : '••••••••••••'}
            </span>
            <div className="password-card__actions">
              <button
                className="password-card__toggle"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Ocultar' : 'Mostrar'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
              <button
                className={`password-card__copy ${copiedPass ? 'copied' : ''}`}
                onClick={() => copyPass(data.password_decrypted)}
                title="Copiar contraseña"
              >
                {copiedPass ? '✓' : '📋'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer con acciones */}
      <div className="password-card__footer">
        <Button 
          variant="ghost" 
          size="small"
          onClick={() => onEdit?.(data)}
        >
          ✏️ Editar
        </Button>
        <Button 
          variant="ghost" 
          size="small"
          onClick={() => onDelete?.(data.id)}
          className="password-card__delete"
        >
          🗑️ Eliminar
        </Button>
      </div>
    </div>
  );
};

export default PasswordCard;