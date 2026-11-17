import type {
  AudienceScale,
  DomainId,
  Feature,
  ProjectType,
  RiskRule,
} from '../types'

// Base effort per project type, in arbitrary effort units.
export const BASE_EFFORT: Readonly<Record<ProjectType, number>> = {
  web_app: 60,
  mobile_app: 90,
  ai_automation: 110,
  cloud_migration: 70,
  digital_marketing: 35,
  ecommerce: 70,
  saas_platform: 130,
  other: 60,
}

// Feature effort weights, added to the base effort when a feature is selected.
export const FEATURE_WEIGHTS: Readonly<Record<Feature, number>> = {
  auth: 12,
  payments: 18,
  dashboard: 16,
  ai_features: 35,
  integrations_apis: 20,
  multi_tenant: 30,
  realtime: 22,
  cms: 18,
  file_uploads: 8,
  search: 14,
  notifications: 12,
  i18n: 14,
  admin_panel: 16,
  reporting: 14,
  map: 12,
  chat: 16,
}

// Scale multipliers applied to total effort by audience scale.
export const SCALE_MULTIPLIER: Readonly<Record<AudienceScale, number>> = {
  startup: 1.0,
  small_business: 1.1,
  mid_market: 1.3,
  enterprise: 1.6,
}

// Concrete, sensible tech stack per project type.
export const TECH_STACK: Readonly<Record<ProjectType, readonly string[]>> = {
  web_app: ['React/Next.js', 'TypeScript', 'Tailwind', 'Node.js', 'PostgreSQL', 'Vercel'],
  mobile_app: ['React Native/Flutter', 'Node.js', 'Firebase/Supabase'],
  ai_automation: [
    'Python',
    'FastAPI',
    'LangChain/LLM orchestration',
    'pgvector/Pinecone',
    'cloud GPU inference',
  ],
  cloud_migration: [
    'AWS/Azure',
    'Terraform (IaC)',
    'Docker/Kubernetes',
    'zero-trust networking',
  ],
  digital_marketing: [
    'Next.js + technical SEO',
    'GA4',
    'Search Console',
    'content pipeline',
    'Core Web Vitals',
  ],
  ecommerce: ['Next.js Commerce/Shopify Hydrogen', 'Stripe', 'headless CMS'],
  saas_platform: [
    'Next.js',
    'multi-tenant DB',
    'Stripe billing',
    'RBAC',
    'queue workers',
  ],
  other: ['consult (discovery-led)'],
}

// Base project-type -> Cynbit domain mapping. The engine augments this when
// rules demand it (e.g. add Cloud for enterprise AI automation).
export const PROJECT_TYPE_DOMAINS: Readonly<
  Record<ProjectType, readonly DomainId[]>
> = {
  web_app: ['engineering'],
  mobile_app: ['engineering'],
  ai_automation: ['ai'],
  cloud_migration: ['cloud'],
  digital_marketing: ['marketing'],
  ecommerce: ['engineering'],
  saas_platform: ['engineering'],
  other: ['engineering'],
}

// Display titles for the four Cynbit domains.
export const DOMAIN_TITLES: Readonly<Record<DomainId, string>> = {
  engineering: 'Software engineering',
  marketing: 'Digital marketing & SEO',
  ai: 'AI automation',
  cloud: 'Cloud infrastructure',
}

// Risk rule predicates, evaluated in order. The engine keeps the first matches
// (up to its cap) so the most salient risks surface first.
export const RISK_RULES: readonly RiskRule[] = [
  (ctx) =>
    ctx.input.features.includes('ai_features') && ctx.input.timeline === 'asap'
      ? {
          title: 'AI scope under tight timeline',
          mitigation: 'phase AI in v2, ship a deterministic MVP first',
        }
      : null,
  (ctx) =>
    ctx.input.features.includes('multi_tenant')
      ? {
          title: 'Tenant isolation & data security',
          mitigation: 'row-level security + per-tenant encryption',
        }
      : null,
  (ctx) =>
    ctx.input.features.includes('payments')
      ? {
          title: 'PCI compliance & fraud',
          mitigation: 'tokenized payments via Stripe, no raw card data',
        }
      : null,
  (ctx) =>
    ctx.input.audienceScale === 'enterprise'
      ? {
          title: 'Procurement & integration timelines',
          mitigation: 'align with their IT/security review early',
        }
      : null,
  (ctx) =>
    ctx.input.features.includes('realtime') &&
    ctx.input.audienceScale === 'enterprise'
      ? {
          title: 'Latency & infra cost at scale',
          mitigation:
            'horizontal scaling + caching + connection budgeting',
        }
      : null,
  (ctx) =>
    (ctx.input.timeline === 'asap' && ctx.weeks > 16) ||
    (ctx.input.timeline === 'm3' && ctx.weeks > 20)
      ? {
          title: 'Aggressive timeline vs scope',
          mitigation: 'trim to an MVP scope first',
        }
      : null,
  (ctx) =>
    ctx.input.projectType === 'ai_automation'
      ? {
          title: 'Model cost & reliability',
          mitigation: 'guardrails, evals, caching, fallbacks',
        }
      : null,
]
