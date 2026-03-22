/**
 * useDebounce - Retrasar la ejecución de un valor cambiante
 * Útil para búsquedas en tiempo real
 * @param {*} value - Valor a debounce
 * @param {number} delay - Retraso en ms (default: 500)
 * @returns {*} - Valor debounced
 */

import { useState, useEffect } from 'react';

export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Configurar timeout
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpiar timeout si el valor cambia antes del delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;