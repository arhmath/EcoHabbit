import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from '../lib/motion'

// Nama halaman tujuan yang tampil di layar transisi.
const LABELS: Record<string, string> = {
  '/': 'Beranda',
  '/login': 'Masuk',
  '/register': 'Daftar',
  '/dashboard': 'Dashboard',
  '/admin/dashboard': 'Panel admin',
  '/challenges': 'Misi',
  '/scan': 'Scan sampah',
  '/leaderboard': 'Peringkat',
  '/profile': 'Profil',
}

// Login <-> register sudah punya animasi panel geser sendiri di AuthPage.
const isAuthPath = (p: string) => p === '/login' || p === '/register'

/**
 * Saat pengguna menekan tautan ke halaman lain (login, register, dashboard, dst.), panel hijau naik dari
 * bawah menutup layar berisi nama halaman tujuan, rute berpindah saat layar tertutup, lalu panel naik keluar.
 * Tautan anchor (#section) di landing page tidak memakai transisi ini.
 */
export default function RouteTransition() {
  const navigate = useNavigate()
  const navigateRef = useRef(navigate)
  navigateRef.current = navigate
  const root = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    // Reduced motion: tautan berjalan seperti biasa tanpa animasi.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rootEl = root.current!
    const panelEl = panel.current!
    let busy = false
    gsap.set(panelEl, { yPercent: 120 })

    const run = async (to: string, name: string) => {
      busy = true
      label.current!.textContent = name
      const lines = rootEl.querySelectorAll('.rt-in')
      document.body.style.overflow = 'hidden'
      try {
        await new Promise<void>((done) => {
          gsap
            .timeline({ onComplete: () => done() })
            .set(rootEl, { autoAlpha: 1, pointerEvents: 'auto' })
            .fromTo(panelEl, { yPercent: 120 }, { yPercent: 0, duration: 0.8, ease: 'power4.inOut' })
            .fromTo(lines, { yPercent: 110 }, { yPercent: 0, duration: 0.6, stagger: 0.1, ease: 'power4.out' }, '-=0.4')
        })
        // Rute (termasuk chunk lazy-nya) dimuat selagi layar tertutup.
        await navigateRef.current(to)
        window.scrollTo(0, 0)
        await new Promise<void>((done) => {
          gsap.to(panelEl, { yPercent: -120, duration: 0.8, delay: 0.35, ease: 'power4.inOut', onComplete: () => done() })
        })
      } finally {
        gsap.set(rootEl, { autoAlpha: 0, pointerEvents: 'none' })
        gsap.set(panelEl, { yPercent: 120 })
        document.body.style.overflow = ''
        busy = false
      }
    }

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element).closest<HTMLAnchorElement>('a[href]')
      if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return
      const url = new URL(a.href, window.location.href)
      if (url.origin !== window.location.origin) return
      // Tautan ke halaman yang sama (termasuk anchor #section) dibiarkan.
      if (url.pathname === window.location.pathname && url.search === window.location.search) return
      if (isAuthPath(window.location.pathname) && isAuthPath(url.pathname)) return

      // Fase capture: jalan lebih dulu dari handler Link milik React Router, jadi navigasinya kita tahan dulu.
      e.preventDefault()
      e.stopPropagation()
      if (busy) return
      void run(url.pathname + url.search + url.hash, LABELS[url.pathname] ?? 'EcoHabbit')
    }

    document.addEventListener('click', onClick, true)
    return () => {
      document.removeEventListener('click', onClick, true)
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none invisible fixed inset-0 z-[90] overflow-hidden">
      <div ref={panel} className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-leaf px-6 text-center text-zest">
        {/* Tepi atas dan bawah melengkung supaya panel terasa menyapu layar. */}
        <span className="absolute inset-x-0 bottom-full h-[14vh] bg-leaf" style={{ borderRadius: '50% 50% 0 0 / 100% 100% 0 0' }} />
        <span className="absolute inset-x-0 top-full h-[14vh] bg-leaf" style={{ borderRadius: '0 0 50% 50% / 0 0 100% 100%' }} />
        <span className="overflow-hidden">
          <span className="rt-in block font-display text-lg font-semibold text-white/70">Menuju</span>
        </span>
        <span className="overflow-hidden pb-2">
          <span ref={label} className="rt-in block font-display text-5xl font-extrabold tracking-tight sm:text-7xl md:text-8xl" />
        </span>
      </div>
    </div>
  )
}
