const views = [
  ['Dashboard', 'Ringkasan XP, streak, dan misi harianmu.'],
  ['Challenge', 'Misi harian dan tantangan sesuai levelmu.'],
  ['Scan Sampah', 'Foto sampah, lihat hasil pemilahannya.'],
  ['Leaderboard', 'Bandingkan XP dengan pengguna lain.'],
  ['Reward', 'Tukar poin dengan voucher mitra hijau.'],
  ['Komunitas', 'Lihat dan ajukan event lingkungan.'],
  ['Profil', 'Level, tanaman, dan riwayat progresmu.'],
  ['Panel Admin', 'Kelola tantangan, reward, dan pengguna.'],
]

export default function Features() {
  return (
    <section id="fitur" className="mx-auto max-w-6xl px-6 py-28">
      <h2 className="max-w-3xl font-display text-4xl font-bold tracking-tight md:text-6xl">Semua tampilan, satu platform.</h2>
      <p className="mt-6 max-w-lg text-lg text-mist/70">Masuk untuk membuka setiap bagian. Menu menyesuaikan peran akunmu.</p>
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {views.map(([title, body], i) => (
          <a key={title} href="#cta" className="group flex min-h-48 flex-col justify-between rounded-3xl border border-sage/20 bg-forest-900 p-6 transition-colors duration-300 hover:bg-sage hover:text-ink">
            <span className="font-display text-sm font-semibold text-sage transition-colors group-hover:text-ink">{String(i + 1).padStart(2, '0')}</span>
            <span>
              <span className="block font-display text-2xl font-semibold">{title}</span>
              <span className="mt-2 block text-sm leading-relaxed text-mist/70 transition-colors group-hover:text-ink/80">{body}</span>
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
