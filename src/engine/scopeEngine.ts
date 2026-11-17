import type {
  AudienceScale,
  Brief,
  BudgetTier,
  DomainId,
  DomainRef,
  Feature,
  Phase,
  PhaseName,
  ProjectType,
  Risk,
  RiskContext,
  ScopeInput,
  TeamMember,
  Timeline,
} from '../types'
import {
  BASE_EFFORT,
  DOMAIN_TITLES,
  FEATURE_WEIGHTS,
  PROJECT_TYPE_DOMAINS,
  RISK_RULES,
  SCALE_MULTIPLIER,
  TECH_STACK,
} from '../data/scopeConfig'

// --- Engine tuning constants -----------------------------------------------

const WEEKS_DIVISOR = 12
const MIN_WEEKS = 4
const MAX_WEEKS = 36
const MAX_RISKS = 4
const MAX_ROI_NOTES = 3

// Effort bounds used to normalize totalEffort into a 0..1 position inside a
// budget tier (higher effort -> upper part of the tier).
const EFFORT_MIN = 35
const EFFORT_MAX = 660

const PHASE_DEFS: readonly { name: PhaseName; percent: number }[] = [
  { name: 'Discovery', percent: 15 },
  { name: 'Design', percent: 15 },
  { name: 'Build', percent: 50 },
  { name: 'QA', percent: 12 },
  { name: 'Launch', percent: 8 },
]

// Budget tier USD ranges. 'not_sure' is not a concrete range — it is inferred.
type ConcreteBudgetTier = Exclude<BudgetTier, 'not_sure'>
const BUDGET_RANGE: Readonly<Record<ConcreteBudgetTier, readonly [number, number]>> = {
  lean: [5000, 15000],
  mid: [15000, 50000],
  premium: [50000, 150000],
  enterprise: [150000, 400000],
}

// Headcount scaling by audience scale; per-role caps stop counts from bloating.
const SCALE_COUNT: Readonly<Record<AudienceScale, number>> = {
  startup: 1,
  small_business: 1,
  mid_market: 2,
  enterprise: 3,
}

// Features that justify a backend engineer on the team.
const BACKEND_TRIGGERS: readonly Feature[] = [
  'payments',
  'auth',
  'multi_tenant',
  'integrations_apis',
  'realtime',
]

// Roles, their headcount caps, and when they join the team.
type RoleSpec = {
  role: string
  max: number
  include: (input: ScopeInput, weeks: number) => boolean
}

const ROLE_SPECS: readonly RoleSpec[] = [
  { role: 'Project Lead/Architect', max: 1, include: () => true },
  { role: 'Frontend Engineer', max: 3, include: () => true },
  {
    role: 'Backend Engineer',
    max: 2,
    include: (input) =>
      input.projectType === 'saas_platform' ||
      BACKEND_TRIGGERS.some((f) => input.features.includes(f)),
  },
  {
    role: 'ML/AI Engineer',
    max: 2,
    include: (input) => input.features.includes('ai_features'),
  },
  {
    role: 'DevOps/Cloud Engineer',
    max: 2,
    include: (input) =>
      input.projectType === 'cloud_migration' ||
      input.audienceScale === 'enterprise',
  },
  {
    role: 'SEO/Growth Specialist',
    max: 2,
    include: (input) => input.projectType === 'digital_marketing',
  },
  {
    role: 'Product Designer',
    max: 2,
    include: (input) =>
      input.features.includes('dashboard') ||
      input.features.includes('cms') ||
      input.projectType === 'ecommerce' ||
      input.projectType === 'web_app' ||
      input.projectType === 'mobile_app',
  },
  {
    role: 'QA Engineer',
    max: 2,
    include: (input, weeks) =>
      weeks >= 12 || input.audienceScale === 'enterprise',
  },
]

// ROI rule: given the input, return a tailored value bullet or null.
type RoiRule = (input: ScopeInput) => string | null

const ROI_RULES: readonly RoiRule[] = [
  (input) =>
    input.features.includes('ai_features') || input.projectType === 'ai_automation'
      ? 'AI and automation take repetitive work off the team, lowering manual ops cost over time.'
      : null,
  (input) =>
    input.features.includes('payments') || input.projectType === 'ecommerce'
      ? 'Built-in billing and checkout open a direct revenue channel from day one.'
      : null,
  (input) =>
    input.features.includes('multi_tenant') || input.projectType === 'saas_platform'
      ? 'A multi-tenant architecture grows revenue per customer without growing cost linearly.'
      : null,
  (input) =>
    input.projectType === 'cloud_migration'
      ? 'Modern cloud infrastructure cuts run cost and lifts reliability and uptime.'
      : null,
  (input) =>
    input.projectType === 'digital_marketing'
      ? 'Technical SEO compounds: organic traffic lowers acquisition cost quarter over quarter.'
      : null,
  (input) =>
    input.features.includes('dashboard') || input.features.includes('reporting')
      ? 'Self-serve dashboards cut support load and surface the metrics that matter in real time.'
      : null,
  (input) =>
    input.features.includes('realtime') ||
    input.features.includes('chat') ||
    input.features.includes('notifications')
      ? 'Real-time engagement lifts retention and time-on-product.'
      : null,
  (input) =>
    input.features.includes('search')
      ? 'Fast in-product search improves conversion and reduces drop-off.'
      : null,
]

const ROI_FALLBACK =
  'A clear, phased scope de-risks delivery and protects the launch date.'

// Human-readable labels used in the summary and the markdown export.
const SCALE_LABELS: Readonly<Record<AudienceScale, string>> = {
  startup: 'startup',
  small_business: 'small business',
  mid_market: 'mid-market',
  enterprise: 'enterprise',
}

const PROJECT_TYPE_LABELS: Readonly<Record<ProjectType, string>> = {
  web_app: 'web app',
  mobile_app: 'mobile app',
  ai_automation: 'AI automation',
  cloud_migration: 'cloud migration',
  digital_marketing: 'digital marketing',
  ecommerce: 'e-commerce',
  saas_platform: 'SaaS platform',
  other: 'software project',
}

const TIMELINE_LABELS: Readonly<Record<Timeline, string>> = {
  asap: 'ASAP',
  m3: '~3 months',
  m6: '~6 months',
  m12: '~12 months',
  flexible: 'Flexible',
}

const TIER_LABELS: Readonly<Record<ConcreteBudgetTier, string>> = {
  lean: 'Lean',
  mid: 'Mid',
  premium: 'Premium',
  enterprise: 'Enterprise',
}

// --- Small helpers ---------------------------------------------------------

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(Math.max(n, lo), hi)
}

function sumFeatureWeights(features: readonly Feature[]): number {
  return features.reduce((sum, f) => sum + FEATURE_WEIGHTS[f], 0)
}

// "eight", "eleven", "eighteen", and the eighties start with a vowel sound.
function startsWithVowel(n: number): boolean {
  return n === 8 || n === 11 || n === 18 || (n >= 80 && n < 90)
}

function formatUsd(n: number): string {
  return `$${Math.round(n / 1000)}k`
}

// --- Computation steps ----------------------------------------------------

function computePhases(weeks: number): Phase[] {
  const raw = PHASE_DEFS.map((p) => ({
    name: p.name,
    percent: p.percent,
    weeks: Math.round((weeks * p.percent) / 100),
  }))
  // Adjust the largest phase (Build) so the split sums exactly to weeks.
  const delta = weeks - raw.reduce((sum, p) => sum + p.weeks, 0)
  const buildIndex = raw.findIndex((p) => p.name === 'Build')
  raw[buildIndex] = {
    ...raw[buildIndex],
    weeks: Math.max(0, raw[buildIndex].weeks + delta),
  }
  return raw
}

function inferTier(totalEffort: number): ConcreteBudgetTier {
  if (totalEffort < 70) return 'lean'
  if (totalEffort < 160) return 'mid'
  if (totalEffort < 320) return 'premium'
  return 'enterprise'
}

function computeBudget(
  budgetTier: BudgetTier,
  totalEffort: number,
): { range: string; tier: ConcreteBudgetTier; inferred: boolean } {
  const inferred = budgetTier === 'not_sure'
  const tier = inferred ? inferTier(totalEffort) : budgetTier
  const [lo, hi] = BUDGET_RANGE[tier]
  const span = hi - lo
  const effortPos = clamp(
    (totalEffort - EFFORT_MIN) / (EFFORT_MAX - EFFORT_MIN),
    0,
    1,
  )
  // A sub-window of the tier that slides toward the upper bound as effort rises.
  const windowWidth = Math.round((span * 0.6) / 1000) * 1000
  const maxSlide = span - windowWidth
  const slide = Math.round((maxSlide * effortPos) / 1000) * 1000
  const low = lo + slide
  const high = low + windowWidth
  const range = `${formatUsd(low)}\u2013${formatUsd(high)}${inferred ? ' (Estimated)' : ''}`
  return { range, tier, inferred }
}

function computeTeam(input: ScopeInput, weeks: number): TeamMember[] {
  const base = SCALE_COUNT[input.audienceScale]
  return ROLE_SPECS.filter((spec) => spec.include(input, weeks)).map((spec) => ({
    role: spec.role,
    count: Math.max(1, Math.min(base, spec.max)),
  }))
}

function computeRisks(ctx: RiskContext): Risk[] {
  const out: Risk[] = []
  for (const rule of RISK_RULES) {
    if (out.length >= MAX_RISKS) break
    const risk = rule(ctx)
    if (risk) out.push(risk)
  }
  return out
}

function computeDomains(input: ScopeInput): DomainRef[] {
  const ids = new Set<DomainId>(PROJECT_TYPE_DOMAINS[input.projectType])
  if (input.projectType === 'ai_automation' && input.audienceScale === 'enterprise') {
    ids.add('cloud')
  }
  return [...ids].map((id) => ({ id, title: DOMAIN_TITLES[id] }))
}

function computeRoi(input: ScopeInput): string[] {
  const out: string[] = []
  for (const rule of ROI_RULES) {
    if (out.length >= MAX_ROI_NOTES) break
    const note = rule(input)
    if (note) out.push(note)
  }
  if (out.length === 0) out.push(ROI_FALLBACK)
  return out
}

function buildSummary(
  input: ScopeInput,
  weeks: number,
  team: TeamMember[],
): string {
  const teamSize = team.reduce((sum, m) => sum + m.count, 0)
  const scaleLabel = SCALE_LABELS[input.audienceScale]
  const typeLabel = PROJECT_TYPE_LABELS[input.projectType]
  const budgetLabel =
    input.budgetTier === 'not_sure' ? 'Estimated' : TIER_LABELS[input.budgetTier]
  const article = startsWithVowel(teamSize) ? 'an' : 'a'
  const scaleArticle = ['enterprise'].includes(input.audienceScale) ? 'An' : 'A'
  return `${scaleArticle} ${scaleLabel} ${typeLabel} with ${input.features.length} core features \u2014 estimated ${weeks} weeks across ${article} ${teamSize}-person team in the ${budgetLabel} range.`
}

// --- Public API -----------------------------------------------------------

/**
 * Pure, deterministic scoping engine. Same input always yields the same Brief.
 */
export function computeBrief(input: ScopeInput): Brief {
  const base = BASE_EFFORT[input.projectType]
  const featureSum = sumFeatureWeights(input.features)
  const scale = SCALE_MULTIPLIER[input.audienceScale]
  const totalEffort = (base + featureSum) * scale
  const weeks = clamp(Math.round(totalEffort / WEEKS_DIVISOR), MIN_WEEKS, MAX_WEEKS)

  const phases = computePhases(weeks)
  const budget = computeBudget(input.budgetTier, totalEffort)
  const team = computeTeam(input, weeks)
  const risks = computeRisks({ input, weeks })
  const domains = computeDomains(input)
  const roiNotes = computeRoi(input)
  const summary = buildSummary(input, weeks, team)

  return {
    summary,
    projectType: input.projectType,
    oneLiner: input.oneLiner,
    selectedFeatures: [...input.features],
    audienceScale: input.audienceScale,
    timeline: input.timeline,
    budgetTier: budget.tier,
    estimatedBudgetRange: budget.range,
    weeks,
    phases,
    team,
    techStack: [...TECH_STACK[input.projectType]],
    risks,
    domains,
    roiNotes,
  }
}

// --- Share-link encode / decode -------------------------------------------

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = ''
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk))
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function base64UrlToBytes(s: string): Uint8Array {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/')
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4)
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

/** Encode a ScopeInput into a compact, URL-safe query-string value. */
export function encodeInput(input: ScopeInput): string {
  const json = JSON.stringify(input)
  const bytes = new TextEncoder().encode(json)
  return bytesToBase64Url(bytes)
}

/** Decode a value produced by encodeInput back into the exact ScopeInput. */
export function decodeInput(s: string): ScopeInput {
  const bytes = base64UrlToBytes(s)
  const json = new TextDecoder().decode(bytes)
  return JSON.parse(json) as ScopeInput
}

// --- Markdown export ------------------------------------------------------

function tierLabel(brief: Brief): string {
  return brief.budgetTier === 'not_sure' ? 'Estimated' : TIER_LABELS[brief.budgetTier]
}

/** Render a Brief as valid Markdown. */
export function briefToMarkdown(brief: Brief): string {
  const lines: string[] = []
  lines.push('# Project Scope Brief')
  lines.push('')
  lines.push(`> ${brief.summary}`)
  lines.push('')
  lines.push('## Project')
  lines.push(`- **Type:** ${PROJECT_TYPE_LABELS[brief.projectType]}`)
  lines.push(`- **One-liner:** ${brief.oneLiner}`)
  lines.push(`- **Audience scale:** ${SCALE_LABELS[brief.audienceScale]}`)
  lines.push(`- **Timeline:** ${TIMELINE_LABELS[brief.timeline]}`)
  lines.push(`- **Budget tier:** ${tierLabel(brief)}`)
  lines.push(`- **Estimated budget:** ${brief.estimatedBudgetRange}`)
  lines.push('')
  lines.push('## Scope')
  if (brief.selectedFeatures.length === 0) {
    lines.push('- _No core features selected._')
  } else {
    lines.push(
      `- **Core features (${brief.selectedFeatures.length}):** ${brief.selectedFeatures.join(', ')}`,
    )
  }
  lines.push('')
  lines.push('## Timeline')
  lines.push(`- **Estimated duration:** ${brief.weeks} weeks`)
  lines.push('')
  lines.push('| Phase | Split | Weeks |')
  lines.push('| --- | ---: | ---: |')
  for (const p of brief.phases) {
    lines.push(`| ${p.name} | ${p.percent}% | ${p.weeks} |`)
  }
  lines.push('')
  lines.push('## Team')
  for (const m of brief.team) lines.push(`- ${m.role} \u2014 ${m.count}`)
  lines.push('')
  lines.push('## Tech stack')
  lines.push(brief.techStack.map((t) => `\`${t}\``).join(' \u00b7 '))
  lines.push('')
  lines.push('## Risks')
  if (brief.risks.length === 0) {
    lines.push('- _None flagged._')
  }
  for (const r of brief.risks) {
    lines.push(`- **${r.title}** \u2014 ${r.mitigation}`)
  }
  lines.push('')
  lines.push('## Domain alignment')
  lines.push(brief.domains.map((d) => d.title).join(', '))
  lines.push('')
  lines.push('## ROI / value notes')
  for (const n of brief.roiNotes) lines.push(`- ${n}`)
  lines.push('')
  return lines.join('\n')
}

// --- Sample / sanity helper ----------------------------------------------

/** The canonical sample input used to trace and sanity-check the engine. */
export const SAMPLE_INPUT: ScopeInput = {
  projectType: 'saas_platform',
  oneLiner: 'A multi-tenant SaaS platform with AI-assisted workflows.',
  features: ['auth', 'payments', 'dashboard', 'multi_tenant', 'ai_features'],
  audienceScale: 'mid_market',
  timeline: 'm6',
  budgetTier: 'mid',
}

/** Compute the brief for the canonical sample input. */
export function computeSampleBrief(): Brief {
  return computeBrief(SAMPLE_INPUT)
}
