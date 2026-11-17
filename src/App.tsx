import { useEffect, useState } from 'react'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { ValueProps } from './components/ValueProps'
import { Domains } from './components/Domains'
import { Process } from './components/Process'
import { Testimonials } from './components/Testimonials'
import { Footer } from './components/Footer'
import { ScopeStudio } from './components/ScopeStudio/ScopeStudio'

function Divider() {
  return (
    <hr
      aria-hidden="true"
      className="border-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mx-6"
    />
  )
}

function App() {
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setShowTop(window.scrollY > 300)
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function scrollToTop() {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Fixed background orbs */}
      <div
        aria-hidden="true"
        className="bg-orb w-96 h-96 bg-indigo-600 top-0 left-0"
      />
      <div
        aria-hidden="true"
        className="bg-orb w-96 h-96 bg-fuchsia-600 bottom-0 right-0"
      />

      <Nav />
      <main>
        <Hero />
        <Divider />
        <ScopeStudio />
        <Divider />
        <ValueProps />
        <Divider />
        <Domains />
        <Divider />
        <Process />
        <Divider />
        <Testimonials />
      </main>
      <Footer />

      {/* Scroll-to-top FAB */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        className={`fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full btn-primary transition-all duration-300 ${
          showTop
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    </div>
  )
}

export default App
