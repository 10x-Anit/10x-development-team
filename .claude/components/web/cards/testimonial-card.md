# Testimonial Card Component

## Structure
```
<div (card)> → <quote text> + <div (author: avatar + name + role)> + <rating?>
```

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| quote | `string` | yes | Testimonial text |
| author | `string` | yes | Author name |
| role | `string` | no | Author role/company |
| avatar | `string` | no | Avatar image URL |
| rating | `number` | no | Star rating (1-5) |

## Variants
- **default** — Quote with author below
- **minimal** — No avatar, just quote + name
- **featured** — Larger card, bigger text, accent quote mark

## Build Notes
- Quote mark: large decorative " in primary-200
- Avatar: 48px circle, object-cover
- Rating: filled/empty star icons
- Use `<blockquote>` and `<cite>` for semantics
