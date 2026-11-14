import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../../lib/motion'
import Preloader from './Preloader'
import Navbar from './Navbar'
import Hero from './Hero'
import Hud from './Hud'
import Features from './Features'
import Steps from './Steps'
import Levels from './Levels'
import Cta from './Cta'

export default function LandingPage() {
  const [loading, setLoading] = useState(true)

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
      {loading && <Preloader onDone={() => setLoading(false)} />}
      <Navbar />
      <main>
        <Hero />
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
