// Format tampilan: angka id-ID dan tanggal WIB (UX-05). Server mengirim ISO 8601 UTC (SRS 4.2).
const nf = new Intl.NumberFormat('id-ID')
export const num = (n: number) => nf.format(n)

const wib = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', ...o })
const d = (v: string | Date) => (v instanceof Date ? v : new Date(v))
export const fmtDate = (v: string | Date) => wib({ day: 'numeric', month: 'short', year: 'numeric' }).format(d(v))
export const fmtShort = (v: string | Date) => wib({ day: 'numeric', month: 'short' }).format(d(v))
export const fmtWeekday = (v: string | Date) => wib({ weekday: 'short' }).format(d(v))
export const fmtDateTime = (v: string | Date) => `${wib({ day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(d(v)).replace(/\./g, ':')} WIB`

/** Nilai input datetime-local dianggap WIB, diubah ke ISO UTC untuk dikirim ke server. */
export const wibInputToIso = (local: string) => new Date(`${local}:00+07:00`).toISOString()

export const isPast = (v: string) => new Date(v).getTime() < Date.now()

export function timeAgo(v: string): string {
  const diff = Date.now() - new Date(v).getTime()
  const min = Math.round(diff / 60_000)
  if (min < 1) return 'baru saja'
  if (min < 60) return `${min} menit lalu`
  const hr = Math.round(min / 60)
  if (hr < 24) return `${hr} jam lalu`
  const day = Math.round(hr / 24)
  return day < 7 ? `${day} hari lalu` : fmtShort(v)
}
