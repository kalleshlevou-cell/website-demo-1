import { useEffect, useState } from 'react'
import { computeBrief, decodeInput, encodeInput } from '../../engine/scopeEngine'
import type { Brief, ScopeInput } from '../../types'
import { BriefResult } from './BriefResult'
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

  // The brief is only set once every required field is filled (via generate or
  // via a decoded share param), so a non-null input is guaranteed alongside it.
  const input = toScopeInput(draft)
  const shareUrl = input ? shareUrlFor(input) : ''

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
          {brief && input ? (
            <BriefResult brief={brief} shareUrl={shareUrl} onReset={startOver} />
          ) : (
            <Wizard draft={draft} update={update} onGenerate={generate} />
          )}
        </div>
      </div>
    </section>
  )
}
