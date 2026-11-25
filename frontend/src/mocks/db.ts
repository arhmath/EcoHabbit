// "Server palsu" untuk pengembangan frontend selama backend belum siap (SRS 2.5). Semua perhitungan XP, level,
// streak, dan poin sengaja dilakukan DI SINI agar komponen UI tetap hanya menampilkan data dari "server" (BR-09).
// Nilai ambang level dan aturan hadiah hanyalah contoh; nilai resmi menunggu Q-01 sampai Q-03 di SRS bagian 12.
import { ApiError } from '../api/errors'
import type { User } from '../types/api'
import type {
  ActivityCharts, AdminStats, AdminUser, Challenge, DashboardSummary, EventItem, EventsPayload, HistoryItem, Leaderboard, LeaderboardRow,
  Level, Mission, Paged, PointTransaction, Profile, Redemption, Reward, Submission, WasteCategory, WasteCode, WasteLogResult,
} from '../types/domain'
import { decodeMockToken } from './auth'

// ---------- util ----------
const WIB = 'Asia/Jakarta'
export const dayKey = (d: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: WIB }).format(d)
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000)
const today = () => dayKey(new Date())
const iso = (d: Date = new Date()) => d.toISOString()
let seq = 1000
const nextId = () => ++seq
const sleep = (ms = 350, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, ms)
    signal?.addEventListener('abort', () => {
      clearTimeout(t)
      reject(new DOMException('Dibatalkan', 'AbortError'))
    })
  })
const code = () => `ECO-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
const paginate = <T,>(all: T[], page: number, per: number): Paged<T> => ({ items: all.slice((page - 1) * per, page * per), total: all.length, page, per_page: per })

// ---------- data master ----------
export const LEVELS: Level[] = [
  { level: 1, name: 'Bibit', min_xp: 0 },
  { level: 2, name: 'Tunas', min_xp: 100 },
  { level: 3, name: 'Tanaman muda', min_xp: 300 },
  { level: 4, name: 'Tanaman dewasa', min_xp: 650 },
  { level: 5, name: 'Pohon', min_xp: 1100 },
]
const levelFor = (xp: number) => [...LEVELS].reverse().find((l) => xp >= l.min_xp) ?? LEVELS[0]
const EVENT_MIN_LEVEL = 3 // BR-07 / Q-03: nilai asli TBD

export const WASTE: WasteCategory[] = [
  { code: 'kertas', name: 'Kertas', kind: 'anorganik', points_per_item: 2, tip: 'Pisahkan dari kertas basah atau berminyak, lalu rapikan agar mudah didaur ulang.' },
  { code: 'plastik', name: 'Plastik', kind: 'anorganik', points_per_item: 3, tip: 'Bilas sisa makanan dan keringkan sebelum dimasukkan ke bank sampah.' },
  { code: 'kaca', name: 'Kaca', kind: 'anorganik', points_per_item: 4, tip: 'Bungkus pecahan dengan kertas tebal dan beri tanda agar aman dibawa petugas.' },
  { code: 'kardus', name: 'Kardus', kind: 'anorganik', points_per_item: 2, tip: 'Lipat rata supaya hemat tempat dan jaga tetap kering.' },
  { code: 'organik', name: 'Organik', kind: 'organik', points_per_item: 1, tip: 'Jadikan kompos atau pisahkan dari sampah anorganik agar tidak membusuk bersamaan.' },
  { code: 'lainnya', name: 'Lainnya', kind: 'anorganik', points_per_item: 1, tip: 'Cek apakah ada drop point khusus, misalnya untuk baterai atau elektronik.' },
]

let challenges: Challenge[] = [
  { id: 1, title: 'Bawa tumbler sendiri', description: 'Gunakan tumbler atau botol isi ulang, bukan botol plastik sekali pakai.', criteria: 'Foto tumbler milikmu terlihat jelas, idealnya sedang terisi minuman.', category: 'Konsumsi', type: 'daily', level_required: 1, xp_reward: 25, points_reward: 15, verification: 'photo', daily_quota: 1, is_active: true, starts_at: null, ends_at: null },
  { id: 2, title: 'Pilah sampah rumah tangga', description: 'Pisahkan sampah organik dan anorganik di rumahmu hari ini.', criteria: 'Foto dua wadah atau kantong terpisah beserta isinya.', category: 'Sampah', type: 'daily', level_required: 1, xp_reward: 30, points_reward: 20, verification: 'photo', daily_quota: 1, is_active: true, starts_at: null, ends_at: null },
  { id: 3, title: 'Matikan lampu yang tidak terpakai', description: 'Biasakan mematikan lampu dan perangkat saat meninggalkan ruangan.', criteria: 'Tanpa foto. Tekan selesai setelah kamu melakukannya.', category: 'Energi', type: 'daily', level_required: 1, xp_reward: 15, points_reward: 10, verification: 'none', daily_quota: 1, is_active: true, starts_at: null, ends_at: null },
  { id: 4, title: 'Jalan kaki atau bersepeda', description: 'Tempuh perjalanan pendek tanpa kendaraan bermotor.', criteria: 'Foto sepeda atau rute jalan kakimu, lengkap dengan lokasi yang terlihat.', category: 'Transportasi', type: 'daily', level_required: 2, xp_reward: 40, points_reward: 25, verification: 'photo', daily_quota: 1, is_active: true, starts_at: null, ends_at: null },
  { id: 5, title: 'Tolak sedotan plastik', description: 'Minta minumanmu tanpa sedotan plastik.', criteria: 'Tanpa foto. Tekan selesai setelah kamu melakukannya.', category: 'Konsumsi', type: 'daily', level_required: 2, xp_reward: 20, points_reward: 10, verification: 'none', daily_quota: 1, is_active: true, starts_at: null, ends_at: null },
  { id: 6, title: 'Buat kompos dari sisa makanan', description: 'Olah sisa sayur dan buah menjadi kompos sederhana.', criteria: 'Foto wadah kompos beserta bahan yang kamu masukkan.', category: 'Sampah', type: 'dynamic', level_required: 3, xp_reward: 60, points_reward: 40, verification: 'photo', daily_quota: 1, is_active: true, starts_at: null, ends_at: null },
  { id: 7, title: 'Tanam satu tanaman', description: 'Tanam bibit di pot atau lahan kosong di sekitarmu.', criteria: 'Foto tanaman yang baru kamu tanam bersama potnya.', category: 'Lingkungan', type: 'dynamic', level_required: 3, xp_reward: 80, points_reward: 50, verification: 'photo', daily_quota: 1, is_active: true, starts_at: null, ends_at: null },
  { id: 8, title: 'Bersih-bersih lingkungan', description: 'Ajak teman memungut sampah di sekitar tempat tinggalmu.', criteria: 'Foto kegiatan dan hasil sampah yang terkumpul.', category: 'Komunitas', type: 'dynamic', level_required: 4, xp_reward: 120, points_reward: 80, verification: 'photo', daily_quota: 1, is_active: true, starts_at: null, ends_at: null },
]

let rewards: Reward[] = [
  { id: 1, title: 'Voucher kopi gratis', description: 'Satu minuman ukuran reguler di gerai mitra.', terms: 'Berlaku satu kali per kode. Tidak dapat digabung dengan promo lain.', partner: 'Kopi Hijau', type: 'voucher', points_price: 120, stock: 14, valid_until: '2027-03-31', is_active: true },
  { id: 2, title: 'Isi ulang sabun cair 500 ml', description: 'Isi ulang sabun cair di toko refill, bawa wadahmu sendiri.', terms: 'Wajib membawa wadah sendiri. Berlaku di cabang Yogyakarta.', partner: 'Toko Refill Bumi', type: 'voucher', points_price: 90, stock: 8, valid_until: '2027-02-28', is_active: true },
  { id: 3, title: 'Tote bag daur ulang', description: 'Tas kain dari limbah tekstil, desain eksklusif EcoHabbit.', terms: 'Diambil di titik penukaran. Maksimal satu per akun.', partner: 'Thrift Daun', type: 'merchandise', points_price: 250, stock: 5, valid_until: '2027-06-30', is_active: true },
  { id: 4, title: 'Donasi bibit pohon', description: 'Poinmu diubah menjadi satu bibit pohon yang ditanam mitra.', terms: 'Bukti penanaman dikirim ke email akunmu maksimal 30 hari.', partner: 'Bank Sampah Jogja', type: 'donasi', points_price: 150, stock: 40, valid_until: '2027-12-31', is_active: true },
  { id: 5, title: 'Sedotan stainless set', description: 'Satu set sedotan stainless dengan sikat pembersih.', terms: 'Stok terbatas, ambil di titik penukaran.', partner: 'Toko Refill Bumi', type: 'merchandise', points_price: 180, stock: 0, valid_until: '2027-01-31', is_active: true },
  { id: 6, title: 'Diskon 20% pakaian bekas', description: 'Potongan 20% untuk satu transaksi di toko thrift mitra.', terms: 'Minimal belanja Rp50.000. Tidak berlaku akhir pekan.', partner: 'Thrift Daun', type: 'voucher', points_price: 110, stock: 20, valid_until: '2027-04-30', is_active: true },
]

let events: (EventItem & { owner_id: number })[] = [
  { id: 1, title: 'Aksi bersih Sungai Code', description: 'Memungut sampah di bantaran sungai bersama komunitas lokal. Sarung tangan disediakan.', location: 'Jembatan Gondolayu, Yogyakarta', starts_at: '2026-12-06T01:00:00Z', ends_at: '2026-12-06T04:00:00Z', quota: 40, status: 'approved', review_note: null, proposer_name: 'Nadia Putri', is_mine: false, owner_id: 11 },
  { id: 2, title: 'Workshop kompos rumahan', description: 'Belajar membuat kompos dari sisa dapur, dipandu praktisi urban farming.', location: 'Kampus UIN Sunan Kalijaga', starts_at: '2026-12-13T02:00:00Z', ends_at: '2026-12-13T05:00:00Z', quota: 30, status: 'approved', review_note: null, proposer_name: 'Raka Pratama', is_mine: false, owner_id: 12 },
  { id: 3, title: 'Tukar baju bekas', description: 'Bawa pakaian layak pakai, tukar dengan milik orang lain.', location: 'Taman Pintar, Yogyakarta', starts_at: '2026-10-25T03:00:00Z', ends_at: '2026-10-25T07:00:00Z', quota: 60, status: 'approved', review_note: null, proposer_name: 'Salsa Aulia', is_mine: false, owner_id: 13 },
  { id: 4, title: 'Pilah sampah di kos', description: 'Sosialisasi pemilahan sampah untuk penghuni kos sekitar kampus.', location: 'Sapen, Yogyakarta', starts_at: '2027-01-10T02:00:00Z', ends_at: '2027-01-10T04:00:00Z', quota: 25, status: 'pending', review_note: null, proposer_name: 'Dimas Saputra', is_mine: false, owner_id: 14 },
  { id: 5, title: 'Pasar barang bekas komunitas', description: 'Lapak barang bekas layak pakai untuk mengurangi limbah rumah tangga.', location: 'Alun-alun Selatan', starts_at: '2027-01-17T01:00:00Z', ends_at: '2027-01-17T06:00:00Z', quota: 80, status: 'pending', review_note: null, proposer_name: 'Ayu Lestari', is_mine: false, owner_id: 15 },
]

interface Peer { id: number; name: string; email: string; xp: number; week: number[]; points: number; streak: number; active: boolean }
const PEERS: Peer[] = [
  [11, 'Nadia Putri', 1320, [40, 60, 30, 80, 50, 70, 55]], [12, 'Raka Pratama', 960, [30, 20, 50, 40, 60, 10, 45]], [13, 'Salsa Aulia', 780, [20, 40, 30, 20, 60, 50, 30]],
  [14, 'Dimas Saputra', 610, [10, 30, 0, 40, 20, 30, 15]], [15, 'Ayu Lestari', 540, [0, 25, 35, 20, 30, 0, 40]], [16, 'Fajar Nugroho', 410, [15, 0, 25, 30, 0, 20, 10]],
  [17, 'Intan Maharani', 360, [20, 20, 0, 15, 25, 10, 0]], [18, 'Bayu Wicaksono', 275, [0, 10, 20, 0, 15, 25, 20]], [19, 'Citra Dewi', 190, [10, 0, 10, 20, 0, 15, 5]],
  [20, 'Rizky Ramadhan', 120, [5, 10, 0, 10, 0, 5, 20]], [21, 'Laras Ayu', 70, [0, 0, 10, 15, 0, 5, 0]], [22, 'Yoga Prasetyo', 30, [0, 5, 0, 0, 10, 0, 0]],
].map(([id, name, xp, week]) => ({ id: id as number, name: name as string, email: `${(name as string).split(' ')[0].toLowerCase()}@ecohabbit.test`, xp: xp as number, week: week as number[], points: Math.round((xp as number) * 0.6), streak: Math.max(0, Math.round((xp as number) / 200)), active: true }))

// ---------- state per pengguna ----------
interface UserState {
  xp: number
  points: number
  streak_current: number
  streak_longest: number
  activity: Record<string, { xp: number; active: boolean }>
  submissions: Submission[]
  attempts: Record<string, number>
  waste: { at: string; category: WasteCode; quantity: number }[]
  wasteLogs: WasteLogResult[]
  history: HistoryItem[]
  redemptions: Redemption[]
  pointTx: PointTransaction[]
  verified: number
  scans: number
}
const blank = (): UserState => ({ xp: 0, points: 0, streak_current: 0, streak_longest: 0, activity: {}, submissions: [], attempts: {}, waste: [], wasteLogs: [], history: [], redemptions: [], pointTx: [], verified: 0, scans: 0 })

function seedBudi(): UserState {
  const s = blank()
  ;[[6, 0, false], [5, 30, true], [4, 55, true], [3, 40, true], [2, 75, true], [1, 40, true]].forEach(([n, xp, active]) => {
    s.activity[dayKey(daysAgo(n as number))] = { xp: xp as number, active: active as boolean }
  })
  s.xp = 240
  s.points = 180
  s.streak_current = 5
  s.streak_longest = 12
  s.verified = 6
  s.scans = 2
  const at = (n: number) => iso(daysAgo(n))
  s.history = [
    { id: 'h1', type: 'mission', title: 'Bawa tumbler sendiri', detail: 'Misi terverifikasi', xp: 25, points: 15, at: at(1) },
    { id: 'h2', type: 'scan', title: 'Scan sampah', detail: '7 item terdeteksi', xp: 15, points: 17, at: at(1) },
    { id: 'h3', type: 'mission', title: 'Pilah sampah rumah tangga', detail: 'Misi terverifikasi', xp: 30, points: 20, at: at(2) },
    { id: 'h4', type: 'mission', title: 'Jalan kaki atau bersepeda', detail: 'Misi terverifikasi', xp: 40, points: 25, at: at(2) },
    { id: 'h5', type: 'scan', title: 'Scan sampah', detail: '5 item terdeteksi', xp: 20, points: 13, at: at(3) },
    { id: 'h6', type: 'mission', title: 'Matikan lampu yang tidak terpakai', detail: 'Misi terverifikasi', xp: 15, points: 10, at: at(4) },
    { id: 'h7', type: 'mission', title: 'Bawa tumbler sendiri', detail: 'Misi terverifikasi', xp: 25, points: 15, at: at(5) },
  ]
  s.waste = [
    { at: at(1), category: 'plastik', quantity: 4 }, { at: at(1), category: 'kertas', quantity: 2 }, { at: at(1), category: 'organik', quantity: 1 },
    { at: at(3), category: 'kardus', quantity: 2 }, { at: at(3), category: 'kaca', quantity: 1 }, { at: at(3), category: 'plastik', quantity: 2 },
  ]
  s.pointTx = [
    { id: 1, label: 'Misi: Bawa tumbler sendiri', amount: 15, at: at(1) }, { id: 2, label: 'Scan sampah', amount: 17, at: at(1) },
    { id: 3, label: 'Misi: Pilah sampah rumah tangga', amount: 20, at: at(2) }, { id: 4, label: 'Penukaran: Donasi bibit pohon', amount: -150, at: at(2) },
    { id: 5, label: 'Misi: Jalan kaki atau bersepeda', amount: 25, at: at(2) }, { id: 6, label: 'Penyesuaian awal akun', amount: 253, at: at(6) },
  ]
  s.redemptions = [{ id: 1, reward_id: 4, reward_title: 'Donasi bibit pohon', partner: 'Bank Sampah Jogja', points_spent: 150, code: 'ECO-7QK2-M9XD', status: 'used', redeemed_at: at(2), valid_until: '2027-12-31' }]
  return s
}

const states = new Map<number, UserState>([[2, seedBudi()]])
const stateFor = (id: number) => {
  if (!states.has(id)) states.set(id, blank())
  return states.get(id)!
}
const me = (): User => {
  const u = decodeMockToken()
  if (!u) throw new ApiError(401, 'Sesi Anda berakhir. Silakan masuk kembali.')
  return u
}

function profileOf(user: User): Profile {
  const s = stateFor(user.id)
  const lv = levelFor(s.xp)
  return {
    ...user, level: lv.level, level_name: lv.name, xp: s.xp, level_min_xp: lv.min_xp, next_level_xp: LEVELS[lv.level]?.min_xp ?? null,
    points: s.points, streak_current: s.streak_current, streak_longest: s.streak_longest, active_today: s.activity[today()]?.active ?? false,
  }
}

function award(s: UserState, xp: number, points: number, txLabel: string, h: Pick<HistoryItem, 'type' | 'title' | 'detail'>) {
  const before = levelFor(s.xp)
  const day = (s.activity[today()] ??= { xp: 0, active: false })
  if (!day.active) {
    day.active = true
    s.streak_current += 1
    s.streak_longest = Math.max(s.streak_longest, s.streak_current)
  }
  day.xp += xp
  s.xp += xp
  s.points += points
  s.pointTx.unshift({ id: nextId(), label: txLabel, amount: points, at: iso() })
  s.history.unshift({ id: `h${nextId()}`, ...h, xp, points, at: iso() })
  const after = levelFor(s.xp)
  const up = after.level > before.level
  return { leveled_up: up, new_level: up ? after.level : null, new_level_name: up ? after.name : null }
}

// ---------- profil, dashboard ----------
export async function getProfile(): Promise<Profile> {
  await sleep(250)
  return profileOf(me())
}

export async function getLevels(): Promise<Level[]> {
  await sleep(150)
  return LEVELS
}

function toMission(c: Challenge, s: UserState, level: number): Mission {
  const todays = s.submissions.filter((x) => x.challenge_id === c.id && dayKey(new Date(x.created_at)) === today())
  const used = todays.filter((x) => x.status !== 'rejected').length
  const latest = todays[0]
  const locked = c.level_required > level
  return {
    ...c, locked, unlock_xp: locked ? LEVELS[c.level_required - 1].min_xp : null,
    today_status: latest?.status ?? null, rejection_reason: latest?.status === 'rejected' ? latest.rejection_reason : null, quota_left: Math.max(0, c.daily_quota - used),
  }
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  await sleep()
  const user = me()
  const s = stateFor(user.id)
  const profile = profileOf(user)
  const missions = challenges.filter((c) => c.is_active).map((c) => toMission(c, s, profile.level)).filter((m) => !m.locked)
  return {
    profile,
    missions_today: missions.slice(0, 5),
    streak_week: Array.from({ length: 7 }, (_, i) => {
      const date = dayKey(daysAgo(6 - i))
      return { date, active: s.activity[date]?.active ?? false }
    }),
    totals: { missions_verified: s.verified, waste_items: s.waste.reduce((n, w) => n + w.quantity, 0) },
  }
}

export async function getActivityCharts(): Promise<ActivityCharts> {
  await sleep()
  const s = stateFor(me().id)
  const since = Date.now() - 7 * 86_400_000
  return {
    xp_by_day: Array.from({ length: 7 }, (_, i) => {
      const date = dayKey(daysAgo(6 - i))
      return { date, xp: s.activity[date]?.xp ?? 0 }
    }),
    waste_by_category: WASTE.map((w) => ({
      category: w.code,
      quantity: s.waste.filter((x) => x.category === w.code && new Date(x.at).getTime() >= since).reduce((n, x) => n + x.quantity, 0),
    })),
  }
}

export async function getHistory(page: number, perPage = 5): Promise<Paged<HistoryItem>> {
  await sleep(300)
  return paginate(stateFor(me().id).history, page, perPage)
}

export async function updateProfile(patch: { name?: string; avatar_url?: string | null }): Promise<User> {
  const { mockUpdateMe } = await import('./auth')
  return mockUpdateMe(patch)
}

// ---------- challenge ----------
export async function getMissions(): Promise<Mission[]> {
  await sleep()
  const s = stateFor(me().id)
  const lv = levelFor(s.xp).level
  return challenges.filter((c) => c.is_active).map((c) => toMission(c, s, lv))
}

export async function getMission(id: number): Promise<Mission> {
  await sleep(250)
  const s = stateFor(me().id)
  const c = challenges.find((x) => x.id === id && x.is_active)
  if (!c) throw new ApiError(404, 'Misi tidak ditemukan atau sudah tidak aktif.')
  return toMission(c, s, levelFor(s.xp).level)
}

function verifySubmission(s: UserState, c: Challenge, sub: Submission, fileName: string) {
  // Demo: nama file yang memuat "tolak" akan ditolak AI, supaya alur ditolak dan kirim ulang bisa dicoba.
  if (/tolak/i.test(fileName)) {
    sub.status = 'rejected'
    sub.rejection_reason = 'Foto belum menunjukkan aksi yang diminta. Ambil ulang dengan objek terlihat jelas dan cahaya cukup.'
    return
  }
  sub.status = 'verified'
  s.verified += 1
  sub.result = { xp_earned: c.xp_reward, points_earned: c.points_reward, ...award(s, c.xp_reward, c.points_reward, `Misi: ${c.title}`, { type: 'mission', title: c.title, detail: 'Misi terverifikasi' }) }
}

export async function submitMission(id: number, file: File | null): Promise<Submission> {
  await sleep(500)
  const user = me()
  const s = stateFor(user.id)
  const c = challenges.find((x) => x.id === id && x.is_active)
  if (!c) throw new ApiError(404, 'Misi tidak ditemukan atau sudah tidak aktif.')
  const m = toMission(c, s, levelFor(s.xp).level)
  if (m.locked) throw new ApiError(403, `Misi ini terbuka di level ${c.level_required}.`)
  const key = `${id}:${today()}`
  if ((s.attempts[key] ?? 0) >= 5) throw new ApiError(429, 'Terlalu banyak percobaan untuk misi ini. Coba lagi dalam 120 detik.', {}, 120)
  if (m.quota_left <= 0) throw new ApiError(429, 'Kuota harian misi ini sudah habis. Coba lagi besok.')
  s.attempts[key] = (s.attempts[key] ?? 0) + 1
  const sub: Submission = { id: nextId(), challenge_id: id, status: 'pending', rejection_reason: null, created_at: iso(), result: null }
  s.submissions.unshift(sub)
  if (c.verification === 'none') verifySubmission(s, c, sub, '')
  else setTimeout(() => verifySubmission(s, c, sub, file?.name ?? ''), 2400)
  return { ...sub }
}

export async function getSubmission(id: number): Promise<Submission> {
  await sleep(200)
  const sub = stateFor(me().id).submissions.find((x) => x.id === id)
  if (!sub) throw new ApiError(404, 'Pengerjaan tidak ditemukan.')
  return { ...sub }
}

// ---------- scan ----------
export const getWasteCategories = async (): Promise<WasteCategory[]> => (await sleep(150), WASTE)

export async function createWasteLog(file: File, signal?: AbortSignal): Promise<WasteLogResult> {
  await sleep(1900, signal)
  const s = stateFor(me().id)
  // Demo: nama file memuat "kosong" menghasilkan hasil kosong (WS-06). Selain itu hasil ditentukan dari ukuran file.
  let seed = (file.size % 9973) + 7
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
  const empty = /kosong/i.test(file.name)
  const picked = [...WASTE].sort(() => rnd() - 0.5).slice(0, empty ? 0 : 2 + Math.floor(rnd() * 3))
  const items = picked.map((w) => ({ category: w.code, quantity: 1 + Math.floor(rnd() * 5), avg_confidence: Math.round((0.72 + rnd() * 0.26) * 100) / 100 }))
  const total = items.reduce((n, i) => n + i.quantity, 0)
  const points = items.reduce((n, i) => n + i.quantity * (WASTE.find((w) => w.code === i.category)?.points_per_item ?? 1), 0)
  const xp = total * 4
  const result: WasteLogResult = { id: nextId(), image_url: URL.createObjectURL(file), created_at: iso(), total_items: total, xp_earned: xp, points_earned: points, items }
  if (total > 0) {
    award(s, xp, points, 'Scan sampah', { type: 'scan', title: 'Scan sampah', detail: `${total} item terdeteksi` })
    items.forEach((i) => s.waste.push({ at: iso(), category: i.category, quantity: i.quantity }))
    s.scans += 1
  }
  s.wasteLogs.unshift(result)
  return result
}

export async function getWasteLogs(page: number, perPage = 6): Promise<Paged<WasteLogResult>> {
  await sleep(300)
  return paginate(stateFor(me().id).wasteLogs, page, perPage)
}

export async function getWasteLog(id: number): Promise<WasteLogResult> {
  await sleep(250)
  const log = stateFor(me().id).wasteLogs.find((x) => x.id === id)
  if (!log) throw new ApiError(404, 'Riwayat scan tidak ditemukan. Data scan contoh hanya tersimpan selama sesi ini.')
  return log
}

// ---------- leaderboard ----------
export async function getLeaderboard(period: 'weekly' | 'all'): Promise<Leaderboard> {
  await sleep()
  const user = me()
  const s = stateFor(user.id)
  const mine = period === 'all' ? s.xp : Array.from({ length: 7 }, (_, i) => s.activity[dayKey(daysAgo(i))]?.xp ?? 0).reduce((a, b) => a + b, 0)
  const rows = [
    ...PEERS.map((p) => ({ user_id: p.id, name: p.name, xp: period === 'all' ? p.xp : p.week.reduce((a, b) => a + b, 0), level: levelFor(p.xp).level, is_me: false })),
    { user_id: user.id, name: user.name, xp: mine, level: levelFor(s.xp).level, is_me: true },
  ]
    .sort((a, b) => b.xp - a.xp)
    .map((r, i): LeaderboardRow => ({ ...r, rank: i + 1 }))
  return { rows: rows.slice(0, 50), me: rows.find((r) => r.is_me)! }
}

// ---------- reward ----------
export async function getRewards(): Promise<Reward[]> {
  await sleep()
  return rewards.filter((r) => r.is_active)
}

export async function getReward(id: number): Promise<Reward> {
  await sleep(250)
  const r = rewards.find((x) => x.id === id && x.is_active)
  if (!r) throw new ApiError(404, 'Reward tidak ditemukan.')
  return r
}

export async function redeemReward(id: number): Promise<Redemption> {
  await sleep(600)
  const s = stateFor(me().id)
  const r = rewards.find((x) => x.id === id && x.is_active)
  if (!r) throw new ApiError(404, 'Reward tidak ditemukan.')
  if (r.stock <= 0) throw new ApiError(422, 'Stok reward ini sudah habis.')
  if (s.points < r.points_price) throw new ApiError(422, 'Poinmu belum cukup untuk menukar reward ini.')
  r.stock -= 1
  s.points -= r.points_price
  const red: Redemption = { id: nextId(), reward_id: r.id, reward_title: r.title, partner: r.partner, points_spent: r.points_price, code: code(), status: 'active', redeemed_at: iso(), valid_until: r.valid_until }
  s.redemptions.unshift(red)
  s.pointTx.unshift({ id: nextId(), label: `Penukaran: ${r.title}`, amount: -r.points_price, at: iso() })
  return red
}

export const getRedemptions = async (): Promise<Redemption[]> => (await sleep(), stateFor(me().id).redemptions)
export const getPointTransactions = async (): Promise<PointTransaction[]> => (await sleep(), stateFor(me().id).pointTx)

// ---------- komunitas ----------
export async function getEvents(): Promise<EventsPayload> {
  await sleep()
  const user = me()
  const s = stateFor(user.id)
  const lv = levelFor(s.xp)
  return {
    events: events.filter((e) => e.status === 'approved' || e.owner_id === user.id).map(({ owner_id, ...e }) => ({ ...e, is_mine: owner_id === user.id })),
    min_level: EVENT_MIN_LEVEL, user_level: lv.level, min_level_xp: LEVELS[EVENT_MIN_LEVEL - 1].min_xp, user_xp: s.xp,
  }
}

export interface EventInput { title: string; description: string; location: string; starts_at: string; ends_at: string; quota: number }
export async function proposeEvent(input: EventInput): Promise<EventItem> {
  await sleep(600)
  const user = me()
  if (levelFor(stateFor(user.id).xp).level < EVENT_MIN_LEVEL) throw new ApiError(403, `Pengajuan event terbuka mulai level ${EVENT_MIN_LEVEL}.`)
  const ev = { id: nextId(), ...input, status: 'pending' as const, review_note: null, proposer_name: user.name, is_mine: true, owner_id: user.id }
  events.unshift(ev)
  const { owner_id, ...pub } = ev
  void owner_id
  return pub
}

// ---------- admin ----------
const adminUsers = (): AdminUser[] => {
  const budi = profileOf({ id: 2, name: 'Budi Hijau', email: 'user@ecohabbit.test', role: 'user', avatar_url: null })
  const bs = stateFor(2)
  const live: AdminUser = {
    id: 2, name: budi.name, email: budi.email, level: budi.level, xp: budi.xp, points: budi.points, streak_current: budi.streak_current,
    verified_total: bs.verified, scans_total: bs.scans, weekly_xp: Array.from({ length: 7 }, (_, i) => bs.activity[dayKey(daysAgo(6 - i))]?.xp ?? 0),
    last_active_at: iso(daysAgo(0)), is_active: !deactivated.has(2),
  }
  return [live, ...PEERS.map((p, i): AdminUser => ({
    id: p.id, name: p.name, email: p.email, level: levelFor(p.xp).level, xp: p.xp, points: p.points, streak_current: p.streak,
    verified_total: Math.round(p.xp / 35), scans_total: Math.round(p.xp / 120), weekly_xp: p.week, last_active_at: iso(daysAgo(i % 5)), is_active: !deactivated.has(p.id),
  }))]
}
const deactivated = new Set<number>()

export async function getAdminStats(): Promise<AdminStats> {
  await sleep()
  const users = adminUsers()
  const bs = stateFor(2)
  const redeemed = [...states.values()].flatMap((s) => s.redemptions).reduce((n, r) => n + r.points_spent, 0)
  return {
    total_users: users.length,
    active_users_7d: users.filter((u) => u.is_active && new Date(u.last_active_at).getTime() > Date.now() - 7 * 86_400_000).length,
    missions_verified: users.reduce((n, u) => n + u.verified_total, 0),
    waste_by_category: WASTE.map((w, i) => ({ category: w.code, quantity: [118, 164, 41, 73, 96, 28][i] + bs.waste.filter((x) => x.category === w.code).reduce((n, x) => n + x.quantity, 0) })),
    points_circulating: users.reduce((n, u) => n + u.points, 0),
    points_redeemed: redeemed + 2260,
    events_pending: events.filter((e) => e.status === 'pending').length,
    trend: Array.from({ length: 14 }, (_, i) => ({ date: dayKey(daysAgo(13 - i)), verified: [9, 12, 8, 15, 14, 11, 18, 16, 13, 20, 17, 22, 19, 24][i], active_users: [5, 6, 5, 8, 7, 6, 9, 9, 7, 10, 9, 11, 10, 12][i] })),
    pending_events: events.filter((e) => e.status === 'pending').map(({ owner_id, ...e }) => (void owner_id, e)),
  }
}

export async function getAdminUsers(q: { search: string; status: 'all' | 'active' | 'inactive'; sort: 'xp' | 'points' | 'streak' | 'name'; page: number }, perPage = 6): Promise<Paged<AdminUser>> {
  await sleep(300)
  const term = q.search.trim().toLowerCase()
  const list = adminUsers()
    .filter((u) => (!term || u.name.toLowerCase().includes(term) || u.email.includes(term)) && (q.status === 'all' || (q.status === 'active') === u.is_active))
    .sort((a, b) => (q.sort === 'name' ? a.name.localeCompare(b.name) : q.sort === 'points' ? b.points - a.points : q.sort === 'streak' ? b.streak_current - a.streak_current : b.xp - a.xp))
  return paginate(list, q.page, perPage)
}

export async function setUserActive(id: number, active: boolean): Promise<void> {
  await sleep(300)
  if (active) deactivated.delete(id)
  else deactivated.add(id)
}

export const getAdminChallenges = async (): Promise<Challenge[]> => (await sleep(), [...challenges])
export async function saveChallenge(input: Omit<Challenge, 'id'> & { id?: number }): Promise<Challenge> {
  await sleep(450)
  if (input.id) {
    challenges = challenges.map((c) => (c.id === input.id ? { ...c, ...input, id: c.id } : c))
    return challenges.find((c) => c.id === input.id)!
  }
  const c: Challenge = { ...input, id: nextId() }
  challenges = [...challenges, c]
  return c
}
// Tantangan yang pernah dikerjakan tidak dihapus, hanya dinonaktifkan (AD-04).
export async function setChallengeActive(id: number, active: boolean): Promise<void> {
  await sleep(250)
  challenges = challenges.map((c) => (c.id === id ? { ...c, is_active: active } : c))
}

export const getAdminRewards = async (): Promise<Reward[]> => (await sleep(), [...rewards])
export async function saveReward(input: Omit<Reward, 'id'> & { id?: number }): Promise<Reward> {
  await sleep(450)
  if (input.id) {
    rewards = rewards.map((r) => (r.id === input.id ? { ...r, ...input, id: r.id } : r))
    return rewards.find((r) => r.id === input.id)!
  }
  const r: Reward = { ...input, id: nextId() }
  rewards = [...rewards, r]
  return r
}
export async function getAdminRedemptions(): Promise<Redemption[]> {
  await sleep()
  const fake: Redemption[] = [
    { id: 901, reward_id: 1, reward_title: 'Voucher kopi gratis', partner: 'Kopi Hijau', points_spent: 120, code: 'ECO-A1B2-C3D4', status: 'used', redeemed_at: iso(daysAgo(4)), valid_until: '2027-03-31', user_name: 'Nadia Putri' },
    { id: 902, reward_id: 6, reward_title: 'Diskon 20% pakaian bekas', partner: 'Thrift Daun', points_spent: 110, code: 'ECO-E5F6-G7H8', status: 'active', redeemed_at: iso(daysAgo(2)), valid_until: '2027-04-30', user_name: 'Raka Pratama' },
    { id: 903, reward_id: 2, reward_title: 'Isi ulang sabun cair 500 ml', partner: 'Toko Refill Bumi', points_spent: 90, code: 'ECO-J9K1-L2M3', status: 'expired', redeemed_at: iso(daysAgo(40)), valid_until: '2026-11-01', user_name: 'Salsa Aulia' },
  ]
  return [...stateFor(2).redemptions.map((r) => ({ ...r, user_name: 'Budi Hijau' })), ...fake].sort((a, b) => b.redeemed_at.localeCompare(a.redeemed_at))
}

export async function getAdminEvents(): Promise<EventItem[]> {
  await sleep()
  return events.map(({ owner_id, ...e }) => (void owner_id, e))
}
export async function reviewEvent(id: number, decision: 'approved' | 'rejected', note: string): Promise<void> {
  await sleep(400)
  if (decision === 'rejected' && !note.trim()) throw new ApiError(422, 'Data yang dikirim belum valid.', { note: ['Alasan penolakan wajib diisi.'] })
  events = events.map((e) => (e.id === id ? { ...e, status: decision, review_note: note.trim() || null } : e))
}
export async function cancelEvent(id: number): Promise<void> {
  await sleep(300)
  events = events.map((e) => (e.id === id ? { ...e, status: 'cancelled' } : e))
}
