import { useRef } from 'react'
import { gsap, useMotion } from '../../lib/motion'

export default function Footer() {
  const ref = useRef<HTMLElement>(null)

  useMotion(ref, () => {
    gsap.from('.fl', {
      yPercent: 110,
      rotate: (i: number) => (i % 2 ? 10 : -10),
      duration: 1.2,
      stagger: 0.06,
      ease: 'elastic.out(1, 0.6)',
      scrollTrigger: { trigger: ref.current, start: 'top 85%' },
    })
  })

  return (
    <footer ref={ref} className="overflow-hidden bg-leaf px-6 pt-12 pb-8 text-center text-white">
      <p aria-label="EcoHabbit" className="overflow-hidden pb-2 font-display text-[clamp(2rem,10vw,7rem)] font-extrabold tracking-[0.3em] text-zest">
        {'ECOHABBIT'.split('').map((c, i) => (
          <span key={i} aria-hidden="true" className="fl inline-block">{c}</span>
        ))}
      </p>
      <p className="mt-6 text-sm text-white/60">© {new Date().getFullYear()} EcoHabbit. Capstone Project.</p>
    </footer>
  )
}
