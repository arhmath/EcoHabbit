import { useRef } from 'react'
import { gsap, useMotion } from '../../lib/motion'

// Nama level masih placeholder, sesuaikan dengan tabel levels dari System Analyst.
const levels = [
  { name: 'Bibit', height: 20, tone: 'bg-forest-800' },
  { name: 'Tunas', height: 40, tone: 'bg-forest-700' },
  { name: 'Tanaman muda', height: 60, tone: 'bg-forest-700' },
  { name: 'Tanaman dewasa', height: 80, tone: 'bg-sage' },
  { name: 'Pohon', height: 100, tone: 'bg-mist' },
]

export default function Levels() {
  const ref = useRef<HTMLElement>(null)

  useMotion(ref, () => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top 60%' } })
    tl.fromTo('.bar', { scaleY: 0 }, { scaleY: 1, duration: 1.4, ease: 'elastic.out(1, 0.7)', stagger: 0.15 })
    tl.fromTo('.lv', { opacity: 0 }, { opacity: 1, duration: 0.6, stagger: 0.15 }, 0.3)
  })

  return (
    <section ref={ref} id="level" className="mx-auto max-w-6xl px-6 py-28">
      <h2 className="max-w-3xl font-display text-4xl font-bold tracking-tight md:text-6xl">
        Setiap kebiasaan menumbuhkan tanamanmu.
      </h2>
      <p className="mt-6 max-w-lg text-lg text-mist/70">Dari bibit sampai pohon, lima level menandai konsistensimu.</p>
      <ol className="mt-16 grid grid-cols-5 items-end gap-3 md:gap-6">
        {levels.map((l, i) => (
          <li key={l.name} className="flex flex-col items-center gap-4">
            <div className="flex h-72 w-full items-end">
              <div className={`bar w-full origin-bottom rounded-full ${l.tone}`} style={{ height: `${l.height}%` }} />
            </div>
            <div className="lv text-center">
              <p className="font-display text-lg font-bold">Lv {i + 1}</p>
              <p className="text-xs text-mist/70 md:text-sm">{l.name}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
