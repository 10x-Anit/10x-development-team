# Modal Component

## Structure
```
<div (backdrop)> → <div (modal panel)> → <header (title + close)> + <body> + <footer (actions)>
```

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| title | `string` | yes | Modal title |
| isOpen | `boolean` | yes | Open state |
| onClose | `() => void` | yes | Close handler |
| size | `"sm" \| "md" \| "lg" \| "xl"` | no | Modal width |
| actions | `{ label, onClick, variant }[]` | no | Footer buttons |

## Variants
- **default** — Centered dialog with backdrop
- **fullscreen** — Full viewport on mobile, large on desktop
- **drawer** — Slides in from right side
- **confirm** — Small confirmation dialog with yes/no

## Build Notes
- Backdrop: bg-black/50, click to close
- Panel: centered, max-height 90vh, scrollable body
- Focus trap inside modal when open
- Close on Escape key
- `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- Transition: fade in backdrop, scale up panel
- Sizes: sm=400px, md=500px, lg=640px, xl=800px
