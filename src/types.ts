// Shared TypeScript types for the Scope Studio deterministic scoping engine.
// Pure data contracts — no runtime values live here.

export type ProjectType =
  | 'web_app'
  | 'mobile_app'
  | 'ai_automation'
  | 'cloud_migration'
  | 'digital_marketing'
  | 'ecommerce'
  | 'saas_platform'
  | 'other'

export type Feature =
  | 'auth'
  | 'payments'
  | 'dashboard'
  | 'ai_features'
  | 'integrations_apis'
  | 'multi_tenant'
  | 'realtime'
  | 'cms'
  | 'file_uploads'
  | 'search'
  | 'notifications'
  | 'i18n'
  | 'admin_panel'
  | 'reporting'
  | 'map'
  | 'chat'

export type AudienceScale =
  | 'startup'
  | 'small_business'
  | 'mid_market'
  | 'enterprise'

export type Timeline = 'asap' | 'm3' | 'm6' | 'm12' | 'flexible'

export type BudgetTier = 'lean' | 'mid' | 'premium' | 'enterprise' | 'not_sure'

export type DomainId = 'engineering' | 'marketing' | 'ai' | 'cloud'

export type ScopeInput = {
  projectType: ProjectType
  oneLiner: string
  features: Feature[]
  audienceScale: AudienceScale
  timeline: Timeline
  budgetTier: BudgetTier
  mustHaves?: string
  notes?: string
}

export type PhaseName = 'Discovery' | 'Design' | 'Build' | 'QA' | 'Launch'

export type Phase = {
  name: PhaseName
  weeks: number
  percent: number
}

export type TeamMember = {
  role: string
  count: number
}

export type Risk = {
  title: string
  mitigation: string
}

export type DomainRef = {
  id: DomainId
  title: string
}

export type Brief = {
  summary: string
  projectType: ProjectType
  oneLiner: string
  selectedFeatures: Feature[]
  audienceScale: AudienceScale
  timeline: Timeline
  budgetTier: BudgetTier
  estimatedBudgetRange: string
  weeks: number
  phases: Phase[]
  team: TeamMember[]
  techStack: string[]
  risks: Risk[]
  domains: DomainRef[]
  roiNotes: string[]
}

// Context handed to a risk rule predicate. Rules are pure and read only the
// input plus the derived total week count (the "aggressive timeline" rule needs
// weeks to decide).
export type RiskContext = {
  input: ScopeInput
  weeks: number
}

export type RiskRule = (ctx: RiskContext) => Risk | null
