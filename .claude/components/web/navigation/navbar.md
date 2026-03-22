# Navbar Component

## Structure
```
<nav> → <container> → <Logo> + <NavLinks> + <CTA> + <MobileToggle>
```

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| logo | `{ src, alt, href }` | yes | Logo image and link |
| links | `{ label, href, active? }[]` | yes | Nav links |
| cta | `{ label, href }` | no | CTA button |
| sticky | `boolean` | no | Stick on scroll |
| transparent | `boolean` | no | Transparent until scroll |

## Variants
- **default** — Logo left, links center, CTA right. Solid bg.
- **centered** — Logo centered above links.
- **sidebar-toggle** — Has hamburger to toggle sidebar.

## Build Notes
- Mobile breakpoint: 768px → hamburger menu
- `position: sticky` for sticky variant
- Mobile menu: full-width dropdown, `aria-expanded` on toggle
- Focus trap inside open mobile menu
