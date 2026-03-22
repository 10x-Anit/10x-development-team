# List View Component

## Structure
```
<div> → <ul> → <li (renderItem)> → repeats + <empty state?>
```

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| items | `any[]` | yes | Data items |
| renderItem | `(item) => ReactNode` | yes | Item render function |
| actions | `{ label, onClick }[]` | no | Per-item actions |
| emptyState | `ReactNode` | no | Empty state content |

## Variants
- **default** — Simple list with dividers
- **card-list** — Each item in a card
- **timeline** — Vertical timeline with dots and lines

## Build Notes
- Divider between items: border-b neutral-200
- Hover: bg-neutral-50
- Actions: appear on hover (desktop) or swipe (mobile)
- Empty state: icon + message centered
- Timeline: left border with dots at each item
