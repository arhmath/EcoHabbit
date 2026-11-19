import { useEffect, useRef, useState } from 'react'
import { createWasteLog, getWasteCategories } from '../../api/resources'
import { toApiError } from '../../api/errors'
import Icon from '../../components/Icon'
import { Btn } from '../../components/ui/Btn'
import Card from '../../components/ui/Card'
import PageHeader from '../../components/ui/PageHeader'
import Pill from '../../components/ui/Pill'
import { EmptyState } from '../../components/ui/States'
import { toast } from '../../components/ui/Toast'
import { invalidate } from '../../hooks/useResource'
import { compressImage, formatBytes, ImageError, validateImage } from '../../lib/image'
import type { WasteCategory, WasteLogResult } from '../../types/domain'
import { WASTE_NAME } from './waste'

// WS-01..WS-07: ambil/pilih foto, preview, kompres, kirim (bisa dibatalkan), hasil per kelas, kondisi kosong dan galat.
export default function ScanPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>()
  const [state, setState] = useState<'idle' | 'busy'>('idle')
  const [result, setResult] = useState<WasteLogResult | null>(null)
  const [error, setError] = useState('')
  const [cats, setCats] = useState<WasteCategory[]>([])
  const abort = useRef<AbortController | null>(null)

  useEffect(() => { void getWasteCategories().then(setCats).catch(() => {}) }, [])
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])

  const choose = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    e.target.value = ''
    if (!f) return
    try {
      validateImage(f)
    } catch (err) {
      return setError((err as Error).message)
    }
    setError('')
    setResult(null)
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const reset = () => { abort.current?.abort(); setFile(null); setPreview(undefined); setResult(null); setError(''); setState('idle') }

  const submit = async () => {
    if (!file) return
    setState('busy')
    setError('')
    abort.current = new AbortController()
    try {
      const out = await createWasteLog(await compressImage(file), abort.current.signal)
      setResult(out)
      invalidate('dashboard', 'profile', 'history', 'leaderboard')
      if (out.total_items > 0) toast.ok(`+${out.xp_earned} XP dan +${out.points_earned} poin.`)
    } catch (e) {
      if ((e as Error).name === 'AbortError') return
      setError(e instanceof ImageError ? e.message : toApiError(e).message)
    } finally {
      setState('idle')
    }
  }

  const tip = (code: string) => cats.find((c) => c.code === code)

  return (
    <>
      <PageHeader eyebrow="Scan" title="Scan sampah" note="Foto sampah yang sudah kamu pilah. Sistem menghitung jumlah per jenis." />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          {preview ? (
            <img src={preview} alt="Foto sampah yang akan dipindai" className="aspect-4/3 w-full rounded-2xl border-2 border-leaf object-cover" />
          ) : (
            <EmptyState title="Belum ada foto" body="Ambil foto dengan kamera atau pilih dari galeri." />
          )}
          {file && <p className="mt-2 text-sm text-leaf/70">{file.name} · {formatBytes(file.size)}</p>}
          <div className="mt-4 flex flex-wrap gap-3">
            <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-2 border-leaf bg-zest px-5 font-semibold hover:bg-zest-soft focus-within:outline-2">
              <Icon name="camera" /> Kamera
              <input type="file" accept="image/jpeg,image/png,image/webp" capture="environment" className="sr-only" onChange={choose} />
            </label>
            <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-2 border-leaf bg-white px-5 font-semibold hover:bg-zest-soft focus-within:outline-2">
              <Icon name="image" /> Galeri
              <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={choose} />
            </label>
            {file && <Btn variant="primary" loading={state === 'busy'} onClick={() => void submit()}>Pindai</Btn>}
            {file && <Btn variant="ghost" onClick={reset}>{state === 'busy' ? 'Batal' : 'Ulang'}</Btn>}
          </div>
          {error && <p role="alert" className="mt-3 rounded-xl bg-red-100 p-3 text-sm text-red-900">{error} {file && <button type="button" onClick={() => void submit()} className="font-bold underline">Coba lagi</button>}</p>}
        </Card>

        <Card tone="soft">
          <h2 className="mb-4 font-display text-2xl font-extrabold">Hasil</h2>
          {!result ? (
            <p className="text-leaf/70">Hasil pemindaian tampil di sini.</p>
          ) : result.total_items === 0 ? (
            <EmptyState title="Tidak ada sampah terdeteksi" body="Coba foto ulang dengan cahaya cukup, jarak lebih dekat, dan latar polos." />
          ) : (
            <>
              <p className="font-display text-4xl font-extrabold">{result.total_items} <span className="text-lg">item</span></p>
              <p className="text-sm font-bold">+{result.xp_earned} XP · +{result.points_earned} poin</p>
              <ul className="mt-4 space-y-3">
                {result.items.map((it, i) => (
                  <li key={it.category} className="rise rounded-2xl border-2 border-leaf bg-white p-3" style={{ ['--i' as string]: i }}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display text-lg font-bold">{WASTE_NAME[it.category]} <Pill tone="soft">{tip(it.category)?.kind ?? ''}</Pill></span>
                      <span className="font-display text-2xl font-extrabold">{it.quantity}</span>
                    </div>
                    <p className="mt-1 text-sm text-leaf/75">{tip(it.category)?.tip}</p>
                  </li>
                ))}
              </ul>
              <Btn className="mt-4" variant="zest" onClick={reset}>Scan lagi</Btn>
            </>
          )}
        </Card>
      </div>
    </>
  )
}
