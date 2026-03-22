# Data Table Component — Copy-Paste Ready

## React + Tailwind (No dependencies beyond React)
```tsx
// src/components/ui/data-table.tsx
'use client'
import { useState, useMemo } from 'react'

interface Column<T> {
  key: keyof T
  label: string
  sortable?: boolean
  render?: (value: T[keyof T], row: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  pageSize?: number
  searchable?: boolean
  onRowClick?: (row: T) => void
}

export function DataTable<T extends { id: string }>({
  columns, data, pageSize = 10, searchable = true, onRowClick
}: DataTableProps<T>) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<keyof T | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let result = data
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(row =>
        columns.some(col => String(row[col.key]).toLowerCase().includes(q))
      )
    }
    if (sortKey) {
      result = [...result].sort((a, b) => {
        const aVal = String(a[sortKey])
        const bVal = String(b[sortKey])
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      })
    }
    return result
  }, [data, search, sortKey, sortDir, columns])

  const totalPages = Math.ceil(filtered.length / pageSize)
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  function handleSort(key: keyof T) {
    if (sortKey === key) { setSortDir(d => d === 'asc' ? 'desc' : 'asc') }
    else { setSortKey(key); setSortDir('asc') }
  }

  return (
    <div className="space-y-4">
      {searchable && (
        <input
          type="text" placeholder="Search..." value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="w-full max-w-sm rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(col => (
                <th key={String(col.key)}
                  className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 ${col.sortable ? 'cursor-pointer hover:text-gray-700' : ''}`}
                  onClick={() => col.sortable && handleSort(col.key)}>
                  {col.label}
                  {sortKey === col.key && (sortDir === 'asc' ? ' ↑' : ' ↓')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {paged.length === 0 ? (
              <tr><td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-gray-500">No results found</td></tr>
            ) : (
              paged.map(row => (
                <tr key={row.id} onClick={() => onRowClick?.(row)}
                  className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}>
                  {columns.map(col => (
                    <td key={String(col.key)} className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                      {col.render ? col.render(row[col.key], row) : String(row[col.key])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Showing {(page-1)*pageSize+1}-{Math.min(page*pageSize, filtered.length)} of {filtered.length}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
              className="rounded border px-3 py-1 disabled:opacity-50">Previous</button>
            <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}
              className="rounded border px-3 py-1 disabled:opacity-50">Next</button>
          </div>
        </div>
      )}
    </div>
  )
}
```

## Usage
```tsx
<DataTable
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', render: (val) => <Badge>{val}</Badge> },
  ]}
  data={users}
  onRowClick={(user) => router.push(`/users/${user.id}`)}
/>
```
