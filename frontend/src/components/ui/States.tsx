import type { ReactNode } from 'react'
import type { Resource } from '../../hooks/useResource'
import { Btn } from './Btn'
import Icon from '../Icon'

export function Skeleton({ className = '' }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-2xl bg-leaf/10 motion-reduce:animate-none ${className}`} />
}

/** UX-01: kondisi kosong yang ramah, dengan ajakan tindakan bila ada. */
export function EmptyState({ title, body, action }: { title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-3xl border-2 border-dashed border-leaf/40 px-6 py-10 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-zest text-leaf">
        <Icon name="recycle" className="size-6" />
      </span>
      <p className="font-display text-xl font-bold">{title}</p>
      {body && <p className="max-w-sm text-sm text-leaf/70">{body}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

/** UX-01: galat dengan tombol coba lagi. */
export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-2 rounded-3xl border-2 border-red-700/50 bg-red-50 px-6 py-10 text-center text-red-900">
      <p className="font-display text-xl font-bold">Data belum bisa dimuat</p>
      <p className="max-w-sm text-sm">{message}</p>
      {onRetry && (
        <Btn variant="ghost" small onClick={onRetry} className="mt-2">
          <Icon name="refresh" className="size-4" /> Coba lagi
        </Btn>
      )}
    </div>
  )
}

/** Membungkus resource: skeleton saat memuat, ErrorState saat gagal, selain itu render datanya. */
export function Async<T>({ res, skeleton, children }: { res: Resource<T>; skeleton: ReactNode; children: (data: T) => ReactNode }) {
  if (res.data === undefined) return res.error ? <ErrorState message={res.error.message} onRetry={res.reload} /> : <>{skeleton}</>
  return <>{children(res.data)}</>
}
