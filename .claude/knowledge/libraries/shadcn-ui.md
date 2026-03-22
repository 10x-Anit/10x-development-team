# shadcn/ui Reference

## What It Is
NOT a library you install. It's copy-paste components you OWN. They go into your `src/components/ui/`.

## Setup
```bash
npx shadcn@latest init
```
Choose: New York style, Zinc color, CSS variables: yes

## Install Components (pick what you need)
```bash
# Core UI
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add card
npx shadcn@latest add badge
npx shadcn@latest add avatar
npx shadcn@latest add separator

# Forms
npx shadcn@latest add form          # react-hook-form + zod
npx shadcn@latest add select
npx shadcn@latest add checkbox
npx shadcn@latest add textarea
npx shadcn@latest add switch
npx shadcn@latest add radio-group

# Navigation
npx shadcn@latest add navigation-menu
npx shadcn@latest add tabs
npx shadcn@latest add breadcrumb
npx shadcn@latest add sidebar

# Overlay
npx shadcn@latest add dialog
npx shadcn@latest add sheet         # side drawer
npx shadcn@latest add dropdown-menu
npx shadcn@latest add popover
npx shadcn@latest add tooltip
npx shadcn@latest add command       # command palette (Ctrl+K)
npx shadcn@latest add alert-dialog  # confirm dialog

# Data Display
npx shadcn@latest add table
npx shadcn@latest add data-table    # with sorting/filtering
npx shadcn@latest add accordion
npx shadcn@latest add carousel
npx shadcn@latest add chart         # recharts wrapper
npx shadcn@latest add skeleton      # loading placeholder

# Feedback
npx shadcn@latest add toast
npx shadcn@latest add alert
npx shadcn@latest add progress
npx shadcn@latest add sonner        # better toast (recommended)
```

## Usage Examples

### Button
```tsx
import { Button } from '@/components/ui/button'

<Button>Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button disabled>Disabled</Button>
<Button>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Loading
</Button>
```

### Card
```tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Content here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Dialog (Modal)
```tsx
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    <p>Modal content</p>
    <DialogFooter>
      <Button>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Form with Validation
```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
})

export function MyForm() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', name: '' },
  })

  function onSubmit(values: z.infer<typeof schema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl><Input type="email" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

### Data Table
```bash
npx shadcn@latest add table
npm install @tanstack/react-table
```

### Toast (Sonner — recommended)
```bash
npx shadcn@latest add sonner
```
```tsx
// In layout.tsx: add <Toaster /> component
import { Toaster } from '@/components/ui/sonner'

// In any component:
import { toast } from 'sonner'
toast.success('Saved successfully')
toast.error('Something went wrong')
toast.loading('Saving...')
```

### Command Palette (Ctrl+K)
```bash
npx shadcn@latest add command dialog
```

## Theming
Colors defined in `globals.css` as CSS variables:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --primary: 240 5.9% 10%;
  --primary-foreground: 0 0% 98%;
  /* ... more tokens */
}
.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
}
```

## When to Use shadcn/ui
- MVP and Production scopes
- When you need consistent, accessible components fast
- When using Next.js or Vite + React with Tailwind
- NOT for Simple scope (no React)
- NOT for Prototype if speed > quality
