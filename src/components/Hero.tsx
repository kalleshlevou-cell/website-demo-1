export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-24 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-[100px]"
      />

      <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32 lg:py-40">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
            The optimistic architect
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Architecture with intent.
            <br />
            <span className="text-gradient">Engineering with optimism.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Cynbit is a software studio that designs and ships products,
            growth, AI, and cloud systems with the calm confidence of an
            architect who has done this before.{' '}
            <span className="font-medium text-white">
              New — Scope Studio
            </span>{' '}
            turns your idea into a clear project scope, timeline, and estimate
            in minutes.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#studio"
              className="btn-primary inline-flex w-full items-center justify-center px-6 py-3 text-sm sm:w-auto"
            >
              Scope my project
            </a>
            <a
              href="#edge"
              className="btn-ghost inline-flex w-full items-center justify-center px-6 py-3 text-sm sm:w-auto"
            >
              Explore the Cynbit edge
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
