# Landing Page Scaffold

## Command
```bash
npx create-next-app@latest [app-name] --typescript --tailwind --eslint --app --src-dir
```

## Directory Structure
```
src/
  app/
    layout.tsx          ← Root layout
    page.tsx            ← Main landing page (all sections)
    privacy/page.tsx    ← Privacy policy
    terms/page.tsx      ← Terms of service
  components/
    ui/                 ← Base UI components
    sections/           ← Landing page sections
      hero.tsx
      features.tsx
      testimonials.tsx
      pricing.tsx
      faq.tsx
      cta.tsx
    layout/
      navbar.tsx
      footer.tsx
  lib/
    utils.ts
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
    "lucide-react": "latest"
  },
  "devDependencies": {
    "typescript": "latest",
    "tailwindcss": "latest",
    "@types/react": "latest",
    "prettier": "latest"
  }
}
```

## Sections (typical order)
1. Navbar (sticky)
2. Hero — headline, subtitle, CTA, hero image/illustration
3. Social proof — logos or stats
4. Features — 3-6 feature cards in grid
5. How it works — 3 steps
6. Testimonials — 3 customer quotes
7. Pricing — 3 plan cards
8. FAQ — accordion
9. CTA — final call to action
10. Footer — links, social, copyright
