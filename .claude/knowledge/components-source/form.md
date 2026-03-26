# Form Component -- Production-Quality, Copy-Paste Ready

> Uses ONLY semantic design tokens. NEVER use `text-white`, `bg-gray-*`, `bg-blue-*`, etc.
> Integrates react-hook-form + zod for validation. All errors use aria-describedby.

---

## React + Tailwind (MVP/Production Scope)

### Reusable Form Field Wrapper

```tsx
// src/components/ui/form-field.tsx
import { cn } from '@/lib/utils'

interface FormFieldProps {
  label: string
  htmlFor: string
  error?: string
  helperText?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

export function FormField({ label, htmlFor, error, helperText, required, children, className }: FormFieldProps) {
  const errorId = `${htmlFor}-error`
  const helperId = `${htmlFor}-helper`

  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-destructive" aria-hidden="true">*</span>}
      </label>
      {children}
      {error && (
        <p id={errorId} className="text-xs text-destructive" role="alert">{error}</p>
      )}
      {!error && helperText && (
        <p id={helperId} className="text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  )
}
```

### Form Section Divider

```tsx
// src/components/ui/form-section.tsx
interface FormSectionProps {
  title: string
  description?: string
  children: React.ReactNode
}

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <fieldset className="space-y-4">
      <legend className="sr-only">{title}</legend>
      <div className="border-b border-border pb-2">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </fieldset>
  )
}
```

### Complete Contact Form (react-hook-form + zod)

```tsx
// src/components/forms/contact-form.tsx
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { FormSection } from '@/components/ui/form-section'

// --- Schema ---

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message is too long'),
})

type ContactFormData = z.infer<typeof contactSchema>

// --- Component ---

interface ContactFormProps {
  /** API endpoint to submit to */
  action?: string
  /** Called on successful submission */
  onSuccess?: (data: ContactFormData) => void
}

export function ContactForm({ action = '/api/contact', onSuccess }: ContactFormProps) {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  async function onSubmit(data: ContactFormData) {
    setServerError('')
    try {
      const res = await fetch(action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.message || 'Something went wrong')
      }

      setStatus('success')
      reset()
      onSuccess?.(data)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong')
      setStatus('error')
    }
  }

  // Success state
  if (status === 'success') {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center" role="status">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Message sent</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Thank you for reaching out. We will get back to you soon.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => setStatus('idle')}
        >
          Send another
        </Button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm"
      noValidate
    >
      {/* Server error banner */}
      {serverError && (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-3" role="alert">
          <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
          <p className="text-sm text-destructive">{serverError}</p>
        </div>
      )}

      <FormSection title="Your Information" description="How can we reach you?">
        {/* Name */}
        <FormField label="Name" htmlFor="name" error={errors.name?.message} required>
          <input
            id="name"
            {...register('name')}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className={cn(
              'flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground ring-offset-background',
              'placeholder:text-muted-foreground transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              errors.name ? 'border-destructive' : 'border-input'
            )}
            placeholder="Your full name"
          />
        </FormField>

        {/* Email */}
        <FormField label="Email" htmlFor="email" error={errors.email?.message} required>
          <input
            id="email"
            type="email"
            {...register('email')}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={cn(
              'flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground ring-offset-background',
              'placeholder:text-muted-foreground transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              errors.email ? 'border-destructive' : 'border-input'
            )}
            placeholder="you@example.com"
          />
        </FormField>
      </FormSection>

      <FormSection title="Your Message">
        {/* Subject */}
        <FormField label="Subject" htmlFor="subject" error={errors.subject?.message} required>
          <select
            id="subject"
            {...register('subject')}
            aria-invalid={!!errors.subject}
            aria-describedby={errors.subject ? 'subject-error' : undefined}
            className={cn(
              'flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground ring-offset-background',
              'transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              errors.subject ? 'border-destructive' : 'border-input'
            )}
          >
            <option value="">Select a subject</option>
            <option value="general">General Inquiry</option>
            <option value="support">Technical Support</option>
            <option value="sales">Sales</option>
            <option value="feedback">Feedback</option>
          </select>
        </FormField>

        {/* Message */}
        <FormField label="Message" htmlFor="message" error={errors.message?.message} required>
          <textarea
            id="message"
            rows={5}
            {...register('message')}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'message-error' : undefined}
            className={cn(
              'flex min-h-[120px] w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground ring-offset-background',
              'placeholder:text-muted-foreground transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              errors.message ? 'border-destructive' : 'border-input'
            )}
            placeholder="How can we help you?"
          />
        </FormField>
      </FormSection>

      {/* Submit */}
      <Button type="submit" fullWidth loading={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  )
}
```

### Settings Form Pattern (Edit form with save)

```tsx
// src/components/forms/settings-form.tsx
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { FormSection } from '@/components/ui/form-section'
import { cn } from '@/lib/utils'

const settingsSchema = z.object({
  displayName: z.string().min(1, 'Display name is required'),
  email: z.string().email('Invalid email'),
  bio: z.string().max(300, 'Bio must be under 300 characters').optional(),
  notifications: z.boolean(),
})

type SettingsData = z.infer<typeof settingsSchema>

interface SettingsFormProps {
  defaultValues: SettingsData
}

export function SettingsForm({ defaultValues }: SettingsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<SettingsData>({
    resolver: zodResolver(settingsSchema),
    defaultValues,
  })

  async function onSubmit(data: SettingsData) {
    const promise = fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    toast.promise(promise, {
      loading: 'Saving settings...',
      success: 'Settings saved',
      error: 'Failed to save settings',
    })
  }

  const inputClass = (hasError: boolean) => cn(
    'flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground ring-offset-background',
    'placeholder:text-muted-foreground transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    hasError ? 'border-destructive' : 'border-input'
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      <FormSection title="Profile" description="Your public profile information.">
        <FormField label="Display Name" htmlFor="displayName" error={errors.displayName?.message} required>
          <input id="displayName" {...register('displayName')} className={inputClass(!!errors.displayName)} />
        </FormField>
        <FormField label="Email" htmlFor="email" error={errors.email?.message} required>
          <input id="email" type="email" {...register('email')} className={inputClass(!!errors.email)} />
        </FormField>
        <FormField label="Bio" htmlFor="bio" error={errors.bio?.message} helperText="Brief description for your profile.">
          <textarea id="bio" rows={3} {...register('bio')} className={cn(inputClass(!!errors.bio), 'min-h-[80px]')} />
        </FormField>
      </FormSection>

      <FormSection title="Notifications">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register('notifications')}
            className="h-4 w-4 rounded border-input text-primary focus:ring-ring focus:ring-offset-background"
          />
          <span className="text-sm text-foreground">Receive email notifications</span>
        </label>
      </FormSection>

      <div className="flex justify-end gap-3 border-t border-border pt-6">
        <Button type="button" variant="outline" disabled={!isDirty}>Cancel</Button>
        <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
          Save Changes
        </Button>
      </div>
    </form>
  )
}
```

### Skeleton Loader

```tsx
export function FormSkeleton() {
  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-6">
      {[1, 2].map(section => (
        <div key={section} className="space-y-4">
          <div className="h-5 w-32 animate-pulse rounded bg-muted" />
          <div className="h-px bg-border" />
          {[1, 2].map(field => (
            <div key={field} className="space-y-1.5">
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
              <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
            </div>
          ))}
        </div>
      ))}
      <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
    </div>
  )
}
```

---

## HTML/CSS (Simple Scope)

```html
<form id="contact-form" class="form-card" novalidate>
  <!-- Section: Personal Info -->
  <fieldset class="form-section">
    <legend class="form-section-title">Your Information</legend>

    <div class="form-field">
      <label for="name" class="form-label">Name <span class="form-required">*</span></label>
      <input type="text" id="name" name="name" class="form-input" placeholder="Your full name" required />
      <p class="form-error" id="name-error" hidden></p>
    </div>

    <div class="form-field">
      <label for="email" class="form-label">Email <span class="form-required">*</span></label>
      <input type="email" id="email" name="email" class="form-input" placeholder="you@example.com" required />
      <p class="form-error" id="email-error" hidden></p>
    </div>
  </fieldset>

  <!-- Section: Message -->
  <fieldset class="form-section">
    <legend class="form-section-title">Your Message</legend>

    <div class="form-field">
      <label for="subject" class="form-label">Subject <span class="form-required">*</span></label>
      <select id="subject" name="subject" class="form-input" required>
        <option value="">Select a subject</option>
        <option value="general">General Inquiry</option>
        <option value="support">Support</option>
        <option value="sales">Sales</option>
      </select>
      <p class="form-error" id="subject-error" hidden></p>
    </div>

    <div class="form-field">
      <label for="message" class="form-label">Message <span class="form-required">*</span></label>
      <textarea id="message" name="message" rows="5" class="form-input" placeholder="How can we help?" required></textarea>
      <p class="form-error" id="message-error" hidden></p>
    </div>
  </fieldset>

  <!-- Server error -->
  <div class="form-banner form-banner-error" id="form-server-error" hidden>
    <span class="form-banner-text"></span>
  </div>

  <!-- Success message (shown after submit) -->
  <div class="form-success" id="form-success" hidden>
    <p class="form-success-title">Message sent!</p>
    <p class="form-success-text">Thank you. We will get back to you soon.</p>
  </div>

  <button type="submit" class="btn btn-primary" style="width:100%" id="form-submit">
    Send Message
  </button>
</form>
```

```css
/* css/components/form.css */

.form-card {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  max-width: var(--max-width-narrow);
  margin: 0 auto;
}

.form-section {
  border: none;
  padding: 0;
  margin: 0;
}

.form-section + .form-section {
  margin-top: var(--space-6);
}

.form-section-title {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text);
  padding-bottom: var(--space-2);
  margin-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-border);
}

.form-field + .form-field {
  margin-top: var(--space-4);
}

.form-label {
  display: block;
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text);
  margin-bottom: var(--space-1);
}

.form-required { color: var(--color-error); }

.form-input {
  display: block;
  width: 100%;
  height: 2.5rem;
  padding: var(--space-2) var(--space-3);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: var(--color-text);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

textarea.form-input { height: auto; min-height: 5rem; }

select.form-input { cursor: pointer; }

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 25%, transparent);
}

.form-input.has-error {
  border-color: var(--color-error);
}

.form-input.has-error:focus {
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-error) 25%, transparent);
}

.form-error {
  font-size: var(--text-xs);
  color: var(--color-error);
  margin-top: var(--space-1);
}

.form-error[hidden] { display: none; }

.form-banner {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  border-radius: var(--radius-lg);
  margin-top: var(--space-4);
}

.form-banner[hidden] { display: none; }

.form-banner-error {
  background: color-mix(in srgb, var(--color-error) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-error) 30%, transparent);
}

.form-banner-error .form-banner-text {
  color: var(--color-error);
  font-size: var(--text-sm);
}

.form-success {
  text-align: center;
  padding: var(--space-8);
}

.form-success[hidden] { display: none; }

.form-success-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text);
}

.form-success-text {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin-top: var(--space-1);
}
```

```js
// js/form.js
(function () {
  const form = document.getElementById('contact-form')
  if (!form) return

  const submitBtn = document.getElementById('form-submit')
  const successEl = document.getElementById('form-success')
  const serverErrorEl = document.getElementById('form-server-error')

  const rules = {
    name:    { min: 2, message: 'Name must be at least 2 characters' },
    email:   { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email' },
    subject: { min: 1, message: 'Please select a subject' },
    message: { min: 10, message: 'Message must be at least 10 characters' },
  }

  function validate(field) {
    const rule = rules[field.name]
    if (!rule) return true
    const val = field.value.trim()
    const errorEl = document.getElementById(`${field.name}-error`)

    let valid = true
    if (rule.pattern && !rule.pattern.test(val)) valid = false
    if (rule.min && val.length < rule.min) valid = false

    if (!valid && errorEl) {
      errorEl.textContent = rule.message
      errorEl.hidden = false
      field.classList.add('has-error')
      field.setAttribute('aria-invalid', 'true')
      field.setAttribute('aria-describedby', errorEl.id)
    } else if (errorEl) {
      errorEl.hidden = true
      field.classList.remove('has-error')
      field.removeAttribute('aria-invalid')
      field.removeAttribute('aria-describedby')
    }

    return valid
  }

  // Live validation on blur
  form.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('blur', () => validate(input))
  })

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    serverErrorEl.hidden = true

    const fields = form.querySelectorAll('.form-input')
    let allValid = true
    fields.forEach(f => { if (!validate(f)) allValid = false })

    if (!allValid) return

    submitBtn.disabled = true
    submitBtn.textContent = 'Sending...'

    try {
      const data = Object.fromEntries(new FormData(form))
      // Replace with your real endpoint
      // await fetch('/api/contact', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } })
      form.querySelectorAll('fieldset, button').forEach(el => el.hidden = true)
      successEl.hidden = false
    } catch (err) {
      serverErrorEl.querySelector('.form-banner-text').textContent = 'Something went wrong. Please try again.'
      serverErrorEl.hidden = false
    } finally {
      submitBtn.disabled = false
      submitBtn.textContent = 'Send Message'
    }
  })
})()
```
