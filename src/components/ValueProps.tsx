import { Icon } from './Icon'
import { valueProps } from '../data/domains'

export function ValueProps() {
  return (
    <section id="edge" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">
            The Cynbit edge
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Why teams pick Cynbit
          </h2>
          <p className="mt-4 text-slate-400">
            Four things that show up in every engagement — and in the results.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {valueProps.map((prop) => (
            <article
              key={prop.id}
              className="card card-hover rounded-2xl p-6"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 text-violet-300 ring-1 ring-inset ring-white/10">
                <Icon name={prop.icon} className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">
                {prop.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {prop.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
