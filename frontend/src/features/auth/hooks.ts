import { homePathFor } from './utils'
import { useAuthStore } from './store'

/** Tujuan tombol ajakan di landing (LAND-02): ke dashboard sesuai role bila sudah login. */
export function useAuthCta() {
  const user = useAuthStore((s) => s.user)
  return user ? { authed: true as const, dashboard: homePathFor(user.role) } : { authed: false as const, dashboard: '/login' }
}
