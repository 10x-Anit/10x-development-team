# Card Component — Copy-Paste Ready

## React + Tailwind
```tsx
// src/components/ui/card.tsx
interface CardProps {
  image?: { src: string; alt: string }
  title: string
  description?: string
  badge?: string
  actions?: React.ReactNode
  href?: string
  className?: string
}

export function Card({ image, title, description, badge, actions, href, className = '' }: CardProps) {
  const Wrapper = href ? 'a' : 'div'
  const wrapperProps = href ? { href } : {}

  return (
    <Wrapper
      {...wrapperProps}
      className={`group block overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm transition-all hover:shadow-md ${href ? 'cursor-pointer' : ''} ${className}`}
    >
      {image && (
        <div className="aspect-video overflow-hidden bg-gray-100 dark:bg-gray-700">
          <img src={image.src} alt={image.alt} className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
        </div>
      )}
      <div className="p-4">
        {badge && (
          <span className="mb-2 inline-block rounded-full bg-blue-100 dark:bg-blue-900 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:text-blue-200">
            {badge}
          </span>
        )}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        {description && <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{description}</p>}
        {actions && <div className="mt-4 flex gap-2">{actions}</div>}
      </div>
    </Wrapper>
  )
}
```

## Usage
```tsx
<Card
  image={{ src: "/product.jpg", alt: "Product" }}
  title="Product Name"
  description="A brief description of the product."
  badge="New"
  actions={<Button size="sm">View</Button>}
/>

<Card title="Simple Card" description="No image, just text" />

<Card href="/blog/post-1" title="Blog Post" description="Click to read" />
```
