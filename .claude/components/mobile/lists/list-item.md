# List Item Component (Mobile)

## Structure
```
<TouchableOpacity> → <Icon?> + <View (title + subtitle)> + <Right (chevron/toggle/badge)>
```

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| title | `string` | yes | Item title |
| subtitle | `string` | no | Secondary text |
| icon | `ReactNode` | no | Left icon |
| onPress | `() => void` | no | Press handler |
| swipeActions | `{ label, color, onPress }[]` | no | Swipe action buttons |

## Variants
- **default** — Title + subtitle + chevron right
- **with-avatar** — Circular image left instead of icon
- **with-toggle** — Switch/toggle on right side

## Build Notes
- Height: 56px (single line), 72px (two lines)
- Divider: 1px bottom border, indented past icon
- Swipe: reveal action buttons (delete, edit, etc.)
- Chevron: neutral-400, only if onPress provided
- Active/pressed: bg-neutral-100
