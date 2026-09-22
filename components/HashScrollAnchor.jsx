'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Keeps the page pinned to the `#hash` target while the page settles.
 *
 * The browser scrolls to a hash target as soon as it exists, but content above
 * it is still growing at that point: lazy images have no reserved height, the
 * `ssr: false` ReviewSlider swaps its short placeholder for the real slider,
 * and GSAP's ScrollTrigger re-measures on load. Every one of those pushes the
 * target further down the document, so a scroll position that was correct on
 * arrival ends up showing an earlier section instead.
 *
 * So rather than scrolling once, we re-anchor for a short settle window and
 * bail out the moment the visitor scrolls for themselves.
 */
const SETTLE_MS = 3000

export default function HashScrollAnchor() {
  const pathname = usePathname()

  useEffect(() => {
    const hash = window.location.hash
    if (hash.length < 2) return

    let id
    try {
      id = decodeURIComponent(hash.slice(1))
    } catch (e) {
      id = hash.slice(1)
    }

    let rafId = 0
    let finished = false
    const startedAt = performance.now()

    const stop = () => {
      if (finished) return
      finished = true
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('wheel', stop)
      window.removeEventListener('touchstart', stop)
      window.removeEventListener('keydown', stop)
    }

    const tick = () => {
      if (finished) return

      const el = document.getElementById(id)
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY
        // Only correct real drift, so we never fight a smooth scroll in flight.
        if (Math.abs(top - window.scrollY) > 2) {
          window.scrollTo({ top, behavior: 'auto' })
        }
      }

      if (performance.now() - startedAt >= SETTLE_MS) {
        stop()
        return
      }
      rafId = requestAnimationFrame(tick)
    }

    // Passive so we never block the visitor's own scrolling.
    const opts = { passive: true }
    window.addEventListener('wheel', stop, opts)
    window.addEventListener('touchstart', stop, opts)
    window.addEventListener('keydown', stop, opts)

    rafId = requestAnimationFrame(tick)

    return stop
  }, [pathname])

  return null
}
