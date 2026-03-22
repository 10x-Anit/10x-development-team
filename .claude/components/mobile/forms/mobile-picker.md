# Mobile Picker Component

## Structure
```
<TouchableOpacity (trigger)> → <Modal> → <Picker / FlatList>
```

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| options | `{ value, label }[]` | yes | Picker options |
| selectedValue | `any` | yes | Current selected value |
| onValueChange | `(value) => void` | yes | Change handler |

## Variants
- **default** — Platform native picker
- **wheel** — iOS-style scroll wheel
- **modal** — Full modal with searchable list

## Build Notes
- Trigger: looks like a text input with chevron-down icon
- iOS: use native Picker in action sheet
- Android: use native Picker or modal list
- Modal variant: FlatList with search input at top
