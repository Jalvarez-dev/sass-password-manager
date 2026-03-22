/**
 * Header - Barra superior con logo, búsqueda y menú de usuario
 */

import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../common/Button/Button';
import './Header.css';

export const Header = ({ onMenuToggle, showSearch = true, onSearch }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch?.(value);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  // Obtener iniciales del nombre
  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(n => n?.[0] || '')
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  return (
    <header className="header">
      <div className="header__left">
        {/* Botón menú móvil */}
        <button 
          className="header__menu-btn"
          onClick={onMenuToggle}
          aria-label="Abrir menú"
        >
          ☰
        </button>

        {/* Logo */}
        <div className="header__logo">
          <span className="header__logo-icon">🔐</span>
          <span className="header__logo-text">SecureVault</span>
        </div>
      </div>

      {/* Barra de búsqueda */}
      {showSearch && (
        <div className="header__search">
          <span className="header__search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar contraseñas..."
            value={searchValue}
            onChange={handleSearchChange}
            className="header__search-input"
          />
          {searchValue && (
            <button 
              className="header__search-clear"
              onClick={() => {
                setSearchValue('');
                onSearch?.('');
              }}
            >
              ✕
            </button>
          )}
        </div>
      )}

      <div className="header__right">
        {/* Botón agregar rápido */}
        <Button 
          variant="primary" 
          size="small"
          className="header__add-btn"
          leftIcon="+"
        >
          <span className="header__add-text">Nueva</span>
        </Button>

        {/* Menú de usuario */}
        <div className="header__user">
          <button 
            className="header__user-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="header__avatar">
              {getInitials(user?.full_name)}
            </div>
            <span className="header__user-name">{user?.full_name}</span>
            <span className="header__user-arrow">▼</span>
          </button>

          {showUserMenu && (
            <>
              <div 
                className="header__user-overlay"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="header__user-menu">
                <div className="header__user-info">
                  <p className="header__user-email">{user?.email}</p>
                </div>
                <div className="header__menu-divider" />
                <button className="header__menu-item">
                  ⚙️ Configuración
                </button>
                <button className="header__menu-item">
                  👤 Perfil
                </button>
                <div className="header__menu-divider" />
                <button 
                  className="header__menu-item header__menu-item--danger"
                  onClick={handleLogout}
                >
                  🚪 Cerrar sesión
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;