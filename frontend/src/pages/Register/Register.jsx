/**
 * Register - Página de registro de nuevos usuarios
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from '../../hooks/useForm';
import { usePasswordGenerator } from '../../hooks/usePasswordGenerator';
import { AuthLayout } from '../../components/layout/AuthLayout/AuthLayout';
import { Button } from '../../components/common/Button/Button';
import { Input } from '../../components/common/Input/Input';
import { PasswordInput } from '../../components/common/PasswordInput/PasswordInput';
import { Spinner } from '../../components/common/Spinner/Spinner';
import './Register.css';

export const Register = () => {
  const navigate = useNavigate();
  const { register, error: authError, clearError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { calculateStrength } = usePasswordGenerator();

  // Validación
  const validate = (values) => {
    const errors = {};
    
    if (!values.full_name?.trim()) {
      errors.full_name = 'El nombre es requerido';
    }
    
    if (!values.email?.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = 'Email inválido';
    }
    
    if (!values.password) {
      errors.password = 'La contraseña es requerida';
    } else if (values.password.length < 8) {
      errors.password = 'Mínimo 8 caracteres';
    } else {
      const strength = calculateStrength(values.password);
      if (strength.score < 3) {
        errors.password = 'La contraseña es muy débil';
      }
    }
    
    if (values.password !== values.confirm_password) {
      errors.confirm_password = 'Las contraseñas no coinciden';
    }
    
    return errors;
  };

  // Submit
  const onSubmit = async (values) => {
    setIsLoading(true);
    clearError();
    
    const result = await register({
      email: values.email,
      password: values.password,
      full_name: values.full_name,
    });
    
    if (result.success) {
      navigate('/', { replace: true });
    }
    
    setIsLoading(false);
  };

  const { values, errors, handleChange, handleSubmit } = useForm({
    initialValues: {
      full_name: '',
      email: '',
      password: '',
      confirm_password: '',
    },
    validate,
    onSubmit,
  });

  return (
    <AuthLayout
      title="Crear cuenta"
      subtitle="Comienza a proteger tus contraseñas de forma segura"
    >
      <form className="register-form" onSubmit={handleSubmit}>
        {authError && (
          <div className="register-form__error">
            ⚠️ {authError}
          </div>
        )}

        <Input
          label="Nombre completo"
          name="full_name"
          placeholder="Juan Pérez"
          value={values.full_name}
          onChange={handleChange}
          error={errors.full_name}
          icon="👤"
          required
          autoFocus
        />

        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="tu@email.com"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
          icon="✉️"
          required
        />

        <PasswordInput
          label="Contraseña maestra"
          name="password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          showGenerator={true}
          required
          helper="Usa al menos 8 caracteres con mayúsculas, números y símbolos"
        />

        <Input
          label="Confirmar contraseña"
          name="confirm_password"
          type="password"
          placeholder="Repite tu contraseña"
          value={values.confirm_password}
          onChange={handleChange}
          error={errors.confirm_password}
          icon="🔒"
          required
        />

        <div className="register-form__terms">
          <label className="register-form__checkbox">
            <input type="checkbox" required />
            <span>
              Acepto los{' '}
              <Link to="/terms" target="_blank">Términos de servicio</Link>
              {' '}y{' '}
              <Link to="/privacy" target="_blank">Política de privacidad</Link>
            </span>
          </label>
        </div>

        <Button 
          type="submit" 
          fullWidth 
          loading={isLoading}
          size="large"
        >
          {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
        </Button>
      </form>

      <div className="register-form__footer">
        <p>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="register-form__link">
            Iniciar sesión
          </Link>
        </p>
      </div>

      {isLoading && <Spinner fullScreen />}
    </AuthLayout>
  );
};

export default Register;