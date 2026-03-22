# Stat Card Component

## Structure
```
<div (card)> → <icon?> + <value (large number)> + <label> + <trend indicator?>
```

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| value | `string \| number` | yes | The stat value |
| label | `string` | yes | Description label |
| trend | `"up" \| "down" \| "neutral"` | no | Trend direction |
| icon | `ReactNode` | no | Icon element |
| change | `string` | no | Change amount (+12%, -5%) |

## Variants
- **default** — Icon + value + label + trend
- **mini** — Compact, no icon
- **with-chart** — Small sparkline chart below value

## Build Notes
- Value: text-3xl font-bold
- Trend up: green text + arrow up icon
- Trend down: red text + arrow down icon
- Used in dashboard grids (typically 3-4 in a row)
