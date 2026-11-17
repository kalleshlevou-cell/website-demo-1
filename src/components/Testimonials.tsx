import { testimonials } from '../data/domains'

export function Testimonials() {
  return (
    <section id="impact" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">
            Impact
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            What clients say
          </h2>
          <p className="mt-4 text-slate-400">
            Outcomes from teams who put Cynbit to work.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.id}
              className="card flex flex-col rounded-2xl p-6"
            >
              <blockquote className="text-sm leading-relaxed text-slate-200">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/30 to-fuchsia-500/30 text-sm font-semibold text-violet-200 ring-1 ring-inset ring-white/10">
                  {testimonial.company.charAt(0)}
                </span>
                <span className="not-italic">
                  <span className="block text-sm font-semibold text-white">
                    {testimonial.company}
                  </span>
                  <span className="block text-xs text-slate-400">
                    {testimonial.role}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
