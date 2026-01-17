import axios from 'axios'

const api = axios.create({
  baseURL: 'https://otruyenapi.com/v1/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// interceptor (sau này gắn token)
api.interceptors.request.use((config) => {
  // const token = getToken()
  // if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
