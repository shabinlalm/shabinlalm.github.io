# Developer Portfolio

A modern, professional, responsive developer portfolio built with **Angular 22**, **TypeScript**, **PrimeNG**, and **SCSS**. Features dark/light mode, lazy-loaded routes, scroll animations, SEO optimization, and accessibility support.

## Tech Stack

- Angular 22 (standalone components)
- TypeScript
- PrimeNG + PrimeIcons
- SCSS with CSS custom properties
- RxJS
- Responsive, mobile-first design

## Features

- **7 pages**: Home, About, Skills, Projects, Experience, Certifications, Contact
- **Dark/Light theme** toggle with persistence
- **Lazy-loaded routes** for fast initial load
- **Scroll animations** via Intersection Observer
- **Project search & filter** with modal detail view and image gallery
- **Skills progress indicators** grouped by category
- **Experience timeline** layout
- **Contact form** with validation (demo toast on submit)
- **SEO meta tags** per page
- **Accessibility**: skip link, ARIA labels, keyboard focus, reduced motion support

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── directives/       # Scroll animation directive
│   │   ├── layout/           # Header, footer, main layout
│   │   ├── models/           # TypeScript interfaces
│   │   └── services/         # Portfolio, theme, SEO services
│   ├── features/             # Lazy-loaded page components
│   │   ├── home/
│   │   ├── about/
│   │   ├── skills/
│   │   ├── projects/
│   │   ├── experience/
│   │   ├── certifications/
│   │   └── contact/
│   ├── shared/
│   │   └── components/       # Reusable UI components
│   ├── app.config.ts
│   ├── app.routes.ts
│   └── app.ts
├── assets/
│   ├── data/portfolio.json   # Sample portfolio data
│   ├── images/               # Avatars, project screenshots, badges
│   └── resume/               # Resume PDF
├── styles/                   # SCSS variables, themes, animations
└── index.html
public/
└── web.config                # IIS URL rewrite for SPA routing
```

## Getting Started

### Prerequisites

- Node.js 22.22+ or 24.15+
- npm 10+

### Installation

```bash
npm install --legacy-peer-deps
```

> PrimeNG 21 currently lists Angular 21 as a peer dependency. Use `--legacy-peer-deps` for Angular 22 compatibility.

### Development Server

```bash
npm start
```

Open [http://localhost:4200](http://localhost:4200).

### Production Build

```bash
npm run build
```

Output is written to `dist/portfolio/browser/`.

## Customization

Edit `src/assets/data/portfolio.json` to update:

- Profile information and social links
- Skills with proficiency levels
- Projects with screenshots, technologies, and descriptions
- Work experience timeline
- Certifications
- Contact details

Replace placeholder assets:

- `src/assets/images/avatar.svg` — profile photo
- `src/assets/images/projects/` — project screenshots
- `src/assets/resume/jordan-mitchell-resume.pdf` — your resume PDF
- `src/index.html` — SEO meta tags and canonical URL

Update branding in `src/app/core/layout/header/header.component.html` and footer.

## Deployment

### Static Hosting (Netlify, Vercel, GitHub Pages, Azure Static Web Apps)

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the contents of `dist/portfolio/browser/` to your static host.

3. Configure SPA fallback so all routes serve `index.html`:

   **Netlify** — create `public/_redirects`:
   ```
   /*    /index.html   200
   ```

   **Vercel** — add `vercel.json`:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```

   **GitHub Pages** — if deploying to a subpath, set `baseHref` in `angular.json`:
   ```json
   "baseHref": "/your-repo-name/"
   ```

   **Azure Static Web Apps** — routing is configured automatically for SPAs.

### IIS Deployment

1. Build for production:
   ```bash
   npm run build
   ```

2. Copy all files from `dist/portfolio/browser/` to your IIS site folder (e.g. `C:\inetpub\wwwroot\portfolio`).

3. Ensure `web.config` is present in the site root (included from `public/web.config`).

4. Install **IIS URL Rewrite Module** if not already installed:
   - Download from [Microsoft IIS URL Rewrite](https://www.iis.net/downloads/microsoft/url-rewrite)

5. Create or configure the IIS site:
   - Open **IIS Manager** → **Sites** → **Add Website**
   - Set physical path to your deployment folder
   - Bind HTTP/HTTPS as needed

6. Enable static content and ensure MIME types are configured (handled by `web.config`).

7. For HTTPS, bind an SSL certificate in IIS Site Bindings.

8. Optional performance tuning:
   - Enable **HTTP Compression** in IIS
   - Set cache headers for hashed assets (`*.js`, `*.css`)
   - Enable **HTTP/2** if available

### IIS Troubleshooting

| Issue | Solution |
|-------|----------|
| 404 on page refresh | Verify URL Rewrite module is installed and `web.config` is in site root |
| Blank page | Check browser console; ensure `base href="/"` matches your deployment path |
| Assets not loading | Confirm all files from `dist/portfolio/browser/` were copied |
| MIME type errors | Verify `web.config` staticContent section is present |

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start dev server |
| `npm run build` | Production build |
| `npm run watch` | Development build with watch |

## Browser Support

- Chrome, Firefox, Safari, Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

## License

MIT — customize freely for your personal portfolio.
