# SEO Patterns — Copy-Paste Reference

## Next.js Metadata (App Router)
```tsx
// src/app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { default: 'My App', template: '%s | My App' },
  description: 'One line description of your app',
  openGraph: {
    title: 'My App',
    description: 'One line description',
    url: 'https://myapp.com',
    siteName: 'My App',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'My App', description: 'One line description' },
  robots: { index: true, follow: true },
}
```

## Per-Page Metadata
```tsx
// src/app/pricing/page.tsx
export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Choose the plan that works for you',
}
```

## Sitemap
```tsx
// src/app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://myapp.com', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://myapp.com/pricing', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://myapp.com/blog', lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
  ]
}
```

## Robots.txt
```tsx
// src/app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/dashboard/'] },
    sitemap: 'https://myapp.com/sitemap.xml',
  }
}
```

## HTML Meta Tags (Simple scope)
```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title | My App</title>
  <meta name="description" content="One line description of this page">
  <meta property="og:title" content="Page Title">
  <meta property="og:description" content="One line description">
  <meta property="og:image" content="/og-image.png">
  <meta property="og:url" content="https://myapp.com/page">
  <link rel="canonical" href="https://myapp.com/page">
</head>
```
