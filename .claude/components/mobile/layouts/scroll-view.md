# Scroll View Component (Mobile)

## Structure
```
<ScrollView / FlatList> → {children or renderItem}
```

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| refreshing | `boolean` | no | Pull-to-refresh state |
| onRefresh | `() => void` | no | Refresh handler |
| horizontal | `boolean` | no | Horizontal scroll |

## Variants
- **default** — Basic ScrollView for mixed content
- **section-list** — SectionList with grouped headers
- **flat-list** — FlatList for large datasets (virtualized)

## Build Notes
- Pull-to-refresh: RefreshControl component
- FlatList: use for lists >20 items (better perf via virtualization)
- SectionList: for grouped data (settings screens, contacts)
- Always set keyExtractor for lists
- Add ListEmptyComponent for empty states
