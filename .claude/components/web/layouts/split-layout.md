# Split Layout Component

## Structure
```
<div (flex row)> → <div (content side)> + <div (media side)>
```

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| left | `ReactNode` | yes | Left side content |
| right | `ReactNode` | yes | Right side content |
| ratio | `string` | no | Split ratio (default: "1:1", also "2:1", "1:2") |
| reversed | `boolean` | no | Swap left and right |

## Variants
- **default** — Equal split, stack on mobile
- **sticky-media** — Media side sticks on scroll
- **overlap** — Slight overlap between sides

## Build Notes
- Mobile: stack vertically (media first or content first)
- Gap between sides: 32px-64px
- Sticky: `position: sticky; top: 80px` on media side
- Commonly used for hero sections, feature highlights
