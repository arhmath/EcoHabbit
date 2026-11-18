import { useCallback, useEffect, useRef, useState } from 'react'
import { toApiError, type ApiError } from '../api/errors'

// Pengambil data server yang ringan: cache per key, loading, galat, refetch, dan invalidate setelah aksi (GM-06).
// Bentuk hook sengaja mirip TanStack Query (SRS 7.1) agar bisa diganti tanpa mengubah halaman.
const cache = new Map<string, unknown>()
const subs = new Set<{ key: string; refetch: () => void }>()

/** Tandai data dengan awalan key tertentu sebagai usang; yang sedang tampil diambil ulang diam-diam. */
export function invalidate(...prefixes: string[]) {
  subs.forEach((s) => prefixes.some((p) => s.key.startsWith(p)) && s.refetch())
  prefixes.forEach((p) => cache.forEach((_, k) => k.startsWith(p) && cache.delete(k)))
}
/** AUTH-03: logout dan sesi berakhir membersihkan seluruh cache data. */
export const clearResourceCache = () => cache.clear()

export interface Resource<T> {
  data?: T
  error?: ApiError
  loading: boolean
  reload: () => void
}

export function useResource<T>(key: string, fetcher: () => Promise<T>): Resource<T> {
  const [state, setState] = useState<{ data?: T; error?: ApiError; loading: boolean }>(() =>
    cache.has(key) ? { data: cache.get(key) as T, loading: false } : { loading: true },
  )
  const fetchRef = useRef(fetcher)
  fetchRef.current = fetcher
  const run = useRef(0)

  const load = useCallback(
    (silent: boolean) => {
      const id = ++run.current
      if (!silent) setState((s) => ({ data: s.data, loading: true }))
      fetchRef
        .current()
        .then((data) => {
          cache.set(key, data)
          if (id === run.current) setState({ data, loading: false })
        })
        .catch((e) => {
          if (id === run.current) setState((s) => ({ data: s.data, error: toApiError(e), loading: false }))
        })
    },
    [key],
  )

  useEffect(() => {
    // Key berganti (mis. halaman atau filter): tampilkan cache bila ada, selalu segarkan di belakang layar.
    setState(cache.has(key) ? { data: cache.get(key) as T, loading: false } : { loading: true })
    load(cache.has(key))
    const sub = { key, refetch: () => load(true) }
    subs.add(sub)
    return () => {
      subs.delete(sub)
      run.current++
    }
  }, [key, load])

  return { ...state, reload: () => load(false) }
}
