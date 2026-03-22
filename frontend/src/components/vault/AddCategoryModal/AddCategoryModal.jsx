import { useState } from 'react';
import { useForm } from '../../../hooks/useForm';
import { useVault } from '../../../contexts/VaultContext';
import { useNotification } from '../../../contexts/NotificationContext';
import { Modal } from '../../common/Modal/Modal';
import { Button } from '../../common/Button/Button';
import { Input } from '../../common/Input/Input';
import './AddCategoryModal.css';

export const AddCategoryModal = ({ isOpen, onClose, onSuccess }) => {
  const { createCategory } = useVault();
  const { success, error } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (values) => {
    const errors = {};
    if (!values.name?.trim()) {
      errors.name = 'El nombre es requerido';
    }
    return errors;
  };

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const result = await createCategory({
        name: values.name,
        description: values.description || '',
      });

      if (result.success) {
        success(`Categoría "${values.name}" creada correctamente`);
        reset();
        onClose();
        if (onSuccess) onSuccess(result.data);
      } else {
        error(result.error || 'Error al crear la categoría');
      }
    } catch (err) {
      error('Error inesperado al crear la categoría');
    } finally {
      setIsSubmitting(false);
    }
  };

  const { values, errors, handleChange, handleSubmit, reset } = useForm({
    initialValues: {
      name: '',
      description: '',
    },
    validate,
    onSubmit,
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nueva Categoría"
      size="small"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            loading={isSubmitting}
          >
            Crear Categoría
          </Button>
        </>
      }
    >
      <form className="add-category-form" onSubmit={handleSubmit}>
        <Input
          label="Nombre de la categoría"
          name="name"
          placeholder="ej. Redes Sociales, Trabajo"
          value={values.name}
          onChange={handleChange}
          error={errors.name}
          required
        />

        <Input
          label="Descripción (opcional)"
          name="description"
          placeholder="Describe brevemente esta categoría"
          value={values.description}
          onChange={handleChange}
          error={errors.description}
        />
      </form>
    </Modal>
  );
};

export default AddCategoryModal;
