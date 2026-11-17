import { useState } from 'react'
import { CheckIcon, ConstraintsStep, FeaturesStep, IntentStep, ScaleStep } from './steps'
import type { WizardDraft } from './steps'

const STEPS = [
  { id: 'intent', label: 'Intent' },
  { id: 'features', label: 'Features' },
  { id: 'scale', label: 'Scale' },
  { id: 'constraints', label: 'Constraints' },
] as const

// Required-selection validation per step. Features is intentionally optional
// (a project can legitimately scope to none of these). The wizard gates
// Continue on the current step being valid before advancing.
function isStepValid(step: number, draft: WizardDraft): boolean {
  switch (step) {
    case 0:
      return draft.projectType !== null
    case 1:
      return true
    case 2:
      return draft.audienceScale !== null
    case 3:
      return draft.timeline !== null && draft.budgetTier !== null
    default:
      return true
  }
}

type WizardProps = {
  draft: WizardDraft
  update: (patch: Partial<WizardDraft>) => void
  onGenerate: () => void
}

export function Wizard({ draft, update, onGenerate }: WizardProps) {
  const [step, setStep] = useState(0)
  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1))
  const back = () => setStep((s) => Math.max(0, s - 1))
  const valid = isStepValid(step, draft)
  const isLast = step === STEPS.length - 1

  return (
    <div className="glass rounded-3xl p-6 sm:p-8">
      <ol className="flex items-center" aria-label="Scope Studio progress">
        {STEPS.map((s, i) => {
          const done = i < step
          const current = i === step
          return (
            <li key={s.id} className="flex flex-1 items-center last:flex-none">
              <button
                type="button"
                onClick={() => {
                  if (i < step) setStep(i)
                }}
                disabled={i > step}
                aria-current={current ? 'step' : undefined}
                className="flex items-center gap-2 disabled:cursor-not-allowed"
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition ${
                    current
                      ? 'border-violet-500 bg-violet-500/15 text-violet-300'
                      : done
                        ? 'border-violet-500 bg-violet-500 text-white'
                        : 'border-white/15 bg-white/[0.02] text-slate-400'
                  }`}
                >
                  {done ? <CheckIcon className="h-4 w-4" /> : i + 1}
                </span>
                <span
                  className={`hidden text-xs font-medium sm:inline ${
                    current ? 'text-white' : done ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {s.label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <span aria-hidden className="mx-3 h-px flex-1 bg-white/10" />
              )}
            </li>
          )
        })}
      </ol>

      {/* key={step} remounts on step change so the enter animation replays */}
      <div key={step} className="mt-8 wizard-step">
        {step === 0 && <IntentStep draft={draft} update={update} />}
        {step === 1 && <FeaturesStep draft={draft} update={update} />}
        {step === 2 && <ScaleStep draft={draft} update={update} />}
        {step === 3 && (
          <ConstraintsStep
            draft={draft}
            update={update}
            onBack={back}
            onGenerate={onGenerate}
          />
        )}
      </div>

      {/* ConstraintsStep renders its own Back + Generate row. */}
      {!isLast && (
        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className="btn-ghost inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            Back
          </button>
          <button
            type="button"
            onClick={next}
            disabled={!valid}
            className="btn-primary inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm disabled:pointer-events-none disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  )
}
