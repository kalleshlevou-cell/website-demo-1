import { Icon } from './Icon'
import { domains } from '../data/domains'

export function Domains() {
  return (
    <section id="domains" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">
            Domain mastery
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Four disciplines, one team
          </h2>
          <p className="mt-4 text-slate-400">
            Depth where it matters, integrated so you don&apos;t stitch vendors
            together.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {domains.map((domain) => (
            <article
              key={domain.id}
              className="card card-hover rounded-2xl p-7"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 text-violet-300 ring-1 ring-inset ring-white/10">
                  <Icon name={domain.icon} className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {domain.title}
                </h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                {domain.description}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {domain.capabilities.map((capability) => (
                  <li
                    key={capability}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"
                  >
                    {capability}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
