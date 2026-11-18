import { useEffect, type ReactNode } from 'react'

export default function PageHeader({ eyebrow, title, note, actions }: { eyebrow: string; title: string; note?: string; actions?: ReactNode }) {
  useEffect(() => {
    document.title = `${title} | EcoHabbit`
  }, [title])
  return (
    <header className="rise mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="font-display text-sm font-bold text-leaf-600">{eyebrow}</p>
        <h1 className="mt-1 font-display text-4xl leading-none font-extrabold tracking-tight md:text-5xl">{title}</h1>
        {note && <p className="mt-3 max-w-xl text-leaf/70">{note}</p>}
      </div>
      {actions}
    </header>
  )
}
