import type { ComponentProps } from 'react'

// Kartu blok warna datar dengan tepi tegas dan bayangan offset, sama seperti kartu di landing page.
const tones = {
  white: 'bg-white text-leaf shadow-[6px_6px_0_0_var(--color-leaf)]',
  leaf: 'bg-leaf text-white shadow-[6px_6px_0_0_var(--color-zest)]',
  zest: 'bg-zest text-leaf shadow-[6px_6px_0_0_var(--color-leaf)]',
  soft: 'bg-zest-soft text-leaf shadow-[6px_6px_0_0_var(--color-leaf)]',
  mid: 'bg-leaf-600 text-white shadow-[6px_6px_0_0_var(--color-zest)]',
} as const
export type Tone = keyof typeof tones

interface Props extends ComponentProps<'div'> {
  tone?: Tone
  /** Naik sedikit dan bayangan membesar saat disorot. */
  lift?: boolean
}

// Kelas `rise` dipakai AppShell untuk animasi masuk dari bawah saat halaman terbuka.
export default function Card({ tone = 'white', lift = false, className = '', ...rest }: Props) {
  const hover = lift ? 'transition-[box-shadow,translate] duration-300 hover:-translate-y-0.5 hover:shadow-[9px_9px_0_0_var(--color-leaf)]' : ''
  return <div {...rest} className={`rise rounded-3xl border-2 border-leaf p-5 md:p-6 ${tones[tone]} ${hover} ${className}`} />
}
