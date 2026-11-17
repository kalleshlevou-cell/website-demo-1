# Cynbit Website Improvement: Scope Studio

**Author:** Your Name  
**Date:** November 2026  
**Repo URL:** [repo-url]  
**Live URL:** [live-url — see DEPLOYMENT.md]

---

## 1. Problem Statement

### The existing site

Cynbit's website is well-structured and communicates the company's positioning clearly. The key sections:

- **Hero — "The optimistic architect":** Sets tone but asks nothing of the visitor.
- **Our Ecosystem:** Describes the SaaS suite and "human-centric impact" at a high level.
- **BitElevate:** Remote internship program, targeted at a secondary audience.
- **The Cynbit Edge:** Four pillars — startup speed, AI-first, end-to-end delivery, ROI engineering.
- **Domain Mastery:** Software engineering, Digital marketing & SEO, AI automation, Cloud infrastructure.
- **Architectural Lifecycle (6 steps):** Discovery & audit → Strategy & blueprinting → High-fidelity design → Technical implementation → Quality & integrity check → Deployment & evolution.
- **Testimonials:** Nine clients. Stats: 98% retention, 24/7 support, 3× ROI uplift, 6+ countries.
- **Closing CTA:** "Let's discuss how our AI automation…"

### What is missing

Every section above describes Cynbit. None of it involves the visitor. The funnel collapses to a single point of contact — "Let's discuss" — with no intermediate value exchange and no self-service path.

**From a visitor's perspective:** someone who arrives with a project idea cannot answer the most basic pre-sales question ("what would this roughly cost and how long would it take?") without initiating a call. That is high friction, particularly for technically literate buyers who want to scope before they talk.

**From Cynbit's perspective:** the site positions the company as AI-first and ROI-focused, but provides no demonstration of either. All leads arrive cold, with no structured context about what they want. The sales team must spend discovery call time on information that a visitor could have provided themselves.

**The conversion gap:** passive description → single generic CTA, no qualified intermediate step, no measurable engagement mechanism.

---

## 2. The Improvement: Scope Studio

Scope Studio is an interactive project-scoping wizard embedded directly in the page. The visitor answers four questions about their project — type, desired features, audience scale, and timeline/budget constraints — and receives a fully structured scope brief in return, covering: a one-line summary, estimated timeline, budget range, delivery phase breakdown, team composition, recommended tech stack, flagged risks, and ROI notes.

The brief is shareable via a URL that encodes all inputs (no server state needed), downloadable as a Markdown file, copyable, and includes a CTA that opens a pre-filled email to Cynbit with the brief summary and share link in the body.

### Why this improvement

**For the visitor:** clarity before commitment. Instead of opening a cold email, they know their project has an estimated duration of N weeks, a rough budget of $X–$Y, and three risks worth planning for. That is the information they needed before initiating contact. The brief is a tangible artifact they can share internally and act on.

**For Cynbit:** pre-qualified leads with structure. The email CTA sends the project type, audience scale, timeline preference, budget tier, feature list, and a one-line description — everything the sales team would have asked in the first ten minutes of a discovery call. The site also now *demonstrates* the AI-first positioning it claims, by giving visitors an instant AI-automation-style experience: input a problem, receive a structured output.

**A/B conversion comparison:** passive reading → low engagement → one generic CTA vs. interactive wizard → tangible brief → specific CTA with pre-filled context. The latter lowers friction, raises lead quality, and creates a measurable engagement event (brief generated, share link copied, email CTA clicked).

---

## 3. Technical Stack Choices

| Tool | Version | Role |
|---|---|---|
| Vite | 8 | Dev server + production build |
| React | 19 | Component model for the wizard and brief |
| TypeScript | 7 | Static types throughout the engine and UI |
| Tailwind CSS | 3 (classic config) | Utility-first styling |

**Why Vite + React + TypeScript:** Vite gives an instant dev loop and a clean static `dist/` output deployable to any CDN with zero configuration. React makes the wizard's multi-step state and conditional rendering straightforward to manage at component granularity. TypeScript catches mistakes in the estimation engine at compile time — the engine manipulates numeric coefficients and union-type enums, and a type error there produces a wrong estimate, not a crash, so static checking is load-bearing here.

**Why Tailwind CSS v3:** The v3 classic config is stable, well-documented, and has a mature ecosystem. Tailwind v4 alpha was explicitly avoided — it is production-unstable, the config format changed, and the existing tooling (PostCSS plugin, `tailwind.config.js`) is v3. Picking v4 here would add risk for no benefit.

**Alternatives considered:**

- **Next.js:** Server-side rendering is unnecessary for a static prototype with no data fetching. Next.js would add deploy complexity (Node.js runtime or edge functions) for no gain. Vite produces a smaller, simpler static bundle.
- **Vanilla HTML/JS:** Feasible for a simple form, but the wizard's four steps, shared state, conditional rendering, and animated result panel would require manual DOM management. TypeScript type safety on the engine would also require more scaffolding.
- **Live LLM API (GPT/Claude):** Rejected. A live LLM adds latency (1–5 s per generation), API key management, per-call cost, and failure modes (rate limits, model errors). The deterministic engine produces a brief in under 1 ms, works offline, works in every demo environment, and never fails. The trade-off is that the output is formulaic, not prose — an acceptable cost for a prototype that is demonstrating the concept, not replacing a consultant.

---

## 4. Architecture & Implementation

### Component tree

```
App
├── Nav
├── Hero
├── ScopeStudio          ← id="studio" (smooth-scroll anchor)
│   ├── Wizard
│   │   ├── IntentStep   (project type, one-liner)
│   │   ├── FeaturesStep (feature multi-select)
│   │   ├── ScaleStep    (audience scale)
│   │   └── ConstraintsStep (timeline, budget tier, notes)
│   └── BriefResult      (generated brief + action buttons)
├── ValueProps
├── Domains
├── Process
├── Testimonials
└── Footer
```

### Data layer

`src/data/scopeConfig.ts` holds all tunable constants: `BASE_EFFORT` (8 project types), `FEATURE_WEIGHTS` (16 features), `SCALE_MULTIPLIER` (4 audience scales), `TECH_STACK` (stack per project type), `PROJECT_TYPE_DOMAINS` (domain mapping), `DOMAIN_TITLES`, and `RISK_RULES` (7 predicate rules). None of this data lives inside the engine — the engine imports it. Changing an estimate requires editing the config, not the computation logic.

`src/data/domains.ts` holds Cynbit domain metadata consumed by the Domains section.

`src/types.ts` defines the pure data contracts: `ScopeInput`, `Brief`, `Phase`, `TeamMember`, `Risk`, `DomainRef`, `RiskContext`, `RiskRule`, and the union types (`ProjectType`, `Feature`, `AudienceScale`, `Timeline`, `BudgetTier`, `PhaseName`, `DomainId`).

### Engine: `src/engine/scopeEngine.ts`

`computeBrief(input: ScopeInput): Brief` is a pure, deterministic function. Same input → same output, every time.

**Effort model:**

```
totalEffort = (BASE_EFFORT[projectType] + Σ FEATURE_WEIGHTS[feature]) × SCALE_MULTIPLIER[audienceScale]
weeks       = clamp(round(totalEffort / 12), 4, 36)
```

Base effort ranges from 35 (digital_marketing) to 130 (saas_platform). Feature weights range from 8 (file_uploads) to 35 (ai_features). Scale multipliers: startup 1.0×, small_business 1.1×, mid_market 1.3×, enterprise 1.6×. The divisor of 12 converts effort units to weeks; the clamp enforces a floor of 4 and a ceiling of 36 weeks.

**Phases:** fixed percentages applied to `weeks`, with the Build phase absorbing any rounding remainder so the split always sums to exactly `weeks`.

| Phase | Split |
|---|---|
| Discovery | 15% |
| Design | 15% |
| Build | 50% |
| QA | 12% |
| Launch | 8% |

**Team composition:** eight role specs, each with an `include` predicate (driven by project type, feature list, audience scale, and week count) and a per-role headcount cap. Headcount per included role scales with `SCALE_COUNT[audienceScale]` (startup=1, mid_market=2, enterprise=3), capped by the role's max.

**Budget:** the selected tier defines a `[lo, hi]` USD range. The engine places a sub-window of width `0.6 × span` inside that range, sliding it toward the upper bound as `totalEffort` rises. This produces a specific range like "$21k–$42k" rather than the full tier span, while respecting the visitor's tier selection.

**Risks:** `RISK_RULES` is an ordered list of 7 predicate functions; the engine evaluates them in order and collects the first 4 that return a non-null result. Rules check: AI features under a tight timeline, multi-tenant isolation, PCI compliance, enterprise procurement overhead, realtime at enterprise scale, aggressive timeline vs. scope, and AI model cost/reliability.

**ROI notes:** 8 ROI rules, capped at 3, matched against project type and selected features.

**Domain mapping:** `PROJECT_TYPE_DOMAINS` maps each project type to one or more Cynbit domain IDs; enterprise AI automation additionally adds `cloud`.

### URL stateless sharing

`encodeInput` serializes the `ScopeInput` to JSON, UTF-8-encodes it, then base64url-encodes the bytes (replacing `+`, `/`, `=` for URL safety). `decodeInput` reverses this exactly. The result is stored in the `?scope=` query parameter.

On mount, `ScopeStudio` checks `window.location.search` for `?scope=`. If present, it decodes the input, calls `computeBrief`, and renders `BriefResult` directly — skipping the wizard — so the share link reproduces the identical brief on any device, any browser, any deploy.

### Integration

The Nav's "Scope my project" CTA links to `#studio`. Clicking it triggers a smooth scroll to the `ScopeStudio` section. All existing site sections (Hero, ValueProps, Domains, Process, Testimonials, Footer) are unchanged.

---

## 5. Key Decisions & Trade-offs

| Decision | Rationale |
|---|---|
| Deterministic engine over live LLM | Zero latency, no API key, no cost, works offline in demo, never fails. Output is formulaic but reliable. |
| Client-side only, no backend | Free static hosting (Vercel/Netlify/GitHub Pages), no server state, no ops. Zero infrastructure for a prototype. |
| Tailwind CSS v3 classic config (not v4 alpha) | v3 is stable and production-proven. v4 changed the config API and is not yet stable; the risk/reward is unfavorable. |
| URL stateless sharing vs. server session | No backend needed. The share link carries the full input; the brief is recomputed client-side on load. Any deploy URL works. |
| 4-step wizard vs. single form | Progressive disclosure: each step presents one decision at a time, reducing cognitive load and preventing blank-form paralysis. |
| Brief as downloadable Markdown artifact | A portable, plain-text document the visitor actually keeps and can share internally. Demonstrates tangible value beyond the web UI. |

---

## 6. Results & Expected Impact

### Verified sample trace

Input: `saas_platform` / `[auth, payments, dashboard, multi_tenant, ai_features]` / `mid_market` / `m6` / `mid`

- totalEffort = (130 + 12 + 18 + 16 + 30 + 35) × 1.3 = 241 × 1.3 = 313.3
- **Weeks: 26** (round(313.3 / 12) = round(26.1) = 26, within clamp [4, 36])
- **Phases:** Discovery 4w, Design 4w, Build 13w, QA 3w, Launch 2w — **sum = 26** ✓
- **Team:** 6 roles (Project Lead/Architect, Frontend Engineer, Backend Engineer, ML/AI Engineer, Product Designer, QA Engineer)
- **Budget:** $21k–$42k (mid tier, effort-position slide) ✓
- **Risks (2):** Tenant isolation & data security; Aggressive timeline vs scope (m6 with 26 weeks > 20)
- **ROI notes (3):** AI automation ops cost reduction; built-in billing/revenue channel; multi-tenant SaaS revenue scaling
- **Round-trip encode/decode:** PASS

### Conversion improvement

| Metric | Before | After |
|---|---|---|
| Engagement before CTA | None — description only | Wizard completion → structured brief |
| Lead quality | Cold contact, no context | Pre-qualified: type, features, scale, budget tier, timeline |
| CTA specificity | Generic "Let's discuss" | Pre-filled email with brief summary + share link |
| Capability demonstration | Claims AI-first | Visitor experiences a deterministic AI-style output |

### What to measure

- Briefs generated per session (wizard completion rate)
- Share-link copies vs. briefs generated
- "Discuss with Cynbit" mailto CTA clicks
- Time-on-page vs. baseline (pre-feature launch)
- Per-step drop-off rate in the wizard (which step loses visitors)

---

## 7. Deployment

One command on Vercel: see [DEPLOYMENT.md](./DEPLOYMENT.md). Live URL filled in after first deploy.

---

## 8. Limitations & Future Work

**Current limitations:**

- Estimates are guidance, not quotes. The engine is intentionally simplified — a real project scope requires discovery. The brief includes a disclaimer to this effect.
- The budget model uses fixed tier windows; it does not account for regional labor rates, existing infrastructure, or regulatory requirements.

**Possible future work:**

- **LLM enhancement:** stream a personalized brief narrative from an LLM (GPT-4o / Claude 3.5), using the deterministic output as a structured prompt seed. The deterministic engine still runs first; the LLM adds prose color, not the numbers.
- **A/B test:** compare conversion from the existing generic CTA against the Scope Studio wizard CTA, measuring mailto clicks and inquiry-to-call rate.
- **CRM integration:** save briefs server-side on "Discuss with Cynbit" click; pass structured fields (project type, budget tier, timeline, features) directly into HubSpot or Pipedrive.
- **Analytics events:** track wizard step completion and per-step drop-off with a lightweight event pipeline (PostHog, Plausible).
- **Real-time collaboration:** shareable brief link with a live-edit mode so a visitor can refine it with their team before sending.
- **Multi-language support:** the type/label system in `scopeConfig.ts` is already separated from the engine; adding i18n is a data-layer change, not an engine change.
