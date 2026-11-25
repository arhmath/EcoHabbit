import { Btn } from './Btn'

export default function Pagination({ page, perPage, total, onPage }: { page: number; perPage: number; total: number; onPage: (p: number) => void }) {
  const pages = Math.max(1, Math.ceil(total / perPage))
  if (pages <= 1) return null
  return (
    <nav aria-label="Halaman data" className="mt-4 flex items-center justify-between gap-3">
      <Btn variant="ghost" small disabled={page <= 1} onClick={() => onPage(page - 1)}>
        Sebelumnya
      </Btn>
      <span className="text-sm font-semibold text-leaf/75">
        Halaman {page} dari {pages}
      </span>
      <Btn variant="ghost" small disabled={page >= pages} onClick={() => onPage(page + 1)}>
        Berikutnya
      </Btn>
    </nav>
  )
}
