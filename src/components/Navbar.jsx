import React, { useState, useEffect, useRef } from 'react'

function Navbar({ cartCount, onCart, onSearch, solid }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [bounce, setBounce] = useState(false)
  const prevCount = useRef(cartCount)

  useEffect(() => {
    if (cartCount > prevCount.current) {
      setBounce(true)
      const t = setTimeout(() => setBounce(false), 600)
      return () => clearTimeout(t)
    }
    prevCount.current = cartCount
  }, [cartCount])

  useEffect(() => {
    prevCount.current = cartCount
  }, [cartCount])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <header className={`navbar${solid ? ' solid' : ''}`}>
      <a
        className="nav-brand"
        href="#top"
        style={{
          display: solid ? 'flex' : 'none',
          opacity: solid ? 1 : 0,
          transition: 'opacity .5s',
        }}
      >
        <img src="/aura.svg" alt="AURA KICKS" />
      </a>
      <nav className="nav-center" aria-label="Main navigation">
        <button className="nav-link" onClick={() => scrollTo('kicks')}>
          Shop
        </button>
        <button className="nav-link" onClick={() => scrollTo('drop')}>
          The Drop
        </button>
        <button className="nav-link" onClick={() => scrollTo('manifesto')}>
          Manifesto
        </button>
      </nav>
      <div className="nav-right">
        <button className="icon-btn" onClick={onSearch} aria-label="Search products">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-4-4" />
          </svg>
        </button>
        <button className="icon-btn" onClick={onCart} aria-label={`Cart with ${cartCount} items`}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M6 7h12l1.5 13h-15L6 7z" />
            <path d="M9 7a3 3 0 0 1 6 0" />
          </svg>
          <span className={`cart-count${cartCount > 0 ? ' on' : ''}${bounce ? ' bounce' : ''}`}>
            {cartCount}
          </span>
        </button>
        <button
          className="nav-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </div>
      {menuOpen && (
        <div className="nav-mobile">
          <button className="nav-link" onClick={() => scrollTo('kicks')}>
            Shop
          </button>
          <button className="nav-link" onClick={() => scrollTo('drop')}>
            The Drop
          </button>
          <button className="nav-link" onClick={() => scrollTo('manifesto')}>
            Manifesto
          </button>
        </div>
      )}
    </header>
  )
}

export default Navbar
