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

type Pt = [number, number]

// Cabang utama pohon: 4 titik kontrol kurva bezier kubik, w = tebal garis, y = titik tumbuh di batang.
const mainBranches: { p: [Pt, Pt, Pt, Pt]; w: number }[] = [
  { p: [[200, 318], [178, 300], [146, 292], [104, 250]], w: 6 },
  { p: [[200, 300], [224, 282], [262, 276], [298, 236]], w: 6 },
  { p: [[200, 262], [176, 244], [140, 232], [96, 184]], w: 6.5 },
  { p: [[200, 250], [226, 232], [266, 216], [308, 168]], w: 6.5 },
  { p: [[200, 214], [180, 188], [150, 166], [124, 112]], w: 6 },
  { p: [[200, 204], [222, 176], [254, 150], [282, 96]], w: 6 },
  { p: [[200, 176], [196, 146], [206, 110], [199, 64]], w: 7 },
]

// Ranting: tumbuh dari tengah cabang induk. off = selisih titik kontrol dari titik awal.
const twigDefs: { parent: number; t: number; off: [Pt, Pt, Pt] }[] = [
  { parent: 0, t: 0.6, off: [[-2, -24], [-12, -40], [-16, -62]] },
  { parent: 1, t: 0.6, off: [[4, -24], [14, -40], [18, -62]] },
  { parent: 2, t: 0.55, off: [[-4, -22], [-18, -40], [-22, -64]] },
  { parent: 3, t: 0.55, off: [[6, -22], [20, -40], [24, -64]] },
  { parent: 4, t: 0.6, off: [[12, -14], [30, -26], [40, -50]] },
  { parent: 5, t: 0.6, off: [[-12, -14], [-30, -26], [-40, -50]] },
]

const STEM_DUR = 4 // batang selesai tumbuh di detik ke-4 dari 5 satuan timeline
const BR_DUR = 0.7
const TWIG_DUR = 0.45
const LEAF_POP = 0.25

const bez = ([p0, p1, p2, p3]: [Pt, Pt, Pt, Pt], t: number): Pt => {
  const m = 1 - t
  const a = m * m * m, b = 3 * m * m * t, c = 3 * m * t * t, d = t * t * t
  return [a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]]
}
// Sudut arah kurva dalam derajat, 0 = menunjuk ke atas, positif = searah jarum jam.
const heading = ([p0, p1, p2, p3]: [Pt, Pt, Pt, Pt], t: number) => {
  const m = 1 - t
  const dx = 3 * m * m * (p1[0] - p0[0]) + 6 * m * t * (p2[0] - p1[0]) + 3 * t * t * (p3[0] - p2[0])
  const dy = 3 * m * m * (p1[1] - p0[1]) + 6 * m * t * (p2[1] - p1[1]) + 3 * t * t * (p3[1] - p2[1])
  return (Math.atan2(dx, -dy) * 180) / Math.PI
}
// Variasi deterministik (tanpa Math.random) supaya hasil render selalu sama.
const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}
const FOLIAGE = ['#14604a', '#ffffff', '#e2f9ae', '#0b4a3a', '#14604a']
const dPath = ([p0, p1, p2, p3]: [Pt, Pt, Pt, Pt]) => `M${p0[0]} ${p0[1]} C${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]} ${p3[0]} ${p3[1]}`

type Branch = { d: string; w: number; at: number; dur: number }
type Foliage = { x: number; y: number; r: number; s: number; f: string; at: number }

const branches: Branch[] = []
const foliage: Foliage[] = []
let seed = 0

// Daun berselang-seling di kiri-kanan cabang, ditambah satu daun di ujung.
const addLeaves = (curve: [Pt, Pt, Pt, Pt], start: number, dur: number, count: number, size: number) => {
  for (let k = 0; k <= count; k++) {
    const tip = k === count
    const t = tip ? 1 : 0.25 + (0.7 * k) / count
    const [x, y] = bez(curve, t)
    const side = k % 2 ? 1 : -1
    const r = heading(curve, t) + (tip ? (rnd(seed) - 0.5) * 24 : side * (38 + rnd(seed) * 28))
    foliage.push({ x, y, r, s: tip ? size * 1.25 : size * (0.75 + rnd(seed + 1) * 0.5), f: FOLIAGE[Math.floor(rnd(seed + 2) * FOLIAGE.length)], at: start + dur * t })
    seed += 3
  }
}

mainBranches.forEach((b) => {
  const startY = b.p[0][1]
  const at = Math.min(((STEM_BASE - startY) / (STEM_BASE - STEM_TOP)) * STEM_DUR, 3.6)
  branches.push({ d: dPath(b.p), w: b.w, at, dur: BR_DUR })
  addLeaves(b.p, at, BR_DUR, 8, 0.6)
})
twigDefs.forEach((tw) => {
  const parent = mainBranches[tw.parent]
  const pAt = branches[tw.parent].at
  const p0 = bez(parent.p, tw.t)
  const curve: [Pt, Pt, Pt, Pt] = [p0, [p0[0] + tw.off[0][0], p0[1] + tw.off[0][1]], [p0[0] + tw.off[1][0], p0[1] + tw.off[1][1]], [p0[0] + tw.off[2][0], p0[1] + tw.off[2][1]]]
  const at = pAt + BR_DUR * tw.t
  branches.push({ d: dPath(curve), w: 3.5, at, dur: TWIG_DUR })
  addLeaves(curve, at, TWIG_DUR, 4, 0.55)
})

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
    tl.fromTo('.stem', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: STEM_DUR }, 0)
    // Batang makin tebal dan pangkalnya melebar seperti akar saat tanaman menjadi pohon.
    tl.to('.stem', { strokeWidth: 16, duration: 2 }, 2)
    tl.fromTo('.trunk', { scaleY: 0, transformOrigin: '50% 100%' }, { scaleY: 1, duration: 0.9, ease: 'power2.out' }, 2.2)
    tl.fromTo('.prog-fill', { scaleX: 0 }, { scaleX: 1, duration: N }, 0)

    gsap.utils.toArray<SVGElement>('.leaf').forEach((el) => {
      const y = Number(el.dataset.y)
      const at = ((STEM_BASE - y) / (STEM_BASE - STEM_TOP)) * STEM_DUR + 0.05
      tl.fromTo(el, { scale: 0, transformOrigin: '50% 100%' }, { scale: 1, duration: 0.7, ease: 'back.out(2)' }, at)
      // Daun tanaman muda rontok saat cabang pohon mulai tumbuh; daun di batang bawah lebih dulu.
      tl.to(el, { scale: 0, duration: 0.4, ease: 'power2.in' }, y >= 300 ? 2.9 : 3.3)
    })
    // Cabang digambar dari batang, lalu daun muncul satu per satu mengikuti ujung cabang.
    gsap.utils.toArray<SVGElement>('.br').forEach((el) => {
      tl.fromTo(el, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: Number(el.dataset.dur), ease: 'power1.out' }, Number(el.dataset.at))
    })
    gsap.utils.toArray<SVGElement>('.fol').forEach((el) => {
      tl.fromTo(el, { scale: 0, transformOrigin: '50% 100%' }, { scale: 1, duration: LEAF_POP, ease: 'back.out(2)' }, Number(el.dataset.at))
    })

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
            <path className="trunk" d="M176 452 C190 438 193 414 195 384 L205 384 C207 414 210 438 224 452 Z" fill="#0b4a3a" />
            {branches.map((b, i) => (
              <path
                key={i}
                className="br"
                data-at={b.at}
                data-dur={b.dur}
                d={b.d}
                pathLength={1}
                fill="none"
                stroke="#0b4a3a"
                strokeWidth={b.w}
                strokeLinecap="round"
                strokeDasharray="1"
                style={{ strokeDashoffset: 0 }}
              />
            ))}
            {foliage.map((l, i) => (
              <g key={i} transform={`translate(${l.x.toFixed(1)} ${l.y.toFixed(1)}) rotate(${l.r.toFixed(1)}) scale(${l.s.toFixed(2)})`}>
                <path className="fol" data-at={l.at} d={LEAF} fill={l.f} stroke="#0b4a3a" strokeWidth={(2.2 / l.s).toFixed(1)} strokeLinejoin="round" />
              </g>
            ))}
          </svg>
        </div>
      </div>
    </section>
  )
}
