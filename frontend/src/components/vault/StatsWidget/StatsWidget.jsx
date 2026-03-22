/**
 * StatsWidget - Widget de estadísticas del vault
 */

import { useVault } from '../../../contexts/VaultContext';
import './StatsWidget.css';

export const StatsWidget = () => {
  const { stats } = useVault();

  const items = [
    { label: 'Total', value: stats.total, icon: '🔐', color: '#6366f1' },
    { label: 'Categorías', value: stats.totalCategories, icon: '📁', color: '#8b5cf6' },
    { label: 'Alertas', value: stats.expiringSoon, icon: '⚠️', color: '#f59e0b', warning: true },
    { label: 'Expiradas', value: stats.expired, icon: '❌', color: '#ef4444', danger: true },
  ];

  return (
    <div className="stats-widget">
      {items.map((item, index) => (
        <div 
          key={index} 
          className={`stats-widget__item ${item.warning ? 'warning' : ''} ${item.danger ? 'danger' : ''}`}
        >
          <div 
            className="stats-widget__icon"
            style={{ backgroundColor: `${item.color}20`, color: item.color }}
          >
            {item.icon}
          </div>
          <div className="stats-widget__info">
            <span className="stats-widget__value">{item.value}</span>
            <span className="stats-widget__label">{item.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsWidget;