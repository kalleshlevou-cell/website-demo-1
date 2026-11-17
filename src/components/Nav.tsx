import { useEffect, useState, type MouseEvent } from 'react'
import { useHashScroll } from '../hooks/useHashScroll'

const SECTIONS = ['home', 'studio', 'edge', 'domains', 'process', 'impact'] as const

const NAV_ITEMS = [
  { id: 'studio', label: 'Studio' },
  { id: 'domains', label: 'Domains' },
  { id: 'process', label: 'Process' },
  { id: 'impact', label: 'Impact' },
] as const

export function Nav() {
  const [open, setOpen] = useState(false)
  const { activeId, scrollToSection } = useHashScroll(SECTIONS)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const handleNav = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    scrollToSection(id)
    setOpen(false)
  }

  const linkClass = (id: string) =>
    `rounded-lg px-3 py-2 text-sm transition ${
      activeId === id
        ? 'text-white'
        : 'text-slate-300 hover:text-white'
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4"
        aria-label="Primary"
      >
        <a
          href="#home"
          onClick={(e) => handleNav(e, 'home')}
          className="flex items-center gap-2.5"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-xs font-bold text-white shadow-lg shadow-violet-500/30">
            C
          </span>
          <span className="text-lg font-bold tracking-tight">Cynbit</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => handleNav(e, item.id)}
                className={linkClass(item.id)}
                aria-current={activeId === item.id ? 'true' : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#studio"
          onClick={(e) => handleNav(e, 'studio')}
          className="btn-primary hidden md:inline-flex rounded-xl px-4 py-2 text-sm"
        >
          Scope my project
        </a>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M6 18 18 6" />
            </svg>
          ) : (
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          )}
        </button>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          className="border-t border-white/10 bg-slate-950/95 px-6 py-4 backdrop-blur-xl md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleNav(e, item.id)}
                  className="block rounded-lg px-3 py-3 text-sm text-slate-200 transition hover:bg-white/5 hover:text-white"
                  aria-current={activeId === item.id ? 'true' : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#studio"
            onClick={(e) => handleNav(e, 'studio')}
            className="btn-primary mt-3 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm"
          >
            Scope my project
          </a>
        </div>
      )}
    </header>
  )
}
