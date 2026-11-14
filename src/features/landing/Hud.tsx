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
    <div className="border-b-2 border-leaf bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3 text-sm text-leaf/75">
        <span className="flex items-center gap-2">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-leaf-600 opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex size-2.5 rounded-full bg-leaf" />
          </span>
          Misi harian aktif
        </span>
        <span className="hidden sm:inline">Tanamanmu tumbuh setiap hari</span>
        <span className="font-display font-semibold text-leaf tabular-nums">{time} WIB</span>
      </div>
    </div>
  )
}
