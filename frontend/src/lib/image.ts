// Validasi dan kompresi foto di browser sebelum upload (CH-04, WS-02, NFR-03). Tanpa dependensi tambahan.
// Target sisi terpanjang 1280 px dan di bawah 1 MB masih [USULAN] (Q-07).
export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_INPUT_BYTES = 12 * 1024 * 1024

export class ImageError extends Error {}

export function validateImage(file: File) {
  if (!ACCEPTED_TYPES.includes(file.type)) throw new ImageError('Format foto harus JPG, PNG, atau WebP.')
  if (file.size > MAX_INPUT_BYTES) throw new ImageError('Ukuran foto maksimal 12 MB.')
}

export async function compressImage(file: File, maxSide = 1280, maxBytes = 1_000_000): Promise<File> {
  const bitmap = await createImageBitmap(file).catch(() => {
    throw new ImageError('Foto tidak bisa dibaca. Coba pilih foto lain.')
  })
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  const ctx = canvas.getContext('2d')
  if (!ctx) return file
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()

  let quality = 0.85
  let blob: Blob | null = null
  for (let i = 0; i < 5; i++) {
    blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/jpeg', quality))
    if (!blob || blob.size <= maxBytes) break
    quality -= 0.15
  }
  if (!blob || (scale === 1 && blob.size >= file.size)) return file
  // Nama file dipertahankan, hanya ekstensinya yang menyesuaikan format hasil kompresi.
  return new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' })
}

export const formatBytes = (n: number) => (n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`)
