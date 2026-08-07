import React, { useState, useEffect, useRef } from 'react'

function Preloader({ loading, onDone }) {
  const [pct, setPct] = useState(0)
  const done = useRef(false)
  const fadeTimer = useRef(null)

  useEffect(() => {
    if (done.current) return
    const iv = setInterval(() => {
      setPct((prev) => {
        if (loading) {
          const next = prev + Math.floor(Math.random() * 3) + 1
          return Math.min(next, 90)
        }
        return prev
      })
    }, 30)
    return () => clearInterval(iv)
  }, [loading])

  useEffect(() => {
    if (done.current) return
    if (!loading && pct < 100) setPct(100)
    if (pct >= 100 && !done.current) {
      done.current = true
      fadeTimer.current = setTimeout(onDone, 500)
    }
    return () => {
      if (fadeTimer.current) clearTimeout(fadeTimer.current)
    }
  }, [pct, loading, onDone])

  return (
    <div
      className="preloader"
      style={{
        transition: 'opacity .5s',
        opacity: pct >= 100 ? 0 : 1,
        pointerEvents: pct >= 100 ? 'none' : 'auto',
      }}
    >
      <img className="preloader-logo" src="/aura.svg" alt="AURA KICKS" />
      <div className="preloader-pct">
        <span>{pct}</span>%
      </div>
      <div className="preloader-notice">{loading ? 'loading the forge' : 'entering'}</div>
      <div
        className="preloader-fill"
        style={{ height: `${pct}%`, transition: 'height .3s ease-out' }}
      />
    </div>
  )
}

export default Preloader
