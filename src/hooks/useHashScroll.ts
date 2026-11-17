import { useCallback, useEffect, useState } from 'react'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Tracks which section is currently in view and exposes a helper that
 * smooth-scrolls to a section by id. The list of section ids should be a
 * stable (module-level) reference so the observer is set up only once.
 */
export function useHashScroll(sectionIds: readonly string[]) {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? '')

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    // A zero-height band through the vertical center: a section is "active"
    // while the center line sits inside it. Direction-agnostic and robust
    // for both tall and short sections.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        }
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [sectionIds])

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'start',
    })
    if (typeof history !== 'undefined' && history.replaceState) {
      history.replaceState(null, '', `#${id}`)
    }
  }, [])

  return { activeId, scrollToSection }
}
