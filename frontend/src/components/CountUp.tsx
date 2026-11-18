import { useEffect, useRef } from 'react'
import { num } from '../lib/format'
import { gsap } from '../lib/motion'

/** Angka yang menghitung naik dari nilai sebelumnya, seperti statistik di hero landing. Reduced motion: langsung tampil. */
export default function CountUp({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const from = useRef(0)

  useEffect(() => {
    const el = ref.current!
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = num(value)
      from.current = value
      return
    }
    const s = { v: from.current }
    const tween = gsap.to(s, {
      v: value,
      duration: 1.4,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = num(Math.round(s.v))
        from.current = s.v
      },
    })
    return () => {
      tween.kill()
    }
  }, [value])

  return (
    <span ref={ref} className={`tabular-nums ${className ?? ''}`}>
      {num(value)}
    </span>
  )
}
