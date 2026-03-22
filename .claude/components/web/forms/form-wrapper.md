# Form Wrapper Component

## Structure
```
<form onSubmit> → <fields (grid/stack)> + <submit button> + <form-level error?>
```

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| onSubmit | `(data) => void` | yes | Submit handler |
| validation | `object` | no | Validation schema (zod/yup) |
| layout | `"stack" \| "grid" \| "inline"` | no | Field layout |
| submitLabel | `string` | no | Submit button text |

## Variants
- **default** — Vertical stack of fields
- **inline** — Horizontal fields in a row
- **stepped** — Multi-step wizard with progress indicator

## Build Notes
- Validation: run on submit, show errors per field
- Loading state: disable submit button, show spinner
- Stepped: progress bar or step indicators at top
- Reset: clear all fields and errors after successful submit
- `noValidate` on form element (handle validation in JS)
