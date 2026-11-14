const points = [
  'Pilih misi dan tingkat tantangan sesuai levelmu',
  'Foto sampahmu dan lihat hasil pemilahannya',
  'Kumpulkan XP, naikkan level, jaga streak',
  'Tukar poin dengan reward mitra hijau',
]

export default function Cta() {
  return (
    <section id="cta" className="px-6 pb-28">
      <div className="mx-auto grid max-w-6xl gap-10 rounded-[3rem] bg-mist px-8 py-16 text-ink md:grid-cols-2 md:px-16 md:py-24">
        <div>
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-6xl">Mulai kebiasaan hijaumu.</h2>
          <p className="mt-6 max-w-md text-lg text-ink/70">Aksi kecilmu diverifikasi, dicatat, lalu dihargai dengan XP dan reward.</p>
        </div>
        <div>
          <ul className="space-y-3 text-lg">
            {points.map((p) => (
              <li key={p} className="flex gap-3"><span className="mt-2.5 size-2 shrink-0 rounded-full bg-forest-700" />{p}</li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#top" className="rounded-full bg-ink px-7 py-3.5 font-semibold text-mist transition-colors hover:bg-forest-700">Masuk dan mulai</a>
            <a href="#top" className="rounded-full border border-ink/30 px-7 py-3.5 font-semibold transition-colors hover:bg-sage">Buat akun EcoHabbit</a>
          </div>
        </div>
      </div>
    </section>
  )
}
