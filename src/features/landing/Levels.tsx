import { useRef } from 'react'
import { gsap, useMotion } from '../../lib/motion'

// Nama level masih placeholder, sesuaikan dengan tabel levels dari System Analyst.
const levels = [
  { name: 'Bibit', note: 'Satu aksi hijau pertama menanam bijinya.' },
  { name: 'Tunas', note: 'Kebiasaanmu mulai berakar dan menembus tanah.' },
  { name: 'Tanaman muda', note: 'Streak yang konsisten membuat daun bertambah.' },
  { name: 'Tanaman dewasa', note: 'Batang makin kuat, aksi hijau jadi rutinitas.' },
  { name: 'Pohon', note: 'Puncak konsistensi: rindang dan memberi manfaat.' },
]

const LEAF = 'M0 0C-20 -12 -24 -36 0 -54C24 -36 20 -12 0 0Z'
const STEM_BASE = 440
const STEM_TOP = 170

// y = posisi daun di batang, r = sudut, s = skala. Waktu kemunculan dihitung dari y.
const leaves = [
  { y: 412, r: -55, s: 0.6, f: '#14604a' },
  { y: 412, r: 55, s: 0.6, f: '#ffffff' },
  { y: 372, r: -62, s: 0.85, f: '#ffffff' },
  { y: 372, r: 62, s: 0.85, f: '#14604a' },
  { y: 330, r: -52, s: 1, f: '#14604a' },
  { y: 300, r: 56, s: 1, f: '#ffffff' },
  { y: 270, r: -46, s: 1, f: '#14604a' },
  { y: 240, r: 60, s: 1.1, f: '#ffffff' },
  { y: 215, r: -66, s: 1.1, f: '#14604a' },
]

const crowns = [
  { cx: 200, cy: 150, r: 62, f: '#14604a' },
  { cx: 142, cy: 172, r: 46, f: '#ffffff' },
  { cx: 258, cy: 172, r: 46, f: '#0b4a3a' },
  { cx: 200, cy: 92, r: 44, f: '#ffffff' },
  { cx: 150, cy: 108, r: 36, f: '#0b4a3a' },
  { cx: 250, cy: 108, r: 36, f: '#14604a' },
]

const spores = [
  { l: '12%', t: '70%' },
  { l: '82%', t: '60%' },
  { l: '20%', t: '30%' },
  { l: '75%', t: '22%' },
  { l: '50%', t: '12%' },
  { l: '90%', t: '85%' },
]

export default function Levels() {
  const ref = useRef<HTMLElement>(null)
  const N = levels.length

  useMotion(ref, () => {
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: ref.current, start: 'top top', end: '+=300%', pin: true, scrub: 0.8 },
    })

    // Tanaman tumbuh mengikuti scroll: batang digambar, daun mekar, lalu mahkota pohon.
    tl.fromTo('.ground', { scaleX: 0, transformOrigin: '50% 50%' }, { scaleX: 1, duration: 0.6, ease: 'power2.out' }, 0)
    tl.fromTo('.stem', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: N }, 0)
    tl.fromTo('.prog-fill', { scaleX: 0 }, { scaleX: 1, duration: N }, 0)

    gsap.utils.toArray<SVGElement>('.leaf').forEach((el) => {
      const at = ((STEM_BASE - Number(el.dataset.y)) / (STEM_BASE - STEM_TOP)) * N + 0.05
      tl.fromTo(el, { scale: 0, transformOrigin: '50% 100%' }, { scale: 1, duration: 0.7, ease: 'back.out(2)' }, at)
    })
    tl.fromTo('.crown', { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.7)' }, N - 1.1)

    // Teks level bergantian dan titik progres menyala.
    tl.set('.lt-0', { opacity: 1, y: 0 }, 0)
    tl.set(`.lt-${N - 1}`, { opacity: 0 }, 0)
    for (let i = 1; i < N; i++) {
      tl.to(`.lt-${i - 1}`, { opacity: 0, y: -24, duration: 0.25 }, i - 0.1)
      tl.fromTo(`.lt-${i}`, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.25 }, i - 0.05)
    }
    for (let i = 0; i < N; i++) {
      tl.fromTo(`.dot-${i}`, { backgroundColor: '#ffffff', scale: 1 }, { backgroundColor: '#0b4a3a', scale: 1.25, duration: 0.2 }, i)
    }

    // Spora melayang terus menerus, terlepas dari scroll.
    gsap.to('.spore', {
      y: -36,
      x: (i: number) => (i % 2 ? 14 : -14),
      duration: 2.6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.3,
    })
  })

  return (
    <section ref={ref} id="level" className="relative flex min-h-screen items-center overflow-hidden bg-paper">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-6 py-20 md:grid-cols-2 md:gap-14">
        <div>
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-6xl">Setiap kebiasaan menumbuhkan tanamanmu.</h2>
          <p className="mt-4 max-w-md text-lg text-leaf/70">Scroll untuk melihat tanamanmu tumbuh dari bibit sampai pohon.</p>

          <div className="relative mt-8 h-44 md:h-48" aria-live="polite">
            {levels.map((l, i) => (
              <div key={l.name} className={`lt lt-${i} absolute inset-0 ${i === N - 1 ? '' : 'opacity-0'}`}>
                <p className="font-display text-7xl leading-none font-extrabold text-leaf md:text-8xl">
                  Lv {i + 1}
                </p>
                <p className="mt-3 inline-block rounded-full bg-zest px-4 py-1 font-display text-xl font-bold text-leaf">{l.name}</p>
                <p className="mt-3 max-w-sm text-leaf/70">{l.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 max-w-md">
            <div className="h-2.5 overflow-hidden rounded-full border-2 border-leaf bg-white">
              <div className="prog-fill h-full origin-left bg-leaf" />
            </div>
            <ol className="mt-3 flex justify-between">
              {levels.map((l, i) => (
                <li key={l.name} className="flex flex-col items-center gap-1 text-xs font-semibold text-leaf/70">
                  <span className={`dot-${i} size-4 rounded-full border-2 border-leaf bg-leaf`} />
                  Lv {i + 1}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="relative mx-auto aspect-[4/4.6] w-full max-w-md overflow-hidden rounded-[3rem] border-2 border-leaf bg-zest shadow-[10px_10px_0_0_var(--color-leaf)]">
          <div aria-hidden="true" className="absolute -top-16 -left-16 size-52 rounded-full bg-zest-soft" />
          <div aria-hidden="true" className="absolute -right-12 bottom-24 size-40 rounded-full bg-leaf-600/25" />
          {spores.map((p, i) => (
            <span key={i} aria-hidden="true" className="spore absolute size-3 rounded-full bg-leaf/50" style={{ left: p.l, top: p.t }} />
          ))}
          <svg viewBox="0 0 400 480" className="relative size-full" role="img" aria-label="Tanaman yang tumbuh dari bibit menjadi pohon">
            <ellipse className="ground" cx="200" cy="446" rx="150" ry="24" fill="#0b4a3a" />
            <path
              className="stem"
              d={`M200 ${STEM_BASE} C196 380 204 300 200 ${STEM_TOP}`}
              pathLength={1}
              fill="none"
              stroke="#0b4a3a"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray="1"
              style={{ strokeDashoffset: 0 }}
            />
            {leaves.map((l, i) => (
              <g key={i} transform={`translate(200 ${l.y}) rotate(${l.r}) scale(${l.s})`}>
                <path className="leaf" data-y={l.y} d={LEAF} fill={l.f} stroke="#0b4a3a" strokeWidth="3" strokeLinejoin="round" />
              </g>
            ))}
            {crowns.map((c, i) => (
              <circle key={i} className="crown" cx={c.cx} cy={c.cy} r={c.r} fill={c.f} stroke="#0b4a3a" strokeWidth="3" />
            ))}
          </svg>
        </div>
      </div>
    </section>
  )
}
