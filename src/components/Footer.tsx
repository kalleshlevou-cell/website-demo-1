const currentYear = new Date().getFullYear()

const FOOTER_LINKS = [
  { id: 'studio', label: 'Scope Studio' },
  { id: 'edge', label: 'The Cynbit edge' },
  { id: 'domains', label: 'Domains' },
  { id: 'process', label: 'Process' },
  { id: 'impact', label: 'Impact' },
] as const

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-slate-950/60">
      <div className="mx-auto max-w-6xl px-6 py-16">
        {/* Final CTA */}
        <div className="glass rounded-3xl p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Ready to scope your project?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-400">
            Start with Scope Studio — a clear scope, timeline, and estimate in
            minutes, no sales call required.
          </p>
          <a
            href="#studio"
            className="btn-primary mt-6 inline-flex px-6 py-3 text-sm"
          >
            Scope my project
          </a>
        </div>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-xs font-bold text-white shadow-lg shadow-violet-500/30">
                C
              </span>
              <span className="text-lg font-bold tracking-tight">Cynbit</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              A software studio designing and building products, growth, AI,
              and cloud systems with the calm confidence of an architect who
              has done this before.
            </p>
            <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-medium text-white">Manav Seva Trust</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">
                A portion of our work supports Manav Seva Trust&rsquo;s community
                programs — because building good software should also do good.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Explore</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {FOOTER_LINKS.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className="text-slate-400 transition hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Get started</h3>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Prefer to talk it through? Scope Studio is the fastest way to
              start — share your project and we&apos;ll take it from there.
            </p>
            <a
              href="#studio"
              className="btn-ghost mt-4 inline-flex px-4 py-2 text-sm"
            >
              Scope my project
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>&copy; {currentYear} Cynbit. All rights reserved.</p>
          <p>Built with care. Original work.</p>
        </div>
      </div>
    </footer>
  )
}
