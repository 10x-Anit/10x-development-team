# SEO — Complete Implementation Guide

> Every page MUST have metadata. No exceptions.
> Use the Next.js Metadata API for App Router projects. Use `<meta>` tags for Simple scope.

---

## Next.js Metadata API — Root Layout (Global Defaults)

This is the base metadata that ALL pages inherit. Set it once in the root layout.

```tsx
// src/app/layout.tsx
import type { Metadata } from "next"

const siteConfig = {
  name: "MyApp",
  description: "A brief description of what your app does — under 160 characters.",
  url: "https://myapp.com",
  ogImage: "https://myapp.com/og-image.png",
}

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["keyword1", "keyword2", "keyword3"],
  authors: [{ name: "Your Name", url: siteConfig.url }],
  creator: "Your Name",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@yourtwitterhandle",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
}
```

---

## Static Per-Page Metadata

Each page can override the defaults. The `title` uses the template from the layout (`%s | MyApp`).

```tsx
// src/app/pricing/page.tsx
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pricing",
  description: "Choose the plan that fits your needs. Free tier available, no credit card required.",
  openGraph: {
    title: "Pricing — MyApp",
    description: "Simple, transparent pricing. Start free, upgrade when you need more.",
    images: [{ url: "/og-pricing.png", width: 1200, height: 630 }],
  },
}

export default function PricingPage() {
  return <main>{/* Page content */}</main>
}
```

```tsx
// src/app/about/page.tsx
export const metadata: Metadata = {
  title: "About",
  description: "Learn about our mission and the team behind MyApp.",
}
```

---

## Dynamic Metadata (generateMetadata)

For pages where metadata depends on data (blog posts, product pages, user profiles):

```tsx
// src/app/blog/[slug]/page.tsx
import type { Metadata } from "next"
import { notFound } from "next/navigation"

interface PageProps {
  params: Promise<{ slug: string }>
}

// Dynamic metadata based on the blog post
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) return { title: "Not Found" }

  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  return <main><article>{/* Post content */}</article></main>
}
```

### Product Page Example
```tsx
// src/app/products/[id]/page.tsx
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) return { title: "Not Found" }

  return {
    title: product.name,
    description: `${product.name} — ${product.shortDescription}. Starting at $${product.price}.`,
    openGraph: {
      title: `${product.name} | MyApp`,
      description: product.shortDescription,
      images: product.images.map((img) => ({
        url: img.url,
        width: 800,
        height: 800,
        alt: product.name,
      })),
    },
  }
}
```

---

## Canonical URLs

Canonical URLs prevent duplicate content issues. Set them per page when needed:

```tsx
export const metadata: Metadata = {
  alternates: {
    canonical: "/pricing",
    // Or absolute URL:
    // canonical: "https://myapp.com/pricing",
  },
}

// For dynamic pages
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  return {
    alternates: {
      canonical: `/blog/${slug}`,
    },
  }
}
```

With `metadataBase` set in the root layout, relative canonical URLs are resolved automatically.

---

## Structured Data (JSON-LD)

Structured data helps Google understand your content and show rich results (star ratings, pricing, FAQ dropdowns).

### Helper Component
```tsx
// src/components/json-ld.tsx
interface JsonLdProps {
  data: Record<string, unknown>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
```

### Organization (Homepage)
```tsx
// src/app/page.tsx
import { JsonLd } from "@/components/json-ld"

export default function HomePage() {
  return (
    <main>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "MyApp",
        url: "https://myapp.com",
        logo: "https://myapp.com/logo.png",
        description: "A brief description of your company.",
        sameAs: [
          "https://twitter.com/myapp",
          "https://github.com/myapp",
          "https://linkedin.com/company/myapp",
        ],
      }} />
      {/* Page content */}
    </main>
  )
}
```

### Product
```tsx
<JsonLd data={{
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.name,
  description: product.description,
  image: product.images[0].url,
  offers: {
    "@type": "Offer",
    price: product.price,
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: `https://myapp.com/products/${product.id}`,
  },
  aggregateRating: product.rating ? {
    "@type": "AggregateRating",
    ratingValue: product.rating,
    reviewCount: product.reviewCount,
  } : undefined,
}} />
```

### Article (Blog Post)
```tsx
<JsonLd data={{
  "@context": "https://schema.org",
  "@type": "Article",
  headline: post.title,
  description: post.excerpt,
  image: post.coverImage,
  datePublished: post.publishedAt,
  dateModified: post.updatedAt || post.publishedAt,
  author: {
    "@type": "Person",
    name: post.author.name,
    url: post.author.url,
  },
  publisher: {
    "@type": "Organization",
    name: "MyApp",
    logo: {
      "@type": "ImageObject",
      url: "https://myapp.com/logo.png",
    },
  },
}} />
```

### FAQ Page
```tsx
<JsonLd data={{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
}} />
```

### SoftwareApplication (SaaS)
```tsx
<JsonLd data={{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "MyApp",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "0",
    highPrice: "99",
    priceCurrency: "USD",
    offerCount: 3,
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "1250",
  },
}} />
```

---

## Sitemap Generation

```tsx
// src/app/sitemap.ts
import type { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://myapp.com"

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
  ]

  // Dynamic pages (blog posts, products, etc.)
  const posts = await getAllPosts()
  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.publishedAt),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))

  return [...staticPages, ...postPages]
}
```

### Multi-Sitemap for Large Sites
```tsx
// src/app/sitemap.ts
import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://myapp.com", lastModified: new Date() },
    { url: "https://myapp.com/pricing", lastModified: new Date() },
  ]
}

// src/app/blog/sitemap.ts — separate sitemap for blog
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    url: `https://myapp.com/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
  }))
}
```

---

## robots.txt

```tsx
// src/app/robots.ts
import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/admin/", "/_next/"],
      },
    ],
    sitemap: "https://myapp.com/sitemap.xml",
  }
}
```

---

## Complete Page Metadata Template (Copy-Paste)

Use this as a starting point for any new page:

```tsx
// src/app/[page-name]/page.tsx
import type { Metadata } from "next"
import { JsonLd } from "@/components/json-ld"

export const metadata: Metadata = {
  title: "Page Title",
  description: "A compelling description under 160 characters with the main keyword.",
  openGraph: {
    title: "Page Title — MyApp",
    description: "Description optimized for social sharing.",
    images: [{ url: "/og-page-name.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "/page-name",
  },
}

export default function PageName() {
  return (
    <main>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Page Title",
        description: "Page description.",
        url: "https://myapp.com/page-name",
      }} />

      {/* Proper heading hierarchy */}
      <h1>Single H1 with main keyword</h1>

      <section aria-labelledby="section-heading">
        <h2 id="section-heading">Section Title</h2>
        {/* Content */}
      </section>
    </main>
  )
}
```

---

## Page Structure Rules for SEO

```tsx
// EVERY page must follow this structure
export default function Page() {
  return (
    <main>
      {/* 1. Exactly ONE <h1> per page */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
        Main Page Heading
      </h1>

      {/* 2. Sections with aria-labelledby linking to their h2 */}
      <section aria-labelledby="features-heading">
        <h2 id="features-heading">Features</h2>
        {/* h3 under h2, never skip heading levels */}
        <h3>Feature One</h3>
      </section>

      <section aria-labelledby="pricing-heading">
        <h2 id="pricing-heading">Pricing</h2>
      </section>

      {/* 3. Images ALWAYS have alt text */}
      <Image src="/photo.jpg" alt="Descriptive text about the image" />

      {/* 4. Links have descriptive text — never "click here" */}
      <a href="/pricing">View our pricing plans</a>  {/* GOOD */}
      <a href="/pricing">Click here</a>               {/* BAD */}
    </main>
  )
}
```

---

## HTML Meta Tags (Simple Scope)

For projects using plain HTML without Next.js:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Primary SEO -->
  <title>Page Title | MyApp</title>
  <meta name="description" content="Compelling description under 160 characters.">
  <meta name="keywords" content="keyword1, keyword2, keyword3">
  <meta name="author" content="Your Name">

  <!-- Canonical -->
  <link rel="canonical" href="https://myapp.com/page-name">

  <!-- Open Graph (Facebook, LinkedIn) -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://myapp.com/page-name">
  <meta property="og:title" content="Page Title | MyApp">
  <meta property="og:description" content="Description for social sharing.">
  <meta property="og:image" content="https://myapp.com/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="MyApp">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Page Title | MyApp">
  <meta name="twitter:description" content="Description for Twitter.">
  <meta name="twitter:image" content="https://myapp.com/og-image.png">

  <!-- Favicon -->
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" href="/icon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">

  <!-- Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Page Title",
    "description": "Page description.",
    "url": "https://myapp.com/page-name"
  }
  </script>
</head>
<body>
  <!-- Content -->
</body>
</html>
```

---

## OG Image Best Practices

- Size: 1200x630px (Facebook/LinkedIn standard)
- Format: PNG or JPG (PNG for text-heavy, JPG for photos)
- Include your logo, page title, and a visual
- Test with: https://www.opengraph.xyz/
- For dynamic OG images, use Next.js `ImageResponse` from `next/og`

### Dynamic OG Image (Advanced)
```tsx
// src/app/og/route.tsx
import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get("title") ?? "MyApp"

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0f1117",
          color: "#f1f5f9",
          fontFamily: "Inter",
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700, textAlign: "center", padding: "0 80px" }}>
          {title}
        </div>
        <div style={{ fontSize: 24, color: "#94a3b8", marginTop: 16 }}>
          myapp.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}

// Use in metadata:
// images: [{ url: `/og?title=${encodeURIComponent(post.title)}`, width: 1200, height: 630 }]
```
