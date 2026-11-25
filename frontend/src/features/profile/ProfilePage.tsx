import { useState } from 'react'
import { getProfile, updateProfile } from '../../api/resources'
import { invalidate, useResource } from '../../hooks/useResource'
import { Btn } from '../../components/ui/Btn'
import Card from '../../components/ui/Card'
import PageHeader from '../../components/ui/PageHeader'
import ProgressBar from '../../components/ui/ProgressBar'
import { Async, Skeleton } from '../../components/ui/States'
import { toast } from '../../components/ui/Toast'
import { toApiError } from '../../api/errors'
import { num } from '../../lib/format'
import { useAuthStore } from '../auth/store'

// PROF-01, PROF-02 (nama). Avatar menyusul bersama ImageUploader.
export default function ProfilePage() {
  const res = useResource('profile', getProfile)
  const user = useAuthStore((s) => s.user)!
  const [name, setName] = useState(user.name)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  const save = async () => {
    const n = name.trim()
    if (n.length < 2) return setErr('Nama minimal 2 karakter.')
    setErr('')
    setSaving(true)
    try {
      const u = await updateProfile({ name: n })
      useAuthStore.setState({ user: { ...user, ...u } })
      invalidate('profile', 'dashboard', 'leaderboard')
      toast.ok('Nama berhasil diperbarui.')
    } catch (e) {
      setErr(toApiError(e).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <PageHeader eyebrow="Akun" title="Profil" />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-display text-2xl font-extrabold">Data diri</h2>
          <label htmlFor="pname" className="mb-1.5 block text-sm font-semibold">Nama</label>
          <input id="pname" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={err ? true : undefined} className="h-12 w-full rounded-2xl border-2 border-leaf/30 bg-white px-4 focus:border-leaf focus:outline-none" />
          {err && <p role="alert" className="mt-1.5 text-sm text-red-700">{err}</p>}
          <p className="mt-4 text-sm text-leaf/70">Email: {user.email}</p>
          <Btn className="mt-5" loading={saving} onClick={() => void save()} disabled={name.trim() === user.name}>Simpan nama</Btn>
        </Card>
        {user.role === 'user' && (
          <Card tone="soft">
            <h2 className="mb-4 font-display text-2xl font-extrabold">Progres</h2>
            <Async res={res} skeleton={<Skeleton className="h-40" />}>
              {(p) => (
                <div className="space-y-4">
                  <p className="font-display text-3xl font-extrabold">Level {p.level} · {p.level_name}</p>
                  <ProgressBar label="Progres XP" value={p.xp - p.level_min_xp} max={p.next_level_xp == null ? 1 : p.next_level_xp - p.level_min_xp} />
                  <dl className="grid grid-cols-2 gap-3 text-sm">
                    {([['Total XP', p.xp], ['Saldo poin', p.points], ['Streak saat ini', p.streak_current], ['Streak terpanjang', p.streak_longest]] as const).map(([k, v]) => (
                      <div key={k} className="rounded-2xl border-2 border-leaf bg-white p-3"><dt className="font-semibold text-leaf/70">{k}</dt><dd className="font-display text-2xl font-extrabold">{num(v)}</dd></div>
                    ))}
                  </dl>
                </div>
              )}
            </Async>
          </Card>
        )}
      </div>
    </>
  )
}
