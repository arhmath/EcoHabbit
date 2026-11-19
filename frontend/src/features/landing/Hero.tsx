import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap, magnetic, useMotion } from '../../lib/motion'
import { useAuthCta } from '../auth/hooks'

const words = ['Cukup', 'mulai', 'dari', 'satu', 'kebiasaan.']

const stats = [
  { label: 'Misi selesai', value: 26 },
  { label: 'Sampah dipilah', value: 138 },
  { label: 'Total XP', value: 1240 },
  { label: 'Streak (hari)', value: 12 },
]

const statTones = ['bg-zest text-leaf', 'bg-white text-leaf', 'bg-leaf-600 text-white', 'bg-zest-soft text-leaf']

const deck = [
  { title: 'Scan sampah', note: 'Plastik 4, kertas 2, organik 3', value: '+60 XP', tone: 'bg-zest text-leaf' },
  { title: 'Misi harian', note: 'Bawa tumbler sendiri hari ini', value: '+25 XP', tone: 'bg-leaf-600 text-white' },
  { title: 'Reward hijau', note: 'Voucher mitra siap ditukar', value: '120 poin', tone: 'bg-white text-leaf' },
]

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const [order, setOrder] = useState([0, 1, 2])
  const { authed, dashboard } = useAuthCta()

  useMotion(ref, () => {
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'power4.out' } })
    tl.from('.word', { yPercent: 115, duration: 1.1, stagger: 0.07 })
      .from('.intro', { y: 20, opacity: 0, duration: 0.9, stagger: 0.12 }, '-=0.6')
      .from('.win', { y: 60, opacity: 0, scale: 0.96, duration: 1.2 }, '-=1.2')
    gsap.utils.toArray<HTMLElement>('.count').forEach((el) => {
      const to = Number(el.dataset.to ?? 0)
      const s = { v: 0 }
      el.textContent = '0'
      tl.to(s, { v: to, duration: 2, ease: 'power2.out', onUpdate: () => { el.textContent = Math.round(s.v).toLocaleString('id-ID') } }, '-=0.6')
    })
    const play = () => tl.play()
    window.addEventListener('eh:ready', play, { once: true })
    gsap.to('.orb', {
      yPercent: (i: number) => -20 * (i + 1),
      ease: 'none',
      scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true },
    })
    const el = ref.current!
    const cleanups: (() => void)[] = []
    gsap.to('.badge-spin', { rotation: 360, duration: 26, ease: 'none', repeat: -1 })
    if (window.matchMedia('(pointer: fine)').matches) {
      gsap.utils.toArray<HTMLElement>('.magnet').forEach((m) => cleanups.push(magnetic(m)))
      const win = el.querySelector<HTMLElement>('.win')
      if (win) {
        // Kartu dashboard miring 3D mengikuti pointer.
        gsap.set(win, { transformPerspective: 1000 })
        const rY = gsap.quickTo(win, 'rotationY', { duration: 0.7, ease: 'power3' })
        const rX = gsap.quickTo(win, 'rotationX', { duration: 0.7, ease: 'power3' })
        const move = (e: PointerEvent) => {
          rY((e.clientX / window.innerWidth - 0.5) * 12)
          rX(-(e.clientY / window.innerHeight - 0.5) * 10)
        }
        el.addEventListener('pointermove', move)
        cleanups.push(() => el.removeEventListener('pointermove', move))
      }
    }
    return () => {
      window.removeEventListener('eh:ready', play)
      cleanups.forEach((c) => c())
    }
  })

  return (
    <section ref={ref} className="relative overflow-hidden bg-paper">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="orb absolute -top-28 -left-28 size-[26rem] rounded-full bg-zest" />
        <div className="orb absolute top-1/4 -right-24 size-72 rounded-full bg-leaf" />
        <div className="orb absolute bottom-24 left-[42%] size-24 rounded-full border-2 border-leaf bg-white" />
        <div className="orb absolute bottom-10 -left-10 size-40 rounded-full bg-leaf-600/20" />
      </div>

      <div className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-12 px-6 pt-32 pb-32 lg:grid-cols-[1fr_1fr]">
        {/* Stempel teks melingkar yang berputar. */}
        <svg aria-hidden="true" viewBox="0 0 120 120" className="badge-spin pointer-events-none absolute bottom-16 left-[46%] z-10 hidden size-32 lg:block">
          <circle cx="60" cy="60" r="58" fill="#c6f26b" stroke="#0b4a3a" strokeWidth="2" />
          <path id="badge-path" d="M60,60 m-42,0 a42,42 0 1,1 84,0 a42,42 0 1,1 -84,0" fill="none" />
          <text fontSize="10.5" fontWeight="800" letterSpacing="2.2" fill="#0b4a3a" fontFamily="Bricolage Grotesque, sans-serif">
            <textPath href="#badge-path">PILAH · CATAT · TUMBUH · JAGA STREAK ·</textPath>
          </text>
          <circle cx="60" cy="60" r="10" fill="#0b4a3a" />
        </svg>
        <div>
          <h1 className="font-display text-5xl leading-[0.95] font-extrabold tracking-tight sm:text-6xl xl:text-7xl">
            {words.map((w, i) => (
              <span key={w} className="mr-[0.25em] inline-block overflow-hidden pb-2 align-bottom">
                <span className={`word inline-block ${i === words.length - 1 ? 'rounded-2xl bg-zest px-3' : ''}`}>{w}</span>
              </span>
            ))}
          </h1>
          <p className="intro mt-8 max-w-lg text-lg leading-relaxed text-leaf/75">
            EcoHabbit mencatat aksi hijau harianmu, memverifikasinya, lalu mengubahnya jadi XP, level, dan reward.
          </p>
          <div className="intro mt-10 flex flex-wrap gap-4">
            <Link to={authed ? dashboard : '/register'} className="magnet rounded-full border-2 border-leaf bg-leaf px-7 py-3.5 font-semibold text-white shadow-[4px_4px_0_0_var(--color-zest)] transition-[background-color,box-shadow] hover:bg-leaf-600 hover:shadow-[6px_6px_0_0_var(--color-zest)]">{authed ? 'Ke dashboard' : 'Mulai sekarang'}</Link>
            <a href="#cara" className="magnet rounded-full border-2 border-leaf bg-white px-7 py-3.5 font-semibold transition-colors hover:bg-zest-soft">Lihat cara kerja</a>
          </div>
        </div>

        <div className="win rounded-3xl border-2 border-leaf bg-leaf text-white shadow-[10px_10px_0_0_var(--color-zest)]">
          <div className="flex items-center gap-2 border-b border-white/15 px-5 py-3" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-white/40" />
            <span className="size-2.5 rounded-full bg-white/70" />
            <span className="size-2.5 rounded-full bg-zest" />
            <span className="ml-3 text-xs text-white/60">ecohabbit / dashboard</span>
          </div>
          <div className="p-6">
            <h2 className="font-display text-xl font-bold">Dashboard Kebiasaan</h2>
            <p className="text-sm text-white/70">Ringkasan aksi hijau dan progres levelmu</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {stats.map((s, i) => (
                <div key={s.label} className={`rounded-2xl p-4 ${statTones[i]}`}>
                  <p className="text-xs opacity-70">{s.label}</p>
                  <p className="count font-display text-3xl font-bold tabular-nums" data-to={s.value}>
                    {s.value.toLocaleString('id-ID')}
                  </p>
                </div>
              ))}
            </div>
            <button
              type="button"
              aria-label="Tampilkan kartu berikutnya"
              onClick={() => setOrder((o) => [...o.slice(1), o[0]])}
              className="relative mt-6 block h-28 w-full text-left"
            >
              {deck.map((c, id) => {
                const pos = order.indexOf(id)
                return (
                  <span
                    key={c.title}
                    style={{ transform: `translateY(${pos * 12}px) scale(${1 - pos * 0.05})`, zIndex: 3 - pos, opacity: 1 - pos * 0.25 }}
                    className={`absolute inset-x-0 top-0 flex items-center justify-between rounded-2xl px-5 py-4 shadow-lg transition-all duration-500 motion-reduce:transition-none ${c.tone}`}
                  >
                    <span>
                      <span className="block font-display font-bold">{c.title}</span>
                      <span className="block text-sm opacity-75">{c.note}</span>
                    </span>
                    <span className="font-display font-bold">{c.value}</span>
                  </span>
                )
              })}
            </button>
            <p className="mt-10 text-xs text-white/60">Ketuk kartu untuk berpindah.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
