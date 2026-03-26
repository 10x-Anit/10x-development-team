# Data Table Component -- Production-Quality, Copy-Paste Ready

> Uses ONLY semantic design tokens. NEVER use `text-white`, `bg-gray-*`, `bg-blue-*`, etc.

---

## React + Tailwind (MVP/Production Scope)

### Core Data Table Component

```tsx
// src/components/ui/data-table.tsx
'use client'
import { useState, useMemo, useCallback } from 'react'
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Inbox,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

// --- TypeScript Interfaces ---

export interface Column<T> {
  /** Property key on the data object */
  key: keyof T & string
  /** Column header label */
  label: string
  /** Enable sorting for this column */
  sortable?: boolean
  /** Custom render function for cell content */
  render?: (value: T[keyof T], row: T) => React.ReactNode
  /** Column width class (e.g. "w-48", "min-w-[200px]") */
  width?: string
  /** Align cell content */
  align?: 'left' | 'center' | 'right'
}

export interface DataTableProps<T> {
  /** Column definitions */
  columns: Column<T>[]
  /** Data rows (each must have a unique `id`) */
  data: T[]
  /** Rows per page (default 10) */
  pageSize?: number
  /** Show search bar (default true) */
  searchable?: boolean
  /** Placeholder for search input */
  searchPlaceholder?: string
  /** Callback when a row is clicked */
  onRowClick?: (row: T) => void
  /** Enable row selection checkboxes */
  selectable?: boolean
  /** Callback when selection changes */
  onSelectionChange?: (selected: T[]) => void
  /** Show loading skeleton */
  loading?: boolean
  /** Custom empty state message */
  emptyMessage?: string
  /** Custom empty state description */
  emptyDescription?: string
  /** Toolbar actions (bulk actions, filters, etc.) */
  toolbar?: React.ReactNode
}

// --- Sorting helpers ---

type SortDir = 'asc' | 'desc'

function SortIcon({ active, direction }: { active: boolean; direction: SortDir }) {
  if (!active) return <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />
  return direction === 'asc'
    ? <ChevronUp className="h-3.5 w-3.5 text-foreground" />
    : <ChevronDown className="h-3.5 w-3.5 text-foreground" />
}

// --- Component ---

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  pageSize = 10,
  searchable = true,
  searchPlaceholder = 'Search...',
  onRowClick,
  selectable = false,
  onSelectionChange,
  loading = false,
  emptyMessage = 'No results found',
  emptyDescription = 'Try adjusting your search or filters.',
  toolbar,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<(keyof T & string) | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<string | number>>(new Set())

  // Filter + sort
  const filtered = useMemo(() => {
    let result = data

    if (search) {
      const q = search.toLowerCase()
      result = result.filter((row) =>
        columns.some((col) => String(row[col.key]).toLowerCase().includes(q))
      )
    }

    if (sortKey) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortKey]
        const bVal = b[sortKey]
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDir === 'asc' ? aVal - bVal : bVal - aVal
        }
        const aStr = String(aVal)
        const bStr = String(bVal)
        return sortDir === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr)
      })
    }

    return result
  }, [data, search, sortKey, sortDir, columns])

  // Pagination
  const totalPages = Math.ceil(filtered.length / pageSize)
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  // Ensure page is valid
  if (page > totalPages && totalPages > 0) setPage(totalPages)

  function handleSort(key: keyof T & string) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  // Selection
  const allSelected = paged.length > 0 && paged.every((r) => selected.has(r.id))
  const someSelected = paged.some((r) => selected.has(r.id)) && !allSelected

  function toggleAll() {
    const next = new Set(selected)
    if (allSelected) {
      paged.forEach((r) => next.delete(r.id))
    } else {
      paged.forEach((r) => next.add(r.id))
    }
    setSelected(next)
    onSelectionChange?.(data.filter((r) => next.has(r.id)))
  }

  function toggleRow(id: string | number) {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelected(next)
    onSelectionChange?.(data.filter((r) => next.has(r.id)))
  }

  // Page range display
  const pageNumbers = useMemo(() => {
    const pages: (number | '...')[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (page > 3) pages.push('...')
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i)
      }
      if (page < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }, [page, totalPages])

  const alignClass = (align?: string) =>
    align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'

  return (
    <div className="space-y-4">
      {/* Toolbar: search + custom actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {searchable && (
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className={cn(
                'flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm text-foreground',
                'placeholder:text-muted-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                'transition-colors duration-150'
              )}
              aria-label="Search table"
            />
          </div>
        )}
        {toolbar && <div className="flex items-center gap-2">{toolbar}</div>}
      </div>

      {/* Bulk actions bar */}
      {selectable && selected.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2 text-sm">
          <span className="font-medium text-foreground">{selected.size} selected</span>
          <button
            onClick={() => { setSelected(new Set()); onSelectionChange?.([]) }}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear selection
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              {selectable && (
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => { if (el) el.indeterminate = someSelected }}
                    onChange={toggleAll}
                    className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={cn(
                    'px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground',
                    alignClass(col.align),
                    col.width,
                    col.sortable && 'cursor-pointer select-none hover:text-foreground transition-colors'
                  )}
                  onClick={() => col.sortable && handleSort(col.key)}
                  aria-sort={
                    sortKey === col.key
                      ? sortDir === 'asc' ? 'ascending' : 'descending'
                      : undefined
                  }
                >
                  <span className="inline-flex items-center gap-1.5">
                    {col.label}
                    {col.sortable && (
                      <SortIcon active={sortKey === col.key} direction={sortDir} />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-border bg-card">
            {/* Loading state */}
            {loading && (
              <>
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={`skeleton-${i}`}>
                    {selectable && (
                      <td className="px-4 py-3">
                        <div className="h-4 w-4 animate-pulse rounded bg-muted" />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3">
                        <div className={cn('h-4 animate-pulse rounded bg-muted', i % 2 === 0 ? 'w-3/4' : 'w-1/2')} />
                      </td>
                    ))}
                  </tr>
                ))}
              </>
            )}

            {/* Empty state */}
            {!loading && paged.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-4 py-16 text-center"
                >
                  <div className="flex flex-col items-center">
                    <div className="rounded-full bg-muted p-3 mb-3">
                      <Inbox className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-foreground">{emptyMessage}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{emptyDescription}</p>
                  </div>
                </td>
              </tr>
            )}

            {/* Data rows */}
            {!loading && paged.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  'transition-colors',
                  onRowClick && 'cursor-pointer hover:bg-muted/50',
                  selected.has(row.id) && 'bg-primary/5'
                )}
              >
                {selectable && (
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selected.has(row.id)}
                      onChange={() => toggleRow(row.id)}
                      className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
                      aria-label={`Select row ${row.id}`}
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      'whitespace-nowrap px-4 py-3 text-sm text-card-foreground',
                      alignClass(col.align),
                      col.width
                    )}
                  >
                    {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm">
          <p className="text-muted-foreground">
            Showing{' '}
            <span className="font-medium text-foreground">
              {(page - 1) * pageSize + 1}
            </span>
            {' '}-{' '}
            <span className="font-medium text-foreground">
              {Math.min(page * pageSize, filtered.length)}
            </span>
            {' '}of{' '}
            <span className="font-medium text-foreground">{filtered.length}</span>
          </p>

          <div className="flex items-center gap-1">
            {/* Prev */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Page numbers */}
            {pageNumbers.map((p, i) =>
              p === '...' ? (
                <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground">...</span>
              ) : (
                <Button
                  key={p}
                  variant={p === page ? 'primary' : 'ghost'}
                  size="icon"
                  onClick={() => setPage(p as number)}
                  className="h-8 w-8"
                  aria-label={`Page ${p}`}
                  aria-current={p === page ? 'page' : undefined}
                >
                  {p}
                </Button>
              )
            )}

            {/* Next */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Next page"
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
```

### Skeleton Loader

```tsx
export function DataTableSkeleton({ columns = 4, rows = 5 }: { columns?: number; rows?: number }) {
  return (
    <div className="space-y-4">
      <div className="h-10 w-64 animate-pulse rounded-md bg-muted" />
      <div className="overflow-hidden rounded-lg border border-border">
        <table className="min-w-full">
          <thead className="bg-muted/50">
            <tr>
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="px-4 py-3">
                  <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {Array.from({ length: rows }).map((_, ri) => (
              <tr key={ri}>
                {Array.from({ length: columns }).map((_, ci) => (
                  <td key={ci} className="px-4 py-3">
                    <div className={cn('h-4 animate-pulse rounded bg-muted', ri % 2 === 0 ? 'w-3/4' : 'w-1/2')} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

### Usage Examples

```tsx
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { Download, Trash2 } from 'lucide-react'

// Basic table
<DataTable
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', render: (val) => (
      <span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
        {String(val)}
      </span>
    )},
    { key: 'created', label: 'Joined', sortable: true, align: 'right' },
  ]}
  data={users}
  onRowClick={(user) => router.push(`/users/${user.id}`)}
/>

// With selection + toolbar
<DataTable
  columns={columns}
  data={data}
  selectable
  onSelectionChange={(rows) => setSelectedRows(rows)}
  toolbar={
    <>
      <Button variant="outline" size="sm" iconLeft={<Download className="h-4 w-4" />}>
        Export
      </Button>
      <Button variant="destructive" size="sm" iconLeft={<Trash2 className="h-4 w-4" />}>
        Delete
      </Button>
    </>
  }
/>

// Loading state
<DataTable columns={columns} data={[]} loading />
```

---

## HTML/CSS (Simple Scope)

```html
<div class="data-table-wrapper">
  <!-- Search bar -->
  <div class="data-table-toolbar">
    <div class="data-table-search">
      <svg class="data-table-search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input type="text" class="data-table-search-input" placeholder="Search..." id="table-search" />
    </div>
  </div>

  <!-- Table -->
  <div class="data-table-container">
    <table class="data-table" id="data-table">
      <thead>
        <tr>
          <th class="sortable" data-sort="name">Name <span class="sort-icon"></span></th>
          <th class="sortable" data-sort="email">Email <span class="sort-icon"></span></th>
          <th>Role</th>
          <th class="sortable text-right" data-sort="joined">Joined <span class="sort-icon"></span></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Jane Cooper</td>
          <td>jane@example.com</td>
          <td><span class="badge">Admin</span></td>
          <td class="text-right">Jan 15, 2024</td>
        </tr>
        <!-- More rows... -->
      </tbody>
    </table>
  </div>

  <!-- Empty state (shown when no results) -->
  <div class="data-table-empty" id="table-empty" hidden>
    <p class="data-table-empty-title">No results found</p>
    <p class="data-table-empty-description">Try adjusting your search.</p>
  </div>

  <!-- Pagination -->
  <div class="data-table-pagination" id="table-pagination">
    <span class="data-table-info">Showing 1-10 of 42</span>
    <div class="data-table-pages">
      <button class="btn btn-outline btn-sm" id="prev-page" disabled>Previous</button>
      <button class="btn btn-outline btn-sm" id="next-page">Next</button>
    </div>
  </div>
</div>
```

```css
/* css/components/data-table.css */

.data-table-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.data-table-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  align-items: center;
  justify-content: space-between;
}

.data-table-search {
  position: relative;
  width: 100%;
  max-width: 20rem;
}

.data-table-search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-muted);
  pointer-events: none;
}

.data-table-search-input {
  width: 100%;
  height: 2.5rem;
  padding: var(--space-2) var(--space-3) var(--space-2) 2.25rem;
  font-size: var(--text-sm);
  color: var(--color-text);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.data-table-search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 25%, transparent);
}

.data-table-container {
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead {
  background: var(--color-bg-alt);
}

.data-table th {
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-xs);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
  text-align: left;
  white-space: nowrap;
  border-bottom: 1px solid var(--color-border);
}

.data-table th.sortable {
  cursor: pointer;
  user-select: none;
  transition: color var(--transition-fast);
}

.data-table th.sortable:hover { color: var(--color-text); }

.data-table th.sorted { color: var(--color-text); }

.sort-icon { font-size: 0.75em; margin-left: 0.25rem; }

.data-table tbody tr {
  border-bottom: 1px solid var(--color-border);
  transition: background var(--transition-fast);
}

.data-table tbody tr:last-child { border-bottom: none; }

.data-table tbody tr:hover { background: var(--color-bg-alt); }

.data-table td {
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-sm);
  color: var(--color-text);
  white-space: nowrap;
}

.text-right { text-align: right; }

.badge {
  display: inline-flex;
  padding: 0.125rem 0.5rem;
  font-size: var(--text-xs);
  font-weight: 500;
  border-radius: var(--radius-full);
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
  color: var(--color-primary);
}

.data-table-empty {
  text-align: center;
  padding: var(--space-16) var(--space-4);
}

.data-table-empty[hidden] { display: none; }
.data-table-empty-title { font-weight: 500; color: var(--color-text); }
.data-table-empty-description { font-size: var(--text-xs); color: var(--color-text-muted); margin-top: var(--space-1); }

.data-table-pagination {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  font-size: var(--text-sm);
}

.data-table-info { color: var(--color-text-muted); }

.data-table-pages { display: flex; gap: var(--space-2); }
```

```js
// js/data-table.js
(function () {
  const table = document.getElementById('data-table')
  const searchInput = document.getElementById('table-search')
  const emptyEl = document.getElementById('table-empty')
  if (!table) return

  const tbody = table.querySelector('tbody')
  const rows = Array.from(tbody.querySelectorAll('tr'))

  // Search
  searchInput?.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase()
    let visible = 0
    rows.forEach(row => {
      const text = row.textContent.toLowerCase()
      const show = text.includes(q)
      row.style.display = show ? '' : 'none'
      if (show) visible++
    })
    if (emptyEl) emptyEl.hidden = visible > 0
  })

  // Sorting
  table.querySelectorAll('th.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const key = th.dataset.sort
      const colIndex = Array.from(th.parentNode.children).indexOf(th)
      const isAsc = th.classList.contains('sorted-asc')

      // Reset all headers
      table.querySelectorAll('th.sortable').forEach(h => {
        h.classList.remove('sorted', 'sorted-asc', 'sorted-desc')
        h.querySelector('.sort-icon').textContent = ''
      })

      const dir = isAsc ? 'desc' : 'asc'
      th.classList.add('sorted', `sorted-${dir}`)
      th.querySelector('.sort-icon').textContent = dir === 'asc' ? ' \u2191' : ' \u2193'

      rows.sort((a, b) => {
        const aVal = a.children[colIndex]?.textContent.trim() || ''
        const bVal = b.children[colIndex]?.textContent.trim() || ''
        return dir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      })

      rows.forEach(row => tbody.appendChild(row))
    })
  })
})()
```
