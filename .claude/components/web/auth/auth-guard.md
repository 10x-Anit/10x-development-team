# Auth Guard Component

## Structure
```
<AuthGuard> → renders {children} if authenticated, redirects otherwise
```

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| redirectTo | `string` | no | Redirect URL (default: /login) |
| roles | `string[]` | no | Required roles |
| fallback | `ReactNode` | no | Loading state while checking auth |

## Variants
- **default** — Simple auth check, redirect if not logged in
- **role-based** — Check user has required role(s)

## Build Notes
- Check auth state from context/store
- Show fallback (spinner) while checking
- Redirect with return URL: /login?redirect=/protected-page
- Role-based: show 403 page if authenticated but wrong role
- Wrap protected routes/layouts with this component
