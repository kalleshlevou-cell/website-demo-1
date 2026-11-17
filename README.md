# Cynbit Scope Studio

A working prototype that improves [Cynbit Technologies'](https://cynbit.in) website with an interactive project-scoping tool. Visitors answer four questions about their project and receive an instant, structured scope brief — estimated timeline, budget range, team composition, delivery phases, tech stack recommendations, risk flags, and ROI notes — with no sales call required. The brief is shareable via URL, downloadable as Markdown, and includes a pre-filled email CTA to start a conversation with Cynbit.

![Built with Vite](https://img.shields.io/badge/Built%20with-Vite-646cff?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-7-3178c6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-38bdf8?logo=tailwindcss&logoColor=white)

---

## Live Demo

[live-url]

---

## What it does

- **Four-step wizard** walks the visitor through project type, desired features, audience scale, and timeline/budget constraints — typically under 90 seconds.
- **Deterministic scoping engine** computes a structured brief instantly: weeks estimate, budget range, phase breakdown, team composition, tech stack, flagged risks, and ROI notes.
- **Download brief** exports the full brief as a `.md` file the visitor keeps and can share internally.
- **Share link** encodes all wizard inputs in a `?scope=` URL parameter — anyone with the link sees the identical brief on any device or deploy, with no server state needed.
- **"Discuss with Cynbit" CTA** opens a pre-filled email with the brief summary and share link in the body, sending Cynbit a pre-qualified lead with structured context.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [Vite 8](https://vite.dev) | Dev server and production build (static `dist/`) |
| [React 19](https://react.dev) | Component model for wizard and brief UI |
| [TypeScript 7](https://www.typescriptlang.org) | Static types on the engine, inputs, and outputs |
| [Tailwind CSS 3](https://tailwindcss.com) | Utility-first styling |
| `src/engine/scopeEngine.ts` | Pure deterministic estimation engine — no runtime deps |
| `src/data/scopeConfig.ts` | Effort weights, risk rules, tech stacks (all tunable) |

---

## Run locally

```bash
git clone <repo-url>
cd "cynbit-scope-studio"
npm install
npm run dev
```

Opens at **http://localhost:5173**.

---

## Build & deploy

```bash
npm run build   # outputs to dist/
```

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for Vercel, Netlify, and GitHub Pages instructions.

---

## Technical report

Full problem analysis, architecture, engine design, key trade-offs, and results: [docs/TECHNICAL_REPORT.md](docs/TECHNICAL_REPORT.md).

---

## Project structure

```
cynbit-scope-studio/
├── docs/
│   ├── TECHNICAL_REPORT.md   problem statement, architecture, results
│   └── DEPLOYMENT.md         Vercel / Netlify / GitHub Pages guide
├── public/
├── src/
│   ├── types.ts              shared TypeScript contracts (ScopeInput, Brief, …)
│   ├── engine/
│   │   └── scopeEngine.ts    pure engine: computeBrief, encodeInput, decodeInput
│   ├── data/
│   │   ├── scopeConfig.ts    effort weights, risk rules, tech stacks
│   │   └── domains.ts        Cynbit domain metadata
│   ├── hooks/
│   │   └── useHashScroll.ts  smooth-scroll helper
│   ├── components/
│   │   ├── ScopeStudio/
│   │   │   ├── ScopeStudio.tsx   section shell, URL sharing, state root
│   │   │   ├── Wizard.tsx        step navigator and progress bar
│   │   │   ├── steps.tsx         four step components
│   │   │   └── BriefResult.tsx   brief display, download, share, CTA
│   │   ├── Nav.tsx
│   │   ├── Hero.tsx
│   │   ├── ValueProps.tsx
│   │   ├── Domains.tsx
│   │   ├── Process.tsx
│   │   ├── Testimonials.tsx
│   │   └── Footer.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## License

MIT
