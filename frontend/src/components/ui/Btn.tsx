import type { ComponentProps } from 'react'
import { Link } from 'react-router-dom'

const variants = {
  primary: 'border-leaf bg-leaf text-white hover:bg-leaf-600',
  zest: 'border-leaf bg-zest text-leaf hover:bg-zest-soft',
  ghost: 'border-leaf bg-white text-leaf hover:bg-zest-soft',
  onleaf: 'border-zest bg-zest text-leaf hover:bg-zest-soft',
  outline: 'border-white/60 bg-transparent text-white hover:bg-white hover:text-leaf',
  danger: 'border-red-800 bg-red-700 text-white hover:bg-red-800',
} as const
export type Variant = keyof typeof variants

// min-h-11 menjaga area sentuh minimal 44 px (NFR-05).
export const btnClass = (variant: Variant = 'primary', small = false, extra = '') =>
  `inline-flex min-h-11 items-center justify-center gap-2 rounded-full border-2 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
    small ? 'px-4 text-sm' : 'px-6'
  } ${variants[variant]} ${extra}`

interface BtnProps extends ComponentProps<'button'> {
  variant?: Variant
  small?: boolean
  loading?: boolean
}

export function Btn({ variant, small, loading, disabled, children, className = '', type = 'button', ...rest }: BtnProps) {
  return (
    <button {...rest} type={type} disabled={disabled || loading} aria-busy={loading || undefined} className={btnClass(variant, small, className)}>
      {loading && <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-current/30 border-t-current motion-reduce:animate-none" />}
      {children}
    </button>
  )
}

interface LinkBtnProps extends ComponentProps<typeof Link> {
  variant?: Variant
  small?: boolean
}

export function LinkBtn({ variant, small, className = '', ...rest }: LinkBtnProps) {
  return <Link {...rest} className={btnClass(variant, small, className)} />
}
