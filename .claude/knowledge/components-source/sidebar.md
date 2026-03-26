# Sidebar Component -- Production-Quality, Copy-Paste Ready

> Uses ONLY semantic design tokens. NEVER use `text-white`, `bg-gray-*`, `bg-blue-*`, etc.

---

## React + Tailwind (MVP/Production Scope)

### Core Sidebar Component

```tsx
// src/components/layout/sidebar.tsx
'use client'
import { useState, useEffect, createContext, useContext } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'

// --- Context for sidebar state ---

interface SidebarContextValue {
  collapsed: boolean
  setCollapsed: (val: boolean) => void
  mobileOpen: boolean
  setMobileOpen: (val: boolean) => void
}

const SidebarContext = createContext<SidebarContextValue>({
  collapsed: false,
  setCollapsed: () => {},
  mobileOpen: false,
  setMobileOpen: () => {},
})

export const useSidebar = () => useContext(SidebarContext)

// --- TypeScript Interfaces ---

interface SidebarItem {
  label: string
  href: string
  icon: React.ReactNode
  badge?: string | number
}

interface SidebarSection {
  title?: string
  items: SidebarItem[]
}

interface SidebarProps {
  /** Grouped navigation sections */
  sections: SidebarSection[]
  /** Logo/brand */
  logo?: { text: string; href: string; icon?: React.ReactNode }
  /** Footer content (user menu, settings) */
  footer?: React.ReactNode
  /** Initial collapsed state */
  defaultCollapsed?: boolean
}

// --- Component ---

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Lock body scroll on mobile open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, mobileOpen, setMobileOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function Sidebar({ sections, logo, footer, defaultCollapsed = false }: SidebarProps) {
  const pathname = usePathname()
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useSidebar()

  // Set default collapsed on mount
  useEffect(() => {
    setCollapsed(defaultCollapsed)
  }, [defaultCollapsed, setCollapsed])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname, setMobileOpen])

  const sidebarContent = (
    <>
      {/* Header */}
      <div className={cn(
        'flex items-center border-b border-border px-4 shrink-0 transition-all duration-200',
        collapsed ? 'h-14 justify-center' : 'h-14 justify-between'
      )}>
        {!collapsed && logo && (
          <Link
            href={logo.href}
            className="flex items-center gap-2 text-lg font-bold text-foreground truncate"
          >
            {logo.icon && <span className="shrink-0" aria-hidden="true">{logo.icon}</span>}
            <span className="truncate">{logo.text}</span>
          </Link>
        )}
        {collapsed && logo?.icon && (
          <Link href={logo.href} className="text-foreground" aria-label={logo.text}>
            {logo.icon}
          </Link>
        )}

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'hidden md:flex items-center justify-center rounded-md p-1.5 transition-colors',
            'text-muted-foreground hover:bg-accent hover:text-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            collapsed && 'mx-auto'
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>

        {/* Close button (mobile only) */}
        <button
          onClick={() => setMobileOpen(false)}
          className="flex md:hidden items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Sidebar navigation">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className={cn(sectionIndex > 0 && 'mt-6')}>
            {/* Section title */}
            {section.title && !collapsed && (
              <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {section.title}
              </p>
            )}
            {section.title && collapsed && (
              <div className="mb-2 mx-auto h-px w-6 bg-border" />
            )}

            <ul className="space-y-1" role="list">
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                        collapsed && 'justify-center px-2'
                      )}
                      title={collapsed ? item.label : undefined}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {/* Icon */}
                      <span className="shrink-0">{item.icon}</span>

                      {/* Label */}
                      {!collapsed && (
                        <span className="flex-1 truncate">{item.label}</span>
                      )}

                      {/* Badge */}
                      {!collapsed && item.badge != null && (
                        <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          {item.badge}
                        </span>
                      )}
                    </Link>

                    {/* Tooltip for collapsed state */}
                    {collapsed && (
                      <div
                        className="pointer-events-none absolute left-full ml-2 hidden rounded-md bg-popover px-2 py-1 text-xs font-medium text-popover-foreground shadow-md group-hover:block"
                        role="tooltip"
                      >
                        {item.label}
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      {footer && (
        <div className="shrink-0 border-t border-border p-3">
          {footer}
        </div>
      )}
    </>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden md:flex md:flex-col border-r border-border bg-card transition-all duration-200',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card transition-transform duration-300 md:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </aside>
    </>
  )
}

// --- Mobile trigger button (place in page header) ---

export function SidebarTrigger() {
  const { setMobileOpen } = useSidebar()
  return (
    <button
      onClick={() => setMobileOpen(true)}
      className="inline-flex items-center justify-center rounded-md p-2 md:hidden text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label="Open sidebar"
    >
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
    </button>
  )
}
```

### Framer Motion Enhanced Sidebar (LARGE context / Production)

```tsx
// src/components/layout/motion-sidebar.tsx
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SidebarItem { label: string; href: string; icon: React.ReactNode; badge?: string | number }
interface SidebarSection { title?: string; items: SidebarItem[] }

interface MotionSidebarProps {
  sections: SidebarSection[]
  logo?: { text: string; href: string; icon?: React.ReactNode }
  footer?: React.ReactNode
}

export function MotionSidebar({ sections, logo, footer }: MotionSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => { setMobileOpen(false) }, [pathname])
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const navContent = (
    <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Sidebar navigation">
      {sections.map((section, si) => (
        <div key={si} className={cn(si > 0 && 'mt-6')}>
          {section.title && !collapsed && (
            <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{section.title}</p>
          )}
          <ul className="space-y-1" role="list">
            {section.items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <li key={item.href} className="relative">
                  <Link
                    href={item.href}
                    className={cn(
                      'group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                      collapsed && 'justify-center px-2'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {/* Animated active background */}
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active-bg"
                        className="absolute inset-0 rounded-md bg-primary/10"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative shrink-0">{item.icon}</span>
                    {!collapsed && <span className="relative flex-1 truncate">{item.label}</span>}
                    {!collapsed && item.badge != null && (
                      <span className="relative ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )

  return (
    <>
      {/* Desktop */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 256 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="hidden md:flex md:flex-col border-r border-border bg-card overflow-hidden"
      >
        <div className={cn('flex items-center h-14 border-b border-border px-4 shrink-0', collapsed ? 'justify-center' : 'justify-between')}>
          <AnimatePresence mode="wait">
            {!collapsed && logo && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <Link href={logo.href} className="flex items-center gap-2 text-lg font-bold text-foreground truncate">
                  {logo.icon && <span className="shrink-0">{logo.icon}</span>}
                  <span className="truncate">{logo.text}</span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
          {collapsed && logo?.icon && <Link href={logo.href} aria-label={logo.text}>{logo.icon}</Link>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
        {navContent}
        {footer && <div className="shrink-0 border-t border-border p-3">{footer}</div>}
      </motion.aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card md:hidden"
            >
              <div className="flex items-center justify-between h-14 border-b border-border px-4">
                {logo && (
                  <Link href={logo.href} className="flex items-center gap-2 text-lg font-bold text-foreground">
                    {logo.icon}{logo.text}
                  </Link>
                )}
                <button onClick={() => setMobileOpen(false)} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent" aria-label="Close sidebar">
                  <X className="h-4 w-4" />
                </button>
              </div>
              {navContent}
              {footer && <div className="shrink-0 border-t border-border p-3">{footer}</div>}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
```

### Usage Example (Dashboard Layout)

```tsx
// src/app/(dashboard)/layout.tsx
import { SidebarProvider, Sidebar, SidebarTrigger } from '@/components/layout/sidebar'
import { Home, Users, Settings, BarChart3, FileText, Bell } from 'lucide-react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar
          logo={{ text: 'MyApp', href: '/dashboard', icon: <span className="text-primary">M</span> }}
          sections={[
            {
              title: 'Overview',
              items: [
                { label: 'Dashboard', href: '/dashboard', icon: <Home className="h-5 w-5" /> },
                { label: 'Analytics', href: '/dashboard/analytics', icon: <BarChart3 className="h-5 w-5" />, badge: 'New' },
              ],
            },
            {
              title: 'Management',
              items: [
                { label: 'Users', href: '/dashboard/users', icon: <Users className="h-5 w-5" />, badge: 12 },
                { label: 'Documents', href: '/dashboard/documents', icon: <FileText className="h-5 w-5" /> },
                { label: 'Notifications', href: '/dashboard/notifications', icon: <Bell className="h-5 w-5" /> },
              ],
            },
            {
              items: [
                { label: 'Settings', href: '/dashboard/settings', icon: <Settings className="h-5 w-5" /> },
              ],
            },
          ]}
        />
        <div className="flex-1 flex flex-col">
          <header className="flex items-center h-14 border-b border-border px-4 md:hidden">
            <SidebarTrigger />
            <span className="ml-3 font-semibold text-foreground">Dashboard</span>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
```

---

## HTML/CSS (Simple Scope)

```html
<aside class="sidebar" id="sidebar">
  <div class="sidebar-header">
    <a href="/dashboard" class="sidebar-logo">
      <span class="sidebar-logo-icon">M</span>
      <span class="sidebar-logo-text">MyApp</span>
    </a>
    <button class="sidebar-collapse-btn" aria-label="Toggle sidebar" id="sidebar-toggle">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
    </button>
  </div>

  <nav class="sidebar-nav" aria-label="Dashboard navigation">
    <p class="sidebar-section-title">Overview</p>
    <ul class="sidebar-list">
      <li><a href="/dashboard" class="sidebar-link active" aria-current="page">
        <svg class="sidebar-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
        <span class="sidebar-label">Dashboard</span>
      </a></li>
      <li><a href="/analytics" class="sidebar-link">
        <svg class="sidebar-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
        <span class="sidebar-label">Analytics</span>
        <span class="sidebar-badge">New</span>
      </a></li>
    </ul>
  </nav>
</aside>

<!-- Mobile overlay -->
<div class="sidebar-overlay" id="sidebar-overlay" hidden></div>
```

```css
/* css/components/sidebar.css */

.sidebar {
  display: none;
  flex-direction: column;
  width: 16rem;
  height: 100vh;
  position: sticky;
  top: 0;
  border-right: 1px solid var(--color-border);
  background: var(--color-bg);
  transition: width var(--transition-base);
  overflow: hidden;
}

.sidebar.collapsed { width: 4rem; }

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 3.5rem;
  padding: 0 var(--space-4);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  text-decoration: none;
  font-weight: 700;
  font-size: var(--text-lg);
  color: var(--color-text);
}

.sidebar.collapsed .sidebar-logo-text { display: none; }

.sidebar-collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-1);
  background: none;
  border: none;
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: background var(--transition-fast), color var(--transition-fast);
}

.sidebar-collapse-btn:hover {
  background: var(--color-bg-alt);
  color: var(--color-text);
}

.sidebar-collapse-btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.sidebar.collapsed .sidebar-collapse-btn svg { transform: rotate(180deg); }

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-4) var(--space-3);
}

.sidebar-section-title {
  padding: 0 var(--space-3);
  margin-bottom: var(--space-2);
  font-size: var(--text-xs);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-muted);
}

.sidebar.collapsed .sidebar-section-title { display: none; }

.sidebar-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-list li + li { margin-top: 0.125rem; }

.sidebar-link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-muted);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: background var(--transition-fast), color var(--transition-fast);
}

.sidebar-link:hover {
  background: var(--color-bg-alt);
  color: var(--color-text);
}

.sidebar-link.active {
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
  color: var(--color-primary);
}

.sidebar.collapsed .sidebar-link { justify-content: center; padding: var(--space-2); }
.sidebar.collapsed .sidebar-label { display: none; }
.sidebar.collapsed .sidebar-badge { display: none; }

.sidebar-icon { width: 1.25rem; height: 1.25rem; flex-shrink: 0; }

.sidebar-badge {
  margin-left: auto;
  padding: 0.125rem 0.5rem;
  font-size: var(--text-xs);
  font-weight: 500;
  border-radius: var(--radius-full);
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
  color: var(--color-primary);
}

/* Mobile sidebar */
.sidebar-overlay {
  position: fixed;
  inset: 0;
  z-index: 40;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
}

.sidebar-overlay[hidden] { display: none; }

@media (min-width: 768px) {
  .sidebar { display: flex; }
  .sidebar-overlay { display: none !important; }
}

@media (max-width: 767px) {
  .sidebar {
    display: flex;
    position: fixed;
    inset-block: 0;
    left: 0;
    z-index: 50;
    transform: translateX(-100%);
    transition: transform var(--transition-slow);
  }
  .sidebar.mobile-open { transform: translateX(0); }
}
```

```js
// js/sidebar.js
(function () {
  const sidebar = document.getElementById('sidebar')
  const toggle = document.getElementById('sidebar-toggle')
  const overlay = document.getElementById('sidebar-overlay')

  // Desktop collapse
  toggle?.addEventListener('click', () => {
    sidebar?.classList.toggle('collapsed')
  })

  // Mobile open/close (trigger from page header button)
  window.openSidebar = function () {
    sidebar?.classList.add('mobile-open')
    if (overlay) overlay.hidden = false
    document.body.style.overflow = 'hidden'
  }

  window.closeSidebar = function () {
    sidebar?.classList.remove('mobile-open')
    if (overlay) overlay.hidden = true
    document.body.style.overflow = ''
  }

  overlay?.addEventListener('click', window.closeSidebar)
})()
```
