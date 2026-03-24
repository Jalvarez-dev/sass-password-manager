/**
 * AddPasswordModal - Modal para crear nueva contraseña
 * Incluye formulario completo con generador integrado
 */

import { useState } from 'react';
import { useForm } from '../../../hooks/useForm';
import { useVault } from '../../../contexts/VaultContext';
import { useNotification } from '../../../contexts/NotificationContext';
import { Modal } from '../../common/Modal/Modal';
import { Button } from '../../common/Button/Button';
import { Input } from '../../common/Input/Input';
import { PasswordInput } from '../../common/PasswordInput/PasswordInput';
import { AddCategoryModal } from '../AddCategoryModal/AddCategoryModal';
import './AddPasswordModal.css';

export const AddPasswordModal = ({ isOpen, onClose }) => {
  const { categories, createPassword, refreshData } = useVault();
  const { success, error } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // Validación del formulario
  const validate = (values) => {
    const errors = {};
    if (!values.site_name?.trim()) {
      errors.site_name = 'El nombre del sitio es requerido';
    }
    if (!values.username_attr?.trim()) {
      errors.username_attr = 'El usuario es requerido';
    }
    if (!values.password_plain?.trim()) {
      errors.password_plain = 'La contraseña es requerida';
    }
    if (values.password_plain && values.password_plain.length < 8) {
      errors.password_plain = 'Mínimo 8 caracteres';
    }
    return errors;
  };

  // Submit del formulario
  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const result = await createPassword({
        site_name: values.site_name,
        url: values.url || '',
        username_attr: values.username_attr,
        password_plain: values.password_plain,
        description: values.description || '',
        category_id: values.category_id ? parseInt(values.category_id) : 1,
      });

      if (result.success) {
        success(`Contraseña para ${values.site_name} guardada correctamente`);
        reset();
        onClose();
        refreshData();
      } else {
        error(result.error || 'Error al guardar la contraseña');
      }
    } catch (err) {
      error('Error inesperado al guardar');
    } finally {
      setIsSubmitting(false);
    }
  };

  const { values, errors, handleChange, handleSubmit, reset } = useForm({
    initialValues: {
      site_name: '',
      url: '',
      username_attr: '',
      password_plain: '',
      description: '',
      category_id: '',
    },
    validate,
    onSubmit,
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Agregar Nueva Contraseña"
      size="medium"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            loading={isSubmitting}
          >
            Guardar Contraseña
          </Button>
        </>
      }
    >
      <form className="add-password-form" onSubmit={handleSubmit}>
        <Input
          label="Nombre del sitio"
          name="site_name"
          placeholder="ej. Netflix, Gmail, GitHub"
          value={values.site_name}
          onChange={handleChange}
          error={errors.site_name}
          required
        />

        <Input
          label="URL del sitio"
          name="url"
          type="url"
          placeholder="https://..."
          value={values.url}
          onChange={handleChange}
          error={errors.url}
        />

        <Input
          label="Nombre de usuario / Email"
          name="username_attr"
          placeholder="usuario@ejemplo.com"
          value={values.username_attr}
          onChange={handleChange}
          error={errors.username_attr}
          required
        />

        <PasswordInput
          label="Contraseña"
          name="password_plain"
          value={values.password_plain}
          onChange={handleChange}
          error={errors.password_plain}
          showGenerator={true}
          required
        />

        <Input
          label="Descripción (opcional)"
          name="description"
          placeholder="Notas sobre esta contraseña"
          value={values.description}
          onChange={handleChange}
          error={errors.description}
        />

        <div className="form-field">
          <div className="form-field__label-row">
            <label className="form-field__label">Categoría (opcional)</label>
            <button 
              type="button" 
              className="form-field__add-btn"
              onClick={() => setShowCategoryModal(true)}
              title="Crear nueva categoría"
            >
              + Nueva
            </button>
          </div>
          <select
            name="category_id"
            className="form-field__select"
            value={values.category_id}
            onChange={handleChange}
          >
            <option value="">Sin categoría</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </form>

      <AddCategoryModal 
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
      />
    </Modal>
  );
};

export default AddPasswordModal;