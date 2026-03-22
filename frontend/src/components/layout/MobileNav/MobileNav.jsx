/**
 * MobileNav - Barra de navegación inferior para móviles
 */

import { useVault } from '../../../contexts/VaultContext';
import './MobileNav.css';

export const MobileNav = ({ onAddClick }) => {
  const { stats, clearFilters, selectedCategory } = useVault();

  return (
    <nav className="mobile-nav">
      <button 
        className={`mobile-nav__item ${!selectedCategory ? 'mobile-nav__item--active' : ''}`}
        onClick={clearFilters}
      >
        <span className="mobile-nav__icon">🏠</span>
        <span className="mobile-nav__label">Inicio</span>
      </button>

      <button className="mobile-nav__item">
        <span className="mobile-nav__icon">⭐</span>
        <span className="mobile-nav__label">Favoritos</span>
      </button>

      {/* Botón flotante central */}
      <button className="mobile-nav__add" onClick={onAddClick}>
        <span>+</span>
      </button>

      <button 
        className={`mobile-nav__item ${stats.expiringSoon > 0 ? 'mobile-nav__item--warning' : ''}`}
      >
        <span className="mobile-nav__icon">⚠️</span>
        <span className="mobile-nav__label">Alertas</span>
        {stats.expiringSoon > 0 && (
          <span className="mobile-nav__badge">{stats.expiringSoon}</span>
        )}
      </button>

      <button className="mobile-nav__item">
        <span className="mobile-nav__icon">⚙️</span>
        <span className="mobile-nav__label">Más</span>
      </button>
    </nav>
  );
};

export default MobileNav;