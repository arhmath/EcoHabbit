import type { ReactNode } from 'react'
import { EmptyState } from './States'

export interface Column<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  align?: 'right'
}

export default function DataTable<T>({ columns, rows, rowKey, caption, empty = 'Belum ada data' }: { columns: Column<T>[]; rows: T[]; rowKey: (r: T) => string | number; caption: string; empty?: string }) {
  if (rows.length === 0) return <EmptyState title={empty} />
  return (
    <div className="overflow-x-auto rounded-2xl border-2 border-leaf bg-white">
      <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-leaf text-white">
          <tr>
            {columns.map((c) => (
              <th key={c.key} scope="col" className={`px-4 py-3 font-display font-semibold ${c.align === 'right' ? 'text-right' : ''}`}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={rowKey(r)} className="border-t border-leaf/15 transition-colors hover:bg-zest-soft/50">
              {columns.map((c) => (
                <td key={c.key} className={`px-4 py-3 align-middle ${c.align === 'right' ? 'text-right tabular-nums' : ''}`}>
                  {c.render(r)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
