# Bottom Tabs Component (Mobile)

## Structure
```
<View (bottom bar)> → <TouchableOpacity (tab)> × N → <Icon> + <Label> + <Badge?>
```

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| tabs | `{ label, icon, screen, badge? }[]` | yes | Tab items |
| activeTab | `string` | yes | Current active tab |
| onChange | `(tab) => void` | yes | Tab change handler |

## Variants
- **default** — Standard bottom bar, icon + label
- **floating** — Floating bar with rounded corners and shadow
- **with-fab** — Center tab replaced with floating action button

## Build Notes
- Height: 56px (standard), 64px with labels
- Active: primary color icon + label, inactive: neutral-500
- Badge: small red dot or number badge on icon
- Safe area: respect bottom safe area on notch devices
- Max 5 tabs
