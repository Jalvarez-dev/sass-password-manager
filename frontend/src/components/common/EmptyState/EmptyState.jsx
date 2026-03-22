/**
 * EmptyState - Estado vacío para listas sin datos
 * Props: icon, title, description, action
 */

import { Button } from '../Button/Button';
import './EmptyState.css';

export const EmptyState = ({
  icon = '📭',
  title = 'No hay datos',
  description = 'Parece que aún no hay nada por aquí.',
  action = null,
  actionLabel = 'Crear nuevo',
  onAction = null,
}) => {
  return (
    <div className="empty-state">
      <span className="empty-state__icon">{icon}</span>
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__description">{description}</p>
      {action && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;