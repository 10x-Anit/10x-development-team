# Signup Form Component

## Structure
```
<div (centered card)> → <heading> + <form (fields + terms + submit)> + <social auth?> + <login link>
```

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| onSubmit | `(data) => void` | yes | Signup handler |
| fields | `("name" \| "email" \| "password" \| "company")[]` | no | Which fields to show |
| socialProviders | `string[]` | no | Social signup buttons |
| termsUrl | `string` | no | Terms of service link |

## Variants
- **default** — All fields in single form
- **stepped** — Multi-step: credentials → profile → preferences
- **minimal** — Email + password only

## Build Notes
- Password: show strength indicator (weak/medium/strong)
- Confirm password: optional, match validation
- Terms: checkbox with link "I agree to Terms of Service"
- autocomplete attributes on all fields
- Stepped: progress bar at top, back/next buttons
