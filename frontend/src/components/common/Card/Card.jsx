/**
 * Card - Contenedor con estilo de tarjeta
 * Props: children, title, subtitle, actions, hoverable, onClick
 */

import './Card.css';

export const Card = ({
  children,
  title,
  subtitle,
  actions,
  hoverable = false,
  onClick,
  className = '',
  ...props
}) => {
  const classes = [
    'card',
    hoverable && 'card--hoverable',
    onClick && 'card--clickable',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={classes} 
      onClick={onClick}
      {...props}
    >
      {(title || subtitle || actions) && (
        <div className="card__header">
          <div className="card__titles">
            {title && <h3 className="card__title">{title}</h3>}
            {subtitle && <p className="card__subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="card__actions">{actions}</div>}
        </div>
      )}
      
      <div className="card__content">
        {children}
      </div>
    </div>
  );
};

export default Card;