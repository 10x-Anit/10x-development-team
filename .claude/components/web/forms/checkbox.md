# Checkbox Component

## Structure
```
<label> → <input type="checkbox"> + <custom indicator> + <label text>
```

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| label | `string` | yes | Checkbox label |
| checked | `boolean` | no | Controlled checked state |
| onChange | `(checked) => void` | no | Change handler |
| disabled | `boolean` | no | Disabled state |
| indeterminate | `boolean` | no | Indeterminate state (dash icon) |

## Variants
- **default** — Standard checkbox with checkmark
- **switch** — Toggle switch style
- **card** — Full card that toggles on click

## Build Notes
- Custom visual: hide native input, style custom box
- Checked: primary-500 bg with white checkmark
- Focus-visible: ring-2 primary-500
- Switch: 40px wide, 20px tall, circle slides
