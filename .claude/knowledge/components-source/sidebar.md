# Sidebar Component — Copy-Paste Ready

## React + Tailwind (Dashboard Layout)
```tsx
// src/components/layout/sidebar.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface SidebarItem {
  label: string
  href: string
  icon: React.ReactNode
}

interface SidebarProps {
  items: SidebarItem[]
  logo?: { text: string; href: string }
}

export function Sidebar({ items, logo }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <aside className={`hidden md:flex flex-col border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 transition-all duration-200 ${collapsed ? 'w-16' : 'w-60'}`}>
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4">
        {!collapsed && logo && (
          <Link href={logo.href} className="text-lg font-bold text-gray-900 dark:text-white truncate">{logo.text}</Link>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="rounded p-1.5 hover:bg-gray-200 dark:hover:bg-gray-800" aria-label={collapsed ? 'Expand' : 'Collapse'}>
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {items.map((item) => {
            const active = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
                    ${active
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-l-2 border-blue-600'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                    }`}
                  title={collapsed ? item.label : undefined}
                  aria-current={active ? 'page' : undefined}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
```

## Usage (Dashboard Layout)
```tsx
// src/app/(dashboard)/layout.tsx
import { Sidebar } from '@/components/layout/sidebar'
import { Home, Users, Settings, BarChart } from 'lucide-react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar
        logo={{ text: 'MyApp', href: '/dashboard' }}
        items={[
          { label: 'Dashboard', href: '/dashboard', icon: <Home className="h-5 w-5" /> },
          { label: 'Users', href: '/dashboard/users', icon: <Users className="h-5 w-5" /> },
          { label: 'Analytics', href: '/dashboard/analytics', icon: <BarChart className="h-5 w-5" /> },
          { label: 'Settings', href: '/dashboard/settings', icon: <Settings className="h-5 w-5" /> },
        ]}
      />
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
```
