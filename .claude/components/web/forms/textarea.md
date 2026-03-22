# Textarea Component

## Structure
```
<div> → <label> + <textarea> + <character count?>
```

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| label | `string` | yes | Textarea label |
| rows | `number` | no | Initial row count (default: 3) |
| maxLength | `number` | no | Character limit |
| autoResize | `boolean` | no | Auto-grow with content |
| placeholder | `string` | no | Placeholder text |

## Variants
- **default** — Standard bordered textarea
- **rich-text** — With toolbar (bold, italic, lists)

## Build Notes
- Auto-resize: adjust height on input, no scrollbar
- Character count: show "X / maxLength" bottom right
- Same focus/error styling as Input component
