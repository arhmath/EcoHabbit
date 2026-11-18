import type { ApiEnvelope, AuthPayload, LoginRequest, RegisterRequest, User } from '../types/api'
import { api } from './client'
import { useMock } from './mode'

const mock = () => import('../mocks/auth')

export async function login(body: LoginRequest): Promise<AuthPayload> {
  if (useMock) return (await mock()).mockLogin(body)
  const { data } = await api.post<ApiEnvelope<AuthPayload>>('/auth/login', body)
  return data.data
}

export async function register(body: RegisterRequest): Promise<AuthPayload> {
  if (useMock) return (await mock()).mockRegister(body)
  const { data } = await api.post<ApiEnvelope<AuthPayload>>('/auth/register', body)
  return data.data
}

export async function fetchMe(): Promise<User> {
  if (useMock) return (await mock()).mockMe()
  const { data } = await api.get<ApiEnvelope<User>>('/me')
  return data.data
}

export async function logout(): Promise<void> {
  if (useMock) return
  await api.post('/auth/logout')
}
