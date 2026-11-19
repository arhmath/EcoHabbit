import type { ReactNode } from 'react'

// Ikon garis SVG konsisten (bukan emoji). Dekoratif secara default; beri label di elemen induknya.
const paths = {
  home: <path d="M3 11l9-8 9 8M5 10v10h14V10" />,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>,
  camera: <><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></>,
  trophy: <path d="M8 4h8v5a4 4 0 01-8 0V4zM8 6H4v2a3 3 0 003 3M16 6h4v2a3 3 0 01-3 3M12 13v4M8 20h8" />,
  gift: <path d="M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7c-2 0-4-1-4-3s3-2 4 3zM12 7c2 0 4-1 4-3s-3-2-4 3z" />,
  users: <path d="M16 20v-1a4 4 0 00-4-4H8a4 4 0 00-4 4v1M10 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM20 20v-1a4 4 0 00-3-3.8M16 4.2a3.5 3.5 0 010 6.6" />,
  user: <path d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0" />,
  shield: <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />,
  logout: <path d="M9 4H5v16h4M16 8l4 4-4 4M20 12H9" />,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  check: <path d="M5 12l5 5 9-10" />,
  lock: <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  upload: <path d="M12 16V4M7 9l5-5 5 5M4 20h16" />,
  flame: <path d="M12 3c1 4 5 5 5 10a5 5 0 01-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z" />,
  bolt: <path d="M13 2L4 14h7l-1 8 9-12h-7z" />,
  coin: <><circle cx="12" cy="12" r="9" /><path d="M12 6.5v11M9.5 14.5c.5.8 1.4 1.2 2.5 1.2 1.5 0 2.5-.7 2.5-1.7 0-2.3-5-1.3-5-3.6 0-1 1-1.7 2.5-1.7 1 0 1.9.4 2.4 1.1" /></>,
  chart: <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  calendar: <path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" />,
  pin: <path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11zM12 12a2 2 0 100-4 2 2 0 000 4z" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></>,
  copy: <path d="M9 9h11v11H9zM5 15V4h11" />,
  refresh: <path d="M20 12a8 8 0 10-2.3 5.7M20 5v5h-5" />,
  image: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="1.5" /><path d="M21 16l-5-5-8 8" /></>,
  edit: <path d="M4 20h4L19 9l-4-4L4 16zM13 7l4 4" />,
  recycle: <path d="M7 19H4l2-4M4 19l3-5M17 19h3l-2-4M20 19l-3-5M12 4l-3 5h6zM9 9l-3 5M15 9l3 5" />,
} satisfies Record<string, ReactNode>

export type IconName = keyof typeof paths

export default function Icon({ name, className = 'size-5' }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}
