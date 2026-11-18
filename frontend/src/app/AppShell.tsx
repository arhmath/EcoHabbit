import { Link, NavLink, Outlet } from 'react-router-dom'
import Icon, { type IconName } from '../components/Icon'
import { ToastHost } from '../components/ui/Toast'
import { useAuthStore } from '../features/auth/store'

const NAV = {
  user: [
    ['/dashboard', 'Dashboard', 'home'],
    ['/challenges', 'Misi', 'target'],
    ['/scan', 'Scan', 'camera'],
    ['/leaderboard', 'Peringkat', 'trophy'],
    ['/profile', 'Profil', 'user'],
  ],
  admin: [
    ['/admin/dashboard', 'Panel admin', 'chart'],
    ['/profile', 'Profil', 'user'],
  ],
} as const satisfies Record<string, readonly (readonly [string, string, IconName])[]>

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2 font-display text-xl font-extrabold tracking-tight">
      <svg viewBox="0 0 24 24" className="size-7 text-leaf" fill="currentColor" aria-hidden="true">
        <path d="M20 4C9 4 4 9.5 4 15c0 1.7.5 3.2 1.4 4.4C7 14 11 10.5 16 9c-4 2.5-7 6-8.4 11.2.8.5 1.6.8 2.5.8 6.3 0 10-6 9.9-17z" />
      </svg>
      EcoHabbit
    </Link>
  )
}

/**
 * Kerangka halaman setelah login. Pindah menu memakai tautan biasa, jadi RouteTransition global yang menangani:
 * panel naik dari bawah dengan nama menu tujuan, lalu isi halaman baru masuk berurutan dari bawah (kelas `rise`).
 */
export default function AppShell() {
  const user = useAuthStore((s) => s.user)!
  const logout = useAuthStore((s) => s.logout)
  const items = NAV[user.role]

  return (
    <div className="theme-light min-h-screen bg-paper text-leaf lg:pl-64">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r-2 border-leaf bg-white p-5 lg:flex">
        <Brand />
        <nav aria-label="Menu utama" className="mt-10 flex flex-1 flex-col gap-2">
          {items.map(([to, label, icon]) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `flex min-h-11 items-center gap-3 rounded-full border-2 px-4 font-semibold transition-colors ${isActive ? 'border-leaf bg-leaf text-white' : 'border-transparent hover:bg-zest-soft'}`
              }
            >
              <Icon name={icon} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="rounded-3xl border-2 border-leaf bg-zest p-4">
          <p className="truncate font-display font-bold">{user.name}</p>
          <p className="truncate text-xs">{user.role === 'admin' ? 'Admin' : user.email}</p>
          <button type="button" onClick={() => void logout()} className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-full border-2 border-leaf bg-white font-semibold hover:bg-zest-soft">
            <Icon name="logout" className="size-4" /> Keluar
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-40 flex items-center justify-between border-b-2 border-leaf bg-white/90 px-5 py-3 backdrop-blur-xl lg:hidden">
        <Brand />
        <button type="button" onClick={() => void logout()} aria-label="Keluar" className="flex size-11 items-center justify-center rounded-full border-2 border-leaf hover:bg-zest-soft">
          <Icon name="logout" />
        </button>
      </header>

      <main className="mx-auto max-w-6xl px-5 pt-8 pb-32 lg:px-10 lg:pt-12 lg:pb-16">
        <Outlet />
      </main>

      <nav aria-label="Menu utama" className="fixed inset-x-3 bottom-3 z-40 flex justify-around rounded-full border-2 border-leaf bg-white p-1.5 shadow-[4px_4px_0_0_var(--color-leaf)] lg:hidden">
        {items.map(([to, label, icon]) => (
          <NavLink key={to} to={to} end className={({ isActive }) => `flex min-h-11 min-w-14 flex-1 flex-col items-center justify-center rounded-full px-1 text-[0.7rem] font-bold ${isActive ? 'bg-leaf text-white' : ''}`}>
            <Icon name={icon} className="size-5" />
            {label}
          </NavLink>
        ))}
      </nav>
      <ToastHost />
    </div>
  )
}
