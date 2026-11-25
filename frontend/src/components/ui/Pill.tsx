import type { ReactNode } from 'react'
import type { EventStatus, RedemptionStatus, SubmissionStatus } from '../../types/domain'

const tones = {
  zest: 'bg-zest text-leaf',
  leaf: 'bg-leaf text-white',
  white: 'bg-white text-leaf',
  soft: 'bg-zest-soft text-leaf',
  warn: 'bg-amber-200 text-amber-950',
  bad: 'bg-red-100 text-red-900',
} as const
export type PillTone = keyof typeof tones

export default function Pill({ tone = 'white', children, className = '' }: { tone?: PillTone; children: ReactNode; className?: string }) {
  return <span className={`inline-flex items-center gap-1 rounded-full border-2 border-leaf px-3 py-0.5 text-xs font-bold whitespace-nowrap ${tones[tone]} ${className}`}>{children}</span>
}

type AnyStatus = SubmissionStatus | EventStatus | RedemptionStatus | null
const map: Record<string, [PillTone, string]> = {
  pending: ['warn', 'Menunggu'],
  verified: ['zest', 'Terverifikasi'],
  rejected: ['bad', 'Ditolak'],
  approved: ['zest', 'Disetujui'],
  cancelled: ['white', 'Dibatalkan'],
  active: ['zest', 'Aktif'],
  used: ['white', 'Terpakai'],
  expired: ['bad', 'Kedaluwarsa'],
}
export function StatusPill({ status }: { status: AnyStatus }) {
  const [tone, label] = status ? map[status] : ['white' as PillTone, 'Belum dikerjakan']
  return <Pill tone={tone}>{label}</Pill>
}
