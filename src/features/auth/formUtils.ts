import type { FieldPath, FieldValues, UseFormSetError } from 'react-hook-form'
import { ApiError, toApiError } from '../../api/errors'

/**
 * Memetakan galat server ke form (AUTH-06): 422 per field ke bawah inputnya,
 * sisanya jadi pesan umum di atas tombol. Isi form tidak pernah dikosongkan (UX-04).
 */
export function applyServerError<T extends FieldValues>(err: unknown, setError: UseFormSetError<T>, known: FieldPath<T>[]) {
  const e: ApiError = toApiError(err)
  let mapped = 0
  for (const [field, messages] of Object.entries(e.fieldErrors)) {
    if ((known as string[]).includes(field)) {
      setError(field as FieldPath<T>, { type: 'server', message: messages[0] })
      mapped++
    }
  }
  if (mapped === 0) setError('root', { type: 'server', message: e.message })
}
