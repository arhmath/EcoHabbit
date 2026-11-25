import { getAdminStats } from '../../api/resources'
import { HBars, TrendChart } from '../../components/charts'
import CountUp from '../../components/CountUp'
import Icon, { type IconName } from '../../components/Icon'
import Card, { type Tone } from '../../components/ui/Card'
import PageHeader from '../../components/ui/PageHeader'
import Pill from '../../components/ui/Pill'
import { Async, EmptyState, Skeleton } from '../../components/ui/States'
import { useResource } from '../../hooks/useResource'
import { fmtDateTime } from '../../lib/format'
import { WASTE_NAME } from '../scan/waste'

function Kpi({ icon, label, value, tone, i }: { icon: IconName; label: string; value: number; tone: Tone; i: number }) {
  return (
    <Card tone={tone} style={{ ['--i' as string]: i }} className="!p-4">
      <Icon name={icon} className="size-6" />
      <p className="mt-3 font-display text-4xl leading-none font-extrabold"><CountUp value={value} /></p>
      <p className="mt-1 text-sm font-semibold opacity-80">{label}</p>
    </Card>
  )
}

// AD-01: total user, user aktif 7 hari, misi terverifikasi, sampah per kategori, poin beredar/ditukar, event menunggu review, tren.
export default function AdminDashboardPage() {
  const res = useResource('admin:stats', getAdminStats)
  return (
    <>
      <PageHeader eyebrow="Panel admin" title="Statistik EcoHabbit" note="Gambaran aktivitas pengguna, sampah terpilah, poin, dan event." />
      <Async res={res} skeleton={<div className="grid gap-5 sm:grid-cols-3">{[0, 1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-32" />)}</div>}>
        {(s) => (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-5 lg:grid-cols-3">
              <Kpi i={0} icon="users" label="Total user" value={s.total_users} tone="leaf" />
              <Kpi i={1} icon="bolt" label="User aktif 7 hari" value={s.active_users_7d} tone="zest" />
              <Kpi i={2} icon="check" label="Misi terverifikasi" value={s.missions_verified} tone="white" />
              <Kpi i={3} icon="coin" label="Poin beredar" value={s.points_circulating} tone="soft" />
              <Kpi i={4} icon="gift" label="Poin ditukar" value={s.points_redeemed} tone="white" />
              <Kpi i={5} icon="calendar" label="Event menunggu review" value={s.events_pending} tone="mid" />
            </div>
            <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
              <Card>
                <h2 className="mb-4 font-display text-2xl font-extrabold">Tren 14 hari</h2>
                <TrendChart label="Misi terverifikasi dan user aktif" data={s.trend.map((t) => ({ date: t.date, a: t.verified, b: t.active_users }))} />
              </Card>
              <Card tone="soft">
                <h2 className="mb-4 font-display text-2xl font-extrabold">Sampah per kategori</h2>
                <HBars label="Total sampah terdeteksi" rows={s.waste_by_category.map((w) => ({ name: WASTE_NAME[w.category], value: w.quantity }))} />
              </Card>
            </div>
            <Card>
              <h2 className="mb-4 font-display text-2xl font-extrabold">Event menunggu review</h2>
              {s.pending_events.length === 0 ? (
                <EmptyState title="Tidak ada pengajuan" body="Semua pengajuan event sudah ditinjau." />
              ) : (
                <ul className="grid gap-3 md:grid-cols-2">
                  {s.pending_events.map((e, i) => (
                    <li key={e.id} className="rise rounded-2xl border-2 border-leaf/25 p-4" style={{ ['--i' as string]: i }}>
                      <div className="flex items-start justify-between gap-2"><p className="font-display text-lg font-bold">{e.title}</p><Pill tone="warn">Menunggu</Pill></div>
                      <p className="mt-1 text-sm text-leaf/70">{e.proposer_name} · {e.location}</p>
                      <p className="text-sm text-leaf/70">{fmtDateTime(e.starts_at)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        )}
      </Async>
    </>
  )
}
