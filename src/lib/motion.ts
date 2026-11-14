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

export { gsap, ScrollTrigger }
