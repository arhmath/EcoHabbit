import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getActivityCharts, getDashboardSummary, getHistory } from '../../api/resources'
import { BarChart, HBars } from '../../components/charts'
import CountUp from '../../components/CountUp'
import Icon, { type IconName } from '../../components/Icon'
import PlantLevel from '../../components/PlantLevel'
import Card from '../../components/ui/Card'
import { LinkBtn } from '../../components/ui/Btn'
import Pagination from '../../components/ui/Pagination'
import PageHeader from '../../components/ui/PageHeader'
import Pill, { StatusPill } from '../../components/ui/Pill'
import ProgressBar from '../../components/ui/ProgressBar'
import { Async, EmptyState, Skeleton } from '../../components/ui/States'
import { useResource } from '../../hooks/useResource'
import { fmtShort, fmtWeekday, num, timeAgo } from '../../lib/format'
import type { DashboardSummary } from '../../types/domain'
import { WASTE_NAME } from '../scan/waste'

const greet = () => {
  const h = Number(new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', hour: 'numeric', hourCycle: 'h23' }).format(new Date()))
  return h < 11 ? 'Selamat pagi' : h < 15 ? 'Selamat siang' : h < 19 ? 'Selamat sore' : 'Selamat malam'
}

// DU-01: sapaan, level + tanaman, progres XP, streak, poin.
function Overview({ d }: { d: DashboardSummary }) {
  const p = d.profile
  const base = p.level_min_xp
  const span = p.next_level_xp == null ? 1 : p.next_level_xp - base
  return (
    <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
      <Card tone="leaf" className="relative overflow-hidden">
        <div className="grid items-center gap-4 sm:grid-cols-[1fr_auto]">
          <div>
            <p className="font-display text-sm font-bold text-zest">{greet()}</p>
            <h2 className="mt-1 font-display text-3xl leading-tight font-extrabold md:text-4xl">{p.name}</h2>
            <p className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <Pill tone="zest">Level {p.level}</Pill> <span className="font-semibold">{p.level_name}</span>
            </p>
            <div className="mt-5 max-w-md">
              <ProgressBar tone="zest" label="Progres XP menuju level berikutnya" value={p.xp - base} max={span} />
              <p className="mt-2 text-sm text-white/80">
                <b className="text-zest"><CountUp value={p.xp} /> XP</b>
                {p.next_level_xp == null ? ' · level tertinggi tercapai' : ` · ${num(p.next_level_xp - p.xp)} XP lagi ke level ${p.level + 1}`}
              </p>
            </div>
          </div>
          <PlantLevel level={p.level} className="mx-auto size-36 text-zest sm:size-44" />
        </div>
      </Card>

      <Card tone="zest">
        <div className="flex items-center justify-between">
          <p className="font-display font-bold">Streak</p>
          <Icon name="flame" className="size-6" />
        </div>
        <p className="mt-1 font-display text-5xl font-extrabold"><CountUp value={p.streak_current} /> <span className="text-lg font-bold">hari</span></p>
        <p className="mt-1 text-sm">{p.active_today ? 'Hari ini sudah aktif.' : 'Belum ada aktivitas hari ini.'} Terpanjang {p.streak_longest} hari.</p>
        <ol aria-label="Aktivitas 7 hari terakhir" className="mt-4 flex justify-between gap-1">
          {d.streak_week.map((day, i) => (
            <li key={day.date} className="rise flex flex-col items-center gap-1 text-xs font-bold" style={{ ['--i' as string]: i + 2 }}>
              <span className={`flex size-8 items-center justify-center rounded-full border-2 border-leaf ${day.active ? 'bg-leaf text-zest' : 'bg-white'}`}>
                {day.active && <Icon name="check" className="size-4" />}
              </span>
              <span className="sr-only">{day.active ? 'aktif' : 'tidak aktif'}</span>
              {fmtWeekday(day.date)}
            </li>
          ))}
        </ol>
      </Card>
    </div>
  )
}

function Stat({ icon, label, value, tone, i }: { icon: IconName; label: string; value: number; tone: 'white' | 'soft' | 'mid'; i: number }) {
  return (
    <Card tone={tone} style={{ ['--i' as string]: i }} className="flex items-center gap-4 !p-4">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-leaf bg-zest text-leaf"><Icon name={icon} /></span>
      <div>
        <p className="font-display text-3xl leading-none font-extrabold"><CountUp value={value} /></p>
        <p className="mt-1 text-sm font-semibold opacity-80">{label}</p>
      </div>
    </Card>
  )
}

function History() {
  const [page, setPage] = useState(1)
  const res = useResource(`history:${page}`, () => getHistory(page))
  return (
    <Card>
      <h2 className="mb-4 font-display text-2xl font-extrabold">Riwayat progres</h2>
      <Async res={res} skeleton={<div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-14" />)}</div>}>
        {(h) =>
          h.items.length === 0 ? (
            <EmptyState title="Belum ada aktivitas" body="Selesaikan misi atau scan sampah pertamamu." />
          ) : (
            <>
              <ul className="divide-y-2 divide-leaf/10">
                {h.items.map((it) => (
                  <li key={it.id} className="flex items-center gap-3 py-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-zest"><Icon name={it.type === 'scan' ? 'camera' : 'target'} className="size-5" /></span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{it.title}</p>
                      <p className="truncate text-sm text-leaf/70">{it.detail} · {timeAgo(it.at)}</p>
                    </div>
                    <div className="text-right text-sm font-bold tabular-nums">+{it.xp} XP<br /><span className="font-semibold text-leaf/70">+{it.points} poin</span></div>
                  </li>
                ))}
              </ul>
              <Pagination page={h.page} perPage={h.per_page} total={h.total} onPage={setPage} />
            </>
          )
        }
      </Async>
    </Card>
  )
}

export default function DashboardPage() {
  const summary = useResource('dashboard:summary', getDashboardSummary)
  const charts = useResource('dashboard:activity', getActivityCharts)

  return (
    <>
      <PageHeader eyebrow="Dashboard" title="Kebiasaan hari ini" note="Ringkasan progres, misi, dan aktivitas pilah sampahmu." />
      <div className="space-y-5">
        <Async res={summary} skeleton={<div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]"><Skeleton className="h-64" /><Skeleton className="h-64" /></div>}>
          {(d) => (
            <>
              <Overview d={d} />
              <div className="grid gap-5 sm:grid-cols-3">
                <Stat i={1} icon="coin" label="Saldo poin" value={d.profile.points} tone="white" />
                <Stat i={2} icon="check" label="Misi terverifikasi" value={d.totals.missions_verified} tone="soft" />
                <Stat i={3} icon="recycle" label="Sampah dipilah" value={d.totals.waste_items} tone="white" />
              </div>

              <Card>
                <div className="mb-4 flex items-end justify-between gap-3">
                  <h2 className="font-display text-2xl font-extrabold">Misi hari ini</h2>
                  <Link to="/challenges" className="text-sm font-bold underline underline-offset-4">Semua misi</Link>
                </div>
                {d.missions_today.length === 0 ? (
                  <EmptyState title="Belum ada misi" body="Misi baru muncul setiap hari." />
                ) : (
                  <ul className="grid gap-3 md:grid-cols-2">
                    {d.missions_today.map((m, i) => (
                      <li key={m.id} className="rise flex items-center justify-between gap-3 rounded-2xl border-2 border-leaf/25 p-3" style={{ ['--i' as string]: i }}>
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{m.title}</p>
                          <p className="text-sm text-leaf/70">{m.category} · +{m.xp_reward} XP · +{m.points_reward} poin</p>
                        </div>
                        <StatusPill status={m.today_status} />
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </>
          )}
        </Async>

        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <h2 className="mb-4 font-display text-2xl font-extrabold">XP 7 hari terakhir</h2>
            <Async res={charts} skeleton={<Skeleton className="h-40" />}>
              {(c) => <BarChart label="XP per hari" data={c.xp_by_day.map((x) => ({ date: x.date, value: x.xp }))} />}
            </Async>
          </Card>
          <Card tone="soft">
            <h2 className="mb-4 font-display text-2xl font-extrabold">Sampah dipilah (7 hari)</h2>
            <Async res={charts} skeleton={<Skeleton className="h-40" />}>
              {(c) => <HBars label="Jumlah sampah per kategori" rows={c.waste_by_category.map((w) => ({ name: WASTE_NAME[w.category], value: w.quantity }))} />}
            </Async>
          </Card>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          {([
            ['/challenges', 'Kerjakan misi', 'target', 'zest'],
            ['/scan', 'Scan sampah', 'camera', 'leaf'],
            ['/leaderboard', 'Lihat peringkat', 'trophy', 'white'],
          ] as const).map(([to, label, icon, v], i) => (
            <LinkBtn key={to} to={to} variant={v === 'leaf' ? 'primary' : v === 'zest' ? 'zest' : 'ghost'} className="rise !min-h-16 text-lg" style={{ ['--i' as string]: i }}>
              <Icon name={icon} /> {label}
            </LinkBtn>
          ))}
        </div>

        <History />
        <p className="text-xs text-leaf/60">Tanggal ditampilkan dalam WIB · terakhir diperbarui {fmtShort(new Date())}</p>
      </div>
    </>
  )
}
