import { useRef } from 'react'
import { gsap, useMotion } from '../../lib/motion'

const steps = [
  { title: 'Lakukan aksi hijau', body: 'Pilih misi harian atau pilah sampahmu hari ini.' },
  { title: 'Foto dan verifikasi', body: 'Unggah foto. AI memeriksa bahwa buktinya sesuai.' },
  { title: 'Dapatkan XP dan poin', body: 'XP menaikkan level tanamanmu, poin bisa ditukar reward.' },
]

export default function Steps() {
  const ref = useRef<HTMLElement>(null)

  useMotion(ref, () => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: ref.current, start: 'top top', end: '+=150%', pin: true, scrub: true },
    })
    tl.fromTo('.line', { scaleY: 0 }, { scaleY: 1, ease: 'none', duration: steps.length }, 0)
    gsap.utils.toArray<HTMLElement>('.step').forEach((el, i) => {
      tl.fromTo(el, { opacity: 0.25, x: 0 }, { opacity: 1, x: 24, duration: 1 }, i)
    })
  })

  return (
    <section ref={ref} id="cara" className="bg-forest-900">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-2">
        <h2 className="font-display text-4xl font-bold tracking-tight md:text-6xl">Tiga langkah dari aksi ke reward.</h2>
        <ol className="relative pl-10">
          <div aria-hidden="true" className="absolute top-0 left-0 h-full w-0.5 bg-forest-700" />
          <div aria-hidden="true" className="line absolute top-0 left-0 h-full w-0.5 origin-top bg-sage" />
          {steps.map((s, i) => (
            <li key={s.title} className="step py-8">
              <span className="font-display text-sm font-semibold text-sage">Langkah {i + 1}</span>
              <h3 className="mt-1 font-display text-2xl font-semibold md:text-3xl">{s.title}</h3>
              <p className="mt-2 max-w-sm text-mist/70">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
