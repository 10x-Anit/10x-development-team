# E-Commerce Scaffold

## Command
```bash
npx create-next-app@latest [app-name] --typescript --tailwind --eslint --app --src-dir
```

## Directory Structure
```
src/
  app/
    layout.tsx          ← Root layout (navbar + footer)
    page.tsx            ← Home page (featured products, categories)
    products/
      page.tsx          ← Product listing (grid + filters)
      [slug]/page.tsx   ← Product detail page
    cart/page.tsx        ← Shopping cart
    checkout/page.tsx    ← Checkout flow
    (auth)/
      login/page.tsx
      signup/page.tsx
    account/
      page.tsx          ← Account overview
      orders/page.tsx   ← Order history
    api/
      products/route.ts
      cart/route.ts
      checkout/route.ts
      orders/route.ts
      webhooks/stripe/route.ts
      health/route.ts
  components/
    ui/                 ← Base components
    product/            ← ProductCard, ProductGrid, ProductFilter
    cart/               ← CartItem, CartSummary, CartDrawer
    checkout/           ← CheckoutForm, PaymentForm, OrderSummary
    layout/             ← Navbar (with cart icon), Footer
  lib/
    api.ts
    auth.ts
    db.ts
    stripe.ts           ← Stripe integration
    cart.ts             ← Cart state management
    utils.ts
  hooks/
    use-cart.ts
    use-auth.ts
  types/
    product.ts
    order.ts
    cart.ts
  styles/
    globals.css
```

## Default Dependencies
```json
{
  "dependencies": {
    "next": "latest",
    "react": "latest",
    "react-dom": "latest",
    "zustand": "latest",
    "zod": "latest",
    "lucide-react": "latest",
    "stripe": "latest",
    "@stripe/stripe-js": "latest",
    "@stripe/react-stripe-js": "latest"
  },
  "devDependencies": {
    "typescript": "latest",
    "tailwindcss": "latest",
    "@types/react": "latest",
    "vitest": "latest",
    "prettier": "latest"
  }
}
```

## Pages (typical e-commerce)
1. Home — hero, featured products, categories, deals
2. Product listing — grid with filters (price, category, sort)
3. Product detail — images, description, variants, add to cart, reviews
4. Cart — item list, quantities, subtotal, checkout button
5. Checkout — shipping, payment (Stripe), order summary
6. Order confirmation — thank you + order details
7. Account — profile, order history, addresses
