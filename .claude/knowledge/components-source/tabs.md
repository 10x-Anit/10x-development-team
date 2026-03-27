# Tabs Component — Copy-Paste Ready

> Uses ONLY semantic design tokens. Accessible with ARIA roles and keyboard navigation.

---

## React + Tailwind

```tsx
// src/components/ui/tabs.tsx
'use client'
import { useState, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'

// --- Types ---

export interface Tab {
  id: string
  label: string
  icon?: React.ReactNode
  disabled?: boolean
  badge?: string | number
}

export interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
  activeTab?: string
  onChange?: (tabId: string) => void
  variant?: 'underline' | 'pills' | 'enclosed'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  children: (activeTab: string) => React.ReactNode
  className?: string
}

// --- Variant Styles ---

const tabVariants = {
  underline: {
    list: 'border-b border-border',
    tab: 'border-b-2 border-transparent -mb-px',
    active: 'border-primary text-foreground',
    inactive: 'text-muted-foreground hover:text-foreground hover:border-border',
  },
  pills: {
    list: 'bg-muted rounded-lg p-1 gap-1',
    tab: 'rounded-md',
    active: 'bg-background text-foreground shadow-sm',
    inactive: 'text-muted-foreground hover:text-foreground',
  },
  enclosed: {
    list: 'border-b border-border',
    tab: 'border border-transparent rounded-t-lg -mb-px',
    active: 'border-border border-b-background bg-background text-foreground',
    inactive: 'text-muted-foreground hover:text-foreground',
  },
}

const sizeMap = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-2.5 text-base',
}

// --- Component ---

export function Tabs({
  tabs,
  defaultTab,
  activeTab: controlledTab,
  onChange,
  variant = 'underline',
  size = 'md',
  fullWidth,
  children,
  className,
}: TabsProps) {
  const [internalTab, setInternalTab] = useState(defaultTab || tabs[0]?.id || '')
  const tabListRef = useRef<HTMLDivElement>(null)

  const activeTab = controlledTab ?? internalTab
  const styles = tabVariants[variant]

  function selectTab(tabId: string) {
    setInternalTab(tabId)
    onChange?.(tabId)
  }

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const enabledTabs = tabs.filter(t => !t.disabled)
    const currentIdx = enabledTabs.findIndex(t => t.id === activeTab)

    let nextIdx: number | null = null
    if (e.key === 'ArrowRight') nextIdx = (currentIdx + 1) % enabledTabs.length
    if (e.key === 'ArrowLeft') nextIdx = (currentIdx - 1 + enabledTabs.length) % enabledTabs.length
    if (e.key === 'Home') nextIdx = 0
    if (e.key === 'End') nextIdx = enabledTabs.length - 1

    if (nextIdx !== null) {
      e.preventDefault()
      selectTab(enabledTabs[nextIdx].id)
      // Focus the tab button
      const buttons = tabListRef.current?.querySelectorAll('[role="tab"]')
      const globalIdx = tabs.findIndex(t => t.id === enabledTabs[nextIdx!].id)
      ;(buttons?.[globalIdx] as HTMLElement)?.focus()
    }
  }, [tabs, activeTab])

  return (
    <div className={className}>
      {/* Tab List */}
      <div
        ref={tabListRef}
        role="tablist"
        aria-orientation="horizontal"
        className={cn('flex', styles.list, fullWidth && 'w-full')}
        onKeyDown={handleKeyDown}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            aria-disabled={tab.disabled}
            tabIndex={activeTab === tab.id ? 0 : -1}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && selectTab(tab.id)}
            className={cn(
              'inline-flex items-center gap-2 font-medium transition-all whitespace-nowrap',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              sizeMap[size],
              styles.tab,
              activeTab === tab.id ? styles.active : styles.inactive,
              fullWidth && 'flex-1 justify-center',
            )}
          >
            {tab.icon && <span className="shrink-0" aria-hidden="true">{tab.icon}</span>}
            {tab.label}
            {tab.badge !== undefined && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/10 px-1.5 text-[10px] font-semibold text-primary">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Panel */}
      <div
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        tabIndex={0}
        className="mt-4 focus-visible:outline-none"
      >
        {children(activeTab)}
      </div>
    </div>
  )
}
```

### Usage
```tsx
import { Tabs } from '@/components/ui/tabs'
import { LayoutDashboard, Settings, Users } from 'lucide-react'

const tabs = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="h-4 w-4" /> },
  { id: 'members', label: 'Members', icon: <Users className="h-4 w-4" />, badge: 12 },
  { id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
]

<Tabs tabs={tabs} defaultTab="overview">
  {(activeTab) => (
    <>
      {activeTab === 'overview' && <OverviewPanel />}
      {activeTab === 'members' && <MembersPanel />}
      {activeTab === 'settings' && <SettingsPanel />}
    </>
  )}
</Tabs>

{/* Pills variant */}
<Tabs tabs={tabs} variant="pills" />

{/* Full-width */}
<Tabs tabs={tabs} fullWidth />
```
