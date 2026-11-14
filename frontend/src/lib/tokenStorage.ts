// Satu-satunya tempat yang menyentuh penyimpanan token. Bearer token vs cookie Sanctum
// masih Q-04 (Open): kalau berubah, cukup ganti file ini.
const KEY = 'eh.token'

export function getToken(): string | null {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

export function setToken(token: string): void {
  try {
    localStorage.setItem(KEY, token)
  } catch {
    /* penyimpanan diblokir: sesi hanya hidup selama tab terbuka */
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* abaikan */
  }
}
