// Visual tanaman per level 1-5 (GM-01). Level datang dari server; komponen ini hanya menggambar.
export default function PlantLevel({ level, className = 'size-40' }: { level: number; className?: string }) {
  const lv = Math.min(5, Math.max(1, level))
  const stem = 18 + lv * 14
  const top = 118 - stem
  const leaves = Array.from({ length: lv }, (_, i) => {
    const y = 112 - (i + 1) * ((stem - 6) / lv)
    const dir = i % 2 === 0 ? 1 : -1
    return { y, dir, i }
  })
  return (
    <svg viewBox="0 0 120 140" className={className} role="img" aria-label={`Tanaman level ${lv}`}>
      <ellipse cx="60" cy="130" rx="34" ry="6" className="fill-leaf/25" />
      <path d="M36 112h48l-6 18H42z" className="fill-zest" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d={`M60 112V${top}`} stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none" className="grow" />
      {leaves.map(({ y, dir, i }) => (
        <path
          key={i}
          d={`M60 ${y}c${dir * 6}-14 ${dir * 24}-16 ${dir * 30}-12c${dir * 2} 12-${dir * 14} 22-${dir * 30} 12z`}
          className="rise fill-zest"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinejoin="round"
          style={{ ['--i' as string]: i + 3, transformOrigin: '60px 80px' }}
        />
      ))}
      {lv === 5 && <circle cx="60" cy={top - 6} r="8" className="fill-white" stroke="currentColor" strokeWidth="3" />}
    </svg>
  )
}
