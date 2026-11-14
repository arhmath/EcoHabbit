import type { RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/** Menjalankan animasi hanya jika pengguna tidak memilih reduced motion. Selector dibatasi ke scope. */
export function useMotion(scope: RefObject<HTMLElement | null>, setup: () => void | (() => void)) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia(scope.current ?? undefined)
      mm.add('(prefers-reduced-motion: no-preference)', () => setup())
      return () => mm.revert()
    },
    { scope },
  )
}

/** Efek magnet: elemen mengikuti pointer saat didekati. Mengembalikan fungsi pembersih. */
export function magnetic(el: HTMLElement, strength = 0.35) {
  const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' })
  const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' })
  const move = (e: PointerEvent) => {
    const r = el.getBoundingClientRect()
    x((e.clientX - (r.left + r.width / 2)) * strength)
    y((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const leave = () => {
    x(0)
    y(0)
  }
  el.addEventListener('pointermove', move)
  el.addEventListener('pointerleave', leave)
  return () => {
    el.removeEventListener('pointermove', move)
    el.removeEventListener('pointerleave', leave)
  }
}

export { gsap, ScrollTrigger }
