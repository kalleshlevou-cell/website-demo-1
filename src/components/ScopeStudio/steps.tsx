import { FEATURE_WEIGHTS } from '../../data/scopeConfig'
import type {
  AudienceScale,
  BudgetTier,
  Feature,
  ProjectType,
  Timeline,
} from '../../types'

// Draft shape for the intake wizard. Selection fields start null so the UI can
// show "nothing selected" and gate progression on required picks. ScopeStudio
// builds a fully-typed ScopeInput from this once every required field is set.
export type WizardDraft = {
  projectType: ProjectType | null
  oneLiner: string
  features: Feature[]
  audienceScale: AudienceScale | null
  timeline: Timeline | null
  budgetTier: BudgetTier | null
  notes: string
}

export const PROJECT_TYPES: readonly { label: string; value: ProjectType }[] = [
  { label: 'Web application', value: 'web_app' },
  { label: 'Mobile app', value: 'mobile_app' },
  { label: 'AI/automation system', value: 'ai_automation' },
  { label: 'Cloud migration', value: 'cloud_migration' },
  { label: 'Digital marketing/SEO', value: 'digital_marketing' },
  { label: 'E-commerce', value: 'ecommerce' },
  { label: 'SaaS platform', value: 'saas_platform' },
  { label: 'Other', value: 'other' },
]

export const FEATURES: readonly { label: string; value: Feature }[] = [
  { label: 'Authentication', value: 'auth' },
  { label: 'Payments/billing', value: 'payments' },
  { label: 'Dashboard & analytics', value: 'dashboard' },
  { label: 'AI features (LLM/agents)', value: 'ai_features' },
  { label: 'Third-party integrations/APIs', value: 'integrations_apis' },
  { label: 'Multi-tenancy', value: 'multi_tenant' },
  { label: 'Real-time (sockets/live)', value: 'realtime' },
  { label: 'CMS/content', value: 'cms' },
  { label: 'File uploads', value: 'file_uploads' },
  { label: 'Search', value: 'search' },
  { label: 'Notifications', value: 'notifications' },
  { label: 'Internationalization', value: 'i18n' },
  { label: 'Admin panel', value: 'admin_panel' },
  { label: 'Reporting', value: 'reporting' },
  { label: 'Maps/geo', value: 'map' },
  { label: 'Chat/messaging', value: 'chat' },
]

export const SCALES: readonly { label: string; value: AudienceScale }[] = [
  { label: 'Startup', value: 'startup' },
  { label: 'Small business', value: 'small_business' },
  { label: 'Mid-market', value: 'mid_market' },
  { label: 'Enterprise', value: 'enterprise' },
]

export const TIMELINES: readonly { label: string; value: Timeline }[] = [
  { label: 'ASAP', value: 'asap' },
  { label: '~3 months', value: 'm3' },
  { label: '~6 months', value: 'm6' },
  { label: '~12 months', value: 'm12' },
  { label: 'Flexible', value: 'flexible' },
]

export const BUDGET_TIERS: readonly { label: string; value: BudgetTier }[] = [
  { label: 'Lean <$15k', value: 'lean' },
  { label: 'Mid $15\u201350k', value: 'mid' },
  { label: 'Premium $50\u2013150k', value: 'premium' },
  { label: 'Enterprise $150k+', value: 'enterprise' },
  { label: 'Not sure', value: 'not_sure' },
]

export function CheckIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

type StepProps = {
  draft: WizardDraft
  update: (patch: Partial<WizardDraft>) => void
}

type ConstraintsStepProps = StepProps & {
  onBack: () => void
  onGenerate: () => void
}

// A single-select option rendered as an accessible card. The input is a real
// radio (keyboard-navigable, grouped by name); sr-only keeps it focusable
// while the visible card is styled off the checked prop. peer-focus-visible
// projects the keyboard focus ring onto the card.
function RadioCard({
  name,
  value,
  label,
  checked,
  onSelect,
}: {
  name: string
  value: string
  label: string
  checked: boolean
  onSelect: () => void
}) {
  return (
    <label className="block cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onSelect}
        className="peer sr-only"
      />
      <span
        className={`flex items-center justify-between gap-3 rounded-xl border p-4 transition hover:border-white/20 peer-focus-visible:ring-2 peer-focus-visible:ring-violet-400/70 ${
          checked ? 'border-violet-500 bg-violet-500/10' : 'border-white/10 bg-white/[0.02]'
        }`}
      >
        <span
          className={`text-sm font-medium transition ${checked ? 'text-white' : 'text-slate-200'}`}
        >
          {label}
        </span>
        <CheckIcon
          className={`h-4 w-4 shrink-0 transition ${checked ? 'text-violet-400' : 'text-transparent'}`}
        />
      </span>
    </label>
  )
}

function FeatureCard({
  value,
  label,
  weight,
  checked,
  onToggle,
}: {
  value: string
  label: string
  weight: number
  checked: boolean
  onToggle: () => void
}) {
  return (
    <label className="block cursor-pointer">
      <input
        type="checkbox"
        value={value}
        checked={checked}
        onChange={onToggle}
        className="peer sr-only"
      />
      <span
        className={`flex items-center justify-between gap-3 rounded-xl border p-4 transition hover:border-white/20 peer-focus-visible:ring-2 peer-focus-visible:ring-violet-400/70 ${
          checked ? 'border-violet-500 bg-violet-500/10' : 'border-white/10 bg-white/[0.02]'
        }`}
      >
        <span
          className={`text-sm font-medium transition ${checked ? 'text-white' : 'text-slate-200'}`}
        >
          {label}
        </span>
        <span className="flex items-center gap-2">
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs font-medium text-slate-400">
            {weight}
          </span>
          <CheckIcon
            className={`h-4 w-4 shrink-0 transition ${checked ? 'text-violet-400' : 'text-transparent'}`}
          />
        </span>
      </span>
    </label>
  )
}

export function IntentStep({ draft, update }: StepProps) {
  return (
    <div className="space-y-8">
      <fieldset className="m-0 border-0 p-0">
        <legend className="p-0 text-base font-semibold text-white">
          What are you building?
        </legend>
        <p className="mt-1 text-sm text-slate-400">
          Pick the closest match &mdash; you can refine later.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {PROJECT_TYPES.map((opt) => (
            <RadioCard
              key={opt.value}
              name="projectType"
              value={opt.value}
              label={opt.label}
              checked={draft.projectType === opt.value}
              onSelect={() => update({ projectType: opt.value })}
            />
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="oneLiner" className="text-base font-semibold text-white">
          Describe your idea in one line
        </label>
        <p className="mt-1 text-sm text-slate-400">
          Optional &mdash; a short pitch helps shape the brief.
        </p>
        <input
          id="oneLiner"
          type="text"
          value={draft.oneLiner}
          onChange={(e) => update({ oneLiner: e.target.value })}
          placeholder="e.g. A multi-tenant SaaS platform with AI-assisted workflows"
          className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400/40"
        />
      </div>
    </div>
  )
}

export function FeaturesStep({ draft, update }: StepProps) {
  const toggle = (value: Feature) =>
    update({
      features: draft.features.includes(value)
        ? draft.features.filter((f) => f !== value)
        : [...draft.features, value],
    })

  return (
    <fieldset className="m-0 border-0 p-0">
      <legend className="p-0 text-base font-semibold text-white">
        Which features do you need?
      </legend>
      <p className="mt-1 text-sm text-slate-400">
        Multi-select &mdash; pick all that apply. Each adds effort to the build.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {FEATURES.map((opt) => (
          <FeatureCard
            key={opt.value}
            value={opt.value}
            label={opt.label}
            weight={FEATURE_WEIGHTS[opt.value]}
            checked={draft.features.includes(opt.value)}
            onToggle={() => toggle(opt.value)}
          />
        ))}
      </div>
      <p className="mt-4 text-sm text-slate-400">
        {draft.features.length === 0
          ? 'No features selected yet.'
          : `${draft.features.length} selected.`}
      </p>
    </fieldset>
  )
}

export function ScaleStep({ draft, update }: StepProps) {
  return (
    <fieldset className="m-0 border-0 p-0">
      <legend className="p-0 text-base font-semibold text-white">Who is this for?</legend>
      <p className="mt-1 text-sm text-slate-400">
        Audience scale shapes team size and rigor.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {SCALES.map((opt) => (
          <RadioCard
            key={opt.value}
            name="audienceScale"
            value={opt.value}
            label={opt.label}
            checked={draft.audienceScale === opt.value}
            onSelect={() => update({ audienceScale: opt.value })}
          />
        ))}
      </div>
    </fieldset>
  )
}

export function ConstraintsStep({
  draft,
  update,
  onBack,
  onGenerate,
}: ConstraintsStepProps) {
  const ready = draft.timeline !== null && draft.budgetTier !== null
  return (
    <div className="space-y-8">
      <fieldset className="m-0 border-0 p-0">
        <legend className="p-0 text-base font-semibold text-white">Timeline</legend>
        <p className="mt-1 text-sm text-slate-400">
          Your target &mdash; we still size the build from scope.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {TIMELINES.map((opt) => (
            <RadioCard
              key={opt.value}
              name="timeline"
              value={opt.value}
              label={opt.label}
              checked={draft.timeline === opt.value}
              onSelect={() => update({ timeline: opt.value })}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="m-0 border-0 p-0">
        <legend className="p-0 text-base font-semibold text-white">Budget</legend>
        <p className="mt-1 text-sm text-slate-400">
          Pick a tier, or choose Not sure and we estimate it.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {BUDGET_TIERS.map((opt) => (
            <RadioCard
              key={opt.value}
              name="budgetTier"
              value={opt.value}
              label={opt.label}
              checked={draft.budgetTier === opt.value}
              onSelect={() => update({ budgetTier: opt.value })}
            />
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="notes" className="text-base font-semibold text-white">
          Must-haves / notes
        </label>
        <p className="mt-1 text-sm text-slate-400">
          Optional &mdash; anything we should factor in.
        </p>
        <textarea
          id="notes"
          rows={3}
          value={draft.notes}
          onChange={(e) => update({ notes: e.target.value })}
          placeholder="e.g. Must launch before Q3, integrate with Salesforce, single-tenant first..."
          className="mt-3 w-full resize-y rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400/40"
        />
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="btn-ghost inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onGenerate}
          disabled={!ready}
          className="btn-primary inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm disabled:pointer-events-none disabled:opacity-50"
        >
          Generate brief
        </button>
      </div>
    </div>
  )
}
