import { fmtShort, fmtWeekday, num } from '../lib/format'

// Grafik SVG ringan tanpa pustaka (SRS 7.1 menyebut Recharts; ganti nanti bila dipasang). Semua beranimasi naik/menyapu.
export function BarChart({ data, label }: { data: { date: string; value: number }[]; label: string }) {
  const max = Math.max(1, ...data.map((d) => d.value))
  const w = 100 / data.length
  return (
    <figure>
      <svg viewBox="0 0 100 52" className="w-full" role="img" aria-label={`${label}: ${data.map((d) => `${fmtShort(d.date)} ${num(d.value)}`).join(', ')}`}>
        {data.map((d, i) => {
          const h = (d.value / max) * 40
          return (
            <g key={d.date}>
              <rect x={i * w + w * 0.18} y={42 - h} width={w * 0.64} height={Math.max(h, 0.8)} rx="1.6" className={`grow ${i === data.length - 1 ? 'fill-leaf' : 'fill-zest'}`} stroke="currentColor" strokeWidth="0.5" style={{ ['--i' as string]: i }} />
              <text x={i * w + w / 2} y="49" textAnchor="middle" className="fill-current text-[3.2px] font-semibold">{fmtWeekday(d.date)}</text>
            </g>
          )
        })}
      </svg>
    </figure>
  )
}

export function HBars({ rows, label }: { rows: { name: string; value: number }[]; label: string }) {
  const max = Math.max(1, ...rows.map((r) => r.value))
  return (
    <ul aria-label={label} className="space-y-3">
      {rows.map((r, i) => (
        <li key={r.name} className="grid grid-cols-[5.5rem_1fr_2.5rem] items-center gap-3 text-sm">
          <span className="font-semibold">{r.name}</span>
          <span className="h-4 overflow-hidden rounded-full border-2 border-leaf bg-white">
            <span className="sweep block h-full rounded-full bg-leaf" style={{ width: `${(r.value / max) * 100}%`, ['--i' as string]: i }} />
          </span>
          <span className="text-right font-bold tabular-nums">{num(r.value)}</span>
        </li>
      ))}
    </ul>
  )
}

export function TrendChart({ data, label }: { data: { date: string; a: number; b: number }[]; label: string }) {
  const max = Math.max(1, ...data.flatMap((d) => [d.a, d.b]))
  const pt = (i: number, v: number) => `${(i / (data.length - 1)) * 96 + 2},${44 - (v / max) * 38}`
  const line = (k: 'a' | 'b') => data.map((d, i) => pt(i, d[k])).join(' ')
  return (
    <figure>
      <svg viewBox="0 0 100 52" className="w-full" role="img" aria-label={`${label}, ${data.length} hari terakhir`}>
        {[0, 1, 2, 3].map((g) => <line key={g} x1="2" x2="98" y1={6 + g * 12.6} y2={6 + g * 12.6} stroke="currentColor" strokeOpacity="0.15" strokeWidth="0.3" />)}
        <polyline points={line('a')} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" className="sweep" />
        <polyline points={line('b')} fill="none" stroke="var(--color-sage)" strokeWidth="1.6" strokeDasharray="3 2" strokeLinejoin="round" strokeLinecap="round" className="sweep" style={{ ['--i' as string]: 2 }} />
        <text x="2" y="50" className="fill-current text-[3.2px] font-semibold">{fmtShort(data[0].date)}</text>
        <text x="98" y="50" textAnchor="end" className="fill-current text-[3.2px] font-semibold">{fmtShort(data[data.length - 1].date)}</text>
      </svg>
      <figcaption className="mt-2 flex gap-4 text-xs font-semibold">
        <span className="flex items-center gap-1.5"><span className="h-0.5 w-5 bg-leaf" /> Misi terverifikasi</span>
        <span className="flex items-center gap-1.5"><span className="h-0.5 w-5 border-t-2 border-dashed border-sage" /> User aktif</span>
      </figcaption>
    </figure>
  )
}
