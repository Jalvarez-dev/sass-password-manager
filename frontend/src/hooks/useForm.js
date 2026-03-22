/**
 * useForm - Manejo completo de formularios con validación
 * @param {Object} options - Opciones del hook
 * @param {Object} options.initialValues - Valores iniciales del formulario
 * @param {Function} options.validate - Función de validación (retorna errores)
 * @param {Function} options.onSubmit - Función a ejecutar al enviar
 * @returns {Object} - Estado y handlers del formulario
 */

import { useState, useCallback } from 'react';

export const useForm = ({ initialValues = {}, validate, onSubmit }) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Validar campo específico o todo el formulario
   */
  const validateField = useCallback((name, value) => {
    if (!validate) return null;
    
    const fieldErrors = validate({ ...values, [name]: value });
    return fieldErrors[name] || null;
  }, [validate, values]);

  /**
   * Manejar cambio en input
   */
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setValues(prev => ({
      ...prev,
      [name]: fieldValue,
    }));

    // Validar en tiempo real si el campo ya fue tocado
    if (touched[name]) {
      const error = validateField(name, fieldValue);
      setErrors(prev => ({
        ...prev,
        [name]: error,
      }));
    }
  }, [touched, validateField]);

  /**
   * Manejar blur (perder foco)
   */
  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  }, [validateField]);

  /**
   * Establecer valor programáticamente
   */
  const setValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  /**
   * Establecer múltiples valores
   */
  const setMultipleValues = useCallback((newValues) => {
    setValues(prev => ({
      ...prev,
      ...newValues,
    }));
  }, []);

  /**
   * Resetear formulario
   */
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  /**
   * Validar todo el formulario
   */
  const validateAll = useCallback(() => {
    if (!validate) return true;
    
    const formErrors = validate(values);
    setErrors(formErrors);
    
    // Marcar todos como tocados
    const allTouched = Object.keys(values).reduce((acc, key) => ({
      ...acc,
      [key]: true,
    }), {});
    setTouched(allTouched);

    return Object.keys(formErrors).length === 0;
  }, [validate, values]);

  /**
   * Manejar submit
   */
  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();

    const isValid = validateAll();
    if (!isValid) return;

    setIsSubmitting(true);
    
    try {
      await onSubmit(values);
      // No resetear automáticamente, dejar que el componente decida
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [validateAll, onSubmit, values]);

  /**
   * Verificar si el formulario es válido
   */
  const isValid = Object.keys(errors).length === 0 && 
                  Object.keys(touched).length > 0;

  return {
    // Estado
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    
    // Handlers
    handleChange,
    handleBlur,
    handleSubmit,
    
    // Acciones
    setValue,
    setMultipleValues,
    reset,
    validate: validateAll,
  };
};

export default useForm;