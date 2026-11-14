import { ApiError } from '../api/errors'
import { getToken } from '../lib/tokenStorage'
import type { AuthPayload, LoginRequest, RegisterRequest, User } from '../types/api'

type Account = User & { password: string }

const accounts: Account[] = [
  { id: 1, name: 'Admin EcoHabbit', email: 'admin@ecohabbit.test', password: 'admin1234', role: 'admin', avatar_url: null },
  { id: 2, name: 'Budi Hijau', email: 'user@ecohabbit.test', password: 'user1234', role: 'user', avatar_url: null },
]

const wait = (ms = 700) => new Promise((r) => setTimeout(r, ms))
const encode = (u: User) => `mock.${btoa(encodeURIComponent(JSON.stringify(u)))}`
const strip = (a: Account): User => ({ id: a.id, name: a.name, email: a.email, role: a.role, avatar_url: a.avatar_url })

export async function mockLogin({ email, password }: LoginRequest): Promise<AuthPayload> {
  await wait()
  const found = accounts.find((a) => a.email === email.trim().toLowerCase() && a.password === password)
  if (!found) throw new ApiError(401, 'Email atau password salah.')
  const user = strip(found)
  return { token: encode(user), user }
}

export async function mockRegister(body: RegisterRequest): Promise<AuthPayload> {
  await wait()
  const email = body.email.trim().toLowerCase()
  if (accounts.some((a) => a.email === email)) {
    throw new ApiError(422, 'Data yang dikirim belum valid.', { email: ['Email sudah terdaftar.'] })
  }
  const user: User = { id: Date.now() % 100_000, name: body.name.trim(), email, role: 'user', avatar_url: null }
  return { token: encode(user), user }
}

export async function mockMe(): Promise<User> {
  await wait(250)
  const token = getToken()
  try {
    if (!token?.startsWith('mock.')) throw new Error('bukan token mock')
    return JSON.parse(decodeURIComponent(atob(token.slice(5)))) as User
  } catch {
    throw new ApiError(401, 'Sesi Anda berakhir. Silakan masuk kembali.')
  }
}
