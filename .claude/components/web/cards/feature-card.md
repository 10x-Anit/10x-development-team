# Feature Card Component

## Structure
```
<div (card)> → <icon (in circle)> + <title> + <description> + <link?>
```

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| icon | `ReactNode` | yes | Feature icon |
| title | `string` | yes | Feature title |
| description | `string` | yes | Feature description |
| link | `{ label, href }` | no | Learn more link |

## Variants
- **default** — Icon top, text below, left-aligned
- **centered** — Everything centered
- **with-image** — Image instead of icon

## Build Notes
- Icon: 48px, in a light primary bg circle
- Title: text-lg font-semibold
- Description: text-sm text-neutral-600
- Link: text-primary with arrow icon
- Typically in a 3-column grid
