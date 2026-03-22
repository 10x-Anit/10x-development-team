# Toast Component

## Structure
```
<div (toast container, fixed)> → <div (toast)> → <icon> + <message> + <action?> + <close?>
```

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| message | `string` | yes | Toast message |
| type | `"success" \| "error" \| "warning" \| "info"` | yes | Toast type |
| duration | `number` | no | Auto-dismiss ms (default: 5000) |
| action | `{ label, onClick }` | no | Action button |

## Variants
- **success** — Green icon, success styling
- **error** — Red icon, error styling
- **warning** — Amber icon, warning styling
- **info** — Blue icon, info styling

## Build Notes
- Position: fixed top-right (desktop), bottom-center (mobile)
- Stack multiple toasts vertically with gap
- Slide in from right, fade out
- Progress bar for auto-dismiss timer
- `role="alert"`, `aria-live="polite"`
