import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/motion'

export default function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const count = useRef<HTMLSpanElement>(null)
  const tl = useRef<ReturnType<typeof gsap.timeline> | null>(null)

  useEffect(() => {
    const finish = () => {
      document.body.style.overflow = ''
      window.dispatchEvent(new Event('eh:ready'))
      onDone()
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish()
      return
    }
    document.body.style.overflow = 'hidden'
    const s = { v: 0 }
    const ctx = gsap.context(() => {
      tl.current = gsap
        .timeline({ onComplete: finish })
        .from('.pl-letter', { yPercent: 100, opacity: 0, stagger: 0.05, duration: 0.8, ease: 'power4.out' })
        .to(s, { v: 100, duration: 2.2, ease: 'power1.inOut', onUpdate: () => { if (count.current) count.current.textContent = String(Math.round(s.v)) } }, 0.3)
        .fromTo('.pl-bar', { scaleX: 0 }, { scaleX: 1, duration: 2.2, ease: 'power1.inOut' }, 0.3)
        .to(root.current, { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, '+=0.2')
    }, root)
    return () => {
      ctx.revert()
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div ref={root} className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-zest px-6 text-center text-leaf">
      <p aria-label="EcoHabbit" className="font-display text-3xl font-extrabold tracking-[0.4em] sm:text-5xl">
        {'ECOHABBIT'.split('').map((c, i) => (
          <span key={i} aria-hidden="true" className="pl-letter inline-block">{c}</span>
        ))}
      </p>
      <p className="text-sm text-leaf/70">Menumbuhkan kebiasaan hijau, satu aksi sehari</p>
      <div className="h-1.5 w-48 overflow-hidden rounded-full bg-leaf/25"><div className="pl-bar h-1.5 origin-left rounded-full bg-leaf" /></div>
      <p className="font-display text-2xl font-bold tabular-nums"><span ref={count}>0</span>%</p>
      <button onClick={() => tl.current?.timeScale(6)} className="absolute right-6 bottom-6 text-sm text-leaf/70 hover:text-leaf">
        Lewati
      </button>
    </div>
  )
}
