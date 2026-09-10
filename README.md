# Shabin Lal M. — Portfolio

Static engineering portfolio. No build step. Host the folder on IIS, Netlify, GitHub Pages, or any static server.

## Run locally

Serve the folder (do not rely on `file://` if you want resume HEAD checks to work):

```bash
# Python
python -m http.server 8080

# or Node
npx --yes serve -p 8080
```

Open `http://localhost:8080`.

## What to edit

| You want to change | File |
| --- | --- |
| Name, email, phone, LinkedIn, GitHub, resume path, hero/about copy | `data/site.js` |
| Jobs / timeline | `data/experience.js` |
| Projects, case studies, screenshot paths, PDFs | `data/projects.js` |
| Skills and expertise tiles | `data/skills.js` |
| Customer names and logos | `data/clients.js` |
| Visual design | `css/styles.css` |
| Page structure | `index.html` |

Do not invent LinkedIn/GitHub URLs. Leave them as empty strings until you have the real profile.

## Adding a project

1. Copy an object in `data/projects.js`.
2. Give it a unique `id` (`kebab-case`).
3. Create `public/projects/<id>/`.
4. Drop `cover.jpg` and screenshots there.
5. Point `cover` and `screenshots` at those files.

Example screenshot entry:

```js
screenshots: [
  { src: "public/projects/recipe-reporting/01.jpg", caption: "Recipe editor" }
]
```

Example document entry:

```js
documents: [
  { title: "Sample report", description: "Public excerpt", src: "public/documents/sample.pdf" }
]
```

Until files exist, the UI shows placeholders. That is intentional.

## Resume PDF

Place the file at:

```
public/resume/Shabin-Lal-Resume.pdf
```

If it is missing, Download/View stay disabled and a hint is shown in the Resume section.

## Logos

Put files in `public/clients/` and set `logo` in `data/clients.js`. Do not hotlink random internet logos.

## Theme

Dark is the default. The toggle stores `localStorage.theme` as `dark` or `light`.

## Deploy (IIS)

Copy the site root (including `web.config`) to the site folder. `web.config` maps JSON/SVG/PDF MIME types and sends `X-Content-Type-Options: nosniff`.
