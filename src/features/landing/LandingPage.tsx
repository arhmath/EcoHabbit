import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../../lib/motion'
import Preloader from './Preloader'
import Navbar from './Navbar'
import Hero from './Hero'
import Hud from './Hud'
import Marquee from './Marquee'
import Features from './Features'
import Steps from './Steps'
import Levels from './Levels'
import Cta from './Cta'
import Footer from './Footer'

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
    <div id="top" className="theme-light min-h-screen bg-paper text-leaf">
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
        <Marquee />
        <Hud />
        <Features />
        <Steps />
        <Levels />
        <Cta />
      </main>
      <Footer />
    </div>
  )
}
