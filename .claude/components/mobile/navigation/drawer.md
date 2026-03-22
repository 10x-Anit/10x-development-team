# Drawer Component (Mobile)

## Structure
```
<View (overlay)> → <View (drawer panel)> → <Header> + <ScrollView (items)> + <Footer?>
```

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| items | `{ label, icon, screen, badge? }[]` | yes | Navigation items |
| header | `ReactNode` | no | Header content (user info, logo) |
| footer | `ReactNode` | no | Footer content (settings, logout) |

## Variants
- **default** — Full height side drawer, 280px wide
- **mini** — Icon-only narrow drawer

## Build Notes
- Slides in from left with backdrop overlay
- Gesture: swipe from left edge to open, swipe left to close
- Backdrop: semi-transparent black, tap to close
- Active item: primary color bg highlight
- Width: 80% of screen, max 320px
