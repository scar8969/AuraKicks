import React, { useState, useEffect, useRef } from 'react'

function Toast({ msg, onDone }) {
  const [visible, setVisible] = useState(false)
  const timers = useRef([])

  useEffect(() => {
    timers.current.forEach((t) => clearTimeout(t))
    timers.current = []
    if (!msg) {
      setVisible(false)
      return
    }
    setVisible(true)
    const t1 = setTimeout(() => setVisible(false), 2000)
    const t2 = setTimeout(onDone, 2500)
    timers.current = [t1, t2]
    return () => {
      timers.current.forEach((t) => clearTimeout(t))
    }
  }, [msg, onDone])

  return (
    <div className={`toast${visible ? ' on' : ''}`} role="status" aria-live="polite">
      {msg}
    </div>
  )
}

export default Toast
