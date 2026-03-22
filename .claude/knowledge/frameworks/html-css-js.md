# Vanilla HTML/CSS/JS Reference (Simple Scope)

## Base HTML Template
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My App</title>
  <link rel="stylesheet" href="css/reset.css">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <header>
    <nav class="navbar">
      <a href="/" class="logo">Logo</a>
      <ul class="nav-links">
        <li><a href="/">Home</a></li>
        <li><a href="/pages/about.html">About</a></li>
        <li><a href="/pages/contact.html">Contact</a></li>
      </ul>
      <button class="nav-toggle" aria-label="Toggle menu">☰</button>
    </nav>
  </header>

  <main>
    <section class="hero" id="hero">
      <h1>Welcome</h1>
      <p>Your subtitle here</p>
      <a href="#features" class="btn btn-primary">Get Started</a>
    </section>

    <section class="features" id="features">
      <h2>Features</h2>
      <div class="grid">
        <div class="card">
          <h3>Feature 1</h3>
          <p>Description</p>
        </div>
      </div>
    </section>
  </main>

  <footer>
    <p>&copy; 2026 My App</p>
  </footer>

  <script src="js/main.js"></script>
</body>
</html>
```

## CSS Reset
```css
/* css/reset.css */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { min-height: 100vh; line-height: 1.6; -webkit-font-smoothing: antialiased; }
img, picture, video, canvas, svg { display: block; max-width: 100%; }
input, button, textarea, select { font: inherit; }
p, h1, h2, h3, h4, h5, h6 { overflow-wrap: break-word; }
```

## CSS Design Tokens + Base Styles
```css
/* css/styles.css */
:root {
  --color-primary: #3b82f6;
  --color-primary-dark: #2563eb;
  --color-text: #1f2937;
  --color-text-light: #6b7280;
  --color-bg: #ffffff;
  --color-bg-alt: #f9fafb;
  --color-border: #e5e7eb;
  --color-success: #10b981;
  --color-error: #ef4444;
  --font-sans: system-ui, -apple-system, 'Segoe UI', sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.5rem;
  --font-size-2xl: 2rem;
  --font-size-3xl: 2.5rem;
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  --spacing-3xl: 4rem;
  --max-width: 1200px;
  --radius: 0.5rem;
  --shadow: 0 1px 3px rgba(0,0,0,0.12);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --transition: 150ms ease;
}

body {
  font-family: var(--font-sans);
  color: var(--color-text);
  background: var(--color-bg);
}

/* Container */
.container { max-width: var(--max-width); margin: 0 auto; padding: 0 var(--spacing-md); }

/* Grid */
.grid { display: grid; gap: var(--spacing-lg); }
.grid-2 { grid-template-columns: repeat(2, 1fr); }
.grid-3 { grid-template-columns: repeat(3, 1fr); }
@media (max-width: 768px) {
  .grid-2, .grid-3 { grid-template-columns: 1fr; }
}

/* Button */
.btn {
  display: inline-flex; align-items: center; gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius); border: none; cursor: pointer;
  font-size: var(--font-size-base); font-weight: 500;
  text-decoration: none; transition: all var(--transition);
}
.btn-primary { background: var(--color-primary); color: white; }
.btn-primary:hover { background: var(--color-primary-dark); }
.btn-outline { background: transparent; border: 2px solid var(--color-primary); color: var(--color-primary); }

/* Card */
.card {
  background: var(--color-bg); border: 1px solid var(--color-border);
  border-radius: var(--radius); padding: var(--spacing-lg);
  box-shadow: var(--shadow); transition: box-shadow var(--transition);
}
.card:hover { box-shadow: var(--shadow-md); }

/* Navbar */
.navbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: var(--spacing-md) var(--spacing-lg);
  max-width: var(--max-width); margin: 0 auto;
}
.nav-links { display: flex; gap: var(--spacing-lg); list-style: none; }
.nav-links a { text-decoration: none; color: var(--color-text); }
.nav-links a:hover { color: var(--color-primary); }
.nav-toggle { display: none; background: none; border: none; font-size: 1.5rem; cursor: pointer; }
@media (max-width: 768px) {
  .nav-links { display: none; }
  .nav-links.active { display: flex; flex-direction: column; position: absolute; top: 60px; left: 0; right: 0; background: white; padding: var(--spacing-md); box-shadow: var(--shadow-md); }
  .nav-toggle { display: block; }
}

/* Hero Section */
.hero {
  text-align: center; padding: var(--spacing-3xl) var(--spacing-md);
  max-width: 800px; margin: 0 auto;
}
.hero h1 { font-size: var(--font-size-3xl); margin-bottom: var(--spacing-md); }
.hero p { font-size: var(--font-size-lg); color: var(--color-text-light); margin-bottom: var(--spacing-xl); }

/* Section */
section { padding: var(--spacing-3xl) var(--spacing-md); }
section h2 { font-size: var(--font-size-2xl); text-align: center; margin-bottom: var(--spacing-2xl); }

/* Form */
.form-group { margin-bottom: var(--spacing-md); }
.form-group label { display: block; margin-bottom: var(--spacing-xs); font-weight: 500; }
.form-group input, .form-group textarea, .form-group select {
  width: 100%; padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border); border-radius: var(--radius);
  font-size: var(--font-size-base); transition: border-color var(--transition);
}
.form-group input:focus, .form-group textarea:focus {
  outline: none; border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

/* Footer */
footer {
  background: var(--color-bg-alt); padding: var(--spacing-xl) var(--spacing-md);
  text-align: center; color: var(--color-text-light); margin-top: var(--spacing-3xl);
}
```

## JavaScript Patterns
```js
// js/main.js
document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle')
  const links = document.querySelector('.nav-links')
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('active'))
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      const target = document.querySelector(link.getAttribute('href'))
      if (target) target.scrollIntoView({ behavior: 'smooth' })
    })
  })

  // Form handling
  const form = document.querySelector('form')
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      const data = new FormData(form)
      const values = Object.fromEntries(data)
      console.log('Form submitted:', values)
    })
  }
})
```
