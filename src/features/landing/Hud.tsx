import { useEffect, useState } from 'react'

const fmt = new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' })

export default function Hud() {
  const [time, setTime] = useState('--:--:--')
  useEffect(() => {
    const tick = () => setTime(fmt.format(new Date()).replace(/\./g, ':'))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="border-y border-sage/20 bg-forest-900">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3 text-sm text-mist/70">
        <span className="flex items-center gap-2">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-sage opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex size-2.5 rounded-full bg-sage" />
          </span>
          Misi harian aktif
        </span>
        <span className="hidden sm:inline">Tanamanmu tumbuh setiap hari</span>
        <span className="font-display font-semibold text-mist tabular-nums">{time} WIB</span>
      </div>
    </div>
  )
}
