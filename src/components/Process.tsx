import { processSteps } from '../data/domains'

export function Process() {
  return (
    <section id="process" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">
            The Architectural Lifecycle
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            From idea to impact, in six moves
          </h2>
          <p className="mt-4 text-slate-400">
            A repeatable path that keeps quality and momentum together.
          </p>
        </div>

        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {processSteps.map((step) => (
            <li key={step.id} className="card card-hover rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-sm font-bold text-white shadow-lg shadow-violet-500/30">
                  {step.step}
                </span>
                <h3 className="text-lg font-semibold text-white">
                  {step.title}
                </h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
