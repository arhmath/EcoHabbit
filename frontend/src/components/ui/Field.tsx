import { useId, useState, type ComponentProps } from 'react'

interface Props extends ComponentProps<'input'> {
  label: string
  error?: string
}

const Eye = ({ off }: { off: boolean }) => (
  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
    {off && <path d="M3 3l18 18" />}
  </svg>
)

// `ref` dari react-hook-form ikut lewat ...rest (React 19: ref adalah prop biasa).
export default function Field({ label, error, type = 'text', className = '', ...rest }: Props) {
  const id = useId()
  const [shown, setShown] = useState(false)
  const isPassword = type === 'password'

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      <div className="relative">
        <input
          {...rest}
          id={id}
          type={isPassword && shown ? 'text' : type}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-err` : undefined}
          className={`h-12 w-full rounded-2xl border-2 bg-white px-4 text-leaf transition-colors placeholder:text-leaf/50 focus:border-leaf focus:bg-zest-soft/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-leaf/30 ${
            error ? 'border-red-700' : 'border-leaf/30'
          } ${isPassword ? 'pr-12' : ''} ${className}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShown((s) => !s)}
            aria-label={shown ? 'Sembunyikan password' : 'Tampilkan password'}
            aria-pressed={shown}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-2xl text-leaf-600 hover:text-leaf"
          >
            <Eye off={shown} />
          </button>
        )}
      </div>
      {error && (
        <p id={`${id}-err`} role="alert" className="mt-1.5 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}
