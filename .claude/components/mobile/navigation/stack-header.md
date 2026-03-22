# Stack Header Component (Mobile)

## Structure
```
<View (header bar)> → <BackButton?> + <Title> + <Actions?>
```

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| title | `string` | yes | Screen title |
| backButton | `boolean` | no | Show back button |
| actions | `{ icon, onPress }[]` | no | Right-side action buttons |
| transparent | `boolean` | no | Transparent background |

## Variants
- **default** — Standard header with title centered
- **large-title** — iOS-style large title that shrinks on scroll
- **search** — Integrated search bar in header

## Build Notes
- Height: 44px (iOS), 56px (Android)
- Back button: chevron-left icon
- Large title: starts at 34px, shrinks to 17px on scroll
- Safe area: respect top safe area (status bar)
