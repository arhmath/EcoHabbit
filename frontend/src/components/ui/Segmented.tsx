/** Pilihan tunggal berbentuk pil, untuk filter dan tab sederhana. */
export default function Segmented<T extends string>({ options, value, onChange, label }: { options: readonly (readonly [T, string])[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div role="group" aria-label={label} className="inline-flex max-w-full flex-wrap gap-1 rounded-full border-2 border-leaf bg-white p-1">
      {options.map(([v, text]) => (
        <button
          key={v}
          type="button"
          aria-pressed={v === value}
          onClick={() => onChange(v)}
          className={`min-h-10 rounded-full px-4 text-sm font-semibold transition-colors ${v === value ? 'bg-leaf text-white' : 'text-leaf hover:bg-zest-soft'}`}
        >
          {text}
        </button>
      ))}
    </div>
  )
}
