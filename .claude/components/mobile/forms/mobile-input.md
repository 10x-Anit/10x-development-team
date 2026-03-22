# Mobile Input Component

## Structure
```
<View> → <Text (label)> + <TextInput> + <Text (error)?>
```

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| label | `string` | yes | Input label |
| keyboardType | `string` | no | default, email-address, numeric, phone-pad |
| returnKeyType | `string` | no | done, next, go, search |
| autoFocus | `boolean` | no | Auto-focus on mount |

## Variants
- **default** — Label above, bordered input
- **outlined** — Material-style outlined input
- **underline** — Underline-only style

## Build Notes
- Height: 48px minimum touch target
- Focus: primary border color
- Error: red border + error text below
- returnKeyType: controls keyboard submit button label
- Use `ref` for focusing next input on "next" key
