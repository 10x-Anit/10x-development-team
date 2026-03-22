# Simple HTML/CSS/JS Scaffold

## Command
```bash
mkdir -p [app-name]/{css,js,assets/images,assets/fonts}
```

## Directory Structure
```
[app-name]/
  index.html            ← Main page
  css/
    styles.css          ← All styles (single file)
    reset.css           ← CSS reset/normalize
  js/
    main.js             ← All JavaScript (single file)
    utils.js            ← Helper functions (if needed)
  assets/
    images/
    fonts/
  pages/                ← Additional HTML pages (if multi-page)
    about.html
    contact.html
```

## No Build Tool Required
- Open index.html directly in browser
- Use Live Server extension for hot reload
- No npm, no node, no bundler

## Default index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[App Name]</title>
  <link rel="stylesheet" href="css/reset.css">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <header></header>
  <main></main>
  <footer></footer>
  <script src="js/main.js"></script>
</body>
</html>
```

## When to Use
- Single page or 2-5 page static sites
- Prototypes and demos
- No backend needed
- No user authentication
- Content is mostly static
- User explicitly wants simple HTML/CSS/JS
