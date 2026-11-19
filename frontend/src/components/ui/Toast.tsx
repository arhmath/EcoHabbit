import { create } from 'zustand'
import Icon from '../Icon'

type Tone = 'ok' | 'err' | 'info'
interface ToastItem {
  id: number
  tone: Tone
  text: string
}
interface ToastState {
  items: ToastItem[]
  push: (tone: Tone, text: string) => void
  drop: (id: number) => void
}

let nextId = 0
const useToasts = create<ToastState>((set, get) => ({
  items: [],
  push: (tone, text) => {
    const id = ++nextId
    set((s) => ({ items: [...s.items, { id, tone, text }].slice(-3) }))
    setTimeout(() => get().drop(id), 5000)
  },
  drop: (id) => set((s) => ({ items: s.items.filter((t) => t.id !== id) })),
}))

/** UX-02: pemberitahuan aksi berhasil atau gagal. */
export const toast = {
  ok: (text: string) => useToasts.getState().push('ok', text),
  err: (text: string) => useToasts.getState().push('err', text),
  info: (text: string) => useToasts.getState().push('info', text),
}

const tones: Record<Tone, string> = {
  ok: 'bg-zest text-leaf',
  err: 'bg-red-100 text-red-900',
  info: 'bg-white text-leaf',
}

export function ToastHost() {
  const items = useToasts((s) => s.items)
  const drop = useToasts((s) => s.drop)
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-[80] flex flex-col items-center gap-2 px-4 lg:bottom-6">
      {items.map((t) => (
        <div key={t.id} className={`anim-rise pointer-events-auto flex max-w-md items-center gap-3 rounded-2xl border-2 border-leaf py-3 pr-2 pl-4 text-sm font-semibold shadow-[4px_4px_0_0_var(--color-leaf)] ${tones[t.tone]}`}>
          <span>{t.text}</span>
          <button type="button" onClick={() => drop(t.id)} aria-label="Tutup pemberitahuan" className="flex size-9 shrink-0 items-center justify-center rounded-full hover:bg-leaf/10">
            <Icon name="x" className="size-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
