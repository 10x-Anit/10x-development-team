# Tabs Component

## Structure
```
<div> → <TabList role="tablist"> + <TabPanel role="tabpanel">
```

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| items | `{ label, content, icon?, disabled? }[]` | yes | Tab items |
| activeTab | `number` | no | Controlled active index |
| onChange | `(index) => void` | no | Tab change handler |
| orientation | `"horizontal" \| "vertical"` | no | Layout direction |

## Variants
- **default** — Horizontal tabs with bottom border on active
- **pills** — Rounded pill-shaped active indicator
- **underline** — Underline animation slides between tabs

## Build Notes
- Keyboard: Arrow keys navigate, Enter/Space activates
- `role="tablist"`, `role="tab"`, `role="tabpanel"`
- `aria-selected` on active tab
- Lazy render tab content or keep all mounted (configurable)
