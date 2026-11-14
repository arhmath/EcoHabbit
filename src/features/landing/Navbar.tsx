import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap, useMotion } from '../../lib/motion'
import { useAuthCta } from '../auth/hooks'

export function Logo({ href = '#top' }: { href?: string }) {
  const cls = 'flex items-center gap-2 font-display text-xl font-bold tracking-tight'
  const inner = (
    <>
      {/* Ganti ikon ini dengan logo EcoHabbit milikmu (src/assets/logo.svg) */}
      <svg viewBox="0 0 24 24" className="size-7 text-sage" fill="currentColor" aria-hidden="true">
        <path d="M20 4C9 4 4 9.5 4 15c0 1.7.5 3.2 1.4 4.4C7 14 11 10.5 16 9c-4 2.5-7 6-8.4 11.2.8.5 1.6.8 2.5.8 6.3 0 10-6 9.9-17z" />
      </svg>
      EcoHabbit
    </>
  )
  // Path rute (/...) lewat router agar tidak reload, hash (#top) tetap anchor biasa.
  return href.startsWith('/') ? (
    <Link to={href} className={cls}>
      {inner}
    </Link>
  ) : (
    <a href={href} className={cls}>
      {inner}
    </a>
  )
}

export default function Navbar() {
  const ref = useRef<HTMLElement>(null)
  const { authed, dashboard } = useAuthCta()
  const links: (readonly [string, string])[] = [
    ['Cara kerja', '#cara'],
    ['Level', '#level'],
    ...(authed ? [] : [['Masuk', '/login'] as const]),
  ]
  useMotion(ref, () => {
    gsap.from(ref.current, { yPercent: -160, opacity: 0, duration: 1, delay: 0.3, ease: 'power4.out' })
  })

  return (
    <header
      ref={ref}
      className="fixed inset-x-0 top-4 z-50 mx-auto flex w-[min(92%,64rem)] items-center justify-between rounded-full border border-sage/20 bg-ink/60 px-5 py-3 backdrop-blur-xl"
    >
      <Logo />
      <nav aria-label="Navigasi utama" className="hidden gap-8 text-sm md:flex">
        {links.map(([label, href]) =>
          href.startsWith('/') ? (
            <Link key={href} to={href} className="text-mist/70 transition-colors hover:text-mist">
              {label}
            </Link>
          ) : (
            <a key={href} href={href} className="text-mist/70 transition-colors hover:text-mist">
              {label}
            </a>
          ),
        )}
      </nav>
      <Link to={authed ? dashboard : '/register'} className="rounded-full bg-sage px-5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-mist">
        {authed ? 'Dashboard' : 'Daftar'}
      </Link>
    </header>
  )
}
