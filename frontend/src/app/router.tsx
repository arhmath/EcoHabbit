import { createBrowserRouter } from 'react-router-dom'
import SplashScreen from '../components/SplashScreen'
import StatusPage from '../components/StatusPage'
import { GuestOnly, RequireAuth } from '../features/auth/RoleGuard'

// Code splitting per route (NFR-02): tiap halaman dimuat saat dibutuhkan.
const page = <T extends { default: React.ComponentType }>(load: () => Promise<T>) => async () => ({ Component: (await load()).default })

export const router = createBrowserRouter([
  {
    HydrateFallback: SplashScreen,
    children: [
      { path: '/', lazy: page(() => import('../features/landing/LandingPage')) },
      {
        element: <GuestOnly />,
        children: [
          {
            // Layout bersama agar panel overlay tidak remount saat pindah /login <-> /register.
            lazy: page(() => import('../features/auth/AuthPage')),
            children: [{ path: '/login' }, { path: '/register' }],
          },
        ],
      },
      {
        element: <RequireAuth roles={['user']} />,
        children: [{ path: '/dashboard', lazy: page(() => import('../features/dashboard/DashboardPage')) }],
      },
      {
        element: <RequireAuth roles={['admin']} />,
        children: [{ path: '/admin/dashboard', lazy: page(() => import('../features/admin/AdminDashboardPage')) }],
      },
      { path: '/403', element: <StatusPage code="403" title="Akses ditolak" body="Akunmu tidak memiliki izin untuk membuka halaman ini." /> },
      { path: '*', element: <StatusPage code="404" title="Halaman tidak ditemukan" body="Alamat yang kamu tuju tidak ada atau sudah dipindahkan." /> },
    ],
  },
])
