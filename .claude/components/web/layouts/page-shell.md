# Page Shell Component

## Structure
```
<div (full height)>
  <Navbar />           ← optional
  <div (flex row)>
    <Sidebar />        ← optional
    <main (content)>
      {children}
    </main>
  </div>
  <Footer />           ← optional
</div>
```

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| navbar | `NavbarProps \| false` | no | Navbar config or disable |
| sidebar | `SidebarProps \| false` | no | Sidebar config or disable |
| footer | `FooterProps \| false` | no | Footer config or disable |
| maxWidth | `string` | no | Content max-width |

## Variants
- **default** — Navbar + content + footer (marketing pages)
- **dashboard** — Navbar + sidebar + content (admin/app)
- **minimal** — Content only, no nav or footer
- **full-width** — No max-width constraint on content

## Build Notes
- Use min-h-screen on outer div
- Content area: flex-1 to fill remaining space
- Dashboard: sidebar stays fixed, content scrolls
- Use `<main>` element for content area (accessibility)
