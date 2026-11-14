// Garis polisi versi EcoHabbit: pita hijau bergaris miring yang berjalan, berisi pesan pemilahan sampah.
// Murni dekoratif (aria-hidden), tidak menangkap klik, dan berhenti bergerak saat reduced motion.
const defaultPhrases = [
  'GARIS HIJAU · DILARANG BUANG SEMBARANG',
  'PILAH DULU SEBELUM MELINTAS',
  'ZONA KEBIASAAN BAIK',
  'AREA PEMILAHAN AKTIF',
]

const tones = {
  sage: 'bg-sage text-ink',
  forest: 'bg-forest-700 text-mist',
  mist: 'bg-mist text-ink',
} as const

interface Props {
  phrases?: string[]
  tone?: keyof typeof tones
  reverse?: boolean
  /** Detik untuk satu putaran penuh. Makin besar makin pelan. */
  duration?: number
  className?: string
}

const Leaf = () => (
  <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="currentColor">
    <path d="M20 4C9 4 4 9.5 4 15c0 1.7.5 3.2 1.4 4.4C7 14 11 10.5 16 9c-4 2.5-7 6-8.4 11.2.8.5 1.6.8 2.5.8 6.3 0 10-6 9.9-17z" />
  </svg>
)

export default function Tape({ phrases = defaultPhrases, tone = 'sage', reverse = false, duration = 45, className = '' }: Props) {
  // Dua salinan baris agar putaran mulus pada translateX(-50%).
  const row = (key: string) => (
    <ul key={key} className="flex shrink-0 items-center">
      {[...phrases, ...phrases].map((p, i) => (
        <li key={`${p}-${i}`} className="flex items-center gap-5 pr-5">
          <span>{p}</span>
          <Leaf />
        </li>
      ))}
    </ul>
  )

  return (
    <div aria-hidden="true" className={`pointer-events-none overflow-hidden shadow-lg shadow-black/40 select-none ${tones[tone]} ${className}`}>
      <div className="tape-stripes h-2" />
      <div
        className="animate-tape flex w-max py-2.5 font-display text-xs font-extrabold tracking-[0.25em] whitespace-nowrap motion-reduce:animate-none sm:text-sm"
        style={{ animationDuration: `${duration}s`, animationDirection: reverse ? 'reverse' : 'normal' }}
      >
        {row('a')}
        {row('b')}
      </div>
      <div className="tape-stripes h-2" />
    </div>
  )
}
