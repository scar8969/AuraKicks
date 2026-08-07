import React, { useState } from 'react'

function Footer() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    setStatus('subscribing')
    setTimeout(() => {
      setStatus('pending')
      setEmail('')
    }, 1000)
  }

  return (
    <footer className="footer" id="footer">
      <div className="footer-fill">
        <img src="/aura.svg" alt="AURA KICKS" />
      </div>
      <div className="footer-inner">
        <div className="newsletter">
          <div>
            <h3>Join the bloodline</h3>
            <p>Early access to drops, restock alerts, and flame-seal exclusives.</p>
          </div>
          <form className="nl-form" onSubmit={handleSubmit}>
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="your@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" disabled={status === 'subscribing'}>
              Ignite
            </button>
            {status === 'subscribing' && <span className="nl-ok">subscribing…</span>}
            {status === 'pending' && (
              <span className="nl-ok">confirmation sent — check your inbox</span>
            )}
          </form>
        </div>
        <div className="footer-top">
          <a className="footer-mail" href="mailto:hello@aurakicks.xyz">
            hello@aurakicks.xyz
          </a>
          <div className="footer-links">
            <a href="#top">Back to top</a>
          </div>
        </div>
        <div className="footer-bar">
          <span>© 2026 Aura Kicks — all flames reserved</span>
          <span className="credit">site forged in fire</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
