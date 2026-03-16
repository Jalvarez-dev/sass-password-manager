//Axios/Fetch configurado
const API_BASE_URL=import.meta.env.VITE_APP_API_URL || 'http://localhost:8000'

class ApiClient{
  constructor(){
    this.baseURL=API_BASE_URL
  }

  async request(endpoint, options={}){
    const url=`${this.baseURL}${endpoint}`
    const token=localStorage.getItem('access_token')

    const config={
      headers:{
        'Content-Type': 'application/json',
        ...(token && {
          'Authorization':`Bearer ${token}`
        }),
        ...options.headers
      },
      ...options
    }

    if (config.body && typeof config.body === 'object'){
      config.body=JSON.stringify(config.body)
    }

    const response=await fetch(url,config)

    if (response.status === 401){
      localStorage.removeItem('access_token')
      window.location.href='/login'
      throw new Error('Sesion expirada')
    }
    if (!response.ok){
      const error = await response.json().catch(()=>({}))
      throw new Error(error.detail?.[0]?.msg || 'Error en la peticion');
    }

    return response.status !== 204 ? await response.json() : null
  }

  get(endpoint){
    return this.request(endpoint, {method: 'GET'})
  }

  post(endpoint, body){
    return this.request(endpoint, {method:'POST',body})
  }

  put(endpoint, body){
    return this.request(endpoint,{method:'PUT',body})
  }

  delete(endpoint){
    return this.request(endpoint, {method:'DELETE'})
  }
}
export const apiClient=new ApiClient()
