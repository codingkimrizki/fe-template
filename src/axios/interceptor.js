import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
// import router from '@/router'

// Buat instance axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Sesuaikan dengan URL backend Anda
  withCredentials: true, // Untuk mengirimkan cookie (refresh token)
})

// Tambahkan interceptor untuk setiap request
api.interceptors.request.use(
  config => {
    if (config.method === 'get') {
      // Nonaktifkan browser cache (agar request tetap dikirim ke server)
      config.headers['Cache-Control'] = 'no-store'
      config.headers['Pragma'] = 'no-cache'
      config.headers['Expires'] = '0'
    }
    // Ambil access token dari localStorage
    const accessToken = JSON.parse(
      localStorage.getItem('auth') || '{}',
    )?.accessToken

    // Jika accessToken ada, tambahkan ke header Authorization
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  response => response,
  async error => {
    const authStore = useAuthStore() // MOVED HERE: Lazy load store
    if (!error.config) {
      return Promise.reject(error)
    }

    const originalRequest = error.config

    // Hindari loop jika refresh token juga gagal
    if (originalRequest.url.includes('/auth/refresh')) {
      await authStore.logout()
      return Promise.reject(error)
    }

    // Jika token expired (401) dan belum dicoba refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/login')
    ) {
      originalRequest._retry = true
      try {
        const res = await api.post('/auth/refresh', {})
        const newAccessToken = res.data.accessToken

        authStore.accessToken = newAccessToken
        api.defaults.headers.common['Authorization'] =
          `Bearer ${newAccessToken}`
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`

        return api(originalRequest)
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError)
        await authStore.logout()
        return Promise.reject(refreshError)
      }
    }

    // Unauthorized setelah coba refresh → logout
    if (error.response?.status === 401 && originalRequest._retry) {
      await authStore.logout()
    }

    return Promise.reject(error)
  },
)

export default api
