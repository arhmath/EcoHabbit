import { useState } from 'react'
import { getLeaderboard } from '../../api/resources'
import Card from '../../components/ui/Card'
import PageHeader from '../../components/ui/PageHeader'
import Pill from '../../components/ui/Pill'
import Segmented from '../../components/ui/Segmented'
import { Async, Skeleton } from '../../components/ui/States'
import { useResource } from '../../hooks/useResource'
import { num } from '../../lib/format'
import type { LeaderboardRow } from '../../types/domain'

const Row = ({ r, i }: { r: LeaderboardRow; i: number }) => (
  <li aria-current={r.is_me || undefined} className={`rise flex items-center gap-4 rounded-2xl border-2 px-4 py-3 ${r.is_me ? 'border-leaf bg-zest' : 'border-leaf/20 bg-white'}`} style={{ ['--i' as string]: Math.min(i, 12) }}>
    <span className={`flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-leaf font-display font-extrabold ${r.rank <= 3 ? 'bg-leaf text-zest' : 'bg-white'}`}>{r.rank}</span>
    <span className="min-w-0 flex-1 truncate font-semibold">{r.name}{r.is_me && ' (kamu)'}</span>
    <Pill tone="soft">Level {r.level}</Pill>
    <span className="w-20 text-right font-bold tabular-nums">{num(r.xp)} XP</span>
  </li>
)

// GM-04, GM-05: 50 teratas, posisi user disorot dan selalu terlihat, filter mingguan/sepanjang waktu.
export default function LeaderboardPage() {
  const [period, setPeriod] = useState<'weekly' | 'all'>('weekly')
  const res = useResource(`leaderboard:${period}`, () => getLeaderboard(period))
  return (
    <>
      <PageHeader
        eyebrow="Peringkat"
        title="Leaderboard"
        note="Urutan berdasarkan XP. XP tidak pernah berkurang."
        actions={<Segmented label="Periode" value={period} onChange={setPeriod} options={[['weekly', 'Mingguan'], ['all', 'Sepanjang waktu']]} />}
      />
      <Async res={res} skeleton={<div className="space-y-3">{[0, 1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-14" />)}</div>}>
        {(lb) => (
          <div className="space-y-5">
            <Card tone="leaf">
              <p className="font-display text-sm font-bold text-zest">Posisimu</p>
              <p className="font-display text-5xl font-extrabold">#{lb.me.rank} <span className="text-lg font-bold text-white/80">· {num(lb.me.xp)} XP</span></p>
            </Card>
            <ol aria-label="Peringkat 50 teratas" className="space-y-2">{lb.rows.map((r, i) => <Row key={r.user_id} r={r} i={i} />)}</ol>
          </div>
        )}
      </Async>
    </>
  )
}
