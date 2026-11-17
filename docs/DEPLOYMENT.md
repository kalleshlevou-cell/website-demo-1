# Deployment Guide

## Prerequisites

- Node.js 18 or later
- npm (bundled with Node)
- git

---

## Run locally

```bash
npm install
npm run dev
```

Opens at **http://localhost:5173**. The dev server supports HMR; edits to any source file reload the browser instantly.

---

## Build

```bash
npm run build
```

Outputs a production-ready static bundle to `dist/`. The build runs `tsc -b` (type-check) then Vite's Rollup bundler.

Preview the production build locally:

```bash
npm run preview
```

---

## Deploy to Vercel (recommended)

**Option A — CLI:**

```bash
npm i -g vercel
vercel
```

Vite is auto-detected; no framework preset needed. The first deploy prompts for a project name. Subsequent deploys:

```bash
vercel --prod
```

**Option B — GitHub dashboard:** Connect the repository at [vercel.com/new](https://vercel.com/new). Vercel detects Vite automatically and sets `npm run build` / `dist` with no manual configuration. Every push to `main` deploys automatically.

> **Note:** `vercel.json` in the project root configures an SPA rewrite rule so that share-link URLs (`?scope=…`) are served by `index.html` on any path. This is required for share links to work correctly.

---

## Deploy to Netlify

**Option A — CLI:**

```bash
npm i -g netlify-cli
npm run build
netlify deploy --dir=dist --prod
```

**Option B — GitHub dashboard:** Connect the repository at [app.netlify.com](https://app.netlify.com). Set:

- Build command: `npm run build`
- Publish directory: `dist`

Netlify handles the SPA rewrite automatically for single-page apps.

---

## Deploy to GitHub Pages

Push the repository to GitHub, then enable Pages:

1. Settings → Pages → Source: **GitHub Actions**
2. The workflow file `.github/workflows/deploy.yml` in this repo handles the full build and deploy automatically on every push to `main`.

---

## Share-link URLs

Share links encode all wizard inputs in the `?scope=` query parameter (base64url-encoded JSON). They are entirely client-side — no server state is needed. Any deployed URL (Vercel, Netlify, GitHub Pages, or a custom domain) will serve share links correctly as long as the SPA rewrite is in place.

---

## Custom domain

Configure a custom domain in the Vercel or Netlify dashboard under **Domains** in your project settings. DNS propagation typically takes a few minutes to a few hours depending on your registrar.
