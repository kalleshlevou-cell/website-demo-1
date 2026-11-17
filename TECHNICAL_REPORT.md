# Technical Report — Cynbit Website Improvement

**Candidate task:** Full Stack Developer Intern  
**Project:** Scope Studio — deterministic project scoping tool  
**Repository:** this repo (master branch)  
**Build status:** passing (`npm run build` → exit 0)

---

## 1. Problem Statement

### Observation

Cynbit's existing website describes what the studio builds but provides no immediate value to a visitor who arrives with a project idea. A potential client must either email to start a conversation or leave. There is no way to self-qualify, understand rough scope, or get an estimate without a sales call.

### Identified gap

The website converts visitors into leads by description alone. A visitor cannot answer the most basic pre-sales question — *"what would this cost and how long would it take?"* — without initiating contact. This raises the barrier to engagement, especially for technically literate buyers who want to scope before they talk.

### Hypothesis

A self-serve, fully client-side scoping tool embedded directly in the website would let visitors turn a rough idea into a structured brief in under two minutes. The resulting brief gives them something concrete to act on (share, download, discuss) and gives Cynbit a warm, pre-qualified lead with context already attached.

---

## 2. Proposed Improvement

**Scope Studio** — a multi-step intake wizard that accepts a project description and produces a deterministic, structured scope brief covering: timeline estimate, budget range, team composition, delivery phases, tech stack, risk flags, and ROI notes. The brief is shareable via a URL, downloadable as Markdown, and includes a direct CTA to open a pre-filled email to Cynbit.

### Why this improvement specifically

| Alternative considered | Why not chosen |
|---|---|
| Contact form improvement | Lowers friction slightly but still requires a human exchange before the visitor gets any value |
| Live chat widget | Needs a human on the other end; adds operational cost |
| Pricing page | Static; cannot reflect the variance in real project scope |
| Scope Studio (chosen) | Delivers immediate, personalized value; collects structured data; zero backend cost |

---

## 3. Technical Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | React 19 + TypeScript 7 | Existing Cynbit stack; strict type-checking catches mistakes at compile time |
| Build tool | Vite 8 | Fast dev loop; Rollup-based production bundles |
| Styling | Tailwind CSS 3 | Utility-first; consistent with existing site design tokens |
| Engine | Pure TypeScript (no runtime deps) | Deterministic; testable in isolation; zero server round-trips |
| State | React `useState` / `useEffect` | No external state library needed for this scope |
| Sharing | Base64url + `URLSearchParams` | No backend; share link is fully self-contained |
| Deployment | Static (`dist/`) | Drop into any CDN; no server required |

**Bundle (production build):**
- JS: 271 kB raw / 82.5 kB gzip
- CSS: 18.4 kB raw / 4.7 kB gzip
- HTML: 1.1 kB raw / 0.6 kB gzip

---

## 4. Implementation

### 4.1 Architecture overview

```
src/
├── types.ts                        shared TypeScript contracts
├── engine/
│   └── scopeEngine.ts              pure computation: computeBrief,
│                                   encodeInput, decodeInput, briefToMarkdown
├── data/
│   ├── scopeConfig.ts              effort weights, risk rules, tech stacks
│   └── domains.ts                  Cynbit domain metadata
└── components/
    └── ScopeStudio/
        ├── ScopeStudio.tsx         section shell, URL sharing, state root
        ├── Wizard.tsx              step navigator and progress bar
        ├── steps.tsx               four step components + shared widgets
        └── BriefResult.tsx         generated brief display + action buttons
```

The site layout lives in `src/components/` (Nav, Hero, ValueProps, Domains, Process, Testimonials, Footer). Scope Studio is a self-contained sub-tree that the page mounts as a standard `<section>`.

### 4.2 Engine design

`computeBrief(input: ScopeInput): Brief` is a pure, deterministic function. Given the same input it always returns the same output — no randomness, no network calls, no side effects. This makes the share-link guarantee trivially true: the URL carries the input, and the engine recomputes the brief on load.

Computation pipeline:

1. **Effort score** — `(BASE_EFFORT[projectType] + Σ FEATURE_WEIGHTS[feature]) × SCALE_MULTIPLIER[audienceScale]`
2. **Weeks** — `clamp(round(effort / 12), 4, 36)`
3. **Budget range** — effort score normalized within the selected (or inferred) tier, producing a sliding sub-window
4. **Phases** — fixed percentages (Discovery 15%, Design 15%, Build 50%, QA 12%, Launch 8%) applied to weeks, adjusted so the split sums exactly
5. **Team** — role specs filtered by project type and features, headcount scaled by audience scale
6. **Risks** — predicate rules evaluated in priority order, capped at 4
7. **ROI notes** — feature/type-matched value bullets, capped at 3
8. **Summary** — human-readable one-liner built from the derived values

### 4.3 Wizard (intake)

Four steps, each validating before the user can advance:

| Step | Fields | Validation |
|---|---|---|
| Intent | Project type (required), one-liner (optional) | `projectType !== null` |
| Features | Feature multi-select (optional) | always valid |
| Scale | Audience scale (required) | `audienceScale !== null` |
| Constraints | Timeline, budget tier (required), notes (optional) | both non-null |

Steps mount with a `wizard-step-enter` animation. The progress bar shows completion state and allows navigating back to any completed step.

### 4.4 Brief result and actions

`BriefResult.tsx` renders all brief fields with a staggered `brief-reveal` animation (60 ms delay per section, 11 sections total → 660 ms full reveal) so the output feels generated rather than dumped. Users with `prefers-reduced-motion` see no animation.

**Action buttons:**

- **Download brief (.md)** — calls `briefToMarkdown(brief)`, wraps in a `Blob`, creates an object URL, triggers a programmatic `<a>` click, and revokes the URL immediately.
- **Copy share link** — calls `history.replaceState` to sync the address bar, then writes the URL to the clipboard (`navigator.clipboard.writeText` with a `document.execCommand` fallback for non-secure contexts).
- **Copy as Markdown** — same clipboard path, content is `briefToMarkdown(brief)`.
- **Discuss this with Cynbit** — constructs a `mailto:hello@cynbit.com` URI with the one-liner as subject and a body containing: the one-line summary, the share URL, and the full Markdown brief.

A disclaimer beneath the actions states: *"Estimates are guidance, not quotes. Final scope, timeline, and budget are confirmed together in a discovery call."*

### 4.5 URL sharing

`encodeInput` serializes a `ScopeInput` to JSON, UTF-8 encodes it, then base64url-encodes the bytes (no `+`, `/`, or `=` characters — safe as a query-string value). `decodeInput` reverses the process exactly.

On mount, `ScopeStudio` checks `window.location.search` for the `?scope=` parameter. If present, it decodes the input, computes the brief, and renders `BriefResult` directly — skipping the wizard. The share link is set by `history.replaceState` when `generate()` is called, and refreshed when the user clicks "Copy share link".

**Round-trip verification (13/13 PASS, Node 22.23.2):**
- Canonical SAMPLE_INPUT (encoded length 316 chars)
- 10 varied inputs: empty features, empty one-liner, Unicode + emoji + quotes in both `oneLiner` and `notes`, `not_sure` budget tier, all project types, full 10-feature list, enterprise audience
- Idempotency: `encode(decode(encode(x))) === encode(x)`
- Distinctness: different inputs produce different tokens

---

## 5. Commits

| Hash | Message |
|---|---|
| `9d31d3c` | `chore: scaffold Vite + React + TypeScript + Tailwind project` |
| `c5ed942` | `feat(site): add on-brand layout, hero, and section components` |
| `4d71038` | `feat(scope-studio): add deterministic scoping engine and data config` |
| `669e3ff` | `refactor(scope-studio): extend engine with month-band timeline and enterprise budget tier` |
| `a7a51ef` | `feat(scope-studio): add multi-step intake wizard` |
| `ace9775` | `feat(scope-studio): add generated brief, download/share/lead-CTA, URL sharing` |

**Total:** 20 source files, 2,426 lines of TypeScript/TSX/CSS across 6 commits.

---

## 6. Results

### What it does

A visitor to the Cynbit website can now:

1. Open the Scope Studio section (no page navigation required).
2. Answer four screens of questions about their project (type, features, scale, constraints) — typically under 90 seconds.
3. Receive a fully structured scope brief: summary, timeline, budget range, team, phases, tech stack, risks, and ROI notes.
4. Share the brief via URL (the link reproduces the exact brief on load), download it as a `.md` file, copy it as Markdown, or open a pre-filled email to start a conversation with Cynbit.

### Technical properties

- **Fully client-side.** No backend, no database, no API key. Deployable as a static site to any CDN.
- **Zero network calls.** The engine runs entirely in the browser. The page loads once; all interactions are instant.
- **Deterministic.** Same input always produces the same brief. Share links are reliable.
- **Accessible.** All interactive elements are keyboard-navigable. Radio inputs and checkboxes use real `<input>` elements (not `div` click handlers). Focus rings are visible. `prefers-reduced-motion` suppresses all animations. `aria-current="step"` marks the active wizard step.
- **Type-safe.** `tsc -b` with `noUnusedLocals`, `noUnusedParameters`, and `erasableSyntaxOnly` all pass with zero errors.

### What it improves

| Before | After |
|---|---|
| Visitor reads about Cynbit's capabilities | Visitor immediately applies those capabilities to their own project |
| Lead generation requires visitor to initiate contact cold | Lead arrives pre-qualified with structured context (type, features, scale, timeline, budget tier) |
| No self-serve estimate | Budget range and timeline estimate in under 2 minutes |
| No shareable project brief | Sharable URL, downloadable Markdown, copy-to-clipboard |
| CTA is "scope my project" link to the studio | CTA is a pre-filled email with the full brief in the body |
