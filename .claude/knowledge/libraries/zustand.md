# Zustand State Management Reference

## Install
```bash
npm install zustand
```

## Basic Store
```tsx
// src/lib/store.ts
import { create } from 'zustand'

interface AppState {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

export const useAppStore = create<AppState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}))
```

## Usage in Component
```tsx
function Counter() {
  const { count, increment, decrement } = useAppStore()
  return (
    <div>
      <button onClick={decrement}>-</button>
      <span>{count}</span>
      <button onClick={increment}>+</button>
    </div>
  )
}
```

## Auth Store Pattern
```tsx
interface AuthState {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  login: async (email, password) => {
    set({ isLoading: true })
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    const { data } = await res.json()
    set({ user: data, isLoading: false })
  },
  logout: () => set({ user: null }),
}))
```

## Cart Store Pattern (E-commerce)
```tsx
interface CartState {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (id: string) => void
  clearCart: () => void
  total: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (product) => set((state) => {
    const exists = state.items.find(i => i.id === product.id)
    if (exists) {
      return { items: state.items.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i) }
    }
    return { items: [...state.items, { ...product, quantity: 1 }] }
  }),
  removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
  clearCart: () => set({ items: [] }),
  total: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
}))
```

## Persist to localStorage
```tsx
import { persist } from 'zustand/middleware'

export const useStore = create(
  persist<State>(
    (set) => ({ /* ... */ }),
    { name: 'app-storage' }
  )
)
```
