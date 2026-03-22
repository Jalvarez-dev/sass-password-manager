/**
 * validators.js - Funciones de validación reutilizables
 */

// Email válido
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Contraseña fuerte (mínimo 8 caracteres, mayúscula, minúscula, número)
export const isStrongPassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

// URL válida
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// No vacío
export const isNotEmpty = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

// Longitud mínima
export const minLength = (value, min) => {
  return value && value.length >= min;
};

// Longitud máxima
export const maxLength = (value, max) => {
  return value && value.length <= max;
};

// Solo números
export const isNumeric = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

// Validador compuesto
export const validate = (values, rules) => {
  const errors = {};
  
  for (const [field, fieldRules] of Object.entries(rules)) {
    for (const rule of fieldRules) {
      const error = rule(values[field], values);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  }
  
  return errors;
};

// Reglas predefinidas
export const rules = {
  required: (message = 'Campo requerido') => (value) => {
    return isNotEmpty(value) ? null : message;
  },
  
  email: (message = 'Email inválido') => (value) => {
    return !value || isValidEmail(value) ? null : message;
  },
  
  min: (min, message) => (value) => {
    const msg = message || `Mínimo ${min} caracteres`;
    return !value || minLength(value, min) ? null : msg;
  },
  
  max: (max, message) => (value) => {
    const msg = message || `Máximo ${max} caracteres`;
    return !value || maxLength(value, max) ? null : msg;
  },
  
  match: (field, message) => (value, values) => {
    const msg = message || 'Los campos no coinciden';
    return value === values[field] ? null : msg;
  },
  
  url: (message = 'URL inválida') => (value) => {
    return !value || isValidUrl(value) ? null : message;
  },
};