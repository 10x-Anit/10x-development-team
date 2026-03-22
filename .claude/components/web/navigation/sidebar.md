# Sidebar Component

## Structure
```
<aside> → <Header (logo + collapse)> + <nav (items)> + <Footer (user/logout)>
```

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| items | `{ icon, label, href, children? }[]` | yes | Nav items |
| collapsed | `boolean` | no | Icon-only mode |
| logo | `{ src, alt }` | no | Header logo |
| footer | `ReactNode` | no | Footer content |

## Variants
- **default** — 240px expanded, 64px collapsed
- **mini** — Always collapsed, tooltips on hover
- **overlay** — Slides over content on mobile

## Build Notes
- Transition: 200ms ease on collapse
- Active: highlighted bg + left border accent
- Nested: indent + collapsible group with chevron
- Mobile: overlay with backdrop, close on outside click
- `aria-current="page"` on active
