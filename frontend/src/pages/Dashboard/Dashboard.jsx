/**
 * Dashboard - Página principal del vault
 * Muestra estadísticas, filtros y lista de contraseñas
 */

import { useState } from 'react';
import { useVault } from '../../contexts/VaultContext';
import { MainLayout } from '../../components/layout/MainLayout/MainLayout';
import { StatsWidget } from '../../components/vault/StatsWidget/StatsWidget';
import { CategoryFilter } from '../../components/vault/CategoryFilter/CategoryFilter';
import { PasswordList } from '../../components/vault/PasswordList/PasswordList';
import { AddPasswordModal } from '../../components/vault/AddPasswordModal/AddPasswordModal';
import { Button } from '../../components/common/Button/Button';
import { EmptyState } from '../../components/common/EmptyState/EmptyState';
import './Dashboard.css';

export const Dashboard = () => {
  const { filteredPasswords, loading } = useVault();
  const [showAddModal, setShowAddModal] = useState(false);

  const handleEdit = (password) => {
    console.log('Editar:', password);
    // TODO: Implementar edición
  };

  const handleDelete = (id) => {
    console.log('Eliminar:', id);
    // TODO: Implementar eliminación con confirmación
  };

  return (
    <MainLayout>
      <div className="dashboard">
        {/* Header del dashboard */}
        <div className="dashboard__header">
          <div className="dashboard__title-section">
            <h1 className="dashboard__title">Mi Vault</h1>
            <p className="dashboard__subtitle">
              Gestiona tus contraseñas de forma segura
            </p>
          </div>
          
          <Button 
            variant="primary"
            leftIcon="+"
            onClick={() => setShowAddModal(true)}
            className="dashboard__add-btn"
          >
            Nueva Contraseña
          </Button>
        </div>

        {/* Estadísticas */}
        <StatsWidget />

        {/* Filtros de categoría */}
        <div className="dashboard__filters">
          <CategoryFilter />
        </div>

        {/* Lista de contraseñas */}
        <div className="dashboard__content">
          {loading ? (
            <div className="dashboard__loading">
              Cargando...
            </div>
          ) : filteredPasswords.length === 0 ? (
            <EmptyState
              icon="🔐"
              title="Tu vault está vacío"
              description="Comienza agregando tu primera contraseña. Estará cifrada y protegida."
              action={true}
              actionLabel="Agregar primera contraseña"
              onAction={() => setShowAddModal(true)}
            />
          ) : (
            <PasswordList 
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      {/* Modal para agregar contraseña */}
      <AddPasswordModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </MainLayout>
  );
};

export default Dashboard;