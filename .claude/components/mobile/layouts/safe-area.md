# Safe Area Component (Mobile)

## Structure
```
<SafeAreaView> → {children}
```

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| edges | `("top" \| "bottom" \| "left" \| "right")[]` | no | Which edges to pad |
| backgroundColor | `string` | no | Background color |

## Build Notes
- Use `react-native-safe-area-context` SafeAreaView
- Default: all edges protected
- Common: top only for screens with bottom tabs
- Set backgroundColor to match screen background
