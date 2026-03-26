# Email — Resend + React Email Reference

## Install
```bash
npm install resend @react-email/components
```

## Resend Client Setup
```tsx
// src/lib/email.ts
import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)
export const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@yourdomain.com'
```
```env
RESEND_API_KEY=re_your_api_key
EMAIL_FROM=noreply@yourdomain.com
```

## Send Basic Email
```tsx
// src/app/api/email/send/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { resend, EMAIL_FROM } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html } = await request.json()
    const { data, error } = await resend.emails.send({ from: EMAIL_FROM, to, subject, html })
    if (error) return NextResponse.json({ error }, { status: 400 })
    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ error: { message: 'Failed to send email' } }, { status: 500 })
  }
}
```

## React Email Templates

### Welcome Email
```tsx
// src/emails/welcome.tsx
import { Html, Head, Body, Container, Section, Text, Button, Hr } from '@react-email/components'

interface WelcomeEmailProps {
  userName: string
  loginUrl: string
}

export function WelcomeEmail({ userName, loginUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#f6f9fc', fontFamily: '-apple-system, sans-serif' }}>
        <Container style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '40px', margin: '40px auto', maxWidth: '560px' }}>
          <Text style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a1a' }}>Welcome, {userName}!</Text>
          <Text style={{ fontSize: '16px', color: '#4a4a4a', lineHeight: '24px' }}>
            Thanks for signing up. Your account is ready.
          </Text>
          <Section style={{ textAlign: 'center', margin: '32px 0' }}>
            <Button href={loginUrl} style={{ backgroundColor: '#000', color: '#fff', padding: '12px 24px', borderRadius: '6px', fontSize: '16px', textDecoration: 'none' }}>
              Get Started
            </Button>
          </Section>
          <Hr style={{ borderColor: '#e6e6e6' }} />
          <Text style={{ fontSize: '12px', color: '#999' }}>If you didn't create this account, ignore this email.</Text>
        </Container>
      </Body>
    </Html>
  )
}
```

### Password Reset Email
```tsx
// src/emails/password-reset.tsx
import { Html, Head, Body, Container, Text, Button, Hr } from '@react-email/components'

interface PasswordResetProps {
  userName: string
  resetUrl: string
}

export function PasswordResetEmail({ userName, resetUrl }: PasswordResetProps) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#f6f9fc', fontFamily: '-apple-system, sans-serif' }}>
        <Container style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '40px', margin: '40px auto', maxWidth: '560px' }}>
          <Text style={{ fontSize: '24px', fontWeight: 'bold' }}>Reset your password</Text>
          <Text style={{ fontSize: '16px', color: '#4a4a4a' }}>Hi {userName}, we received a password reset request.</Text>
          <Button href={resetUrl} style={{ backgroundColor: '#000', color: '#fff', padding: '12px 24px', borderRadius: '6px', fontSize: '16px', textDecoration: 'none', display: 'inline-block', margin: '24px 0' }}>
            Reset Password
          </Button>
          <Text style={{ fontSize: '14px', color: '#999' }}>This link expires in 1 hour.</Text>
          <Hr style={{ borderColor: '#e6e6e6' }} />
          <Text style={{ fontSize: '12px', color: '#999' }}>If you didn't request this, ignore this email.</Text>
        </Container>
      </Body>
    </Html>
  )
}
```

### Invoice Email
```tsx
// src/emails/invoice.tsx
import { Html, Head, Body, Container, Text, Section, Row, Column, Hr } from '@react-email/components'

interface InvoiceEmailProps {
  customerName: string
  invoiceNumber: string
  items: { name: string; quantity: number; price: number }[]
  total: number
  dueDate: string
}

export function InvoiceEmail({ customerName, invoiceNumber, items, total, dueDate }: InvoiceEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#f6f9fc', fontFamily: '-apple-system, sans-serif' }}>
        <Container style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '40px', margin: '40px auto', maxWidth: '560px' }}>
          <Text style={{ fontSize: '24px', fontWeight: 'bold' }}>Invoice #{invoiceNumber}</Text>
          <Text style={{ color: '#4a4a4a' }}>Hi {customerName}, here's your invoice.</Text>
          <Hr />
          {items.map((item, i) => (
            <Row key={i} style={{ padding: '8px 0' }}>
              <Column style={{ width: '60%' }}><Text>{item.name} x{item.quantity}</Text></Column>
              <Column style={{ width: '40%', textAlign: 'right' }}><Text>${(item.price * item.quantity).toFixed(2)}</Text></Column>
            </Row>
          ))}
          <Hr />
          <Row>
            <Column style={{ width: '60%' }}><Text style={{ fontWeight: 'bold' }}>Total</Text></Column>
            <Column style={{ width: '40%', textAlign: 'right' }}><Text style={{ fontWeight: 'bold', fontSize: '18px' }}>${total.toFixed(2)}</Text></Column>
          </Row>
          <Text style={{ color: '#999', marginTop: '24px' }}>Due by: {dueDate}</Text>
        </Container>
      </Body>
    </Html>
  )
}
```

## Send Template Email
```tsx
// src/lib/send-email.ts
import { resend, EMAIL_FROM } from './email'
import { WelcomeEmail } from '@/emails/welcome'
import { PasswordResetEmail } from '@/emails/password-reset'
import { InvoiceEmail } from '@/emails/invoice'
import { render } from '@react-email/render'

export async function sendWelcome(to: string, userName: string, loginUrl: string) {
  return resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject: `Welcome to the app, ${userName}!`,
    react: WelcomeEmail({ userName, loginUrl }),
  })
}

export async function sendPasswordReset(to: string, userName: string, resetUrl: string) {
  return resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject: 'Reset your password',
    react: PasswordResetEmail({ userName, resetUrl }),
  })
}

export async function sendInvoice(to: string, props: Parameters<typeof InvoiceEmail>[0]) {
  return resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject: `Invoice #${props.invoiceNumber}`,
    react: InvoiceEmail(props),
  })
}
```

## Nodemailer Fallback (SMTP)
```bash
npm install nodemailer && npm install -D @types/nodemailer
```
```tsx
// src/lib/email-smtp.ts
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendEmail(to: string, subject: string, html: string) {
  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  })
}
```
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Choosing
- **Resend**: Modern API, React templates, generous free tier, great DX → default choice
- **Nodemailer**: Need SMTP (corporate mail servers, self-hosted, Gmail) → fallback
