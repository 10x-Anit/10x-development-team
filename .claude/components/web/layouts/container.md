# Container Component

## Structure
```
<div (max-width + centered)> → {children}
```

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| maxWidth | `string` | no | Max width (default: 1280px) |
| padding | `string` | no | Horizontal padding (default: px-4 md:px-6) |

## Variants
- **default** — 1280px max-width
- **narrow** — 768px max-width (for text content)
- **wide** — 1440px max-width
- **full** — No max-width, only padding

## Build Notes
- `mx-auto` for centering
- Responsive padding: 16px mobile, 24px tablet+
