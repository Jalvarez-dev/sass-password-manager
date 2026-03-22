/**
 * constants.js - Constantes de la aplicación
 */
//nombre de la app
const VITE_APP_NAME=import.meta.env.VITE_APP_NAME || 'SecureVault'
const VITE_APP_VERSION=import.meta.env.VITE_APP_VERSION || '1.0.0'
// Configuración de la app
export const APP_CONFIG = {
  name: VITE_APP_NAME,
  version: VITE_APP_VERSION,
  description: 'Gestor de contraseñas seguro',
  author: 'jalvarez_dev',
};

// Límites y validaciones
export const LIMITS = {
  password: {
    minLength: 8,
    maxLength: 128,
  },
  siteName: {
    maxLength: 100,
  },
  username: {
    maxLength: 255,
  },
  categoryName: {
    maxLength: 50,
  },
  maxPasswordsPerUser: 1000,
  maxCategoriesPerUser: 50,
};

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  generic: 'Ha ocurrido un error. Inténtalo de nuevo.',
  network: 'Error de conexión. Verifica tu internet.',
  unauthorized: 'Sesión expirada. Inicia sesión nuevamente.',
  forbidden: 'No tienes permisos para realizar esta acción.',
  notFound: 'El recurso solicitado no existe.',
  validation: 'Verifica los datos ingresados.',
  server: 'Error del servidor. Inténtalo más tarde.',
};

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
  passwordCreated: 'Contraseña guardada correctamente',
  passwordUpdated: 'Contraseña actualizada correctamente',
  passwordDeleted: 'Contraseña eliminada correctamente',
  categoryCreated: 'Categoría creada correctamente',
  login: 'Bienvenido de vuelta',
  register: 'Cuenta creada correctamente',
  logout: 'Sesión cerrada correctamente',
  copied: 'Copiado al portapapeles',
};

// Categorías por defecto (si el backend no tiene)
export const DEFAULT_CATEGORIES = [
  { id: 1, name: 'Redes Sociales', description: 'Facebook, Twitter, Instagram...' },
  { id: 2, name: 'Trabajo', description: 'Herramientas profesionales' },
  { id: 3, name: 'Finanzas', description: 'Bancos, inversiones, pagos' },
  { id: 4, name: 'Entretenimiento', description: 'Streaming, juegos, etc.' },
  { id: 5, name: 'Compras', description: 'E-commerce, marketplaces' },
];

// Configuración de seguridad
export const SECURITY = {
  sessionTimeout: 30 * 60 * 1000, // 30 minutos
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutos
  passwordExpiryWarning: 7 * 24 * 60 * 60 * 1000, // 7 días
};

// Rutas de la app
export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  dashboard: '/',
  settings: '/settings',
  profile: '/profile',
};

// LocalStorage keys
export const STORAGE_KEYS = {
  token: 'access_token',
  tokenType: 'token_type',
  user: 'user_data',
  theme: 'theme_preference',
  lastActivity: 'last_activity',
};