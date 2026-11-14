import { create } from 'zustand'
import * as authApi from '../../api/auth'
import { setUnauthorizedHandler } from '../../api/client'
import { ApiError } from '../../api/errors'
import { clearToken, getToken, setToken } from '../../lib/tokenStorage'
import type { AuthPayload, User } from '../../types/api'

type Status = 'booting' | 'authenticated' | 'guest'

interface AuthState {
  user: User | null
  status: Status
  /** Pesan satu kali untuk halaman login, mis. sesi berakhir. */
  notice: string | null
  setSession: (payload: AuthPayload) => void
  bootstrap: () => Promise<void>
  logout: () => Promise<void>
  expire: () => void
  clearNotice: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  status: 'booting',
  notice: null,

  setSession: ({ token, user }) => {
    setToken(token)
    set({ user, status: 'authenticated', notice: null })
  },

  // AUTH-05: pulihkan token lalu validasi lewat GET /me.
  bootstrap: async () => {
    if (!getToken()) {
      set({ user: null, status: 'guest' })
      return
    }
    try {
      const user = await authApi.fetchMe()
      set({ user, status: 'authenticated' })
    } catch (e) {
      // Hanya 401 yang membuang token. Putus jaringan tidak boleh mengeluarkan user.
      if (e instanceof ApiError && e.status === 401) clearToken()
      if (get().status === 'booting') set({ user: null, status: 'guest' })
    }
  },

  // AUTH-03: hapus token (cache TanStack Query ikut dibersihkan di sini saat sudah dipasang).
  logout: async () => {
    try {
      await authApi.logout()
    } catch {
      /* token tetap dihapus di klien walau server gagal dihubungi */
    }
    clearToken()
    set({ user: null, status: 'guest', notice: null })
  },

  // AUTH-04: dipanggil interceptor saat respons 401.
  expire: () => {
    const wasIn = get().status !== 'guest'
    clearToken()
    set({ user: null, status: 'guest', notice: wasIn ? 'Sesi Anda berakhir. Silakan masuk kembali.' : null })
  },

  clearNotice: () => set({ notice: null }),
}))

setUnauthorizedHandler(() => useAuthStore.getState().expire())
