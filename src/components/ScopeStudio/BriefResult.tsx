import { useState } from 'react'
import type { ReactNode } from 'react'
import { briefToMarkdown } from '../../engine/scopeEngine'
import type { Brief } from '../../types'
import { BUDGET_TIERS, FEATURES, PROJECT_TYPES, SCALES, TIMELINES } from './steps'

type BriefResultProps = {
  brief: Brief
  // The shareable URL for this brief: encodeInput(input) placed in the page URL.
  shareUrl: string
  onReset: () => void
}

// Resolve a human-readable label for an enum value from the wizard's option
// lists, so the result mirrors exactly what the user picked. Falls back to the
// raw value if a label is somehow missing.
function labelFor<T extends string>(
  options: readonly { value: T; label: string }[],
  value: T,
): string {
  return options.find((o) => o.value === value)?.label ?? value
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
      {children}
    </p>
  )
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
      {children}
    </span>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-white">{value}</p>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border-l-4 border-violet-500/60 border border-white/10 bg-white/[0.02] p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold text-gradient">{value}</p>
    </div>
  )
}

export function BriefResult({ brief, shareUrl, onReset }: BriefResultProps) {
  const [copied, setCopied] = useState<'link' | 'markdown' | null>(null)
  const teamSize = brief.team.reduce((sum, m) => sum + m.count, 0)

  function flash(kind: 'link' | 'markdown') {
    setCopied(kind)
    setTimeout(() => setCopied((c) => (c === kind ? null : c)), 1800)
  }

  // Clipboard write with a legacy fallback for non-secure contexts.
  async function copyToClipboard(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text)
      return
    } catch {
      // fall through to the legacy path
    }
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    } catch {
      // best-effort; nothing more we can do without a permissions prompt
    }
  }

  async function handleCopyLink() {
    // Keep the address bar in sync with the shareable URL, then copy it.
    if (typeof history !== 'undefined' && history.replaceState) {
      history.replaceState(null, '', shareUrl)
    }
    await copyToClipboard(shareUrl)
    flash('link')
  }

  async function handleCopyMarkdown() {
    await copyToClipboard(briefToMarkdown(brief))
    flash('markdown')
  }

  function handleDownload() {
    const md = briefToMarkdown(brief)
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'scope-brief.md'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function handleDiscuss() {
    const subject = `Project scope brief \u2014 ${
      brief.oneLiner || labelFor(PROJECT_TYPES, brief.projectType)
    }`
    // Keep the body short so it survives email client URI length limits (~2 kB).
    // The share URL lets the recipient (or Cynbit) reconstruct the full brief.
    const body = [
      brief.summary,
      '',
      'Full brief available at:',
      shareUrl,
      '',
      `Project: ${labelFor(PROJECT_TYPES, brief.projectType)}`,
      `Scale: ${labelFor(SCALES, brief.audienceScale)}`,
      `Timeline: ${labelFor(TIMELINES, brief.timeline)}`,
      `Budget: ${brief.estimatedBudgetRange}`,
      `Est. duration: ${brief.weeks} weeks`,
    ].join('\n')
    window.location.href = `mailto:hello@cynbit.com?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`
  }

  return (
    <div className="glass rounded-3xl p-6 sm:p-8">
      {/* One-line summary header */}
      <div className="brief-reveal">
        <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">
          Your scope brief
        </p>
        <h3 className="mt-2 text-xl font-bold leading-snug text-white sm:text-2xl">
          {brief.summary}
        </h3>
      </div>

      {/* Headline stats */}
      <div
        className="brief-reveal mt-6 grid gap-3 sm:grid-cols-3"
        style={{ animationDelay: '60ms' }}
      >
        <Stat label="Est. duration" value={`${brief.weeks} weeks`} />
        <Stat label="Budget" value={brief.estimatedBudgetRange} />
        <Stat label="Team size" value={`${teamSize} people`} />
      </div>

      {/* Project fields */}
      <div className="brief-reveal mt-8 space-y-3" style={{ animationDelay: '120ms' }}>
        <SectionLabel>Project</SectionLabel>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Type" value={labelFor(PROJECT_TYPES, brief.projectType)} />
          <Field
            label="Audience scale"
            value={labelFor(SCALES, brief.audienceScale)}
          />
          <Field label="Timeline" value={labelFor(TIMELINES, brief.timeline)} />
          <Field
            label="Budget tier"
            value={labelFor(BUDGET_TIERS, brief.budgetTier)}
          />
        </div>
        {brief.oneLiner && <Field label="One-liner" value={brief.oneLiner} />}
      </div>

      {/* Core features */}
      <div className="brief-reveal mt-8" style={{ animationDelay: '180ms' }}>
        <SectionLabel>Core features ({brief.selectedFeatures.length})</SectionLabel>
        {brief.selectedFeatures.length === 0 ? (
          <p className="mt-2 text-sm text-slate-400">No core features selected.</p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {brief.selectedFeatures.map((f) => (
              <Chip key={f}>{labelFor(FEATURES, f)}</Chip>
            ))}
          </div>
        )}
      </div>

      {/* Phases */}
      <div className="brief-reveal mt-8" style={{ animationDelay: '240ms' }}>
        <SectionLabel>Phases ({brief.weeks} weeks)</SectionLabel>
        <div className="mt-3 overflow-x-auto overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/[0.03] text-left text-xs uppercase tracking-widest text-slate-400">
                <th className="px-4 py-2.5 font-semibold">Phase</th>
                <th className="px-4 py-2.5 text-right font-semibold">Split</th>
                <th className="px-4 py-2.5 text-right font-semibold">Weeks</th>
              </tr>
            </thead>
            <tbody>
              {brief.phases.map((p) => (
                <tr key={p.name} className="border-t border-white/10 hover:bg-white/[0.03] transition">
                  <td className="px-4 py-2.5 text-slate-100">{p.name}</td>
                  <td className="px-4 py-2.5 text-right text-slate-400">{p.percent}%</td>
                  <td className="px-4 py-2.5 text-right text-slate-200">{p.weeks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Team */}
      <div className="brief-reveal mt-8" style={{ animationDelay: '300ms' }}>
        <SectionLabel>Team</SectionLabel>
        <ul className="mt-3 space-y-2">
          {brief.team.map((m) => (
            <li
              key={m.role}
              className="flex items-center justify-between text-sm"
            >
              <span className="flex items-center text-slate-200">
                <span className="mr-2 inline-block h-2 w-2 shrink-0 rounded-full bg-violet-500/60" />
                {m.role}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-medium text-slate-300">
                {m.count}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tech stack */}
      <div className="brief-reveal mt-8" style={{ animationDelay: '360ms' }}>
        <SectionLabel>Tech stack</SectionLabel>
        <div className="mt-3 flex flex-wrap gap-2">
          {brief.techStack.map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
        </div>
      </div>

      {/* Risks */}
      <div className="brief-reveal mt-8" style={{ animationDelay: '420ms' }}>
        <SectionLabel>Risks to plan for</SectionLabel>
        {brief.risks.length === 0 ? (
          <p className="mt-2 text-sm text-slate-400">None flagged.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {brief.risks.map((r) => (
              <li key={r.title} className="border-l-2 border-violet-500/40 pl-3 text-sm text-slate-300">
                <span className="font-medium text-white">{r.title}</span>
                <span className="text-slate-400"> &mdash; {r.mitigation}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Domain alignment */}
      <div className="brief-reveal mt-8" style={{ animationDelay: '480ms' }}>
        <SectionLabel>Domain alignment</SectionLabel>
        <div className="mt-3 flex flex-wrap gap-2">
          {brief.domains.map((d) => (
            <Chip key={d.id}>{d.title}</Chip>
          ))}
        </div>
      </div>

      {/* ROI notes */}
      <div className="brief-reveal mt-8" style={{ animationDelay: '540ms' }}>
        <SectionLabel>ROI / value notes</SectionLabel>
        <ul className="mt-3 space-y-2">
          {brief.roiNotes.map((n) => (
              <li key={n} className="border-l-2 border-violet-500/40 pl-3 text-sm text-slate-300">
                {n}
              </li>
            ))}
        </ul>
      </div>

      {/* Actions: lead CTA first, then the utility actions */}
      <div className="brief-reveal mt-10" style={{ animationDelay: '600ms' }}>
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <button
            type="button"
            onClick={handleDiscuss}
            className="btn-primary inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm sm:w-auto"
          >
            Discuss this with Cynbit
          </button>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={handleDownload}
              className="btn-ghost inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm"
            >
              <DownloadIcon className="h-4 w-4" />
              Download brief (.md)
            </button>
            <button
              type="button"
              onClick={handleCopyLink}
              className="btn-ghost inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm"
            >
              <LinkIcon className="h-4 w-4" />
              {copied === 'link' ? 'Copied!' : 'Copy share link'}
            </button>
            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="btn-ghost inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm"
            >
              <CopyIcon className="h-4 w-4" />
              {copied === 'markdown' ? 'Copied!' : 'Copy as Markdown'}
            </button>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="btn-ghost inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm sm:ml-auto"
          >
            Start over
          </button>
        </div>
      </div>

      {/* Honest disclaimer */}
      <p
        className="brief-reveal mt-6 text-xs leading-relaxed text-slate-500"
        style={{ animationDelay: '660ms' }}
      >
        Estimates are guidance, not quotes. Final scope, timeline, and budget
        are confirmed together in a discovery call.
      </p>
    </div>
  )
}

function DownloadIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" />
    </svg>
  )
}

function LinkIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
      <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
    </svg>
  )
}

function CopyIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  )
}
