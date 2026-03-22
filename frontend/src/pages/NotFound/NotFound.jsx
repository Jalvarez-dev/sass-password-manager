/**
 * NotFound - Página 404 para rutas no encontradas
 */

import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button/Button';
import './NotFound.css';

export const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found__content">
        <span className="not-found__icon">🔍</span>
        <h1 className="not-found__title">404</h1>
        <h2 className="not-found__subtitle">Página no encontrada</h2>
        <p className="not-found__text">
          La página que buscas no existe o ha sido movida.
        </p>
        <Link to="/">
          <Button variant="primary" size="large">
            Volver al inicio
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;