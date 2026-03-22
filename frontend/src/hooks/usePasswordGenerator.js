/**
 * usePasswordGenerator - Generar contraseñas seguras
 * @returns {Object} - Configuración y función de generación
 */

import { useState, useCallback } from 'react';

const CHAR_SETS = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

export const usePasswordGenerator = () => {
  const [options, setOptions] = useState({
    length: 16,
    includeLowercase: true,
    includeUppercase: true,
    includeNumbers: true,
    includeSymbols: true,
  });

  const [generatedPassword, setGeneratedPassword] = useState('');

  /**
   * Actualizar opciones
   */
  const updateOption = useCallback((key, value) => {
    setOptions(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  /**
   * Generar contraseña
   */
  const generate = useCallback(() => {
    let chars = '';
    let password = '';
    
    // Construir conjunto de caracteres
    if (options.includeLowercase) chars += CHAR_SETS.lowercase;
    if (options.includeUppercase) chars += CHAR_SETS.uppercase;
    if (options.includeNumbers) chars += CHAR_SETS.numbers;
    if (options.includeSymbols) chars += CHAR_SETS.symbols;

    // Fallback si nada está seleccionado
    if (chars === '') {
      chars = CHAR_SETS.lowercase + CHAR_SETS.uppercase;
    }

    // Generar contraseña
    const array = new Uint32Array(options.length);
    crypto.getRandomValues(array);

    for (let i = 0; i < options.length; i++) {
      password += chars[array[i] % chars.length];
    }

    // Asegurar que al menos haya un carácter de cada tipo seleccionado
    let finalPassword = password;
    let positions = [];

    if (options.includeLowercase) {
      const pos = Math.floor(Math.random() * options.length);
      positions.push(pos);
      finalPassword = replaceAt(finalPassword, pos, getRandomChar(CHAR_SETS.lowercase));
    }
    if (options.includeUppercase) {
      let pos = Math.floor(Math.random() * options.length);
      while (positions.includes(pos)) pos = Math.floor(Math.random() * options.length);
      positions.push(pos);
      finalPassword = replaceAt(finalPassword, pos, getRandomChar(CHAR_SETS.uppercase));
    }
    if (options.includeNumbers) {
      let pos = Math.floor(Math.random() * options.length);
      while (positions.includes(pos)) pos = Math.floor(Math.random() * options.length);
      positions.push(pos);
      finalPassword = replaceAt(finalPassword, pos, getRandomChar(CHAR_SETS.numbers));
    }
    if (options.includeSymbols) {
      let pos = Math.floor(Math.random() * options.length);
      while (positions.includes(pos)) pos = Math.floor(Math.random() * options.length);
      finalPassword = replaceAt(finalPassword, pos, getRandomChar(CHAR_SETS.symbols));
    }

    setGeneratedPassword(finalPassword);
    return finalPassword;
  }, [options]);

  /**
   * Calcular fuerza de la contraseña
   */
  const calculateStrength = useCallback((password = generatedPassword) => {
    if (!password) return { score: 0, label: 'Vacía', color: '#9ca3af' };

    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;

    const strengthMap = {
      0: { label: 'Muy débil', color: '#ef4444' },
      1: { label: 'Débil', color: '#f97316' },
      2: { label: 'Regular', color: '#eab308' },
      3: { label: 'Buena', color: '#84cc16' },
      4: { label: 'Fuerte', color: '#22c55e' },
      5: { label: 'Muy fuerte', color: '#10b981' },
      6: { label: 'Excelente', color: '#06b6d4' },
    };

    return {
      score,
      ...strengthMap[Math.min(score, 6)],
    };
  }, [generatedPassword]);

  return {
    options,
    generatedPassword,
    updateOption,
    generate,
    calculateStrength,
  };
};

// Helpers
function replaceAt(str, index, char) {
  return str.substring(0, index) + char + str.substring(index + 1);
}

function getRandomChar(chars) {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return chars[array[0] % chars.length];
}

export default usePasswordGenerator;