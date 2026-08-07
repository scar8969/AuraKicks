import { useEffect, useRef } from 'react'

const FOCUSABLE =
  'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

export function useFocusTrap(active, onClose) {
  const containerRef = useRef(null)
  const previousFocus = useRef(null)

  useEffect(() => {
    if (!active) return
    previousFocus.current = document.activeElement

    const container = containerRef.current
    if (!container) return

    const getFocusables = () => container.querySelectorAll(FOCUSABLE)

    const focusFirst = () => {
      const els = getFocusables()
      if (els.length > 0) els[0].focus()
    }

    focusFirst()

    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose?.()
        return
      }
      if (e.key !== 'Tab') return

      const els = getFocusables()
      if (els.length === 0) return
      const first = els[0]
      const last = els[els.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    container.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'

    return () => {
      container.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      if (previousFocus.current && typeof previousFocus.current.focus === 'function') {
        previousFocus.current.focus()
      }
    }
  }, [active, onClose])

  return containerRef
}
