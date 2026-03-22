# Card Component

## Structure
```
<div (card)> → <image?> + <body (title + description + badge?)> + <actions?>
```

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| image | `{ src, alt }` | no | Card image |
| title | `string` | yes | Card title |
| description | `string` | no | Card description |
| actions | `ReactNode` | no | Footer actions (buttons, links) |
| badge | `{ label, color }` | no | Badge/tag on card |

## Variants
- **default** — Vertical: image top, content below
- **horizontal** — Image left, content right
- **minimal** — No image, just content + border
- **elevated** — Larger shadow, no border

## Build Notes
- Border: neutral-200, rounded-lg
- Shadow: sm default, md on hover
- Image: aspect-video, object-cover
- Hover: subtle lift (translateY -2px)
- Transition: 150ms ease
