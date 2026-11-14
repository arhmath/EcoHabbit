import { Navigate, Outlet, useLocation } from 'react-router-dom'
import SplashScreen from '../../components/SplashScreen'
import type { Role } from '../../types/api'
import { useAuthStore } from './store'
import { homePathFor } from './utils'

// Guard hanya untuk pengalaman pengguna (AUTH-07). Pembatasan akses sebenarnya ada di backend.
export function RequireAuth({ roles }: { roles?: Role[] }) {
  const { user, status } = useAuthStore()
  const location = useLocation()
  if (status === 'booting') return <SplashScreen />
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (roles && !roles.includes(user.role)) return <Navigate to="/403" replace />
  return <Outlet />
}

export function GuestOnly() {
  const { user, status } = useAuthStore()
  if (status === 'booting') return <SplashScreen />
  if (user) return <Navigate to={homePathFor(user.role)} replace />
  return <Outlet />
}
