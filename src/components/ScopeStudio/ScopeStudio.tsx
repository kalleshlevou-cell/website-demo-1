import { useEffect, useState } from 'react'
import { computeBrief, decodeInput, encodeInput } from '../../engine/scopeEngine'
import type { Brief, ScopeInput } from '../../types'
import { Wizard } from './Wizard'
import type { WizardDraft } from './steps'

const INITIAL_DRAFT: WizardDraft = {
  projectType: null,
  oneLiner: '',
  features: [],
  audienceScale: null,
  timeline: null,
  budgetTier: null,
  notes: '',
}

// The query-string key carrying a base64url-encoded ScopeInput for share links.
const SHARE_PARAM = 'scope'

function toScopeInput(draft: WizardDraft): ScopeInput | null {
  if (!draft.projectType || !draft.audienceScale || !draft.timeline || !draft.budgetTier) {
    return null
  }
  return {
    projectType: draft.projectType,
    oneLiner: draft.oneLiner,
    features: draft.features,
    audienceScale: draft.audienceScale,
    timeline: draft.timeline,
    budgetTier: draft.budgetTier,
    notes: draft.notes || undefined,
  }
}

function shareUrlFor(input: ScopeInput): string {
  return `${window.location.pathname}?${SHARE_PARAM}=${encodeInput(input)}${window.location.hash}`
}

// Minimal result placeholder. The full BriefResult view lands in a later step;
// for now we surface the headline numbers and keep the result shareable.
function ResultView({ brief, onReset }: { brief: Brief; onReset: () => void }) {
  const teamSize = brief.team.reduce((sum, m) => sum + m.count, 0)
  return (
    <div className="glass rounded-3xl p-6 sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">
        Your scope brief
      </p>
      <h3 className="mt-2 text-xl font-bold text-white sm:text-2xl">
        Project scope, generated
      </h3>
      <p className="mt-5 text-base leading-relaxed text-slate-200">{brief.summary}</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Stat label="Est. duration" value={`${brief.weeks} weeks`} />
        <Stat label="Budget" value={brief.estimatedBudgetRange} />
        <Stat label="Team size" value={`${teamSize} people`} />
      </div>

      {brief.selectedFeatures.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Core features
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {brief.selectedFeatures.map((f) => (
              <span
                key={f}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      )}

      {brief.risks.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Top risks to plan for
          </p>
          <ul className="mt-2 space-y-2">
            {brief.risks.slice(0, 3).map((r) => (
              <li key={r.title} className="text-sm text-slate-300">
                <span className="font-medium text-white">{r.title}</span>
                <span className="text-slate-400"> &mdash; {r.mitigation}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          This link now reproduces your brief &mdash; share it.
        </p>
        <button
          type="button"
          onClick={onReset}
          className="btn-ghost inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm"
        >
          Start over
        </button>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  )
}

export function ScopeStudio() {
  const [draft, setDraft] = useState<WizardDraft>(INITIAL_DRAFT)
  const [brief, setBrief] = useState<Brief | null>(null)

  // On mount: if a share param is present, decode it and render the result
  // directly (skipping the wizard) so the link is reproducible.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const encoded = params.get(SHARE_PARAM)
    if (!encoded) return
    try {
      const input = decodeInput(encoded)
      setBrief(computeBrief(input))
      setDraft({
        projectType: input.projectType,
        oneLiner: input.oneLiner,
        features: input.features,
        audienceScale: input.audienceScale,
        timeline: input.timeline,
        budgetTier: input.budgetTier,
        notes: input.notes ?? '',
      })
    } catch {
      // ignore a malformed share parameter
    }
  }, [])

  const update = (patch: Partial<WizardDraft>) =>
    setDraft((d) => ({ ...d, ...patch }))

  const generate = () => {
    const input = toScopeInput(draft)
    if (!input) return
    setBrief(computeBrief(input))
    if (typeof history !== 'undefined' && history.replaceState) {
      history.replaceState(null, '', shareUrlFor(input))
    }
  }

  const startOver = () => {
    setBrief(null)
    setDraft(INITIAL_DRAFT)
    if (typeof history !== 'undefined' && history.replaceState) {
      history.replaceState(null, '', `${window.location.pathname}${window.location.hash}`)
    }
  }

  return (
    <section id="studio" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">
            Scope Studio
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Turn your idea into a plan
          </h2>
          <p className="mt-4 text-slate-400">
            Answer a few questions about your project and Scope Studio drafts a
            tailored scope, timeline range, and budget estimate &mdash; no sales
            call required.
          </p>
        </div>

        <div className="mt-10">
          {brief ? (
            <ResultView brief={brief} onReset={startOver} />
          ) : (
            <Wizard draft={draft} update={update} onGenerate={generate} />
          )}
        </div>
      </div>
    </section>
  )
}
