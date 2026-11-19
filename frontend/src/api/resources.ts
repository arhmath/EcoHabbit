// Semua pemanggilan data fitur lewat satu lapisan ini (SRS 7.3 poin 2). Komponen tidak memanggil Axios langsung.
// Path dan bentuk respons mengikuti kontrak awal SRS 4.3 yang masih [USULAN]; sesuaikan setelah disepakati dengan Backend (Q-12).
import type { ApiEnvelope, User } from '../types/api'
import type {
  ActivityCharts, AdminStats, AdminUser, Challenge, DashboardSummary, EventItem, EventsPayload, HistoryItem, Leaderboard, Level, Mission, Paged,
  PointTransaction, Profile, Redemption, Reward, Submission, WasteCategory, WasteLogResult,
} from '../types/domain'
import { api } from './client'
import { run } from './mode'
import type { EventInput } from '../mocks/db'

type Meta = { page: number; per_page: number; total: number }
const get = async <T,>(url: string, params?: object) => (await api.get<ApiEnvelope<T>>(url, { params })).data.data
const getPaged = async <T,>(url: string, params: object): Promise<Paged<T>> => {
  const { data, meta } = (await api.get<ApiEnvelope<T[]> & { meta: Meta }>(url, { params })).data
  return { items: data, total: meta.total, page: meta.page, per_page: meta.per_page }
}
const send = async <T,>(method: 'post' | 'patch' | 'put', url: string, body?: unknown, signal?: AbortSignal) =>
  (await api.request<ApiEnvelope<T>>({ method, url, data: body, signal })).data.data
const form = (fields: Record<string, string | Blob | number | null | undefined>) => {
  const f = new FormData()
  Object.entries(fields).forEach(([k, v]) => v != null && f.append(k, typeof v === 'number' ? String(v) : v))
  return f
}

// ----- profil dan dashboard -----
export const getProfile = () => run((m) => m.getProfile(), () => get<Profile>('/me'))
export const getLevels = () => run((m) => m.getLevels(), () => get<Level[]>('/levels'))
export const updateProfile = (patch: { name?: string; avatar_url?: string | null }) => run((m) => m.updateProfile(patch), () => send<User>('patch', '/me', patch))
export const getDashboardSummary = () => run((m) => m.getDashboardSummary(), () => get<DashboardSummary>('/dashboard/summary'))
export const getActivityCharts = () => run((m) => m.getActivityCharts(), () => get<ActivityCharts>('/dashboard/activity', { range: '7d' }))
export const getHistory = (page: number) => run((m) => m.getHistory(page), () => getPaged<HistoryItem>('/me/history', { page }))

// ----- challenge -----
export const getMissions = () => run((m) => m.getMissions(), () => get<Mission[]>('/challenges'))
export const getMission = (id: number) => run((m) => m.getMission(id), () => get<Mission>(`/challenges/${id}`))
export const submitMission = (id: number, file: File | null) =>
  run((m) => m.submitMission(id, file), () => send<Submission>('post', `/challenges/${id}/submissions`, form({ photo: file })))
export const getSubmission = (id: number) => run((m) => m.getSubmission(id), () => get<Submission>(`/submissions/${id}`))

// ----- scan sampah -----
export const getWasteCategories = () => run((m) => m.getWasteCategories(), () => get<WasteCategory[]>('/waste-categories'))
export const createWasteLog = (file: File, signal?: AbortSignal) =>
  run((m) => m.createWasteLog(file, signal), () => send<WasteLogResult>('post', '/waste-logs', form({ photo: file }), signal))
export const getWasteLogs = (page: number) => run((m) => m.getWasteLogs(page), () => getPaged<WasteLogResult>('/waste-logs', { page }))
export const getWasteLog = (id: number) => run((m) => m.getWasteLog(id), () => get<WasteLogResult>(`/waste-logs/${id}`))

// ----- gamifikasi, reward, komunitas -----
export const getLeaderboard = (period: 'weekly' | 'all') => run((m) => m.getLeaderboard(period), () => get<Leaderboard>('/leaderboard', { period }))
export const getRewards = () => run((m) => m.getRewards(), () => get<Reward[]>('/rewards'))
export const getReward = (id: number) => run((m) => m.getReward(id), () => get<Reward>(`/rewards/${id}`))
export const redeemReward = (id: number) => run((m) => m.redeemReward(id), () => send<Redemption>('post', `/rewards/${id}/redeem`))
export const getRedemptions = () => run((m) => m.getRedemptions(), () => get<Redemption[]>('/me/redemptions'))
export const getPointTransactions = () => run((m) => m.getPointTransactions(), () => get<PointTransaction[]>('/me/point-transactions'))
export const getEvents = () => run((m) => m.getEvents(), () => get<EventsPayload>('/events'))
export const proposeEvent = (input: EventInput, poster: File | null) =>
  run((m) => m.proposeEvent(input), () => send<EventItem>('post', '/events', form({ ...input, poster })))

// ----- admin -----
export const getAdminStats = () => run((m) => m.getAdminStats(), () => get<AdminStats>('/admin/stats'))
export const getAdminUsers = (q: { search: string; status: 'all' | 'active' | 'inactive'; sort: 'xp' | 'points' | 'streak' | 'name'; page: number }) =>
  run((m) => m.getAdminUsers(q), () => getPaged<AdminUser>('/admin/users', q))
export const setUserActive = (id: number, active: boolean) => run((m) => m.setUserActive(id, active), () => send<void>('patch', `/admin/users/${id}`, { is_active: active }))
export const getAdminChallenges = () => run((m) => m.getAdminChallenges(), () => get<Challenge[]>('/admin/challenges'))
export const saveChallenge = (c: Omit<Challenge, 'id'> & { id?: number }) =>
  run((m) => m.saveChallenge(c), () => (c.id ? send<Challenge>('put', `/admin/challenges/${c.id}`, c) : send<Challenge>('post', '/admin/challenges', c)))
export const setChallengeActive = (id: number, active: boolean) =>
  run((m) => m.setChallengeActive(id, active), () => send<void>('patch', `/admin/challenges/${id}`, { is_active: active }))
export const getAdminRewards = () => run((m) => m.getAdminRewards(), () => get<Reward[]>('/admin/rewards'))
export const saveReward = (r: Omit<Reward, 'id'> & { id?: number }) =>
  run((m) => m.saveReward(r), () => (r.id ? send<Reward>('put', `/admin/rewards/${r.id}`, r) : send<Reward>('post', '/admin/rewards', r)))
export const getAdminRedemptions = () => run((m) => m.getAdminRedemptions(), () => get<Redemption[]>('/admin/redemptions'))
export const getAdminEvents = () => run((m) => m.getAdminEvents(), () => get<EventItem[]>('/admin/events'))
export const reviewEvent = (id: number, decision: 'approved' | 'rejected', note: string) =>
  run((m) => m.reviewEvent(id, decision, note), () => send<void>('patch', `/admin/events/${id}/review`, { decision, note }))
export const cancelEvent = (id: number) => run((m) => m.cancelEvent(id), () => send<void>('patch', `/admin/events/${id}`, { status: 'cancelled' }))
