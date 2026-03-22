/**
 * Login - Página de inicio de sesión
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from '../../hooks/useForm';
import { AuthLayout } from '../../components/layout/AuthLayout/AuthLayout';
import { Button } from '../../components/common/Button/Button';
import { Input } from '../../components/common/Input/Input';
import { Spinner } from '../../components/common/Spinner/Spinner';
import './Login.css';

export const Login = () => {
  const navigate = useNavigate();
  const { login, error: authError, clearError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Validación
  const validate = (values) => {
    const errors = {};
    if (!values.email?.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = 'Email inválido';
    }
    if (!values.password) {
      errors.password = 'La contraseña es requerida';
    }
    return errors;
  };

  // Submit
  const onSubmit = async (values) => {
    setIsLoading(true);
    clearError();
    
    const result = await login(values.email, values.password);
    
    if (result.success) {
      navigate('/', { replace: true });
    }
    
    setIsLoading(false);
  };

  const { values, errors, handleChange, handleSubmit } = useForm({
    initialValues: { email: '', password: '' },
    validate,
    onSubmit,
  });

  return (
    <AuthLayout 
      title="Bienvenido de vuelta"
      subtitle="Ingresa tus credenciales para acceder a tu vault"
    >
      <form className="login-form" onSubmit={handleSubmit}>
        {authError && (
          <div className="login-form__error">
            ⚠️ {authError}
          </div>
        )}

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
          autoFocus
        />

        <div className="login-form__password">
          <Input
            label="Contraseña"
            name="password"
            type="password"
            placeholder="••••••••"
            value={values.password}
            onChange={handleChange}
            error={errors.password}
            icon="🔒"
            required
          />
          <Link to="/forgot-password" className="login-form__forgot">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <Button 
          type="submit" 
          fullWidth 
          loading={isLoading}
          size="large"
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>
      </form>

      <div className="login-form__footer">
        <p>
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="login-form__link">
            Crear cuenta
          </Link>
        </p>
      </div>

      {isLoading && <Spinner fullScreen />}
    </AuthLayout>
  );
};

export default Login;