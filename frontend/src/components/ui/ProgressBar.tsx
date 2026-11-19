import { useEffect, useState } from 'react'

/** Bar yang terisi dengan transisi saat tampil. Persentase hanya tampilan, nilai XP dan ambang berasal dari server. */
export default function ProgressBar({ value, max, label, tone = 'leaf', className = '' }: { value: number; max: number; label: string; tone?: 'leaf' | 'zest'; className?: string }) {
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setShown(true), 80)
    return () => clearTimeout(t)
  }, [])
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={Math.min(value, max)}
      className={`h-4 overflow-hidden rounded-full border-2 ${tone === 'zest' ? 'border-zest bg-white/15' : 'border-leaf bg-white'} ${className}`}
    >
      <div className={`h-full rounded-full transition-[width] duration-1000 ease-out motion-reduce:transition-none ${tone === 'zest' ? 'bg-zest' : 'bg-leaf'}`} style={{ width: shown ? `${pct}%` : '0%' }} />
    </div>
  )
}
