import { isAxiosError } from 'axios'

export type FieldErrors = Record<string, string[]>

/** Satu bentuk galat untuk seluruh UI. Komponen tidak perlu tahu soal Axios. */
export class ApiError extends Error {
  readonly status: number
  readonly fieldErrors: FieldErrors
  readonly retryAfter?: number

  constructor(status: number, message: string, fieldErrors: FieldErrors = {}, retryAfter?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
    this.retryAfter = retryAfter
  }
}

const fallback: Record<number, string> = {
  401: 'Sesi Anda berakhir. Silakan masuk kembali.',
  403: 'Anda tidak memiliki akses untuk tindakan ini.',
  404: 'Data yang diminta tidak ditemukan.',
  422: 'Data yang dikirim belum valid.',
  500: 'Terjadi kesalahan di server. Coba lagi beberapa saat.',
}

export function toApiError(err: unknown): ApiError {
  if (err instanceof ApiError) return err
  if (!isAxiosError(err)) return new ApiError(0, 'Terjadi kesalahan yang tidak diketahui.')

  if (!err.response) {
    const timeout = err.code === 'ECONNABORTED'
    return new ApiError(0, timeout ? 'Permintaan terlalu lama. Coba lagi.' : 'Tidak dapat terhubung ke server. Periksa koneksi lalu coba lagi.')
  }

  const { status, data, headers } = err.response
  const body = (data ?? {}) as { message?: string; errors?: FieldErrors }

  if (status === 429) {
    const retry = Number(headers['retry-after'])
    const wait = Number.isFinite(retry) && retry > 0 ? retry : undefined
    return new ApiError(429, wait ? `Terlalu banyak percobaan. Coba lagi dalam ${wait} detik.` : 'Terlalu banyak percobaan. Coba lagi sebentar lagi.', {}, wait)
  }

  return new ApiError(status, body.message ?? fallback[status] ?? fallback[500], body.errors ?? {})
}
