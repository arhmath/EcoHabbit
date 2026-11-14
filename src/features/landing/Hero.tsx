import { useRef, useState } from 'react'
import { gsap, useMotion } from '../../lib/motion'

const words = ['Cukup', 'mulai', 'dari', 'satu', 'kebiasaan.']

const stats = [
  { label: 'Misi selesai', value: 26 },
  { label: 'Sampah dipilah', value: 138 },
  { label: 'Total XP', value: 1240 },
  { label: 'Streak (hari)', value: 12 },
]

const deck = [
  { title: 'Scan sampah', note: 'Plastik 4, kertas 2, organik 3', value: '+60 XP', tone: 'bg-sage text-ink' },
  { title: 'Misi harian', note: 'Bawa tumbler sendiri hari ini', value: '+25 XP', tone: 'bg-forest-700 text-mist' },
  { title: 'Reward hijau', note: 'Voucher mitra siap ditukar', value: '120 poin', tone: 'bg-mist text-ink' },
]

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const [order, setOrder] = useState([0, 1, 2])

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
    return () => window.removeEventListener('eh:ready', play)
  })

  return (
    <section ref={ref} className="relative overflow-hidden bg-linear-to-b from-ink to-forest-900">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="orb absolute -top-24 -left-24 size-[28rem] rounded-full bg-forest-700/50 blur-3xl" />
        <div className="orb absolute top-1/3 right-0 size-[22rem] rounded-full bg-sage/20 blur-3xl" />
      </div>

      <div className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-12 px-6 pt-32 pb-20 lg:grid-cols-[1fr_1fr]">
        <div>
          <h1 className="font-display text-5xl leading-[0.95] font-extrabold tracking-tight sm:text-6xl xl:text-7xl">
            {words.map((w) => (
              <span key={w} className="mr-[0.25em] inline-block overflow-hidden pb-2 align-bottom">
                <span className="word inline-block">{w}</span>
              </span>
            ))}
          </h1>
          <p className="intro mt-8 max-w-lg text-lg leading-relaxed text-mist/75">
            EcoHabbit mencatat aksi hijau harianmu, memverifikasinya, lalu mengubahnya jadi XP, level, dan reward.
          </p>
          <div className="intro mt-10 flex flex-wrap gap-4">
            <a href="#cta" className="rounded-full bg-sage px-7 py-3.5 font-semibold text-ink transition-colors hover:bg-mist">Mulai sekarang</a>
            <a href="#cara" className="rounded-full border border-sage/40 px-7 py-3.5 font-semibold transition-colors hover:bg-forest-800">Lihat cara kerja</a>
          </div>
        </div>

        <div className="win rounded-3xl border border-sage/20 bg-forest-900/80 shadow-2xl shadow-black/40 backdrop-blur">
          <div className="flex items-center gap-2 border-b border-sage/15 px-5 py-3" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-forest-700" />
            <span className="size-2.5 rounded-full bg-sage" />
            <span className="size-2.5 rounded-full bg-mist" />
            <span className="ml-3 text-xs text-mist/50">ecohabbit / dashboard</span>
          </div>
          <div className="p-6">
            <h2 className="font-display text-xl font-bold">Dashboard Kebiasaan</h2>
            <p className="text-sm text-mist/60">Ringkasan aksi hijau dan progres levelmu</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {stats.map((s) => (
                <div key={s.label} className="rounded-2xl bg-forest-800 p-4">
                  <p className="text-xs text-mist/60">{s.label}</p>
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
            <p className="mt-10 text-xs text-mist/50">Ketuk kartu untuk berpindah.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
