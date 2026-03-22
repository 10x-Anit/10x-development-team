# Login Form Component

## Structure
```
<div (centered card)> → <logo?> + <heading> + <form (email + password + submit)> + <social auth?> + <links>
```

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| onSubmit | `(email, password) => void` | yes | Login handler |
| socialProviders | `("google" \| "github" \| "apple")[]` | no | Social login buttons |
| forgotPasswordUrl | `string` | no | Forgot password link |
| signupUrl | `string` | no | Sign up link |

## Variants
- **default** — Centered card on plain background
- **split-screen** — Form left, image/branding right
- **minimal** — No card, just form fields

## Build Notes
- Email: type="email", autocomplete="email"
- Password: type="password", autocomplete="current-password", show/hide toggle
- Submit: full-width primary button, loading state
- Social: divider "or continue with" + icon buttons
- Links: "Forgot password?" + "Don't have an account? Sign up"
- Error: form-level error message above submit button
