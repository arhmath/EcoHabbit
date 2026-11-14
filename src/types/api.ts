// Nama field snake_case mengikuti API/ERD (SRS 4.2). Envelope masih [USULAN] (Q-12).
export type Role = 'admin' | 'user'

export interface User {
  id: number
  name: string
  email: string
  role: Role
  avatar_url: string | null
}

export interface ApiEnvelope<T> {
  data: T
  message?: string
  meta?: { page: number; per_page: number; total: number }
}

export interface AuthPayload {
  token: string
  user: User
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  password_confirmation: string
}
