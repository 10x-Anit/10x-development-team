# Grid Component

## Structure
```
<div (css grid)> → {children mapped into cells}
```

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| columns | `number \| { sm?, md?, lg?, xl? }` | no | Column count (responsive) |
| gap | `number \| string` | no | Gap between items |
| items | `ReactNode[]` | no | Grid items (or use children) |

## Variants
- **default** — Fixed column count, responsive breakpoints
- **masonry** — Pinterest-style staggered grid
- **auto-fit** — Auto-fill columns (minmax pattern)

## Build Notes
- Default: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Auto-fit: `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))`
- Gap: use Tailwind gap utilities
- Items should stretch to fill grid cells by default
