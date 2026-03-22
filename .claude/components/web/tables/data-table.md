# Data Table Component

## Structure
```
<div> → <toolbar (search + filters + actions)> + <table> + <pagination>
```

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| columns | `{ key, label, sortable?, width? }[]` | yes | Column definitions |
| data | `object[]` | yes | Row data array |
| sortable | `boolean` | no | Enable column sorting |
| filterable | `boolean` | no | Enable search/filter |
| paginated | `boolean` | no | Enable pagination |
| selectable | `boolean` | no | Enable row selection |

## Variants
- **default** — Standard table with borders
- **compact** — Smaller text and padding
- **expandable** — Rows expand to show detail

## Build Notes
- Responsive: horizontal scroll on mobile
- Sort: click header to sort, arrow indicator
- Filter: search input in toolbar filters all columns
- Pagination: 10/25/50 per page selector + page numbers
- Selection: checkbox column, bulk action toolbar
- Empty state: centered message when no data
- Loading: skeleton rows during data fetch
