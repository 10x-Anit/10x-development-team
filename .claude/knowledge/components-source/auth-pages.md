# Auth Pages -- Production-Quality, Copy-Paste Ready

> Uses ONLY semantic design tokens. NEVER use `text-white`, `bg-gray-*`, `bg-blue-*`, etc.
> Split-screen layout, social login, password strength, animated card entry.

---

## React + Tailwind (MVP/Production Scope)

### Shared Auth Layout (Split Screen)

```tsx
// src/components/auth/auth-layout.tsx
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface AuthLayoutProps {
  children: React.ReactNode
  /** Branding side content */
  heading: string
  subheading: string
  /** Testimonial or feature highlight */
  testimonial?: {
    quote: string
    author: string
    role: string
  }
}

export function AuthLayout({ children, heading, subheading, testimonial }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Left side: Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-primary p-12">
        <div>
          <Link href="/" className="text-xl font-bold text-primary-foreground">
            MyApp
          </Link>
        </div>

        <div className="max-w-md">
          <h1 className="text-3xl font-bold tracking-tight text-primary-foreground">
            {heading}
          </h1>
          <p className="mt-3 text-lg text-primary-foreground/80 leading-relaxed">
            {subheading}
          </p>
        </div>

        {testimonial && (
          <blockquote className="border-l-2 border-primary-foreground/30 pl-4">
            <p className="text-sm text-primary-foreground/80 italic leading-relaxed">
              "{testimonial.quote}"
            </p>
            <footer className="mt-2">
              <p className="text-sm font-medium text-primary-foreground">
                {testimonial.author}
              </p>
              <p className="text-xs text-primary-foreground/60">{testimonial.role}</p>
            </footer>
          </blockquote>
        )}
      </div>

      {/* Right side: Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-4 sm:px-6 py-12 bg-background">
        <div className="w-full max-w-md animate-fade-in-up">
          {children}
        </div>
      </div>
    </div>
  )
}
```

### Social Login Buttons

```tsx
// src/components/auth/social-login.tsx
'use client'
import { cn } from '@/lib/utils'

interface SocialLoginProps {
  onGoogleClick?: () => void
  onGithubClick?: () => void
  onAppleClick?: () => void
  loading?: boolean
}

export function SocialLogin({ onGoogleClick, onGithubClick, onAppleClick, loading }: SocialLoginProps) {
  return (
    <div className="space-y-3">
      {/* Google */}
      {onGoogleClick && (
        <button
          type="button"
          onClick={onGoogleClick}
          disabled={loading}
          className={cn(
            'flex w-full items-center justify-center gap-3 rounded-md border border-input bg-background px-4 py-2.5',
            'text-sm font-medium text-foreground',
            'transition-colors duration-150',
            'hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:opacity-50 disabled:pointer-events-none'
          )}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
      )}

      {/* GitHub */}
      {onGithubClick && (
        <button
          type="button"
          onClick={onGithubClick}
          disabled={loading}
          className={cn(
            'flex w-full items-center justify-center gap-3 rounded-md border border-input bg-background px-4 py-2.5',
            'text-sm font-medium text-foreground',
            'transition-colors duration-150',
            'hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:opacity-50 disabled:pointer-events-none'
          )}
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
          </svg>
          Continue with GitHub
        </button>
      )}

      {/* Apple */}
      {onAppleClick && (
        <button
          type="button"
          onClick={onAppleClick}
          disabled={loading}
          className={cn(
            'flex w-full items-center justify-center gap-3 rounded-md border border-input bg-background px-4 py-2.5',
            'text-sm font-medium text-foreground',
            'transition-colors duration-150',
            'hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:opacity-50 disabled:pointer-events-none'
          )}
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
          </svg>
          Continue with Apple
        </button>
      )}
    </div>
  )
}
```

### Divider

```tsx
// src/components/auth/auth-divider.tsx
export function AuthDivider() {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
      </div>
    </div>
  )
}
```

### Password Strength Indicator

```tsx
// src/components/auth/password-strength.tsx
import { cn } from '@/lib/utils'

interface PasswordStrengthProps {
  password: string
}

function getStrength(password: string): { score: number; label: string } {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { score: 1, label: 'Weak' }
  if (score <= 2) return { score: 2, label: 'Fair' }
  if (score <= 3) return { score: 3, label: 'Good' }
  return { score: 4, label: 'Strong' }
}

const strengthColors = {
  1: 'bg-destructive',
  2: 'bg-warning',
  3: 'bg-info',
  4: 'bg-primary',
}

const strengthTextColors = {
  1: 'text-destructive',
  2: 'text-warning',
  3: 'text-info',
  4: 'text-primary',
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null

  const { score, label } = getStrength(password)

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors duration-200',
              level <= score ? strengthColors[score as keyof typeof strengthColors] : 'bg-muted'
            )}
          />
        ))}
      </div>
      <p className={cn('text-xs font-medium', strengthTextColors[score as keyof typeof strengthTextColors])}>
        {label}
      </p>
    </div>
  )
}
```

### Login Page

```tsx
// src/app/(auth)/login/page.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AuthLayout } from '@/components/auth/auth-layout'
import { SocialLogin } from '@/components/auth/social-login'
import { AuthDivider } from '@/components/auth/auth-divider'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = new FormData(e.currentTarget)
    const result = await signIn('credentials', {
      email: form.get('email'),
      password: form.get('password'),
      redirect: false,
    })

    if (result?.error) {
      setError('Invalid email or password. Please try again.')
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  const inputClass = (hasError = false) => cn(
    'flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground',
    'ring-offset-background placeholder:text-muted-foreground',
    'transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    hasError ? 'border-destructive' : 'border-input'
  )

  return (
    <AuthLayout
      heading="Welcome back"
      subheading="Sign in to your account to continue where you left off."
      testimonial={{
        quote: 'This tool has completely transformed how our team works. The productivity gains are incredible.',
        author: 'Sarah Chen',
        role: 'CTO at TechCorp',
      }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Sign in</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>

        {/* Social login */}
        <SocialLogin
          onGoogleClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          onGithubClick={() => signIn('github', { callbackUrl: '/dashboard' })}
          loading={loading}
        />

        <AuthDivider />

        {/* Error banner */}
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3" role="alert">
            <svg className="h-4 w-4 shrink-0 text-destructive" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              autoFocus
              className={inputClass()}
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className={inputClass()}
              placeholder="Enter your password"
            />
          </div>

          {/* Remember me */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
            />
            <span className="text-sm text-muted-foreground">Remember me for 30 days</span>
          </label>

          <Button type="submit" fullWidth loading={loading}>
            Sign in
          </Button>
        </form>

        {/* Sign up link */}
        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link href="/signup" className="font-medium text-primary transition-colors hover:text-primary/80">
            Create an account
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
```

### Sign Up Page

```tsx
// src/app/(auth)/signup/page.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { AuthLayout } from '@/components/auth/auth-layout'
import { SocialLogin } from '@/components/auth/social-login'
import { AuthDivider } from '@/components/auth/auth-divider'
import { PasswordStrength } from '@/components/auth/password-strength'
import { Button } from '@/components/ui/button'

export default function SignupPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [emailValid, setEmailValid] = useState<boolean | null>(null)

  function handleEmailBlur(e: React.FocusEvent<HTMLInputElement>) {
    const val = e.target.value
    if (!val) { setEmailValid(null); return }
    setEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = new FormData(e.currentTarget)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.get('name'),
          email: form.get('email'),
          password: form.get('password'),
        }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.message || 'Failed to create account')
      }

      router.push('/login?registered=true')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  const inputClass = (hasError = false) => cn(
    'flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground',
    'ring-offset-background placeholder:text-muted-foreground',
    'transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    hasError ? 'border-destructive' : 'border-input'
  )

  return (
    <AuthLayout
      heading="Start building today"
      subheading="Create your free account and get started in minutes. No credit card required."
      testimonial={{
        quote: 'Setting up took less than 5 minutes. The onboarding experience is seamless.',
        author: 'Alex Rivera',
        role: 'Founder at StartupX',
      }}
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Create an account</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Fill in your details to get started
          </p>
        </div>

        <SocialLogin
          onGoogleClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          onGithubClick={() => signIn('github', { callbackUrl: '/dashboard' })}
          loading={loading}
        />

        <AuthDivider />

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3" role="alert">
            <svg className="h-4 w-4 shrink-0 text-destructive" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-medium text-foreground">Full name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              autoFocus
              className={inputClass()}
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              onBlur={handleEmailBlur}
              className={inputClass(emailValid === false)}
              placeholder="you@example.com"
              aria-invalid={emailValid === false || undefined}
              aria-describedby={emailValid === false ? 'email-feedback' : undefined}
            />
            {emailValid === false && (
              <p id="email-feedback" className="text-xs text-destructive" role="alert">
                Please enter a valid email address
              </p>
            )}
            {emailValid === true && (
              <p className="text-xs text-primary">Looks good!</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass()}
              placeholder="Create a strong password"
            />
            <PasswordStrength password={password} />
          </div>

          {/* Terms */}
          <p className="text-xs text-muted-foreground leading-relaxed">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="font-medium text-primary hover:text-primary/80 transition-colors">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="font-medium text-primary hover:text-primary/80 transition-colors">Privacy Policy</Link>.
          </p>

          <Button type="submit" fullWidth loading={loading}>
            Create account
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary transition-colors hover:text-primary/80">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
```

### Framer Motion Enhanced Auth Card (LARGE context / Production)

```tsx
// Wrap the form content in a MotionCard for animated entry
'use client'
import { motion } from 'framer-motion'

// In AuthLayout, replace the children wrapper:
<div className="w-full max-w-md">
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
</div>

// Stagger social buttons:
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  }}
>
  {/* Each social button wrapped in: */}
  <motion.div variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}>
    {/* button here */}
  </motion.div>
</motion.div>
```

---

## HTML/CSS (Simple Scope)

```html
<div class="auth-layout">
  <!-- Branding side -->
  <div class="auth-brand">
    <a href="/" class="auth-brand-logo">MyApp</a>
    <div class="auth-brand-content">
      <h1 class="auth-brand-heading">Welcome back</h1>
      <p class="auth-brand-subheading">Sign in to continue where you left off.</p>
    </div>
    <blockquote class="auth-testimonial">
      <p>"This tool has completely transformed our workflow."</p>
      <footer>
        <strong>Sarah Chen</strong> <span>CTO at TechCorp</span>
      </footer>
    </blockquote>
  </div>

  <!-- Form side -->
  <div class="auth-form-side">
    <div class="auth-form-container">
      <h2 class="auth-title">Sign in</h2>
      <p class="auth-subtitle">Enter your credentials to access your account</p>

      <!-- Social login -->
      <div class="auth-social">
        <button class="btn btn-outline auth-social-btn" type="button">
          <svg class="auth-social-icon" viewBox="0 0 24 24" width="20" height="20"><!-- Google icon --></svg>
          Continue with Google
        </button>
        <button class="btn btn-outline auth-social-btn" type="button">
          <svg class="auth-social-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><!-- GitHub icon --></svg>
          Continue with GitHub
        </button>
      </div>

      <div class="auth-divider">
        <span>Or continue with</span>
      </div>

      <!-- Error -->
      <div class="auth-error" id="auth-error" hidden>
        <p></p>
      </div>

      <form id="login-form" class="auth-form" novalidate>
        <div class="form-field">
          <label for="email" class="form-label">Email</label>
          <input type="email" id="email" name="email" class="form-input" placeholder="you@example.com" required autocomplete="email" />
        </div>

        <div class="form-field">
          <div class="auth-label-row">
            <label for="password" class="form-label">Password</label>
            <a href="/forgot-password" class="auth-forgot-link">Forgot password?</a>
          </div>
          <input type="password" id="password" name="password" class="form-input" placeholder="Enter your password" required autocomplete="current-password" />
        </div>

        <label class="auth-remember">
          <input type="checkbox" name="remember" />
          <span>Remember me for 30 days</span>
        </label>

        <button type="submit" class="btn btn-primary" style="width:100%">Sign in</button>
      </form>

      <p class="auth-switch">
        Don't have an account? <a href="/signup">Create an account</a>
      </p>
    </div>
  </div>
</div>
```

```css
/* css/components/auth.css */

.auth-layout {
  display: flex;
  min-height: 100vh;
}

.auth-brand {
  display: none;
  width: 50%;
  flex-direction: column;
  justify-content: space-between;
  padding: var(--space-12);
  background: var(--color-primary);
}

.auth-brand-logo {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-bg);
  text-decoration: none;
}

.auth-brand-heading {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--color-bg);
  letter-spacing: -0.02em;
}

.auth-brand-subheading {
  margin-top: var(--space-3);
  font-size: var(--text-lg);
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}

.auth-testimonial {
  border-left: 2px solid rgba(255, 255, 255, 0.3);
  padding-left: var(--space-4);
  margin: 0;
}

.auth-testimonial p {
  font-size: var(--text-sm);
  color: rgba(255, 255, 255, 0.8);
  font-style: italic;
}

.auth-testimonial footer { margin-top: var(--space-2); }
.auth-testimonial strong { font-size: var(--text-sm); color: var(--color-bg); }
.auth-testimonial span { font-size: var(--text-xs); color: rgba(255, 255, 255, 0.6); }

.auth-form-side {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-12) var(--space-4);
  background: var(--color-bg);
}

.auth-form-container { width: 100%; max-width: 28rem; }

.auth-title {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
}

.auth-subtitle {
  margin-top: var(--space-1);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.auth-social {
  margin-top: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.auth-social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  width: 100%;
}

.auth-social-icon { flex-shrink: 0; }

.auth-divider {
  position: relative;
  margin: var(--space-6) 0;
  text-align: center;
}

.auth-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--color-border);
}

.auth-divider span {
  position: relative;
  background: var(--color-bg);
  padding: 0 var(--space-2);
  font-size: var(--text-xs);
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.auth-error {
  padding: var(--space-3);
  border-radius: var(--radius-lg);
  background: color-mix(in srgb, var(--color-error) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-error) 30%, transparent);
  margin-bottom: var(--space-4);
}

.auth-error[hidden] { display: none; }
.auth-error p { font-size: var(--text-sm); color: var(--color-error); margin: 0; }

.auth-form { display: flex; flex-direction: column; gap: var(--space-4); }

.auth-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.auth-forgot-link {
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--color-primary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.auth-forgot-link:hover { color: var(--color-primary-hover); }

.auth-remember {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
}

.auth-remember input {
  width: 1rem;
  height: 1rem;
  border-radius: var(--radius-sm);
  accent-color: var(--color-primary);
}

.auth-remember span {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.auth-switch {
  margin-top: var(--space-6);
  text-align: center;
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.auth-switch a {
  font-weight: 500;
  color: var(--color-primary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.auth-switch a:hover { color: var(--color-primary-hover); }

/* Show branding side on large screens */
@media (min-width: 1024px) {
  .auth-brand { display: flex; }
  .auth-form-side { width: 50%; }
}
```

```js
// js/auth.js
(function () {
  const loginForm = document.getElementById('login-form')
  const errorEl = document.getElementById('auth-error')

  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(loginForm))
    const btn = loginForm.querySelector('button[type="submit"]')

    btn.disabled = true
    btn.textContent = 'Signing in...'
    errorEl.hidden = true

    try {
      // Replace with your real auth endpoint
      // const res = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } })
      // if (!res.ok) throw new Error('Invalid credentials')
      // window.location.href = '/dashboard'

      // Demo: simulate success
      await new Promise(r => setTimeout(r, 1000))
      alert('Login successful! (connect your auth backend)')
    } catch (err) {
      errorEl.querySelector('p').textContent = err.message || 'Invalid email or password.'
      errorEl.hidden = false
    } finally {
      btn.disabled = false
      btn.textContent = 'Sign in'
    }
  })
})()
```
