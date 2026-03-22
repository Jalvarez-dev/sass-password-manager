/**
 * PasswordInput - Input de contraseña con toggle de visibilidad y generador
 */

import { useState } from 'react';
import { usePasswordGenerator } from '../../../hooks/usePasswordGenerator';
import { Button } from '../Button/Button';
import { Modal } from '../Modal/Modal';
import './PasswordInput.css';

export const PasswordInput = ({
  label = 'Contraseña',
  name = 'password',
  value,
  onChange,
  onBlur,
  error,
  helper,
  showGenerator = true,
  required = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);
  
  const {
    options,
    generatedPassword,
    updateOption,
    generate,
    calculateStrength,
  } = usePasswordGenerator();

  const strength = calculateStrength(value);

  const handleGenerate = () => {
    const newPassword = generate();
    // Simular evento para onChange
    const event = {
      target: { name, value: newPassword },
    };
    onChange(event);
  };

  const applyGenerated = () => {
    const event = {
      target: { name, value: generatedPassword },
    };
    onChange(event);
    setShowGeneratorModal(false);
  };

  const toggleVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <>
      <div className="password-input-wrapper">
        <div className="password-input__header">
          {label && (
            <label htmlFor={name} className="password-input__label">
              {label}
              {required && <span className="password-input__required">*</span>}
            </label>
          )}
          
          {showGenerator && (
            <button
              type="button"
              className="password-input__generate-btn"
              onClick={() => setShowGeneratorModal(true)}
            >
              ⚡ Generar
            </button>
          )}
        </div>

        <div className="password-input__container">
          <input
            id={name}
            name={name}
            type={showPassword ? 'text' : 'password'}
            className="password-input__field"
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            required={required}
            {...props}
          />
          
          <button
            type="button"
            className="password-input__toggle"
            onClick={toggleVisibility}
            tabIndex="-1"
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        {/* Indicador de fuerza */}
        {value && (
          <div className="password-strength">
            <div className="password-strength__bar">
              <div 
                className="password-strength__fill"
                style={{ 
                  width: `${(strength.score / 6) * 100}%`,
                  backgroundColor: strength.color,
                }}
              />
            </div>
            <span 
              className="password-strength__label"
              style={{ color: strength.color }}
            >
              {strength.label}
            </span>
          </div>
        )}

        {helper && !error && (
          <span className="password-input__helper">{helper}</span>
        )}
        
        {error && (
          <span className="password-input__error">{error}</span>
        )}
      </div>

      {/* Modal de generador */}
      <Modal
        isOpen={showGeneratorModal}
        onClose={() => setShowGeneratorModal(false)}
        title="Generar Contraseña Segura"
        size="small"
      >
        <div className="password-generator">
          <div className="password-generator__preview">
            <code>{generatedPassword || 'Haz clic en generar'}</code>
            <Button size="small" onClick={handleGenerate}>
              🔄 Generar
            </Button>
          </div>

          <div className="password-generator__options">
            <label className="password-generator__option">
              <span>Longitud: {options.length}</span>
              <input
                type="range"
                min="8"
                max="32"
                value={options.length}
                onChange={(e) => updateOption('length', parseInt(e.target.value))}
              />
            </label>

            {[
              { key: 'includeLowercase', label: 'Minúsculas (a-z)' },
              { key: 'includeUppercase', label: 'Mayúsculas (A-Z)' },
              { key: 'includeNumbers', label: 'Números (0-9)' },
              { key: 'includeSymbols', label: 'Símbolos (!@#$)' },
            ].map(({ key, label }) => (
              <label key={key} className="password-generator__option">
                <input
                  type="checkbox"
                  checked={options[key]}
                  onChange={(e) => updateOption(key, e.target.checked)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>

          <div className="password-generator__actions">
            <Button variant="secondary" onClick={() => setShowGenerator(false)}>
              Cancelar
            </Button>
            <Button onClick={applyGenerated} disabled={!generatedPassword}>
              Usar Contraseña
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PasswordInput;