/**
 * Input - Campo de texto con label, error y helper
 * Props: label, error, helper, icon, ...inputProps
 */

import './Input.css';

export const Input = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  helper,
  icon = null,
  iconPosition = 'left',
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  const inputId = `input-${name}`;
  const hasError = !!error;

  const classes = [
    'input-wrapper',
    hasError && 'input-wrapper--error',
    disabled && 'input-wrapper--disabled',
    icon && `input-wrapper--icon-${iconPosition}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {label && (
        <label htmlFor={inputId} className="input__label">
          {label}
          {required && <span className="input__required">*</span>}
        </label>
      )}
      
      <div className="input__container">
        {icon && iconPosition === 'left' && (
          <span className="input__icon input__icon--left">{icon}</span>
        )}
        
        <input
          id={inputId}
          name={name}
          type={type}
          className="input__field"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <span className="input__icon input__icon--right">{icon}</span>
        )}
      </div>

      {helper && !hasError && (
        <span id={`${inputId}-helper`} className="input__helper">
          {helper}
        </span>
      )}
      
      {hasError && (
        <span id={`${inputId}-error`} className="input__error">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;