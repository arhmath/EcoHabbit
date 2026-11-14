import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../../lib/motion'
import Preloader from './Preloader'
import Navbar from './Navbar'
import Hero from './Hero'
import Hud from './Hud'
import Tape from './Tape'
import Features from './Features'
import Steps from './Steps'
import Levels from './Levels'
import Cta from './Cta'

// Preloader cukup sekali per sesi, supaya kembali dari /login tidak menunggu lagi.
const SEEN_KEY = 'eh.preloaded'
const seenPreloader = () => {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}

export default function LandingPage() {
  const [loading, setLoading] = useState(() => !seenPreloader())

  useEffect(() => {
    document.title = 'EcoHabbit | Ubah kebiasaan kecil jadi dunia yang lebih bersih'
    // Tanpa preloader tidak ada yang mengirim eh:ready, padahal animasi Hero menunggunya.
    if (!loading) window.dispatchEvent(new Event('eh:ready'))
  }, [])

  useEffect(() => {
    document.fonts.ready.then(() => ScrollTrigger.refresh())
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis()
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])

  return (
    <div id="top">
      {loading && (
        <Preloader
          onDone={() => {
            try {
              sessionStorage.setItem(SEEN_KEY, '1')
            } catch {
              /* abaikan */
            }
            setLoading(false)
          }}
        />
      )}
      <Navbar />
      <main>
        <Hero />
        {/* Garis polisi EcoHabbit: dua pita bersilang di batas hero. */}
        <div aria-hidden="true" className="relative z-20 h-0 -translate-y-16 overflow-x-clip">
          <Tape tone="sage" className="absolute -left-[5%] w-[110%] -translate-y-1/2 -rotate-[5deg]" duration={50} />
          <Tape
            tone="forest"
            reverse
            duration={60}
            phrases={['AREA PEMILAHAN AKTIF', 'ORGANIK · KERTAS · PLASTIK · KACA · KARDUS', 'JAGA STREAK-MU']}
            className="absolute -left-[5%] w-[110%] -translate-y-1/2 rotate-[3.5deg]"
          />
        </div>
        <Hud />
        <Features />
        <Steps />
        <Levels />
        <Cta />
      </main>
      <footer className="overflow-hidden border-t border-sage/20 px-6 pt-12 pb-8 text-center">
        <p aria-hidden="true" className="font-display text-[clamp(2rem,10vw,7rem)] font-extrabold tracking-[0.3em] text-forest-700">
          ECOHABBIT
        </p>
        <p className="mt-6 text-sm text-mist/60">© {new Date().getFullYear()} EcoHabbit. Capstone Project.</p>
      </footer>
    </div>
  )
}
