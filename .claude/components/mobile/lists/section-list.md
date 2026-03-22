# Section List Component (Mobile)

## Structure
```
<SectionList> → sections[] → <SectionHeader> + <ListItem> × N
```

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| sections | `{ title, data }[]` | yes | Grouped sections |
| renderItem | `(item) => ReactNode` | yes | Item renderer |
| renderSectionHeader | `(section) => ReactNode` | no | Header renderer |

## Variants
- **default** — Sticky section headers
- **inset** — Rounded card per section (iOS Settings style)
- **plain** — No visual section separation

## Build Notes
- Headers: sticky by default, bg-neutral-100, text-xs uppercase
- Inset: sections in rounded cards with padding
- Use keyExtractor for performance
- Separator between items, not after last in section
