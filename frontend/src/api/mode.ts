// Mock aktif otomatis di `npm run dev` selama backend belum siap. Tidak ikut ke bundle produksi.
export const useMock = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK !== 'false'
export const loadMock = () => import('../mocks/db')

type Mock = typeof import('../mocks/db')

/** Satu pintu untuk semua panggilan data: mock saat dev, API Laravel sungguhan selain itu. */
export async function run<T>(viaMock: (m: Mock) => Promise<T>, viaApi: () => Promise<T>): Promise<T> {
  return useMock ? viaMock(await loadMock()) : viaApi()
}
