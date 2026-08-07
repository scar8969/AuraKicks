import React, { useState, useEffect } from 'react'

const DROP_TIMESTAMP = new Date('2026-12-31T23:59:59+05:30').getTime()

function Countdown() {
  const [d, setD] = useState('00')
  const [h, setH] = useState('00')
  const [m, setM] = useState('00')
  const [s, setS] = useState('00')
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    const tick = () => {
      const ms = DROP_TIMESTAMP - Date.now()
      if (ms <= 0) {
        setExpired(true)
        setD('00')
        setH('00')
        setM('00')
        setS('00')
        return
      }
      setExpired(false)
      setD(String(Math.floor(ms / 86400000)).padStart(2, '0'))
      setH(String(Math.floor((ms % 86400000) / 3600000)).padStart(2, '0'))
      setM(String(Math.floor((ms % 3600000) / 60000)).padStart(2, '0'))
      setS(String(Math.floor((ms % 60000) / 1000)).padStart(2, '0'))
    }
    tick()
    const iv = setInterval(tick, 1000)
    return () => clearInterval(iv)
  }, [])

  return (
    <section className="countdown" id="countdown">
      <div className="cd-k">{expired ? 'the forge has opened' : 'the forge opens in'}</div>
      {!expired && (
        <div className="cd-units">
          <div className="cd-unit">
            <div className="cd-flip">{d}</div>
            <div className="cd-lbl">days</div>
          </div>
          <div className="cd-unit">
            <div className="cd-flip">{h}</div>
            <div className="cd-lbl">hours</div>
          </div>
          <div className="cd-unit">
            <div className="cd-flip">{m}</div>
            <div className="cd-lbl">minutes</div>
          </div>
          <div className="cd-unit">
            <div className="cd-flip">{s}</div>
            <div className="cd-lbl">seconds</div>
          </div>
        </div>
      )}
      <a className="cd-cta pill-btn" href="#kicks">
        see the kicks
      </a>
    </section>
  )
}

export default Countdown
