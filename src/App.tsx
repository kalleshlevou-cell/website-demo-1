import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { ValueProps } from './components/ValueProps'
import { Domains } from './components/Domains'
import { Process } from './components/Process'
import { Testimonials } from './components/Testimonials'
import { Footer } from './components/Footer'

const STUDIO_PREVIEW = [
  'Tailored project scope',
  'Timeline range',
  'Budget estimate',
  'Recommendations',
] as const

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Nav />
      <main>
        <Hero />

        {/* Scope Studio — the interactive wizard + results land here in a
            later step. For now, an on-brand teaser. */}
        <section id="studio" className="relative py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-6">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">
                Scope Studio
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Turn your idea into a plan
              </h2>
              <p className="mt-4 text-slate-400">
                Answer a few questions about your project and Scope Studio
                drafts a tailored scope, timeline range, and budget estimate —
                no sales call required.
              </p>
            </div>

            <div className="glass mt-10 rounded-3xl p-8 sm:p-10">
              <div className="flex flex-col items-center gap-5 text-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400" />
                  Interactive wizard arriving here
                </span>
                <p className="max-w-xl text-sm leading-relaxed text-slate-400">
                  The guided scoping flow will appear in this space — choose
                  your goal, set scope and constraints, and watch a tailored plan
                  generate in real time.
                </p>
                <ul className="grid gap-3 text-left text-sm text-slate-300 sm:grid-cols-2">
                  {STUDIO_PREVIEW.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="text-violet-400" aria-hidden="true">
                        &#8250;
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <ValueProps />
        <Domains />
        <Process />
        <Testimonials />
      </main>
      <Footer />
    </div>
  )
}

export default App
