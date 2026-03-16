// Getion de contraseñas y categorias
import {apiClient} from './client'

export const vaultService={
  //Categorias
  getCategories:()=>apiClient.get('/api/v1/vault/categories'),
  createCategories:(data)=>apiClient.post('/api/v1/vault/categories',data),

  //Contraseñas
  getPasswords:()=>apiClient.get('/api/v1/vault/entries'),
  createPasswords:(data)=>apiClient.post('/api/v1/entries',data),

  //proxima implementaciones en api tambien
  updatePasswords:(id,data)=>apiClient.put(`/api/v1/entries/${id}`,data),
  deletePasswords:(id)=>apiClient.delete(`/api/v1/entries/${id}`)
}