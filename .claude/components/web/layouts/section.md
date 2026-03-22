# Section Component

## Structure
```
<section id?> → <container> → <heading?> + <subtitle?> + {children}
```

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| title | `string` | no | Section heading |
| subtitle | `string` | no | Subtitle text |
| background | `string` | no | Background color/class |
| padding | `string` | no | Vertical padding (default: py-16) |
| id | `string` | no | Anchor ID for navigation |

## Variants
- **default** — Standard content section
- **hero** — Large padding, centered text, bg image support
- **cta** — Centered with prominent call-to-action button
- **feature** — Grid layout for feature cards

## Build Notes
- Heading: centered by default, left-aligned variant
- Alternate backgrounds: white → neutral-50 → white pattern
- Hero: min-height 60vh, vertically centered content
