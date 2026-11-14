/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "false" mematikan mock auth saat dev. Default: mock aktif selama backend belum siap. */
  readonly VITE_USE_MOCK?: string
}
