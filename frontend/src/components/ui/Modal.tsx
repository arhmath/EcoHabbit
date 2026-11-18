import { useEffect, useId, useRef, type ReactNode } from 'react'
import Icon from '../Icon'

// Memakai elemen <dialog> bawaan browser: fokus terkunci di dalam dan Esc menutup tanpa kode tambahan.
export default function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dlg = ref.current!
    if (open && !dlg.open) dlg.showModal()
    if (!open && dlg.open) dlg.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className="m-auto max-h-[92vh] w-[min(92vw,34rem)] overflow-y-auto rounded-3xl border-2 border-leaf bg-white p-0 text-leaf shadow-[10px_10px_0_0_var(--color-zest)] backdrop:bg-ink/60"
    >
      {open && (
        <div className="anim-rise p-6 md:p-8">
          <div className="mb-5 flex items-start justify-between gap-4">
            <h2 id={titleId} className="font-display text-2xl font-extrabold tracking-tight">
              {title}
            </h2>
            <button type="button" onClick={onClose} aria-label="Tutup" className="-mt-1 -mr-2 flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-zest-soft">
              <Icon name="x" />
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  )
}
