import { createBrowserRouter, Outlet } from 'react-router-dom'
import RouteTransition from '../components/RouteTransition'
import SplashScreen from '../components/SplashScreen'
import StatusPage from '../components/StatusPage'
import { GuestOnly, RequireAuth } from '../features/auth/RoleGuard'

// Code splitting per route (NFR-02): tiap halaman dimuat saat dibutuhkan.
const page = <T extends { default: React.ComponentType }>(load: () => Promise<T>) => async () => ({ Component: (await load()).default })

export const router = createBrowserRouter([
  {
    HydrateFallback: SplashScreen,
    element: (
      <>
        <Outlet />
        <RouteTransition />
      </>
    ),
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
        // Semua halaman setelah login berbagi satu kerangka (sidebar/menu bawah) agar tidak remount saat pindah menu.
        element: <RequireAuth />,
        children: [
          {
            lazy: page(() => import('./AppShell')),
            children: [
              {
                element: <RequireAuth roles={['user']} />,
                children: [
                  { path: '/dashboard', lazy: page(() => import('../features/dashboard/DashboardPage')) },
                  { path: '/challenges', lazy: page(() => import('../features/challenges/ChallengesPage')) },
                  { path: '/scan', lazy: page(() => import('../features/scan/ScanPage')) },
                  { path: '/leaderboard', lazy: page(() => import('../features/leaderboard/LeaderboardPage')) },
                ],
              },
              {
                element: <RequireAuth roles={['admin']} />,
                children: [{ path: '/admin/dashboard', lazy: page(() => import('../features/admin/AdminDashboardPage')) }],
              },
              { path: '/profile', lazy: page(() => import('../features/profile/ProfilePage')) },
            ],
          },
        ],
      },
      { path: '/403', element: <StatusPage code="403" title="Akses ditolak" body="Akunmu tidak memiliki izin untuk membuka halaman ini." /> },
      { path: '*', element: <StatusPage code="404" title="Halaman tidak ditemukan" body="Alamat yang kamu tuju tidak ada atau sudah dipindahkan." /> },
    ],
  },
])
