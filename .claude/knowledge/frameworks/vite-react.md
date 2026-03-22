# Vite + React Reference

## Setup
```bash
npm create vite@latest my-app -- --template react-ts
cd my-app && npm install
```

## Add Tailwind CSS (v4+)
```bash
npm install -D tailwindcss @tailwindcss/vite
```
```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': '/src' }
  }
})
```
```css
/* src/index.css */
@import "tailwindcss";
```

## Add Routing
```bash
npm install react-router-dom
```
```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/Home'
import { AboutPage } from './pages/About'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </BrowserRouter>
  )
}
```

## Project Structure
```
src/
  App.tsx              → Router + providers
  main.tsx             → Entry point
  pages/               → Page components
  components/          → Shared UI components
  hooks/               → Custom hooks
  lib/                 → Utilities
  mock/                → Mock data (prototype scope)
  styles/
    index.css          → Global styles + Tailwind
```

## Environment Variables
```
VITE_*  → exposed to browser
```
Access: `import.meta.env.VITE_API_URL`
