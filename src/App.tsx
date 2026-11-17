import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { ValueProps } from './components/ValueProps'
import { Domains } from './components/Domains'
import { Process } from './components/Process'
import { Testimonials } from './components/Testimonials'
import { Footer } from './components/Footer'
import { ScopeStudio } from './components/ScopeStudio/ScopeStudio'

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Nav />
      <main>
        <Hero />
        <ScopeStudio />
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
