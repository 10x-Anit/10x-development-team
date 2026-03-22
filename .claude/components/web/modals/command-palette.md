# Command Palette Component

## Structure
```
<div (backdrop)> → <div (palette)> → <input (search)> + <ul (results)>
```

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| commands | `{ id, label, icon?, shortcut?, group? }[]` | yes | Available commands |
| placeholder | `string` | no | Search placeholder |
| onSelect | `(command) => void` | yes | Selection handler |

## Variants
- **default** — Simple search + results list
- **with-categories** — Results grouped by category

## Build Notes
- Trigger: Ctrl+K / Cmd+K
- Auto-focus search input on open
- Arrow keys navigate results, Enter selects
- Fuzzy matching on command labels
- Show keyboard shortcuts right-aligned
- Max 8-10 visible results, scrollable
