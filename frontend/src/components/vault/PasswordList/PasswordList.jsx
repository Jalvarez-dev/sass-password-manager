/**
 * PasswordList - Grid de tarjetas de contraseñas con estados vacío y carga
 */

import { useVault } from '../../../contexts/VaultContext';
import { PasswordCard } from '../PasswordCard/PasswordCard';
import { EmptyState } from '../../common/EmptyState/EmptyState';
import { Spinner } from '../../common/Spinner/Spinner';
import './PasswordList.css';

export const PasswordList = ({ onEdit, onDelete }) => {
  const { filteredPasswords, loading, selectedCategory, clearFilters } = useVault();

  if (loading) {
    return (
      <div className="password-list__loading">
        <Spinner size="large" text="Cargando contraseñas..." />
      </div>
    );
  }

  if (filteredPasswords.length === 0) {
    return (
      <EmptyState
        icon="🔐"
        title={selectedCategory ? "Sin contraseñas en esta categoría" : "No tienes contraseñas guardadas"}
        description={
          selectedCategory 
            ? "Selecciona otra categoría o agrega una nueva contraseña aquí."
            : "Comienza agregando tu primera contraseña de forma segura."
        }
        action={true}
        actionLabel="Agregar contraseña"
        onAction={clearFilters}
      />
    );
  }

  return (
    <div className="password-list">
      <div className="password-list__grid">
        {filteredPasswords.map(password => (
          <PasswordCard
            key={password.id}
            data={password}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
      
      <p className="password-list__count">
        Mostrando {filteredPasswords.length} contraseña{filteredPasswords.length !== 1 ? 's' : ''}
      </p>
    </div>
  );
};

export default PasswordList;