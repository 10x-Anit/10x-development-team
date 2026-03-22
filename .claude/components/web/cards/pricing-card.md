# Pricing Card Component

## Structure
```
<div (card)> → <plan name> + <price + period> + <features list> + <CTA button> + <popular badge?>
```

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| plan | `string` | yes | Plan name (Free, Pro, Enterprise) |
| price | `string \| number` | yes | Price amount |
| period | `string` | no | Billing period (/mo, /yr) |
| features | `{ text, included }[]` | yes | Feature list with included/excluded |
| cta | `{ label, href }` | yes | CTA button |
| popular | `boolean` | no | Highlighted as popular/recommended |

## Variants
- **default** — Standard card in a row of 3
- **highlighted** — Primary border + "Popular" badge + slight scale up
- **compact** — Smaller, for comparison tables

## Build Notes
- Popular: primary border, scale-105, "Most Popular" badge top
- Features: checkmark for included, dash for excluded
- CTA: full-width button at bottom, primary for popular, outline for others
- Equal height in row: use grid with stretch
