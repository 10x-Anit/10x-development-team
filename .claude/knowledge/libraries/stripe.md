# Stripe Payments Reference

## Install
```bash
npm install stripe @stripe/stripe-js @stripe/react-stripe-js
```

## Server-side Setup
```tsx
// src/lib/stripe.ts
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})
```

## Checkout Session (One-time Payment)
```tsx
// src/app/api/checkout/route.ts
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { priceId } = await request.json()

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
  })

  return NextResponse.json({ url: session.url })
}
```

## Subscription Checkout
```tsx
const session = await stripe.checkout.sessions.create({
  mode: 'subscription',
  line_items: [{ price: priceId, quantity: 1 }],
  success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
  cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
})
```

## Client-side Redirect
```tsx
'use client'

async function handleCheckout(priceId: string) {
  const res = await fetch('/api/checkout', {
    method: 'POST',
    body: JSON.stringify({ priceId }),
  })
  const { url } = await res.json()
  window.location.href = url
}
```

## Webhook
```tsx
// src/app/api/webhooks/stripe/route.ts
import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'

export async function POST(request: Request) {
  const body = await request.text()
  const sig = headers().get('stripe-signature')!

  const event = stripe.webhooks.constructEvent(
    body, sig, process.env.STRIPE_WEBHOOK_SECRET!
  )

  switch (event.type) {
    case 'checkout.session.completed':
      // Handle successful payment
      break
    case 'customer.subscription.deleted':
      // Handle cancellation
      break
  }

  return new Response('OK')
}
```

## ENV
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_URL=http://localhost:3000
```
