import type { ComponentProps } from 'react'

interface Props extends ComponentProps<'button'> {
  loading?: boolean
}

export default function Button({ loading, disabled, children, className = '', ...rest }: Props) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-7 font-semibold text-mist transition-colors hover:bg-forest-700 disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
    >
      {loading && <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-mist/30 border-t-mist motion-reduce:animate-none" />}
      {children}
    </button>
  )
}
