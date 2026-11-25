import { useRef } from 'react'
import { gsap, ScrollTrigger, useMotion } from '../../lib/motion'

// Pengganti pita "garis polisi": barisan pil berwarna yang berjalan lurus di batas hero.
// Dekoratif (aria-hidden) dan tidak bergerak saat reduced motion (useMotion sudah menangani).
const items = ['Pilah sampah', 'Misi harian', 'Jaga streak', 'Naik level', 'Tukar reward', 'Tumbuhkan tanaman']

export default function Marquee() {
  const ref = useRef<HTMLDivElement>(null)

  useMotion(ref, () => {
    // Empat salinan baris, geser 50% = dua salinan, jadi putarannya mulus.
    const tw = gsap.to('.track', { xPercent: -50, duration: 40, ease: 'none', repeat: -1 })
    // Scroll mempercepat marquee dan membalik arahnya mengikuti arah scroll, lalu melambat lagi.
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const boost = Math.min(Math.abs(self.getVelocity()) / 250, 5)
        gsap
          .timeline()
          .to(tw, { timeScale: self.direction * (1 + boost), duration: 0.2, overwrite: true })
          .to(tw, { timeScale: self.direction, duration: 1 })
      },
    })
  })

  const row = (key: string) => (
    <ul key={key} className="flex shrink-0 gap-3 pr-3">
      {items.map((t, i) => (
        <li
          key={t}
          className={`rounded-full border-2 border-leaf px-6 py-2 font-display text-lg font-extrabold whitespace-nowrap ${
            i % 2 ? 'bg-leaf text-zest' : 'bg-white text-leaf'
          }`}
        >
          {t}
        </li>
      ))}
    </ul>
  )

  return (
    <div ref={ref} aria-hidden="true" className="overflow-hidden border-y-2 border-leaf bg-zest py-5 select-none">
      <div className="track flex w-max">{['a', 'b', 'c', 'd'].map(row)}</div>
    </div>
  )
}
