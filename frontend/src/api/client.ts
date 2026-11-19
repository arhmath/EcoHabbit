import axios, { type AxiosError } from 'axios'
import { getToken } from '../lib/tokenStorage'
import { toApiError } from './errors'

// Path relatif: dev lewat proxy Vite, produksi lewat reverse proxy Nginx (SRS NFR-08).
export const api = axios.create({
  baseURL: '/api/v1',
  timeout: 15_000,
  headers: { Accept: 'application/json' },
})

let onUnauthorized: () => void = () => {}
export function setUnauthorizedHandler(fn: () => void) {
  onUnauthorized = fn
}

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    const err = toApiError(error)
    // 401 pada login/register berarti kredensial salah, bukan sesi habis.
    const isAuthCall = /\/auth\/(login|register)$/.test(error.config?.url ?? '')
    if (err.status === 401 && !isAuthCall) onUnauthorized()
    return Promise.reject(err)
  },
)
