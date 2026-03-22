# Footer Component

## Structure
```
<footer> → <container> → <columns (links)> + <social icons> + <newsletter?> + <copyright>
```

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| columns | `{ title, links: { label, href }[] }[]` | yes | Link columns |
| social | `{ platform, href, icon }[]` | no | Social media links |
| newsletter | `boolean` | no | Show email signup |
| copyright | `string` | yes | Copyright text |

## Variants
- **simple** — Single row: links + copyright
- **multi-column** — 3-4 columns of links, social, copyright
- **centered** — Everything centered, single column

## Build Notes
- Background: neutral-900 or neutral-50 depending on theme
- Links: neutral-400, hover to white/primary
- Mobile: columns stack vertically
- Newsletter: email input + submit button
