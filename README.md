# Applications Hub

A premium static navigation landing page — no install, no build required.

Uses **Bootstrap 5**, **Bootstrap Icons**, and **AOS** animations via CDN.

## Run

**Double-click `index.html`** in your browser (internet required for CDN fonts/icons on first load).

## Project structure

```
├── index.html       # Main page
├── css/styles.css   # Custom premium theme
├── js/main.js       # App logic + particle canvas
├── data/apps.js     # Your app links (edit this)
└── web.config       # IIS deployment (optional)
```

## Customize

Edit **`data/apps.js`** — change the JSON object after `window.APP_CONFIG =`.

| Field | Description |
|-------|-------------|
| `name` | App display name |
| `description` | Short description |
| `url` | Link (subdomain or full URL) |
| `icon` | `code`, `article`, `dashboard`, `api` |
| `status` | `live` (clickable) or `coming-soon` |
| `accent` | Card color (hex) |
| `tags` | Optional labels |

Save the file and refresh the browser.

## Deploy

Copy all files to any static host (IIS, Netlify, GitHub Pages, etc.). No build step needed.

For IIS, `web.config` is included for JSON MIME types.

## Branches

| Branch | Purpose |
|--------|---------|
| `main` | This navigation hub |
| Other branches | Individual apps on subdomains |
