// Tipe domain EcoHabbit. Nama field snake_case mengikuti API/ERD (SRS 4.2).
// Semua angka XP, level, streak, dan poin datang dari server (SRS GM-06 dan BR-09): frontend hanya menampilkan.
import type { User } from './api'

export type WasteCode = 'kertas' | 'plastik' | 'kaca' | 'kardus' | 'organik' | 'lainnya'
export type SubmissionStatus = 'pending' | 'verified' | 'rejected'
export type ChallengeType = 'daily' | 'dynamic'
export type Verification = 'photo' | 'none'
export type EventStatus = 'pending' | 'approved' | 'rejected' | 'cancelled'
export type RedemptionStatus = 'active' | 'used' | 'expired'
export type RewardType = 'voucher' | 'merchandise' | 'donasi'

export interface Paged<T> {
  items: T[]
  total: number
  page: number
  per_page: number
}

export interface Level {
  level: number
  name: string
  min_xp: number
}

export interface Profile extends User {
  level: number
  level_name: string
  xp: number
  level_min_xp: number
  /** null jika sudah di level tertinggi. */
  next_level_xp: number | null
  points: number
  streak_current: number
  streak_longest: number
  active_today: boolean
}

export interface Challenge {
  id: number
  title: string
  description: string
  criteria: string
  category: string
  type: ChallengeType
  level_required: number
  xp_reward: number
  points_reward: number
  verification: Verification
  daily_quota: number
  is_active: boolean
  starts_at: string | null
  ends_at: string | null
}

/** Challenge dari sudut pandang user yang sedang login. */
export interface Mission extends Challenge {
  locked: boolean
  unlock_xp: number | null
  today_status: SubmissionStatus | null
  rejection_reason: string | null
  quota_left: number
}

export interface Submission {
  id: number
  challenge_id: number
  status: SubmissionStatus
  rejection_reason: string | null
  created_at: string
  result: { xp_earned: number; points_earned: number; leveled_up: boolean; new_level: number | null; new_level_name: string | null } | null
}

export interface WasteCategory {
  code: WasteCode
  name: string
  kind: 'organik' | 'anorganik'
  points_per_item: number
  tip: string
}

export interface WasteLogResult {
  id: number
  image_url: string
  created_at: string
  total_items: number
  xp_earned: number
  points_earned: number
  items: { category: WasteCode; quantity: number; avg_confidence: number }[]
}

export interface DashboardSummary {
  profile: Profile
  missions_today: Mission[]
  streak_week: { date: string; active: boolean }[]
  totals: { missions_verified: number; waste_items: number }
}

export interface ActivityCharts {
  xp_by_day: { date: string; xp: number }[]
  waste_by_category: { category: WasteCode; quantity: number }[]
}

export interface HistoryItem {
  id: string
  type: 'mission' | 'scan'
  title: string
  detail: string
  xp: number
  points: number
  at: string
}

export interface LeaderboardRow {
  rank: number
  user_id: number
  name: string
  level: number
  xp: number
  is_me: boolean
}

export interface Leaderboard {
  rows: LeaderboardRow[]
  me: LeaderboardRow
}

export interface Reward {
  id: number
  title: string
  description: string
  terms: string
  partner: string
  type: RewardType
  points_price: number
  stock: number
  valid_until: string
  is_active: boolean
}

export interface Redemption {
  id: number
  reward_id: number
  reward_title: string
  partner: string
  /** Harga saat penukaran (snapshot), bukan harga katalog terkini. */
  points_spent: number
  code: string
  status: RedemptionStatus
  redeemed_at: string
  valid_until: string
  user_name?: string
}

export interface PointTransaction {
  id: number
  label: string
  amount: number
  at: string
}

export interface EventItem {
  id: number
  title: string
  description: string
  location: string
  starts_at: string
  ends_at: string
  quota: number
  status: EventStatus
  review_note: string | null
  proposer_name: string
  is_mine: boolean
}

export interface EventsPayload {
  events: EventItem[]
  /** Level minimal untuk mengajukan event (BR-07, nilainya masih TBD di SRS Q-03). */
  min_level: number
  user_level: number
  min_level_xp: number
  user_xp: number
}

export interface AdminUser {
  id: number
  name: string
  email: string
  level: number
  xp: number
  points: number
  streak_current: number
  verified_total: number
  scans_total: number
  weekly_xp: number[]
  last_active_at: string
  is_active: boolean
}

export interface AdminStats {
  total_users: number
  active_users_7d: number
  missions_verified: number
  waste_by_category: { category: WasteCode; quantity: number }[]
  points_circulating: number
  points_redeemed: number
  events_pending: number
  trend: { date: string; verified: number; active_users: number }[]
  pending_events: EventItem[]
}
