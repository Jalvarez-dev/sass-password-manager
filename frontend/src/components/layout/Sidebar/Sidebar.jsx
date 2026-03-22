/**
 * Sidebar - Navegación lateral con categorías y estadísticas
 */

import { useVault } from '../../../contexts/VaultContext';
import './Sidebar.css';
import { APP_CONFIG } from '../../../utils/constants';
export const Sidebar = ({ isOpen, onClose }) => {
  const { 
    categories, 
    selectedCategory, 
    setSelectedCategory, 
    stats,
    clearFilters,
  } = useVault();

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  return (
    <>
      {/* Overlay móvil */}
      {isOpen && (
        <div className="sidebar__overlay" onClick={onClose} />
      )}

      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        {/* Navegación principal */}
        <nav className="sidebar__nav">
          <button 
            className={`sidebar__link ${!selectedCategory ? 'sidebar__link--active' : ''}`}
            onClick={clearFilters}
          >
            <span className="sidebar__link-icon">🏠</span>
            <span className="sidebar__link-text">Todas las contraseñas</span>
            <span className="sidebar__link-badge">{stats.total}</span>
          </button>

          <button className="sidebar__link">
            <span className="sidebar__link-icon">⭐</span>
            <span className="sidebar__link-text">Favoritas</span>
          </button>

          <button 
            className={`sidebar__link ${stats.expiringSoon > 0 ? 'sidebar__link--warning' : ''}`}
          >
            <span className="sidebar__link-icon">⚠️</span>
            <span className="sidebar__link-text">Expiran pronto</span>
            {stats.expiringSoon > 0 && (
              <span className="sidebar__link-badge sidebar__link-badge--warning">
                {stats.expiringSoon}
              </span>
            )}
          </button>
        </nav>

        {/* Categorías */}
        <div className="sidebar__section">
          <div className="sidebar__section-header">
            <h3 className="sidebar__section-title">Categorías</h3>
            <button className="sidebar__add-btn" title="Nueva categoría">
              +
            </button>
          </div>

          <div className="sidebar__categories">
            {categories.map(category => (
              <button
                key={category.id}
                className={`sidebar__category ${
                  selectedCategory === category.id ? 'sidebar__category--active' : ''
                }`}
                onClick={() => handleCategoryClick(category.id)}
              >
                <span className="sidebar__category-dot" />
                <span className="sidebar__category-name">{category.name}</span>
              </button>
            ))}

            {categories.length === 0 && (
              <p className="sidebar__empty">Sin categorías</p>
            )}
          </div>
        </div>

        {/* Estadísticas */}
        <div className="sidebar__stats">
          <div className="sidebar__stat">
            <span className="sidebar__stat-value">{stats.total}</span>
            <span className="sidebar__stat-label">Contraseñas</span>
          </div>
          <div className="sidebar__stat">
            <span className="sidebar__stat-value">{stats.totalCategories}</span>
            <span className="sidebar__stat-label">Categorías</span>
          </div>
        </div>

        {/* Footer */}
        <div className="sidebar__footer">
          <p className="sidebar__version">{`${APP_CONFIG.name} v${APP_CONFIG.version}`}</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;