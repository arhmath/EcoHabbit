import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap, useMotion } from '../../lib/motion'
import ScrubText from './ScrubText'
import { useAuthCta } from '../auth/hooks'

const points = [
  'Pilih misi dan tingkat tantangan sesuai levelmu',
  'Foto sampahmu dan lihat hasil pemilahannya',
  'Kumpulkan XP, naikkan level, jaga streak',
  'Tukar poin dengan reward mitra hijau',
]

export default function Cta() {
  const { authed, dashboard } = useAuthCta()
  const ref = useRef<HTMLElement>(null)

  useMotion(ref, () => {
    gsap.fromTo(
      '.cta-c',
      { scale: 0.3, rotate: -40 },
      { scale: 1, rotate: 0, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top 85%', end: 'center 55%', scrub: true } },
    )
    gsap.fromTo(
      '.sw',
      { opacity: 0.15 },
      { opacity: 1, stagger: 0.15, ease: 'none', scrollTrigger: { trigger: '.cta-h', start: 'top 85%', end: 'bottom 55%', scrub: true } },
    )
  })

  return (
    <section ref={ref} id="cta" className="px-6 pb-28">
      <div className="relative mx-auto grid max-w-6xl gap-10 overflow-hidden rounded-[3rem] border-2 border-leaf bg-leaf px-8 py-16 text-white shadow-[12px_12px_0_0_var(--color-zest)] md:grid-cols-2 md:px-16 md:py-24">
        <div aria-hidden="true" className="cta-c pointer-events-none absolute -top-16 -right-16 size-56 rounded-full bg-zest" />
        <div aria-hidden="true" className="cta-c pointer-events-none absolute -bottom-12 -left-12 size-40 rounded-full bg-leaf-600" />
        <div className="relative">
          <h2 className="cta-h font-display text-4xl font-bold tracking-tight md:text-6xl">
            <ScrubText text="Mulai kebiasaan hijaumu." />
          </h2>
          <p className="mt-6 max-w-md text-lg text-white/75">Aksi kecilmu diverifikasi, dicatat, lalu dihargai dengan XP dan reward.</p>
        </div>
        <div className="relative">
          <ul className="space-y-3 text-lg">
            {points.map((p) => (
              <li key={p} className="flex gap-3"><span className="mt-2.5 size-2 shrink-0 rounded-full bg-zest" />{p}</li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-4">
            {authed ? (
              <Link to={dashboard} className="rounded-full bg-zest px-7 py-3.5 font-semibold text-leaf transition-colors hover:bg-zest-soft">Ke dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="rounded-full bg-zest px-7 py-3.5 font-semibold text-leaf transition-colors hover:bg-zest-soft">Masuk dan mulai</Link>
                <Link to="/register" className="rounded-full border-2 border-white/60 px-7 py-3.5 font-semibold transition-colors hover:bg-white hover:text-leaf">Buat akun EcoHabbit</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
