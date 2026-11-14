import Button from '../../components/ui/Button'
import { useAuthStore } from '../auth/store'

// Placeholder sampai dashboard asli dibangun (DU-01 dan AD-01, Sprint 4).
export default function DashboardShell({ title, note }: { title: string; note: string }) {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  return (
    <main className="min-h-screen bg-linear-to-b from-ink to-forest-900 px-6 py-24 text-mist">
      <div className="mx-auto max-w-3xl">
        <p className="font-display text-sm font-semibold text-sage">{user?.role === 'admin' ? 'Admin' : 'Pengguna'}</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-6xl">Halo, {user?.name}</h1>
        <h2 className="mt-8 font-display text-2xl font-semibold">{title}</h2>
        <p className="mt-2 text-mist/70">{note}</p>
        <div className="mt-10 max-w-48">
          <Button onClick={() => void logout()} className="bg-sage text-ink hover:bg-mist">
            Keluar
          </Button>
        </div>
      </div>
    </main>
  )
}
