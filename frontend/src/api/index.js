/**
 * Archivo de exportación centralizado para la API
 * Permite importar todo desde '@/api' en lugar de archivos individuales
 */

export { apiClient, default as ApiClient } from './client';
export { authService, default as AuthService } from './authService';
export { userService, default as UserService } from './userService';
export { 
  vaultService, 
  categoryService, 
  passwordService,
  default as VaultService 
} from './vaultService';