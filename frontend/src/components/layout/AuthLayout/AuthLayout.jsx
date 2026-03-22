/**
 * AuthLayout - Layout para páginas de autenticación (login/register)
 * Diseño centrado con fondo decorativo
 */

import './AuthLayout.css';

export const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="auth-layout">
      {/* Fondo decorativo */}
      <div className="auth-layout__bg">
        <div className="auth-layout__gradient" />
        <div className="auth-layout__pattern" />
      </div>

      {/* Contenido */}
      <div className="auth-layout__content">
        <div className="auth-layout__card">
          {/* Logo */}
          <div className="auth-layout__brand">
            <span className="auth-layout__logo">🔐</span>
            <h1 className="auth-layout__title">SecureVault</h1>
            <p className="auth-layout__subtitle">
              Gestor de contraseñas seguro
            </p>
          </div>

          {/* Título de página */}
          {(title || subtitle) && (
            <div className="auth-layout__header">
              {title && <h2 className="auth-layout__page-title">{title}</h2>}
              {subtitle && <p className="auth-layout__page-subtitle">{subtitle}</p>}
            </div>
          )}

          {/* Formulario/contenido */}
          <div className="auth-layout__body">
            {children}
          </div>

          {/* Footer */}
          <div className="auth-layout__footer">
            <p className="auth-layout__security">
              🔒 Tus datos están cifrados y seguros
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;