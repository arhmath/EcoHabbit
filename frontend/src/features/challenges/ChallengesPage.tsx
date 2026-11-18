import { useRef, useState } from 'react'
import { getMissions, getSubmission, submitMission } from '../../api/resources'
import { toApiError } from '../../api/errors'
import Icon from '../../components/Icon'
import { Btn } from '../../components/ui/Btn'
import Card from '../../components/ui/Card'
import Modal from '../../components/ui/Modal'
import PageHeader from '../../components/ui/PageHeader'
import Pill, { StatusPill } from '../../components/ui/Pill'
import { Async, Skeleton } from '../../components/ui/States'
import { toast } from '../../components/ui/Toast'
import { invalidate, useResource } from '../../hooks/useResource'
import { compressImage, ImageError, validateImage } from '../../lib/image'
import type { Mission, Submission } from '../../types/domain'

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

// CH-01..CH-08: daftar misi, terkunci, kirim bukti foto (kompres), status verifikasi, modal level-up.
export default function ChallengesPage() {
  const res = useResource('missions', getMissions)
  const [busy, setBusy] = useState<number | null>(null)
  const [levelUp, setLevelUp] = useState<string | null>(null)
  const pick = useRef<Mission | null>(null)
  const input = useRef<HTMLInputElement>(null)

  const refresh = () => invalidate('missions', 'dashboard', 'profile', 'history', 'leaderboard')

  const finish = (m: Mission, s: Submission) => {
    if (s.status === 'verified' && s.result) {
      toast.ok(`+${s.result.xp_earned} XP dan +${s.result.points_earned} poin dari "${m.title}".`)
      if (s.result.leveled_up) setLevelUp(s.result.new_level_name)
    } else if (s.status === 'rejected') toast.err(s.rejection_reason ?? 'Bukti ditolak. Kamu bisa kirim ulang.')
  }

  const send = async (m: Mission, file: File | null) => {
    setBusy(m.id)
    try {
      let s = await submitMission(m.id, file ? await compressImage(file) : null)
      for (let i = 0; s.status === 'pending' && i < 20; i++) {
        await wait(1200)
        s = await getSubmission(s.id)
      }
      finish(m, s)
      if (s.status === 'pending') toast.info('Verifikasi masih berjalan. Cek lagi sebentar.')
    } catch (e) {
      toast.err(e instanceof ImageError ? e.message : toApiError(e).message)
    } finally {
      setBusy(null)
      refresh()
    }
  }

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    const m = pick.current
    if (!file || !m) return
    try {
      validateImage(file)
    } catch (err) {
      return toast.err((err as Error).message)
    }
    void send(m, file)
  }

  const act = (m: Mission) => {
    if (m.verification === 'none') return void send(m, null)
    pick.current = m
    input.current?.click()
  }

  return (
    <>
      <PageHeader eyebrow="Misi" title="Misi harian" note="Selesaikan misi, kirim bukti, dapatkan XP dan poin." />
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" capture="environment" hidden onChange={onFile} />
      <Async res={res} skeleton={<div className="grid gap-5 md:grid-cols-2">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-44" />)}</div>}>
        {(list) => (
          <ul className="grid gap-5 md:grid-cols-2">
            {list.map((m, i) => {
              const done = m.today_status === 'verified' || m.today_status === 'pending'
              const disabled = m.locked || m.quota_left <= 0 || done
              return (
                <li key={m.id}>
                  <Card tone={m.locked ? 'white' : done ? 'soft' : 'white'} lift={!m.locked} style={{ ['--i' as string]: i }} className={m.locked ? 'opacity-70' : ''}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Pill tone="soft">{m.category}</Pill>
                        <h2 className="mt-2 font-display text-xl font-extrabold">{m.title}</h2>
                      </div>
                      {m.locked ? <Icon name="lock" className="size-6" /> : <StatusPill status={m.today_status} />}
                    </div>
                    <p className="mt-2 text-sm text-leaf/75">{m.locked ? `Terbuka di level ${m.level_required} (${m.unlock_xp} XP).` : m.description}</p>
                    {m.rejection_reason && <p role="alert" className="mt-2 rounded-xl bg-red-100 p-2 text-sm text-red-900">{m.rejection_reason}</p>}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm font-bold">+{m.xp_reward} XP · +{m.points_reward} poin</p>
                      <Btn small variant="zest" disabled={disabled} loading={busy === m.id} onClick={() => act(m)}>
                        <Icon name={m.verification === 'photo' ? 'camera' : 'check'} className="size-4" />
                        {m.quota_left <= 0 && !m.locked ? 'Kuota habis' : m.verification === 'photo' ? (m.today_status === 'rejected' ? 'Kirim ulang' : 'Kirim foto') : 'Selesai'}
                      </Btn>
                    </div>
                  </Card>
                </li>
              )
            })}
          </ul>
        )}
      </Async>
      <Modal open={levelUp !== null} onClose={() => setLevelUp(null)} title="Naik level!">
        <p className="text-lg">Tanamanmu tumbuh menjadi <b>{levelUp}</b>.</p>
        <Btn className="mt-5" variant="zest" onClick={() => setLevelUp(null)}>Lanjut</Btn>
      </Modal>
    </>
  )
}
