# Select Component

## Structure
```
<div> → <label> + <button (trigger)> + <dropdown (options list)>
```

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| options | `{ value, label, group? }[]` | yes | Options list |
| label | `string` | yes | Select label |
| multiple | `boolean` | no | Allow multi-select |
| searchable | `boolean` | no | Enable type-to-search |
| placeholder | `string` | no | Placeholder text |

## Variants
- **default** — Single select dropdown
- **multi** — Multi-select with chips/tags
- **grouped** — Options grouped by category

## Build Notes
- Dropdown: absolute positioned, max-height with scroll
- Keyboard: arrows navigate, enter selects, escape closes
- `role="listbox"`, `role="option"` for accessibility
- Close on outside click or escape
- Search: filter options as user types
