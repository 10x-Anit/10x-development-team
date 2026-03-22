# Input Component

## Structure
```
<div> → <label> + <input> + <error message?>
```

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| label | `string` | yes | Input label |
| type | `string` | no | text, email, password, number, tel, url |
| placeholder | `string` | no | Placeholder text |
| error | `string` | no | Error message (shows red border + text) |
| required | `boolean` | no | Required field indicator |
| disabled | `boolean` | no | Disabled state |

## Variants
- **default** — Label above, bordered input
- **floating-label** — Label floats up on focus
- **with-icon** — Icon inside input (left or right)

## Build Notes
- Error state: red border, red error text below
- Focus: primary-500 border, ring-2
- Disabled: opacity-50, cursor-not-allowed
- `aria-invalid` when error present
- `aria-describedby` pointing to error message element
