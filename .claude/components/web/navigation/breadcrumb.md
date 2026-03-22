# Breadcrumb Component

## Structure
```
<nav aria-label="Breadcrumb"> → <ol> → <li> / <separator> / <li (current)>
```

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| items | `{ label, href? }[]` | yes | Breadcrumb items (last = current) |
| separator | `string` | no | Separator char (default: "/") |

## Variants
- **default** — Text links with "/" separator
- **with-icons** — Each item has an icon before label

## Build Notes
- Last item: no link, `aria-current="page"`
- Separator: neutral-400 color
- Truncate long labels with ellipsis on mobile
