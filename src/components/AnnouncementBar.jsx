import React, { useState, useEffect, useMemo } from 'react'

const msgs = [
  'Free shipping over ₹4,999 — all India',
  'EMI zero-interest on 3 months — every pair',
  null,
]

function AnnouncementBar({ products }) {
  const [ix, setIx] = useState(0)
  const [paused, setPaused] = useState(false)

  const allMsgs = useMemo(() => {
    if (products && products.length > 0) {
      return msgs.map((m) =>
        m === null ? `${products.length.toLocaleString()} products — fresh from the vault` : m
      )
    }
    return msgs.map((m) => (m === null ? 'fresh from the vault' : m))
  }, [products])

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setIx((prev) => (prev + 1) % allMsgs.length), 3500)
    return () => clearInterval(t)
  }, [paused, allMsgs.length])

  return (
    <div
      className="ann-bar"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="ann-track">
        {allMsgs.map((m, i) => (
          <div key={i} className={`ann-msg${i === ix ? ' on' : ''}`} aria-hidden={i !== ix}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 1 C13 6 17 7 17 12 C17 15.5 14.8 18 12 18 C9.2 18 7 15.5 7 12 C7 9 9 8 9.5 5.5 C10.6 7 11.6 7.6 12 6 Z"
              />
            </svg>
            {m}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AnnouncementBar
